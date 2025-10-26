import { AbstractJob } from './abstract_job.js';
import { DeserializationJobUtil } from './deserialization_job_util.js';
import { JobType } from './job_type.js';
import { MessageJobError } from './message_job_error.js';
import { RequestType } from '../client/request_type.js';
import { UniversityData } from '../data/university_data.js';
import logger from '../logging/logger.js';
import { ResponseType } from '../data/response_type.js';
import { Subject } from '../data/subject.js';
import { Course } from '../data/course.js';
import { RequestJob } from './request_job.js';
import { BUILDINGS_PATH, COURSES_HOSTNAME, COURSES_PATH, HTML_HEADER, JSON_HEADER, SEARCH_HOSTNAME } from '../constants/rutgers_constants.js';
import { MergeJob } from './merge_job.js';

export class DeserializationJob extends AbstractJob {
  requestType: RequestType;
  response: object | string;

  static parse(object: any): DeserializationJob {
    this.validate(object);
    return new DeserializationJob(
      object.jobType,
      object.universityData !== undefined ? UniversityData.parse(object.universityData) : undefined,
      object.isWorkerFree,
      object.workerId,
      object.requestType,
      object.response,
    );
  }

  protected static validate(object: any): void {
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

  protected constructor(
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
    this.timeAndRunJob(() => {
      logger.debug(`Running deserialization job.`);
      const deserializedResponse = DeserializationJobUtil.deserialize(
        this.requestType,
        this.response,
      );
  
      if (deserializedResponse) {
        this.sendNewJob(deserializedResponse, process);
        logger.debug('Deserialization complete.');
      } else {
        logger.debug('Unable to deserialize response.');
      }
    });
  }

  serializeJob(): object {
    return {
      requestType: this.requestType,
      response: this.response,
      ...super.serializeJob(),
    };
  }

  sendNewJob(input: object | undefined, process: NodeJS.Process): void {
    const serializedResponse : object[] = [];
    if (this.requestType === RequestType.Subject) {
      logger.debug('Sending new course request job.');
      (input as Array<Subject>).forEach(subject => {
        serializedResponse.push(subject.serializeJson());
        const newRequestJob = RequestJob.parse({
          jobType: JobType.Request,
          universityData: {
            ...this.universityData,
            subject: subject.code
          },
          isWorkerFree: false,
          workerId: this.workerId,
          requestType: RequestType.Course,
          hostname: COURSES_HOSTNAME,
          path: COURSES_PATH,
          headers: JSON_HEADER
        });
        if (process.send) {
          process.send(newRequestJob.serializeJob());
        }
      });
    }
    else if (this.requestType === RequestType.Course) {
      logger.debug('Sending new building request job.');
      (input as Array<Course>).forEach(course => {
        serializedResponse.push(course.serializeJson()!);
        course.sections?.forEach(section => {
          section.meetingTimes?.forEach(meetingTime => {
            const newRequestJob = RequestJob.parse({
              jobType: JobType.Request,
              isWorkerFree: false,
              workerId: this.workerId,
              requestType: RequestType.Building,
              hostname: SEARCH_HOSTNAME,
              path: BUILDINGS_PATH,
              headers: HTML_HEADER,
              queries: {
                q: meetingTime.buildingCode
              }
            });
            if (process.send) {
              process.send(newRequestJob.serializeJob());
            }
          });
        });
      });
    }
    logger.debug('Sending new merge job.');
    const newMergeJob = MergeJob.parse({
      jobType: JobType.Merge,
      isWorkerFree: false,
      workerId: this.workerId,
      requestType: this.requestType,
      deserializedResponse: serializedResponse
    });
    if (process.send) {
      process.send(newMergeJob.serializeJob());
    }
  }
}
