/**
 * Messages containing jobs passed through threads.
 */
export interface MessageJob {
  /** Runs the current job. */
  runJob(process: NodeJS.Process): Promise<void>;

  /** Serializes the job so that it can be passed as a message. */
  serializeJob(): object;

  /** Creates a new sequential job if needed. */
  sendNewJob(input: object | undefined, process: NodeJS.Process): void;
}
