import admin, { ServiceAccount } from 'firebase-admin';
import { DOCUMENT_ID } from '../secrets.js';
import { FIRESTORE_COLLECTION } from '../constants/constants.js';
import serviceAccount from '../../../service-account-key.json' with { type: 'json' };

/**
 * Client for Firestore.
 */
export class FirestoreClient {
  private database: admin.firestore.Firestore | null = null;

  initializeDatabase() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    this.database = admin.firestore();
  }

  getDatabase(): admin.firestore.Firestore | null {
    return this.database;
  }

  isDatabaseInitialized(): boolean {
    return this.database !== null;
  }

  async doesDocumentExist(): Promise<boolean | undefined> {
    const document = await this.database
      ?.collection(FIRESTORE_COLLECTION)
      .doc(DOCUMENT_ID)
      .get();
    return document?.exists;
  }

  async getDocument(): Promise<admin.firestore.DocumentData | undefined> {
    return await this.database
      ?.collection(FIRESTORE_COLLECTION)
      .doc(DOCUMENT_ID)
      .get();
  }
}
