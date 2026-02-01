import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";

export interface PageContent {
    title: string;
    sections: Record<string, SectionContent>;
    lastUpdated?: string;
    updatedBy?: string;
}

export interface SectionContent {
    heading: string;
    content: string;
    images?: { url: string; alt: string }[];
}

export const FirestoreService = {
    // Fetch content for a specific page
    getPageContent: async (pageId: string): Promise<PageContent | null> => {
        try {
            const docRef = doc(db, "site_content", pageId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as PageContent;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching page content:", error);
            throw error;
        }
    },

    // Update or Create content for a specific page
    savePageContent: async (pageId: string, data: PageContent) => {
        try {
            const docRef = doc(db, "site_content", pageId);
            await setDoc(docRef, {
                ...data,
                lastUpdated: new Date().toISOString(),
            }, { merge: true });
        } catch (error) {
            console.error("Error saving page content:", error);
            throw error;
        }
    },
    // User Management
    getUsers: async (): Promise<any[]> => {
        try {
            const usersRef = collection(db, "users");
            const snapshot = await getDocs(usersRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    },

    updateUserRole: async (userId: string, role: 'super_admin' | 'editor') => {
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, { role }, { merge: true });
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    }
};
