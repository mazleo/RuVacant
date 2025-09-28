import { ResponseType } from './response_type.js';

/**
 * Data class for Rutgers subjects.
 */
export class Subject implements ResponseType {
  public readonly description: string;
  public readonly code: string;

  constructor(description: string, code: string) {
    this.description = description;
    this.code = code;
  }

  toString(): string {
    return `{description: ${this.description}, code: ${this.code}}`;
  }
}
