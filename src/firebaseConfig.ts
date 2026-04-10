import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

import { getStorage } from 'firebase/storage';
import { getSiteById } from './config/sites';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and default Storage
export const auth = getAuth(app);
export const storage = getStorage(app);

// Memoized databases for multi-tenancy
const dbCache: Record<string, any> = {};

/**
 * Gets the Firestore instance for a specific site.
 * Supports multiple databases within a single Firebase project.
 */
export const getDb = (siteId: string) => {
    const site = getSiteById(siteId);
    const dbId = site?.databaseId || '(default)';

    if (!dbCache[dbId]) {
        dbCache[dbId] = getFirestore(app, dbId);
    }
    return dbCache[dbId];
};

// Default export for backward compatibility
export const db = getFirestore(app);

export default app;
