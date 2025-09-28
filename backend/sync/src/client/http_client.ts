import logger from '../logging/logger.js';

export class HttpClient {
  static async request(): Promise<void> {
    logger.info('Making request from Rutgers servers.');
    try {
      // TODO: v0.1.5 Create jobs
    } catch (error) {
      logger.info(
        'Encountered error while making request from Rutgers servers.',
      );
      logger.debug(error);
    }
  }
}
