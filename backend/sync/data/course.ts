import { ResponseType } from './response_type.js';

/**
 * Data class for course meeting times.
 */
class MeetingTime {
  public readonly pmCode: string;
  public readonly campusAbbrev: string;
  public readonly campusName: string;
  public readonly meetingDay: string;
  public readonly buildingCode: string;
  public readonly startTime: string;
  public readonly endTime: string;
  public readonly startTimeSeconds: number;
  public readonly endTimeSeconds: number;

  constructor(
    pmCode: string,
    campusAbbrev: string,
    campusName: string,
    meetingDay: string,
    buildingCode: string,
    startTime: string,
    endTime: string,
    startTimeSeconds: number,
    endTimeSeconds: number,
  ) {
    this.pmCode = pmCode;
    this.campusAbbrev = campusAbbrev;
    this.campusName = campusName;
    this.meetingDay = meetingDay;
    this.buildingCode = buildingCode;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startTimeSeconds = startTimeSeconds;
    this.endTimeSeconds = endTimeSeconds;
  }
}

/**
 * Data class for Rutgers course sections.
 */
class Section {
  public readonly instructors: Array<string>;
  public readonly number: string;
  public readonly meetingTimes: Array<MeetingTime>;

  constructor(
    instructors: Array<string>,
    number: string,
    meetingTimes: Array<MeetingTime>,
  ) {
    this.instructors = instructors;
    this.number = number;
    this.meetingTimes = meetingTimes;
  }
}

/**
 * Data class for Rutgers courses.
 */
export class Course implements ResponseType {
  public readonly courseNumber: string;
  public readonly subject: string;
  public readonly campusCode: string;
  public readonly title: string;
  public readonly expandedTitle: string;
  public readonly sections: Array<Section>;

  constructor(
    courseNumber: string,
    subject: string,
    campusCode: string,
    title: string,
    expandedTitle: string,
    sections: Array<Section>,
  ) {
    this.courseNumber = courseNumber;
    this.subject = subject;
    this.campusCode = campusCode;
    this.title = title;
    this.expandedTitle = expandedTitle;
    this.sections = sections;
  }
}
