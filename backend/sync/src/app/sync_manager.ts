import logger from '../logging/logger.js';

export class SyncManager {
  public async sync(): Promise<void> {
    logger.info('Starting sync.');
  }

  public completeSync(): void {
    logger.info('Sync complete.');
  }
}
