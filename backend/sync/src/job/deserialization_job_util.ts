import { Course } from '../data/course.js';
import { MessageJobError } from './message_job_error.js';
import { RequestType } from '../client/request_type.js';
import { Subject } from '../data/subject.js';
import { ResponseType } from '../data/response_type.js';

export class DeserializationJobUtil {
  static deserialize(
    requestType: RequestType,
    response: string | object,
  ): ResponseType | Array<ResponseType> | undefined {
    let deserializedResponse = undefined;
    switch (requestType) {
      case RequestType.Subject:
        deserializedResponse = [];
        if (Array.isArray(response)) {
          response.forEach((subject) => {
            deserializedResponse.push(new Subject().deserializeJson(subject));
          });
        }
        break;
      case RequestType.Course:
        if (Array.isArray(response)) {
          deserializedResponse = [];
          response.forEach((course) => {
            const newCourse = new Course().deserializeJson(course);
            if (newCourse?.isOfInterest()) {
              deserializedResponse.push(newCourse);
            }
          });
        }
        break;
      case RequestType.Invalid:
        throw new MessageJobError(
          'Retrieved an invalid RequestType in DeserializationJob.',
        );
    }
    return deserializedResponse;
  }
}
