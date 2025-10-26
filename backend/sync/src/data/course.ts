import { JsonSerializer } from './json_serializer.js';
import { ResponseType } from './response_type.js';

/**
 * Data class for course meeting times.
 */
class MeetingTime implements JsonSerializer<MeetingTime>, ResponseType {
  public pmCode: string | undefined | null = null;
  public campusAbbrev: string | undefined | null = null;
  public campusName: string | undefined | null = null;
  public meetingDay: string | undefined | null = null;
  public buildingCode: string | undefined | null = null;
  public startTime: string | undefined | null = null;
  public endTime: string | undefined | null = null;

  serializeJson(): object | undefined {
    return this.isOfInterest()
      ? {
          pmCode: this.pmCode,
          campusAbbrev: this.campusAbbrev,
          campusName: this.campusName,
          meetingDay: this.meetingDay,
          buildingCode: this.buildingCode,
          startTime: this.startTime,
          endTime: this.endTime,
        }
      : undefined;
  }

  deserializeJson(object: any): MeetingTime | undefined {
    this.pmCode = object.pmCode !== null ? object.pmCode : undefined;
    this.campusAbbrev =
      object.campusAbbrev !== null ? object.campusAbbrev : undefined;
    this.campusName =
      object.campusName !== null ? object.campusName : undefined;
    this.meetingDay =
      object.meetingDay !== null ? object.meetingDay : undefined;
    this.buildingCode =
      object.buildingCode !== null ? object.buildingCode : undefined;
    this.startTime = object.startTime !== null ? object.startTime : undefined;
    this.endTime = object.endTime !== null ? object.endTime : undefined;
    return this.isOfInterest() ? this : undefined;
  }

  isOfInterest(): boolean {
    return (
      this.buildingCode !== undefined &&
      this.startTime !== undefined &&
      this.endTime !== undefined
    );
  }

  toString(): string {
    return JSON.stringify(this.serializeJson());
  }
}

/**
 * Data class for Instructors.
 */
class Instructor implements JsonSerializer<Instructor> {
  name: string | undefined | null = null;

  serializeJson(): object | undefined {
    return this.isOfInterest()
      ? {
          name: this.name,
        }
      : undefined;
  }

  deserializeJson(object: any): Instructor | undefined {
    this.name = object.name !== null ? object.name : undefined;
    return this.isOfInterest() ? this : undefined;
  }

  isOfInterest(): boolean {
    return this.name !== undefined;
  }

  toString(): string {
    return JSON.stringify(this.serializeJson());
  }
}

/**
 * Data class for Rutgers course sections.
 */
class Section implements JsonSerializer<Section> {
  public instructors: Array<Instructor> | undefined | null = null;
  public number: string | undefined | null = null;
  public meetingTimes: Array<MeetingTime> | undefined | null = null;

  serializeJson(): object | undefined {
    return this.isOfInterest()
      ? {
          instructors: this.instructors,
          number: this.number,
          meetingTimes: this.meetingTimes?.map((meetingTime) =>
            meetingTime.serializeJson(),
          ),
        }
      : undefined;
  }

  deserializeJson(object: any): Section | undefined {
    this.instructors =
      object.instructors !== null && object.instructors !== undefined
        ? object.instructors
            .map((instructor: any) =>
              new Instructor().deserializeJson(instructor),
            )
            .filter((instructor: any) => instructor !== undefined)
        : undefined;
    if (
      !this.instructors?.some((instructor: any) => instructor.isOfInterest())
    ) {
      this.instructors = undefined;
    }

    this.number = object.number !== null ? object.number : undefined;

    this.meetingTimes = object.meetingTimes
      ?.map((meetingTime: any) =>
        new MeetingTime().deserializeJson(meetingTime),
      )
      .filter((meetingTime: any) => meetingTime !== undefined);
    if (
      !this.meetingTimes?.some((meetingTime: any) => meetingTime.isOfInterest())
    ) {
      this.meetingTimes = undefined;
    }

    return this.isOfInterest() ? this : undefined;
  }

  isOfInterest(): boolean {
    const isOfInterest = this.meetingTimes?.some((meetingTime) =>
      meetingTime.isOfInterest(),
    );
    return isOfInterest ? isOfInterest : false;
  }

  toString(): string {
    return JSON.stringify(this.serializeJson());
  }
}

/**
 * Data class for Rutgers courses.
 */
export class Course implements ResponseType {
  public courseNumber: string | undefined | null = null;
  public subject: string | undefined | null = null;
  public campusCode: string | undefined | null = null;
  public title: string | undefined | null = null;
  public expandedTitle: string | undefined | null = null;
  public sections: Array<Section> | undefined | null = null;

  serializeJson(): object | undefined {
    return this.isOfInterest()
      ? {
          courseNumber: this.courseNumber,
          subject: this.subject,
          campusCode: this.campusCode,
          title: this.title,
          expandedTitle: this.expandedTitle,
          sections: this.sections?.map((section) => section.serializeJson()),
        }
      : undefined;
  }

  deserializeJson(object: any): Course | undefined {
    this.courseNumber =
      object.courseNumber !== null ? object.courseNumber : undefined;
    this.subject = object.subject !== null ? object.subject : undefined;
    this.campusCode =
      object.campusCode !== null ? object.campusCode : undefined;
    this.title = object.title !== null ? object.title : undefined;
    this.expandedTitle =
      object.expandedTitle !== null ? object.expandedTitle : undefined;

    this.sections = object.sections
      ?.map((section: any) => new Section().deserializeJson(section))
      .filter((section: any) => section !== undefined);
    if (this.sections && this.sections.length === 0) {
      this.sections = undefined;
    }

    return this.isOfInterest() ? this : undefined;
  }

  isOfInterest(): boolean {
    const isOfInterest = this.sections?.some((section) =>
      section.isOfInterest(),
    );
    return isOfInterest ? isOfInterest : false;
  }

  toString(): string {
    return JSON.stringify(this.serializeJson());
  }
}
