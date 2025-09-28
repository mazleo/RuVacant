import { CampusCode, LevelCode, Semester } from './rutgers_constants.js';
import { UniversityData } from './university_data.js';
import logger from '../logging/logger.js';

enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}
const SEMESTER_MONTH_MAPPING = {
  [Semester.Winter]: [Month.December],
  [Semester.Spring]: [Month.January, Month.February, Month.March, Month.April],
  [Semester.Summer]: [Month.May, Month.June, Month.July, Month.August],
  [Semester.Fall]: [Month.September, Month.October, Month.November],
};
const ORDERED_SEMESTERS = [
  Semester.Winter,
  Semester.Spring,
  Semester.Summer,
  Semester.Fall,
];
const NUM_SEMESTERS = 3;

/**
 * Builds the three most recent semesters of UniversityData.
 */
export class UniversityDataBuilder {
  static build(): Array<UniversityData> {
    logger.debug('Building university data.');

    const currentDate = new Date();
    const semesterCodes = this.getRecentSemesterCodes(
      currentDate.getMonth() + 1,
      currentDate.getFullYear(),
    );
    const universityDatas = [];
    for (const semesterCode of semesterCodes) {
      universityDatas.push(
        new UniversityData(
          /** subject= */ undefined,
          semesterCode,
          `${CampusCode.NEW_BRUNSWICK},${CampusCode.NEWARK},${CampusCode.CAMDEN}`,
          `${LevelCode.UNDERGRADUATE},${LevelCode.GRADUATE}`,
        ),
      );
    }

    logger.debug(`University datas built: ${universityDatas}`);
    return universityDatas;
  }

  /**
   * @param currentMonth
   * @param currentYear
   * @returns The most recent semesters
   *
   * Public for testing.
   */
  public static getRecentSemesterCodes(
    currentMonth: number,
    currentYear: number,
  ): Array<string> {
    let currentSemester = Semester.Fall;
    for (const [semester, months] of Object.entries(SEMESTER_MONTH_MAPPING)) {
      if (months.includes(currentMonth)) {
        currentSemester = parseInt(semester) as Semester;
        break;
      }
    }
    const semesterCodes = [];
    let semesterIndex = ORDERED_SEMESTERS.indexOf(currentSemester);
    let s = 0;
    while (s < NUM_SEMESTERS) {
      currentSemester = ORDERED_SEMESTERS[semesterIndex];
      semesterCodes.push(`${currentSemester}${currentYear}`);
      semesterIndex--;
      if (semesterIndex < 0) {
        semesterIndex = ORDERED_SEMESTERS.length - 1;
        currentYear--;
      }
      s++;
    }
    return semesterCodes;
  }
}
