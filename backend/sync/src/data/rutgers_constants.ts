/** The server port for making requests to the Rutgers servers. */
export const SERVER_PORT = 443;

/** The hostname for the Rutgers schedule of classes. */
export const HOSTNAME = 'sis.rutgers.edu';

/** The path for the Rutgers subjects data. */
export const SUBJECTS_PATH = '/oldsoc/subjects.json';

/** The path for the Rutgers courses data. */
export const COURSES_PATH = '/oldsoc/courses.json';

/** The semesters of a University and their code values. */
export enum Semester {
  Winter = 0,
  Spring = 1,
  Summer = 7,
  Fall = 9,
}

/** The campus codes. */
export enum CampusCode {
  NEW_BRUNSWICK = 'NB',
  NEWARK = 'NK',
  CAMDEN = 'CM',
}

/** The level codes. */
export enum LevelCode {
  UNDERGRADUATE = 'U',
  GRADUATE = 'G',
}
