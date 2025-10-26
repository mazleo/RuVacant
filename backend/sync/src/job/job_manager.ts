import cluster, { Worker } from "cluster";
import { FirestoreClient } from "../client/firestore_client.js";
import { ValueObservable } from "../observer/value_observable.js";
import { MasterRunnerStatus } from "./master_runner_status.js";
import { MessageJob } from "./message_job.js";
import os from 'os';
import path, { dirname } from "path";
import { JobType } from "./job_type.js";
import { AbstractJob } from "./abstract_job.js";
import { RequestJob } from "./request_job.js";
import { DeserializationJob } from "./deserialization_job.js";
import { MergeJob } from "./merge_job.js";
import { RequestType } from "../client/request_type.js";
import { Subject } from "../data/subject.js";
import { ResponseType } from "../data/response_type.js";
import { Course } from "../data/course.js";
import { Building } from "../data/building.js";
import { ValueObserver } from "../observer/value_observer.js";
import logger from "../logging/logger.js";
import { fileURLToPath } from "url";
import { WorkerRunnerStatus } from "./worker_runner_status.js";

const MAX_MASTER_CALL_DEPTH = 500;
const MAX_WORKER_CALL_DEPTH = 500;
const REQUEST_DELAY = 60;

export class JobManager {
    private responseTypeQueue_: Array<ResponseType>;
    private devMode: boolean;
    private jobDelegators_: Array<Worker>;
    private masterJobQueue_: Array<AbstractJob>;
    private workerJobQueue_: Array<AbstractJob>;
    private masterRunnerStatus_: ValueObservable<MasterRunnerStatus>;
    private freeWorkerIds_: Array<number>;
    private numFreeWorkers_: ValueObservable<number>;
    private numWorkers_: number;
    private numRunningJobs_: number;
    private numJobsEnqueued_ : number;
    private numJobsRan_: number;
    private workerRunnerStatus_: ValueObservable<WorkerRunnerStatus>;
    private jobSchedulerTimer_: NodeJS.Timeout | undefined;
    private workerTimer_: NodeJS.Timeout | undefined;
    private hasStartedSyncing: boolean;
    private masterCallDepth_: number;
    private workerCallDepth_: number;
    private workerPause_: boolean;
    private workerPauseTimer_: NodeJS.Timeout | undefined;
    private workerPauseTime_: number;

    constructor(
        responseTypeQueue: Array<ResponseType>,
        devMode: boolean
    ) {
        logger.debug('Initializing job manager.');
        this.responseTypeQueue_ = responseTypeQueue;
        this.devMode = devMode;
        this.jobDelegators_ = [];
        this.masterJobQueue_ = [];
        this.workerJobQueue_ = [];
        this.masterRunnerStatus_ = new ValueObservable<MasterRunnerStatus>();
        this.freeWorkerIds_ = [];
        this.numFreeWorkers_ = new ValueObservable<number>();
        this.numWorkers_ = os.cpus().length;
        this.numRunningJobs_ = 0;
        this.numJobsEnqueued_ = 0;
        this.numJobsRan_ = 0;
        this.workerRunnerStatus_ = new ValueObservable<WorkerRunnerStatus>();
        this.hasStartedSyncing = false;
        this.masterCallDepth_ = 0;
        this.workerCallDepth_ = 0;
        this.workerPause_ = false;
        this.workerPauseTime_ = 0;

        this.masterRunnerStatus_.setValue(MasterRunnerStatus.Stopped);
        this.masterRunnerStatus_.addObserver(new ValueObserver(this.runNextMasterJob_.bind(this)));
        this.masterRunnerStatus_.addObserver(new ValueObserver(this.handleStoppedRunners_.bind(this)));
        this.workerRunnerStatus_.setValue(WorkerRunnerStatus.Stopped);
        this.workerRunnerStatus_.addObserver(new ValueObserver(this.handleStoppedRunners_.bind(this)));
        this.numFreeWorkers_.setValue(0);
        this.numFreeWorkers_.addObserver(new ValueObserver(this.delegateNextWorkerJob_.bind(this)));

        this.scheduleJobs_();
        if (cluster.isPrimary) {
            this.initializeJobDelegators_();
        }
    }

    enqueueMasterJob(abstractJob: AbstractJob): void {
        this.masterJobQueue_.push(abstractJob);
    }

    shutdown(): void {
        logger.info('Shutting down the job manager.');
        cluster.disconnect(() => {
            logger.info('Job delegators disconnected.');
        })
        this.masterJobQueue_ = [];
        this.workerJobQueue_ = [];
        this.masterRunnerStatus_.removeAllObservers();
        this.masterRunnerStatus_.setValue(MasterRunnerStatus.Stopped);
        this.freeWorkerIds_ = [];
        this.numFreeWorkers_.removeAllObservers();
        this.numFreeWorkers_.setValue(0);
        this.numWorkers_ = 0;
        this.numRunningJobs_ = 0;
        this.numJobsEnqueued_ = 0;
        this.numJobsRan_ = 0;
        clearInterval(this.jobSchedulerTimer_);
    }

    private scheduleJobs_(): void {
        this.jobSchedulerTimer_ = setInterval(() => {
            if (this.workerPause_ && !this.workerPauseTimer_) {
                logger.debug('Pausing workers.');
                this.workerPauseTimer_ = setInterval(() => {
                    if (this.workerPauseTime_ === REQUEST_DELAY) {
                        logger.debug('Worker pause completed');
                        this.workerPauseTime_ = 0;
                        this.workerPauseTimer_?.close();
                        this.workerPauseTimer_ = undefined;
                        this.workerPause_ = false;
                    }
                    else {
                        this.workerPauseTime_++;
                        logger.debug(`Worker Pause Time: ${this.workerPauseTimer_}`);
                    }
                }, 1000);
            }
            if (
                (this.masterRunnerStatus_.getValue() === MasterRunnerStatus.Waiting && this.masterCallDepth_ === 0)
                || (this.masterRunnerStatus_.getValue() !== MasterRunnerStatus.Running && this.masterRunnerStatus_.getValue() !== MasterRunnerStatus.Waiting)) {
                this.runNextMasterJob_(this.masterRunnerStatus_.getValue()!);
            }
            if (
                !this.workerPause_ &&
                ((this.workerRunnerStatus_.getValue() === WorkerRunnerStatus.Waiting && this.workerCallDepth_ === 0)
                || (this.workerRunnerStatus_.getValue() !== WorkerRunnerStatus.Running && this.workerRunnerStatus_.getValue() !== WorkerRunnerStatus.Waiting))) {
                this.delegateNextWorkerJob_(this.numFreeWorkers_.getValue()!);
            }
        }, 3000);
    }

    private initializeJobDelegators_(): void {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const jobDelegatorScript = path.join(__dirname, 'job_delegator.js');
        cluster.setupPrimary({exec: jobDelegatorScript});
        for (let j = 0; j < this.numWorkers_; j++) {
            this.createNewJobDelegator_();
        }
        this.handleTerminationSignals_();
        this.handleJobDelegatorExit_();
    }

    private handleJobDelegatorExit_(): void {
        cluster.on('exit', (worker, code, signal) => {
            logger.warn(
                `Job delegator ${worker.id} died with code: ${code} and signal: ${signal}.`
            );
    
            const deadDelegatorIndex = this.jobDelegators_.findIndex(delegator => delegator.id === worker.id);
            if (deadDelegatorIndex > -1) {
                this.jobDelegators_.splice(deadDelegatorIndex, 1);
            }
    
            const freeIdIndex = this.freeWorkerIds_.indexOf(worker.id);
            if (freeIdIndex > -1) {
                this.freeWorkerIds_.splice(freeIdIndex, 1);
                this.numFreeWorkers_.setValue(this.freeWorkerIds_.length);
            }
    
            if (this.masterRunnerStatus_.getValue() !== MasterRunnerStatus.Stopped) {
                logger.warn('Creating replacement.');
                this.createNewJobDelegator_();
            }
        });
    }

    private createNewJobDelegator_(): void {
        const jobDelegator = cluster.fork();
        this.jobDelegators_.push(jobDelegator);
        this.freeWorkerIds_.push(jobDelegator.id);
        this.numFreeWorkers_.setValue(this.freeWorkerIds_.length);
        logger.debug(`Created job delegator ${jobDelegator.id}`);

        jobDelegator.on('message', message => {
            const jobType = message.jobType;
            if (jobType !== undefined) {
                let newMasterJob = undefined;
                switch (jobType) {
                    case JobType.IncrementJobs:
                        this.numJobsEnqueued_++;
                        this.numRunningJobs_++;
                        logger.debug(`Running next master job: increment - num jobs enqueued ${this.numJobsEnqueued_}.`);
                        break;
                    case JobType.DecrementJobs: {
                            this.numJobsRan_++;
                            this.numRunningJobs_--;
                            logger.debug(`Running next master job: decrement - num jobs ran ${this.numJobsRan_}.`);
                            const decrementJob = AbstractJob.parse(message);
                            if (this.numRunningJobs_ === 0) {
                                this.workerRunnerStatus_.setValue(WorkerRunnerStatus.Idle);
                                if (this.workerTimer_) {
                                    clearTimeout(this.workerTimer_);
                                    this.workerTimer_ = undefined;
                                }
                                this.workerTimer_ = setTimeout(() => {
                                    if (this.numJobsEnqueued_ === this.numJobsRan_) {
                                        this.workerRunnerStatus_.setValue(WorkerRunnerStatus.Stopped);
                                    }
                                }, 20000);
                            }
                            logger.debug(`Decrement Job - is worker free : ${decrementJob.isWorkerFree}`);
                            if (decrementJob.isWorkerFree) {
                                this.freeWorkerIds_.push(decrementJob.workerId);
                                logger.debug(`New free job delegator: ${decrementJob.workerId}.`)
                                this.numFreeWorkers_.setValue(this.freeWorkerIds_.length);
                            }
                        }
                        break;
                    case JobType.WorkerPause:
                        this.workerPause_ = true;
                        break;
                    case JobType.Request:
                        logger.debug('Enqueuing master job: request.');
                        newMasterJob = RequestJob.parse(message);
                        break;
                    case JobType.Deserialization:
                        logger.debug('Enqueuing master job: deserialization.');
                        newMasterJob = DeserializationJob.parse(message);
                        break;
                    case JobType.Merge:
                        logger.debug('Enqueuing master job: merge.');
                        newMasterJob = MergeJob.parse(message);
                        break;
                    default:
                        break;
                }
                if (newMasterJob) {
                    this.enqueueMasterJob(newMasterJob);
                    logger.debug(`Number of master jobs: ${this.masterJobQueue_.length}`);
                } 
            }
        })

        jobDelegator.on('error', error => {
            logger.error(error);
        });
    }

    private handleTerminationSignals_(): void {
        process.on('SIGINT', this.shutdown.bind(this));
        process.on('SIGTERM', this.shutdown.bind(this));
    }

    private runNextMasterJob_(masterRunnerStatus: MasterRunnerStatus): void {
        if (this.masterCallDepth_ === MAX_MASTER_CALL_DEPTH) {
            return;
        }
        this.masterCallDepth_++;
        logger.debug('Running next master job.');
        logger.debug(`Master runner status: ${masterRunnerStatus}`);
        if (this.masterJobQueue_.length > 0 && (masterRunnerStatus === MasterRunnerStatus.Idle || masterRunnerStatus === MasterRunnerStatus.Stopped)) {
            logger.debug('Setting master runner status to running.');
            this.masterRunnerStatus_.setValue(MasterRunnerStatus.Running);
            const nextMasterJob = this.masterJobQueue_.shift();
            if (!nextMasterJob) {
                return;
            }

            switch (nextMasterJob.jobType) {
                case JobType.Merge: {
                        const requestType = (nextMasterJob as MergeJob).requestType;
                        const serializedResponse = (nextMasterJob as MergeJob).deserializedResponse;
                        switch (requestType) {
                            case RequestType.Subject:
                                logger.debug('Running next master job: merge subject.');
                                (serializedResponse as Array<object>).forEach(response => {
                                    this.responseTypeQueue_.push(new Subject().deserializeJson(response));
                                })
                                break;
                            case RequestType.Course:
                                logger.debug('Running next master job: merge course.');
                                (serializedResponse as Array<object>).forEach(response => {
                                    this.responseTypeQueue_.push(new Course().deserializeJson(response)!);
                                })
                                break;
                            case RequestType.Building:
                                logger.debug('Running next master job: merge building.')
                                this.responseTypeQueue_.push(new Building().deserializeJson(serializedResponse)!);
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case JobType.Request:
                    logger.debug('Running next master job: enqueuing request.');
                    this.workerJobQueue_.push(nextMasterJob!);
                    break;
                case JobType.Deserialization:
                    logger.debug('Running next master job: enqueuing deserialization.');
                    this.workerJobQueue_.push(nextMasterJob!);
                    break;
                default:
                    break;
            }
            if (this.masterJobQueue_.length !== 0) {
                if (this.masterRunnerStatus_.getValue() === MasterRunnerStatus.Idle) {
                    return;
                }
                logger.debug('Setting master runner status to idle.')
                this.masterRunnerStatus_.setValue(MasterRunnerStatus.Idle);
                this.masterCallDepth_--;
            }
            else {
                if (this.masterRunnerStatus_.getValue() === MasterRunnerStatus.Stopped) {
                    return;
                }
                logger.debug('Setting master runner status to stopped.')
                this.masterRunnerStatus_.setValue(MasterRunnerStatus.Stopped);
                this.masterCallDepth_--;
            }
        }
    }

    private delegateNextWorkerJob_(numFreeWorkers: number): void {
        if (this.workerCallDepth_ === MAX_WORKER_CALL_DEPTH) {
            return;
        }
        this.workerCallDepth_++;
        logger.debug(`numFreeWorkers: ${numFreeWorkers}`);
        logger.debug(`workerJobQueue.length: ${this.workerJobQueue_.length}`);
        if (numFreeWorkers > 0 && this.workerJobQueue_.length > 0) {
            this.hasStartedSyncing = true;
            const nextFreeWorkerId = this.freeWorkerIds_.shift();
            const nextFreeWorker = this.jobDelegators_.find(jobDelegator => jobDelegator.id === nextFreeWorkerId);
            const nextWorkerJob = this.workerJobQueue_.shift();
            if (nextWorkerJob && nextFreeWorkerId != undefined) {
                nextWorkerJob.workerId = nextFreeWorkerId;
                logger.debug(`Running next worker: ${nextFreeWorkerId}`);
                if (this.devMode) {
                    setTimeout(() => {
                        nextFreeWorker?.send(nextWorkerJob.serializeJob());
                    }, 100)
                }
                else {
                    nextFreeWorker?.send(nextWorkerJob.serializeJob());
                }
                this.numFreeWorkers_.setValue(this.freeWorkerIds_.length);
                this.workerCallDepth_--;
            }
        }
    }

    private handleStoppedRunners_(unused: any): void {
        logger.debug('Runners stopped.');
        logger.debug(`numRunningJobs: ${this.numRunningJobs_}`);
        logger.debug(`numJobsEnqueued: ${this.numJobsEnqueued_}`);
        logger.debug(`numJobsRan: ${this.numJobsRan_}`);
        if (this.workerRunnerStatus_.getValue() === WorkerRunnerStatus.Stopped && this.masterRunnerStatus_.getValue() === MasterRunnerStatus.Stopped && this.hasStartedSyncing === true) {
            this.shutdown();
        }
    }
}
