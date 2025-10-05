import { ResponseType } from './response_type.js';
import { ResponseTypeError } from './response_type_error.js';

/**
 * Data class for Rutgers subjects.
 */
export class Subject implements ResponseType {
  public description: string | undefined = undefined;
  public code: string | undefined = undefined;

  serializeJson(): object {
    return {
      description: this.description,
      code: this.code,
    };
  }

  deserializeJson(object: any): Subject {
    this.description = object.description;
    this.code = object.code;
    if (!this.description || !this.code) {
      throw new ResponseTypeError(
        'Subject response is not of proper structure.',
      );
    }
    return this;
  }

  isOfInterest(): boolean {
    return true;
  }

  toString(): string {
    return JSON.stringify(this.serializeJson());
  }
}
