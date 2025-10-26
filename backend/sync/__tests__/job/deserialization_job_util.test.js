import { Course } from '../../src/data/course.js';
import { DeserializationJobUtil } from '../../src/job/deserialization_job_util.js';
import { RequestType } from '../../src/client/request_type.js';
import { ResponseTypeError } from '../../src/data/response_type_error.js';
import { Subject } from '../../src/data/subject.js';
describe('DeserializationJobUtil', () => {
    describe('deserialize subjects', () => {
        it('valid subjects', () => {
            const mockSubjects = JSON.parse('[{"code":"123","description":"Description 1"},{"code":"321","description":"Description 2"}]');
            const actualSubjects = DeserializationJobUtil.deserialize(RequestType.Subject, mockSubjects);
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
            expect(() => DeserializationJobUtil.deserialize(RequestType.Subject, mockSubjects)).toThrow(ResponseTypeError);
        });
    });
    describe('deserialize courses', () => {
        it('valid courses', () => {
            const mockCourses = JSON.parse('[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":[{"name":"John Doe"}],"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":"SC","startTime":"0840","endTime":"1000"}]}]}]');
            const actualCourses = DeserializationJobUtil.deserialize(RequestType.Course, mockCourses);
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
                const mockCourses = JSON.parse('[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":null,"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":null,"startTime":"0840","endTime":"1000"}]}]}]');
                const actualCourses = DeserializationJobUtil.deserialize(RequestType.Course, mockCourses);
                expect(actualCourses).toEqual([]);
            });
            it('no start time', () => {
                const mockCourses = JSON.parse('[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":null,"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":"SC","startTime":null,"endTime":"1000"}]}]}]');
                const actualCourses = DeserializationJobUtil.deserialize(RequestType.Course, mockCourses);
                expect(actualCourses).toEqual([]);
            });
            it('no end time', () => {
                const mockCourses = JSON.parse('[{"courseNumber":"123","subject":"321","campusCode":"NB","title":"Intro to Comp Sci","sections":[{"instructors":null,"number":"01","meetingTimes":[{"pmCode":"A","campusAbbrev":"NB","campusName":"New Brunswick","meetingDay":"M","buildingCode":"SC","startTime":"0840","endTime":null}]}]}]');
                const actualCourses = DeserializationJobUtil.deserialize(RequestType.Course, mockCourses);
                expect(actualCourses).toEqual([]);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemF0aW9uX2pvYl91dGlsLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXNlcmlhbGl6YXRpb25fam9iX3V0aWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDbkYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVwRCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtZQUN4QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM3Qiw2RkFBNkYsQ0FDOUYsQ0FBQztZQUVGLE1BQU0sY0FBYyxHQUFHLHNCQUFzQixDQUFDLFdBQVcsQ0FDdkQsV0FBVyxDQUFDLE9BQU8sRUFDbkIsWUFBWSxDQUNiLENBQUM7WUFFRixNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM3QixJQUFJLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDNUIsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsV0FBVyxFQUFFLGVBQWU7aUJBQzdCLENBQUM7Z0JBQ0YsSUFBSSxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQzVCLElBQUksRUFBRSxLQUFLO29CQUNYLFdBQVcsRUFBRSxlQUFlO2lCQUM3QixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0JBQWtCLEVBQUUsR0FB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QUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvdXJzZSB9IGZyb20gJy4uLy4uL3NyYy9kYXRhL2NvdXJzZS5qcyc7XG5pbXBvcnQgeyBEZXNlcmlhbGl6YXRpb25Kb2JVdGlsIH0gZnJvbSAnLi4vLi4vc3JjL2pvYi9kZXNlcmlhbGl6YXRpb25fam9iX3V0aWwuanMnO1xuaW1wb3J0IHsgUmVxdWVzdFR5cGUgfSBmcm9tICcuLi8uLi9zcmMvY2xpZW50L3JlcXVlc3RfdHlwZS5qcyc7XG5pbXBvcnQgeyBSZXNwb25zZVR5cGVFcnJvciB9IGZyb20gJy4uLy4uL3NyYy9kYXRhL3Jlc3BvbnNlX3R5cGVfZXJyb3IuanMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uLy4uL3NyYy9kYXRhL3N1YmplY3QuanMnO1xuXG5kZXNjcmliZSgnRGVzZXJpYWxpemF0aW9uSm9iVXRpbCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2Rlc2VyaWFsaXplIHN1YmplY3RzJywgKCkgPT4ge1xuICAgIGl0KCd2YWxpZCBzdWJqZWN0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tTdWJqZWN0cyA9IEpTT04ucGFyc2UoXG4gICAgICAgICdbe1wiY29kZVwiOlwiMTIzXCIsXCJkZXNjcmlwdGlvblwiOlwiRGVzY3JpcHRpb24gMVwifSx7XCJjb2RlXCI6XCIzMjFcIixcImRlc2NyaXB0aW9uXCI6XCJEZXNjcmlwdGlvbiAyXCJ9XScsXG4gICAgICApO1xuXG4gICAgICBjb25zdCBhY3R1YWxTdWJqZWN0cyA9IERlc2VyaWFsaXphdGlvbkpvYlV0aWwuZGVzZXJpYWxpemUoXG4gICAgICAgIFJlcXVlc3RUeXBlLlN1YmplY3QsXG4gICAgICAgIG1vY2tTdWJqZWN0cyxcbiAgICAgICk7XG5cbiAgICAgIGV4cGVjdChhY3R1YWxTdWJqZWN0cykudG9FcXVhbChbXG4gICAgICAgIG5ldyBTdWJqZWN0KCkuZGVzZXJpYWxpemVKc29uKHtcbiAgICAgICAgICBjb2RlOiAnMTIzJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IFN1YmplY3QoKS5kZXNlcmlhbGl6ZUpzb24oe1xuICAgICAgICAgIGNvZGU6ICczMjEnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMicsXG4gICAgICAgIH0pLFxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW52YWxpZCBzdWJqZWN0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tTdWJqZWN0cyA9IEpTT04ucGFyc2UoJ1t7XCJkZXNjcmlwdGlvblwiOlwiSW52YWxpZFwifV0nKTtcblxuICAgICAgZXhwZWN0KCgpID0+XG4gICAgICAgIERlc2VyaWFsaXphdGlvbkpvYlV0aWwuZGVzZXJpYWxpemUoUmVxdWVzdFR5cGUuU3ViamVjdCwgbW9ja1N1YmplY3RzKSxcbiAgICAgICkudG9UaHJvdyhSZXNwb25zZVR5cGVFcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZXNlcmlhbGl6ZSBjb3Vyc2VzJywgKCkgPT4ge1xuICAgIGl0KCd2YWxpZCBjb3Vyc2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0NvdXJzZXMgPSBKU09OLnBhcnNlKFxuICAgICAgICAnW3tcImNvdXJzZU51bWJlclwiOlwiMTIzXCIsXCJzdWJqZWN0XCI6XCIzMjFcIixcImNhbXB1c0NvZGVcIjpcIk5CXCIsXCJ0aXRsZVwiOlwiSW50cm8gdG8gQ29tcCBTY2lcIixcInNlY3Rpb25zXCI6W3tcImluc3RydWN0b3JzXCI6W3tcIm5hbWVcIjpcIkpvaG4gRG9lXCJ9XSxcIm51bWJlclwiOlwiMDFcIixcIm1lZXRpbmdUaW1lc1wiOlt7XCJwbUNvZGVcIjpcIkFcIixcImNhbXB1c0FiYnJldlwiOlwiTkJcIixcImNhbXB1c05hbWVcIjpcIk5ldyBCcnVuc3dpY2tcIixcIm1lZXRpbmdEYXlcIjpcIk1cIixcImJ1aWxkaW5nQ29kZVwiOlwiU0NcIixcInN0YXJ0VGltZVwiOlwiMDg0MFwiLFwiZW5kVGltZVwiOlwiMTAwMFwifV19XX1dJyxcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGFjdHVhbENvdXJzZXMgPSBEZXNlcmlhbGl6YXRpb25Kb2JVdGlsLmRlc2VyaWFsaXplKFxuICAgICAgICBSZXF1ZXN0VHlwZS5Db3Vyc2UsXG4gICAgICAgIG1vY2tDb3Vyc2VzLFxuICAgICAgKTtcblxuICAgICAgZXhwZWN0KGFjdHVhbENvdXJzZXMpLnRvRXF1YWwoW1xuICAgICAgICBuZXcgQ291cnNlKCkuZGVzZXJpYWxpemVKc29uKHtcbiAgICAgICAgICBjb3Vyc2VOdW1iZXI6ICcxMjMnLFxuICAgICAgICAgIHN1YmplY3Q6ICczMjEnLFxuICAgICAgICAgIGNhbXB1c0NvZGU6ICdOQicsXG4gICAgICAgICAgdGl0bGU6ICdJbnRybyB0byBDb21wIFNjaScsXG4gICAgICAgICAgc2VjdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW5zdHJ1Y3RvcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnSm9obiBEb2UnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIG51bWJlcjogJzAxJyxcbiAgICAgICAgICAgICAgbWVldGluZ1RpbWVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcG1Db2RlOiAnQScsXG4gICAgICAgICAgICAgICAgICBjYW1wdXNBYmJyZXY6ICdOQicsXG4gICAgICAgICAgICAgICAgICBjYW1wdXNOYW1lOiAnTmV3IEJydW5zd2ljaycsXG4gICAgICAgICAgICAgICAgICBtZWV0aW5nRGF5OiAnTScsXG4gICAgICAgICAgICAgICAgICBidWlsZGluZ0NvZGU6ICdTQycsXG4gICAgICAgICAgICAgICAgICBzdGFydFRpbWU6ICcwODQwJyxcbiAgICAgICAgICAgICAgICAgIGVuZFRpbWU6ICcxMDAwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ludmFsaWQgY291cnNlcycsICgpID0+IHtcbiAgICAgIGl0KCdubyBidWlsZGluZyBjb2RlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2NrQ291cnNlcyA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgJ1t7XCJjb3Vyc2VOdW1iZXJcIjpcIjEyM1wiLFwic3ViamVjdFwiOlwiMzIxXCIsXCJjYW1wdXNDb2RlXCI6XCJOQlwiLFwidGl0bGVcIjpcIkludHJvIHRvIENvbXAgU2NpXCIsXCJzZWN0aW9uc1wiOlt7XCJpbnN0cnVjdG9yc1wiOm51bGwsXCJudW1iZXJcIjpcIjAxXCIsXCJtZWV0aW5nVGltZXNcIjpbe1wicG1Db2RlXCI6XCJBXCIsXCJjYW1wdXNBYmJyZXZcIjpcIk5CXCIsXCJjYW1wdXNOYW1lXCI6XCJOZXcgQnJ1bnN3aWNrXCIsXCJtZWV0aW5nRGF5XCI6XCJNXCIsXCJidWlsZGluZ0NvZGVcIjpudWxsLFwic3RhcnRUaW1lXCI6XCIwODQwXCIsXCJlbmRUaW1lXCI6XCIxMDAwXCJ9XX1dfV0nLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGFjdHVhbENvdXJzZXMgPSBEZXNlcmlhbGl6YXRpb25Kb2JVdGlsLmRlc2VyaWFsaXplKFxuICAgICAgICAgIFJlcXVlc3RUeXBlLkNvdXJzZSxcbiAgICAgICAgICBtb2NrQ291cnNlcyxcbiAgICAgICAgKTtcblxuICAgICAgICBleHBlY3QoYWN0dWFsQ291cnNlcykudG9FcXVhbChbXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdubyBzdGFydCB0aW1lJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2NrQ291cnNlcyA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgJ1t7XCJjb3Vyc2VOdW1iZXJcIjpcIjEyM1wiLFwic3ViamVjdFwiOlwiMzIxXCIsXCJjYW1wdXNDb2RlXCI6XCJOQlwiLFwidGl0bGVcIjpcIkludHJvIHRvIENvbXAgU2NpXCIsXCJzZWN0aW9uc1wiOlt7XCJpbnN0cnVjdG9yc1wiOm51bGwsXCJudW1iZXJcIjpcIjAxXCIsXCJtZWV0aW5nVGltZXNcIjpbe1wicG1Db2RlXCI6XCJBXCIsXCJjYW1wdXNBYmJyZXZcIjpcIk5CXCIsXCJjYW1wdXNOYW1lXCI6XCJOZXcgQnJ1bnN3aWNrXCIsXCJtZWV0aW5nRGF5XCI6XCJNXCIsXCJidWlsZGluZ0NvZGVcIjpcIlNDXCIsXCJzdGFydFRpbWVcIjpudWxsLFwiZW5kVGltZVwiOlwiMTAwMFwifV19XX1dJyxcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBhY3R1YWxDb3Vyc2VzID0gRGVzZXJpYWxpemF0aW9uSm9iVXRpbC5kZXNlcmlhbGl6ZShcbiAgICAgICAgICBSZXF1ZXN0VHlwZS5Db3Vyc2UsXG4gICAgICAgICAgbW9ja0NvdXJzZXMsXG4gICAgICAgICk7XG5cbiAgICAgICAgZXhwZWN0KGFjdHVhbENvdXJzZXMpLnRvRXF1YWwoW10pO1xuICAgICAgfSk7XG4gICAgICBpdCgnbm8gZW5kIHRpbWUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vY2tDb3Vyc2VzID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAnW3tcImNvdXJzZU51bWJlclwiOlwiMTIzXCIsXCJzdWJqZWN0XCI6XCIzMjFcIixcImNhbXB1c0NvZGVcIjpcIk5CXCIsXCJ0aXRsZVwiOlwiSW50cm8gdG8gQ29tcCBTY2lcIixcInNlY3Rpb25zXCI6W3tcImluc3RydWN0b3JzXCI6bnVsbCxcIm51bWJlclwiOlwiMDFcIixcIm1lZXRpbmdUaW1lc1wiOlt7XCJwbUNvZGVcIjpcIkFcIixcImNhbXB1c0FiYnJldlwiOlwiTkJcIixcImNhbXB1c05hbWVcIjpcIk5ldyBCcnVuc3dpY2tcIixcIm1lZXRpbmdEYXlcIjpcIk1cIixcImJ1aWxkaW5nQ29kZVwiOlwiU0NcIixcInN0YXJ0VGltZVwiOlwiMDg0MFwiLFwiZW5kVGltZVwiOm51bGx9XX1dfV0nLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGFjdHVhbENvdXJzZXMgPSBEZXNlcmlhbGl6YXRpb25Kb2JVdGlsLmRlc2VyaWFsaXplKFxuICAgICAgICAgIFJlcXVlc3RUeXBlLkNvdXJzZSxcbiAgICAgICAgICBtb2NrQ291cnNlcyxcbiAgICAgICAgKTtcblxuICAgICAgICBleHBlY3QoYWN0dWFsQ291cnNlcykudG9FcXVhbChbXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==