import { SyncManager } from './app/sync_manager.js';

const syncManager = new SyncManager();
await syncManager.sync();
