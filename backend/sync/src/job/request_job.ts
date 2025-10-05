import { AbstractJob } from './abstract_job.js';
import { HttpClient } from '../client/http_client.js';
import { JobType } from './job_type.js';
import { MessageJobError } from './message_job_error.js';
import { RequestType } from '../client/request_type.js';
import { UniversityData } from '../data/university_data.js';
import logger from '../logging/logger.js';

export class RequestJob extends AbstractJob {
  requestType: RequestType;
  hostname: string;
  path: string;
  headers: object;
  queries: object | undefined;

  static parse(object: any): RequestJob {
    this.validate(object);
    return new RequestJob(
      object.jobType,
      object.universityData,
      object.isWorkerFree,
      object.workerId,
      object.requestType,
      object.hostname,
      object.path,
      object.headers,
      object.queries,
    );
  }

  private static validate(object: any): void {
    if (
      object.jobType === undefined ||
      object.isWorkerFree === undefined ||
      object.workerId === undefined ||
      object.requestType === undefined ||
      !object.hostname ||
      !object.path ||
      !object.headers ||
      (!object.universityData && !object.queries)
    ) {
      throw new MessageJobError('Invalid RequestJob input.');
    }
  }

  constructor(
    jobType: JobType,
    universityData: UniversityData | undefined,
    isWorkerFree: boolean,
    workerId: number,
    requestType: RequestType,
    hostname: string,
    path: string,
    headers: object,
    queries: object | undefined,
  ) {
    super(jobType, universityData, isWorkerFree, workerId);
    this.requestType = requestType;
    this.hostname = hostname;
    this.path = path;
    this.headers = headers;
    this.queries = queries;
  }

  async runJob(process: NodeJS.Process): Promise<void> {
    logger.debug(`Running request job: ${this}`);
    const response = await this.request();
    if (response) {
      logger.debug('Response received successfully.');
      this.sendNewJob(response as object, process);
    } else {
      logger.debug('Request failed.');
    }
  }

  serializeJob(): object {
    return {
      requestType: this.requestType,
      hostname: this.hostname,
      path: this.path,
      headers: this.headers,
      queries: this.queries,
      ...super.serializeJob(),
    };
  }

  sendNewJob(input: object | undefined, process: NodeJS.Process): void {
    // TODO: v0.1.6 - Implement parallelization
  }

  getRequestOptions(): object {
    return {
      method: 'get',
      url: `https://${this.hostname}${this.path}`,
      headers: this.headers,
      params: {
        ...this.universityData,
        ...this.queries,
      },
    };
  }

  private async request(): Promise<object | string | undefined> {
    return await HttpClient.request(this);
  }
}
