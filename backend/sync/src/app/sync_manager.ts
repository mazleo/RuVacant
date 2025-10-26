import { RequestType } from '../client/request_type.js';
import { COURSES_HOSTNAME, JSON_HEADER, SUBJECTS_PATH } from '../constants/rutgers_constants.js';
import { ResponseType } from '../data/response_type.js';
import { UniversityData } from '../data/university_data.js';
import { JobManager } from '../job/job_manager.js';
import { JobType } from '../job/job_type.js';
import { RequestJob } from '../job/request_job.js';
import logger from '../logging/logger.js';

export class SyncManager {
  private responseTypeQueue_ : Array<ResponseType>;
  private devMode: boolean;
  private jobManager_ : JobManager;

  constructor(devMode: boolean = false) {
    this.responseTypeQueue_ = [];
    this.devMode = devMode;
    this.jobManager_ = new JobManager(this.responseTypeQueue_, this.devMode);
  }

  public async sync(): Promise<void> {
    logger.info('Starting sync.');
    logger.debug(`Running in dev mode: ${this.devMode}`);

    const newRequestJob = RequestJob.parse({
      jobType: JobType.Request,
      isWorkerFree: false,
      workerId: 0,
      requestType: RequestType.Subject,
      hostname: COURSES_HOSTNAME,
      path: SUBJECTS_PATH,
      headers: JSON_HEADER,
      universityData: new UniversityData(
        undefined,
        '92025',
        'U',
        'NB'
      )
    });
    this.jobManager_.enqueueMasterJob(newRequestJob);
  }

  public completeSync(): void {
    logger.info('Sync complete.');
  }
}
