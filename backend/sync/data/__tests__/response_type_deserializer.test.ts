import { InvalidResponseTypeError } from '../error/invalid_response_type_error.js';
import { RequestType } from '../../client/request_type.js';
import { ResponseTypeDeserializer } from '../response_type_deserializer.js';
import { Subject } from '../subject.js';

describe('ResponseTypeDeserializer', () => {
  describe('deserialize', () => {
    describe('subjects response type', () => {
      it('should deserialize a valid subject JSON string', () => {
        const validJsonString =
          '[{"description":"Computer Science","code":"220"},{"description": "Psychology","code":"384"}]';

        const subjectsArray = ResponseTypeDeserializer.deserialize(
          validJsonString,
          RequestType.SUBJECT,
        );

        expect(subjectsArray).toBeDefined();
        expect(subjectsArray).toBeInstanceOf(Array);
        expect(subjectsArray.length).toEqual(2);
        subjectsArray.forEach((subject) =>
          expect(subject).toBeInstanceOf(Subject),
        );
      });
      it('should throw with an empty json array', () => {
        const emptyArrayString = '[]';

        expect(() =>
          ResponseTypeDeserializer.deserialize(
            emptyArrayString,
            RequestType.SUBJECT,
          ),
        ).toThrow(InvalidResponseTypeError);
      });
      it('should throw with a non-array json response', () => {
        const objectJsonString = '{}';

        expect(() =>
          ResponseTypeDeserializer.deserialize(
            objectJsonString,
            RequestType.SUBJECT,
          ),
        ).toThrow(InvalidResponseTypeError);
      });
      it('should throw with an empty string json response', () => {
        const emptyJsonString = '';

        expect(() =>
          ResponseTypeDeserializer.deserialize(
            emptyJsonString,
            RequestType.SUBJECT,
          ),
        ).toThrow(InvalidResponseTypeError);
      });
      it('should throw on missing subject fields', () => {
        expect(() =>
          ResponseTypeDeserializer.deserialize(
            '{"code":"192"}',
            RequestType.SUBJECT,
          ),
        ).toThrow(InvalidResponseTypeError);
        expect(() =>
          ResponseTypeDeserializer.deserialize(
            '{"description":"Computer Science"}',
            RequestType.SUBJECT,
          ),
        ).toThrow(InvalidResponseTypeError);
      });
      it('show throw on malformed json response', () => {
        expect(() =>
          ResponseTypeDeserializer.deserialize('{{}', RequestType.SUBJECT),
        ).toThrow(SyntaxError);
      });
    });
  });
});
