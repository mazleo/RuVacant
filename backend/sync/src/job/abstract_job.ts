import { JobType } from './job_type.js';
import { MessageJob } from './message_job.js';
import { UniversityData } from '../data/university_data.js';

/**
 * Abstract implementation of MessageJob.
 */
export abstract class AbstractJob implements MessageJob {
  jobType: JobType;
  universityData: UniversityData | undefined = undefined;
  isWorkerFree: boolean;
  workerId: number;

  constructor(
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

  abstract runJob(process: NodeJS.Process): Promise<void>;

  serializeJob(): object {
    return {
      jobType: this.jobType,
      universityData: this.universityData?.serialize(),
      isWorkerFree: this.isWorkerFree,
      workerId: this.workerId,
    };
  }

  abstract sendNewJob(input: object | undefined, process: NodeJS.Process): void;

  toString(): string {
    return JSON.stringify(this.serializeJob());
  }
}
