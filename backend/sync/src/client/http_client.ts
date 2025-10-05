import { MessageJobError } from '../job/message_job_error.js';
import { RequestJob } from '../job/request_job.js';
import { RequestType } from './request_type.js';
import axios from 'axios';
import logger from '../logging/logger.js';
import puppeteer from 'puppeteer';

/**
 * A client for making network requests.
 */
export class HttpClient {
  static async request(
    requestJob: RequestJob,
  ): Promise<object | string | undefined> {
    logger.info('Making request from Rutgers servers.');
    let response = undefined;
    try {
      switch (requestJob.requestType) {
        case RequestType.Subject:
        case RequestType.Course:
          response = (await axios(requestJob.getRequestOptions())).data;
          break;
        case RequestType.Building:
          response = await this.getBuildingResponse(requestJob);
          break;
        case RequestType.Invalid:
          throw new MessageJobError('Invalid request type.');
      }
    } catch (error) {
      logger.error(
        'Encountered error while making request from Rutgers servers.',
      );
      logger.error(error);
    }
    logger.debug(JSON.stringify(response));
    return response;
  }

  private static async getBuildingResponse(
    requestJob: RequestJob,
  ): Promise<object | void> {
    const browser = await puppeteer.launch({ headless: true });
    let building = undefined;
    try {
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      });
      const url = `https://${requestJob.hostname}${requestJob.path}?${new URLSearchParams(requestJob.queries as Record<string, string>).toString()}`;
      await page.goto(url, { waitUntil: 'networkidle2' });
      building = {
        name: await page.evaluate(
          () => document.querySelector('body tbody tr a')?.textContent,
        ),
      };
    } catch (error) {
      logger.error(
        'Encountered error while making request from Rutgers servers.',
      );
      logger.error(error);
    } finally {
      await browser.close();
    }
    return building;
  }
}
