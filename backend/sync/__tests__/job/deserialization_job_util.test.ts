import { Course } from '../../src/data/course.js';
import { DeserializationJobUtil } from '../../src/job/deserialization_job_util.js';
import { RequestType } from '../../src/client/request_type.js';
import { ResponseTypeError } from '../../src/data/response_type_error.js';
import { Subject } from '../../src/data/subject.js';

describe('DeserializationJobUtil', () => {
  describe('deserialize subjects', () => {
    it('valid subjects', () => {
      const mockSubjects = JSON.parse(
        '[{"code":"123","description":"Description 1"},{"code":"321","description":"Description 2"}]',
      );

      const actualSubjects = DeserializationJobUtil.deserialize(
        RequestType.Subject,
        mockSubjects,
      );

      expect(actualSubjects).toEqual([
        new Subject().deserializeJson({
          code: '123',
          description: 'Description 1',
        }),
        new Subject().deserializeJson({
          code: '321',
          description: 'Description 2',
        }),
      ]);
    });

    it('invalid subjects', () => {
      const mockSubjects = JSON.parse('[{"description":"Invalid"}]');

      expect(() =>
        DeserializationJobUtil.deserialize(RequestType.Subject, mockSubjects),
      ).toThrow(ResponseTypeError);
    });
  });

  describe('deserialize courses', () => {
    it('valid courses', () => {
      const mockCourses = JSON.parse(
        '[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":[{"name":"John Doe"}],"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":"SC","startTime":"0840","endTime":"1000"}]}]}]',
      );

      const actualCourses = DeserializationJobUtil.deserialize(
        RequestType.Course,
        mockCourses,
      );

      expect(actualCourses).toEqual([
        new Course().deserializeJson({
          courseNumber: '123',
          subject: '321',
          campusCode: 'NB',
          title: 'Intro to Comp Sci',
          sections: [
            {
              instructors: [
                {
                  name: 'John Doe',
                },
              ],
              number: '01',
              meetingTimes: [
                {
                  pmCode: 'A',
                  campusAbbrev: 'NB',
                  campusName: 'New Brunswick',
                  meetingDay: 'M',
                  buildingCode: 'SC',
                  startTime: '0840',
                  endTime: '1000',
                },
              ],
            },
          ],
        }),
      ]);
    });

    describe('invalid courses', () => {
      it('no building code', () => {
        const mockCourses = JSON.parse(
          '[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":null,"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":null,"startTime":"0840","endTime":"1000"}]}]}]',
        );

        const actualCourses = DeserializationJobUtil.deserialize(
          RequestType.Course,
          mockCourses,
        );

        expect(actualCourses).toEqual([]);
      });
      it('no start time', () => {
        const mockCourses = JSON.parse(
          '[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":null,"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":"SC","startTime":null,"endTime":"1000"}]}]}]',
        );

        const actualCourses = DeserializationJobUtil.deserialize(
          RequestType.Course,
          mockCourses,
        );

        expect(actualCourses).toEqual([]);
      });
      it('no end time', () => {
        const mockCourses = JSON.parse(
          '[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":null,"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":"SC","startTime":"0840","endTime":null}]}]}]',
        );

        const actualCourses = DeserializationJobUtil.deserialize(
          RequestType.Course,
          mockCourses,
        );

        expect(actualCourses).toEqual([]);
      });
    });
  });
});
