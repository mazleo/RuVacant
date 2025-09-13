import { SyncManager } from './manager/index.js';
import logger from './logging/logger.js';

logger.info('Starting application.');
const syncManager = new SyncManager();
syncManager.initialize();
