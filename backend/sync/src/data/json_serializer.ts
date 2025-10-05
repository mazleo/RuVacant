/**
 * A JSON serializer/deserializer.
 */
export interface JsonSerializer<R> {
  /** Serializes to a plain object. */
  serializeJson(): object | undefined;

  /** Deserializes to a ResponseType. */
  deserializeJson(object: object): R | undefined;
}
