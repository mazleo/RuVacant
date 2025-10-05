/**
 * Interface for Rutgers response types.
 */

import { JsonSerializer } from './json_serializer.js';

export interface ResponseType extends JsonSerializer<ResponseType> {
  /** Checks whether to keep the response type. */
  isOfInterest(): boolean;
}
