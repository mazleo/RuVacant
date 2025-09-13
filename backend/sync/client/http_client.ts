import { ResponseProvider, ResponseType } from '../data/index.js';
import { HttpRequestOptions } from './http_request_options.js';
import { RequestType } from './request_type.js';
import https from 'https';
import logger from '../logging/logger.js';

export class HttpClient {
  request(
    options: HttpRequestOptions,
    requestType: RequestType,
    responseCallback: (
      requestType: RequestType,
      responseProvider: ResponseProvider,
    ) => void,
  ): void {
    logger.debug(`Making HTTP Request for RequestType ${requestType}`);
    const req = https.request(options.getOptions(), (response) => {
      let responseData = '';
      response.on('data', (responseChunk) => {
        responseData += responseChunk;
      });
      response.on('end', () => {
        logger.debug('Request completed.');
        responseCallback(
          requestType,
          new ResponseProvider(responseData, requestType),
        );
      });
    });
    req.on('error', (error) => {
      console.error(error);
    });
    req.end();
  }
}
