/**
 * The type of job passed in messages between threads.
 */
export enum JobType {
  Request,
  Deserialization,
  Merge,
  IncrementJobs,
  DecrementJobs,
}
