import { AbstractJob } from './abstract_job.js';
import { DeserializationJobUtil } from './deserialization_job_util.js';
import { JobType } from './job_type.js';
import { MessageJobError } from './message_job_error.js';
import { RequestType } from '../client/request_type.js';
import { UniversityData } from '../data/university_data.js';
import logger from '../logging/logger.js';

export class DeserializationJob extends AbstractJob {
  requestType: RequestType;
  response: object | string;

  static parse(object: any): DeserializationJob {
    this.validate(object);
    return new DeserializationJob(
      object.jobType,
      object.universityData,
      object.isWorkerFree,
      object.workerId,
      object.requestType,
      object.response,
    );
  }

  private static validate(object: any): void {
    if (
      object.jobType === undefined ||
      object.isWorkerFree === undefined ||
      object.workerId === undefined ||
      object.requestType === undefined ||
      !object.response
    ) {
      throw new MessageJobError('Invalid DeserializationJob input.');
    }
  }

  constructor(
    jobType: JobType,
    universityData: UniversityData | undefined,
    isWorkerFree: boolean,
    workerId: number,
    requestType: RequestType,
    response: object | string,
  ) {
    super(jobType, universityData, isWorkerFree, workerId);
    this.requestType = requestType;
    this.response = response;
  }

  async runJob(process: NodeJS.Process): Promise<void> {
    logger.debug(`Running deserialization job.`);
    const deserializedResponse = DeserializationJobUtil.deserialize(
      this.requestType,
      this.response,
    );

    if (deserializedResponse) {
      this.sendNewJob(deserializedResponse as object, process);
      logger.debug('Deserialization complete.');
    } else {
      logger.debug('Unable to deserialize response.');
    }
  }

  serializeJob(): object {
    return {
      responseType: this.requestType,
      response: this.response,
      ...super.serializeJob(),
    };
  }

  sendNewJob(input: object | undefined, process: NodeJS.Process): void {
    logger.debug('Sending new merge job.');
    // TODO: v0.1.6 - Implement parallelization.
  }
}
