/**
 * An error thrown when a message job fails.
 */
export class MessageJobError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MessageJobError';
  }
}
