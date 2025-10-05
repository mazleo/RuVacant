import { RequestJob } from '../job/request_job.js';
import axios from 'axios';
import logger from '../logging/logger.js';

export class HttpClient {
  static async request(
    requestJob: RequestJob,
  ): Promise<object | string | undefined> {
    logger.info('Making request from Rutgers servers.');
    let response = undefined;
    try {
      response = await axios(requestJob.getRequestOptions());
      logger.debug(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data),
      );
    } catch (error) {
      logger.error(
        'Encountered error while making request from Rutgers servers.',
      );
      logger.error(error);
    }
    return response;
  }
}
