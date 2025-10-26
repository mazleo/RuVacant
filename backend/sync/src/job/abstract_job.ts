import { JobType } from './job_type.js';
import { MessageJob } from './message_job.js';
import { MessageJobError } from './message_job_error.js';
import { UniversityData } from '../data/university_data.js';
import logger from '../logging/logger.js';

/**
 * Abstract implementation of MessageJob.
 */
export class AbstractJob implements MessageJob {
  jobType: JobType;
  universityData: UniversityData | undefined = undefined;
  isWorkerFree: boolean;
  workerId: number;

  static parse(object: any): AbstractJob {
    this.validate(object);
    return new AbstractJob(
      object.jobType,
      object.universityData,
      object.isWorkerFree,
      object.workerId,
    );
  }

  protected static validate(object: any): void {
    if (
      object.jobType === undefined ||
      object.isWorkerFree === undefined ||
      object.workerId === undefined
    ) {
      throw new MessageJobError('Invalid AbstractJob input.');
    }
  }

  protected constructor(
    jobType: JobType,
    universityData: UniversityData | undefined,
    isWorkerFree: boolean,
    workerId: number,
  ) {
    this.jobType = jobType;
    this.universityData = universityData;
    this.isWorkerFree = isWorkerFree;
    this.workerId = workerId;
  }

  runJob(process: NodeJS.Process): Promise<void> {
    return new Promise<void>(resolve => {
      resolve();
    });
  }

  serializeJob(): object {
    return {
      jobType: this.jobType,
      universityData: this.universityData?.serialize(),
      isWorkerFree: this.isWorkerFree,
      workerId: this.workerId,
    };
  }

  sendNewJob(input: object | undefined, process: NodeJS.Process): void {}

  async timeAndRunJob(job: () => void): Promise<void> {
    const jobTypeName = JobType[this.jobType];
    const startTime = performance.now();
    await job();
    const duration = performance.now() - startTime;
    logger.debug(`Job ${jobTypeName} took [${duration.toFixed(2)}ms].`);
  }

  toString(): string {
    return JSON.stringify(this.serializeJob());
  }
}
