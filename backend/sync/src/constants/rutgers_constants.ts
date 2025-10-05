/** The server port for making requests to the Rutgers servers. */
export const SERVER_PORT = 443;

/** The hostname for the Rutgers schedule of classes. */
export const COURSES_HOSTNAME = 'sis.rutgers.edu';

/** The hostname for the Rutgers search website. */
export const SEARCH_HOSTNAME = 'search.rutgers.edu';

/** The path for the Rutgers subjects data. */
export const SUBJECTS_PATH = '/oldsoc/subjects.json';

/** The path for the Rutgers courses data. */
export const COURSES_PATH = '/oldsoc/courses.json';

/** The path for Rutgers buildings. */
export const BUILDINGS_PATH = '/buildings';

/** The JSON headers when requesting from the Rutgers server. */
export const JSON_HEADER = {
  'Content-Type': 'application/json',
};

/** The HTML headers when requesting from the Rutgers server. */
export const HTML_HEADER = {
  'Content-Type': 'text/html',
};

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
