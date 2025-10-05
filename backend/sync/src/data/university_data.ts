/**
 * Data class encapsulating semester course information.
 */
export class UniversityData {
  /**
   * The Rutgers subject.
   * Example value is 198 for Computer Science.
   */
  readonly subject: string | undefined;

  /**
   * The semester in number format.
   * The format is <MONTH><YEAR>
   *
   * The months are:
   * - 0 - Winter
   * - 1 - Spring
   * - 7 - Summer
   * - 9 - Fall
   *
   * Sample value:
   * 12025 - Winter 2025
   */
  readonly semester: string;

  /**
   * The graduate level.
   * Expected values:
   * - U - Undergraduate
   * - G - Graduate
   */
  readonly level: string;

  /**
   * The University campus.
   * Expected values:
   * - NB - New Brunswick
   * - NK - Newark
   * - CM - Camden
   */
  readonly campus: string;

  constructor(
    subject: string | undefined,
    semester: string,
    level: string,
    campus: string,
  ) {
    this.subject = subject;
    this.semester = semester;
    this.level = level;
    this.campus = campus;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): object {
    let subjectObject = {};
    if (this.subject) {
      subjectObject = {
        subject: this.subject,
      };
    }
    return {
      semester: this.semester,
      level: this.level,
      campus: this.campus,
      ...subjectObject,
    };
  }
}
