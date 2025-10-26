import { SyncManager } from './app/sync_manager.js';

const script = process.env.npm_lifecycle_event;
const syncManager = new SyncManager(script === 'start_dev');
await syncManager.sync();
