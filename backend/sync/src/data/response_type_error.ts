/** An error thrown when a response doesn't conform to the expected structure. */
export class ResponseTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResponseTypeError';
  }
}
