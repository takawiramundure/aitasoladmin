import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

import { getStorage } from 'firebase/storage';
import { getSiteById } from "@/config/sites";

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
