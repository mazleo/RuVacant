import {
  Building,
  Course,
  ResponseProvider,
  ResponseType,
  Subject,
} from '../data/index.js';
import { HttpClient, HttpRequestOptions } from '../client/index.js';
import { RequestType } from '../client/request_type.js';
import logger from '../logging/logger.js';
import * as RutgersConstants from '../client/rutgers_constants.js';

export class SyncManager {
  public initialize(): void {
    logger.info('Initializing SyncManager.');
    this.initializeSync();
  }

  private initializeSync(): void {
    logger.info('Initializing syncing.');
    const client = new HttpClient();
    client.request(
      HttpRequestOptions.Builder()
        .setMethod('GET')
        .setPort(RutgersConstants.SERVER_PORT)
        .setDefaultHeaders()
        .setHostname(RutgersConstants.HOSTNAME)
        .setPath(RutgersConstants.SUBJECTS_PATH)
        .addQuery('semester', '92025')
        .addQuery('campus', 'NB')
        .addQuery('level', 'U')
        .build(),
      RequestType.SUBJECT,
      this.onResponse,
    );
  }

  private onResponse(
    requestType: RequestType,
    responseProvider: ResponseProvider,
  ): void {
    logger.debug(`Handling request of type ${requestType}`);
  }

  private handleSubjectsResponse(subjects: Array<Subject>): void {}

  private handleCoursesResponse(courses: Array<Course>): void {}

  private handleBuildingResponse(building: Building): void {}
}
