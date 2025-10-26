import { AbstractJob } from './abstract_job.js';
import { JobType } from './job_type.js';
import { MessageJobError } from './message_job_error.js';
import { RequestType } from '../client/request_type.js';
import { UniversityData } from '../data/university_data.js';
import logger from '../logging/logger.js';

export class MergeJob extends AbstractJob {
  requestType: RequestType;
  deserializedResponse: object;

  static parse(object: any): MergeJob {
    this.validate(object);
    return new MergeJob(
      object.jobType,
      object.universityData !== undefined ? UniversityData.parse(object.universityData) : undefined,
      object.isWorkerFree,
      object.workerId,
      object.requestType,
      object.deserializedResponse,
    );
  }

  protected static validate(object: any): void {
    if (
      object.jobType === undefined ||
      object.isWorkerFree === undefined ||
      object.workerId === undefined ||
      object.requestType === undefined ||
      !object.deserializedResponse
    ) {
      throw new MessageJobError('Invalid MergeJob input.');
    }
  }

  protected constructor(
    jobType: JobType,
    universityData: UniversityData | undefined,
    isWorkerFree: boolean,
    workerId: number,
    requestType: RequestType,
    deserializedResponse: object,
  ) {
    super(jobType, universityData, isWorkerFree, workerId);
    this.requestType = requestType;
    this.deserializedResponse = deserializedResponse;
  }

  async runJob(process: NodeJS.Process): Promise<void> {
    return new Promise<void>(resolve => resolve());
  }

  serializeJob(): object {
    return {
      requestType: this.requestType,
      deserializedResponse: this.deserializedResponse,
      ...super.serializeJob(),
    };
  }

  sendNewJob(input: object | undefined, process: NodeJS.Process): void {
  }
}
