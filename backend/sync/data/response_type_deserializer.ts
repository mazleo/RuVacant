import { InvalidResponseTypeError } from './error/invalid_response_type_error.js';
import { RequestType } from '../client/request_type.js';
import { ResponseType } from './response_type.js';
import { Subject } from './subject.js';
import logger from '../logging/logger.js';

/**
 * Deserializes request data from the Rutgers class servers.
 */
export class ResponseTypeDeserializer {
  public static deserialize(
    jsonStringResponse: string,
    requestType: RequestType,
  ): Array<ResponseType> {
    logger.debug('Deserializing response.');
    switch (requestType) {
      case RequestType.SUBJECT:
        return this.deserializeSubjects(jsonStringResponse);
      default:
        throw new InvalidResponseTypeError(
          RequestType.INVALID,
          'Invalid request type',
        );
    }
  }

  private static deserializeSubjects(
    jsonStringResponse: string,
  ): Array<Subject> {
    if (!jsonStringResponse) {
      throw new InvalidResponseTypeError(
        RequestType.SUBJECT,
        'JSON response is not valid.',
      );
    }

    const subjectsJsonArray = JSON.parse(jsonStringResponse);
    if (
      !(subjectsJsonArray instanceof Array) ||
      subjectsJsonArray.length == 0
    ) {
      throw new InvalidResponseTypeError(
        RequestType.SUBJECT,
        'JSON response is not valid.',
      );
    }

    const subjectsArray = [];
    for (const subjectJsonObject of subjectsJsonArray) {
      const description = subjectJsonObject.description
        ? subjectJsonObject.description
        : (() => {
            throw new InvalidResponseTypeError(
              RequestType.SUBJECT,
              'Subjects JSON object must have a description.',
            );
          })();
      const code = subjectJsonObject.code
        ? subjectJsonObject.code
        : (() => {
            throw new InvalidResponseTypeError(
              RequestType.SUBJECT,
              'Subject JSON object must have a code.',
            );
          })();
      const subject = new Subject(description, code);
      logger.debug(`Deserialized ${subject}`);
      subjectsArray.push(subject);
    }
    logger.debug('Deserialized subjects.');
    logger.debug(subjectsArray);
    return subjectsArray;
  }
}
