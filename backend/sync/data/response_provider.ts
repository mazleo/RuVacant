import { ResponseType } from './response_type.js';
import { ResponseTypeDeserializer } from './response_type_deserializer.js';
import { RequestType } from '../client/index.js';

export class ResponseProvider {
  readonly response: Array<ResponseType>;

  constructor(jsonStringResponse: string, requestType: RequestType) {
    this.response = ResponseTypeDeserializer.deserialize(
      jsonStringResponse,
      requestType,
    );
  }

  public get(): Array<ResponseType> {
    return this.response;
  }
}
