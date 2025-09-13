import { RequestType } from '../../client/request_type.js';

/**
 * Error type for Rutgers request data.
 */
export class InvalidResponseTypeError extends Error {
  name = 'InvalidResponseTypeError';

  constructor(requestType: RequestType, message: string | undefined) {
    super(message);
    this.setErrorName(requestType);
  }

  private setErrorName(requestType: RequestType) {
    switch (requestType) {
      case RequestType.SUBJECT:
        this.name = 'InvalidSubjectsResponseTypeError';
        break;
      case RequestType.COURSE:
        this.name = 'InvalidCoursesRequestTypeError';
        break;
      case RequestType.BUILDING:
        this.name = 'InvalidBuildingsRequestTypeError';
        break;
      default:
        this.name = 'InvalidRequestTypeError';
    }
  }
}
