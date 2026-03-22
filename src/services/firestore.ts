import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { SiteSettings } from "../types/siteSettings";

export interface PageContent {
    title?: string;
    sections?: Record<string, SectionContent>;
    lastUpdated?: string;
    updatedBy?: string;
    [key: string]: any; // Allow flexible content structure
}

export interface SectionContent {
    heading: string;
    content: string;
    images?: { url: string; alt: string }[];
    enabled?: boolean;
    stats?: { value: string; label: string }[];
    items?: any[]; // Generic array for varying lists (testimonials, pillars, features)
    subtitle?: string;
    quote?: string;
    author_name?: string;
    author_title?: string;
    signature?: string;
}

export const FirestoreService = {
    // Fetch content for a specific page with siteId
    getPageContent: async (pageId: string, siteId: string): Promise<PageContent | null> => {
        try {
            // Use site-specific collection for better organization (e.g., nspc_content, bweic_content)
            const collectionName = `${siteId}_content`;
            const docRef = doc(db, collectionName, pageId);
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

    // Update or Create content for a specific page with siteId
    savePageContent: async (pageId: string, data: PageContent, siteId: string) => {
        try {
            // Use site-specific collection for better organization (e.g., nspc_content, bweic_content)
            const collectionName = `${siteId}_content`;
            const docRef = doc(db, collectionName, pageId);
            await setDoc(docRef, {
                ...data,
                siteId, // Store siteId for reference
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
    },

    // Site Settings Management
    getSiteSettings: async (siteId: string): Promise<SiteSettings | null> => {
        try {
            const collectionName = `${siteId}_settings`;
            const docRef = doc(db, collectionName, "config");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as SiteSettings;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching site settings:", error);
            throw error;
        }
    },

    saveSiteSettings: async (siteId: string, settings: SiteSettings) => {
        try {
            const collectionName = `${siteId}_settings`;
            const docRef = doc(db, collectionName, "config");
            await setDoc(docRef, {
                ...settings,
                siteId,
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    updatedBy: settings.metadata?.updatedBy || 'system',
                }
            }, { merge: true });
        } catch (error) {
            console.error("Error saving site settings:", error);
            throw error;
        }
    },

    // Event Management
    getEvents: async (siteId: string): Promise<any[]> => {
        try {

            const collectionName = `${siteId}_events`;
            const eventsRef = collection(db, collectionName);
            // Default sort by date? For now getting all.
            const snapshot = await getDocs(eventsRef);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { ...data, id: doc.id };
            });
        } catch (error) {
            console.error("Error fetching events:", error);
            return [];
        }
    },

    saveEvent: async (siteId: string, event: any, eventId?: string) => {
        try {
            const collectionName = `${siteId}_events`;
            if (eventId) {
                // Update
                const docRef = doc(db, collectionName, eventId);
                await updateDoc(docRef, { ...event });
            } else {
                // Add
                const collectionRef = collection(db, collectionName);
                await addDoc(collectionRef, {
                    ...event,
                    createdAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Error saving event:", error);
            throw error;
        }
    },

    deleteEvent: async (siteId: string, eventId: string) => {
        try {
            const collectionName = `${siteId}_events`;
            const docRef = doc(db, collectionName, eventId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting event:", error);
            throw error;
        }
    },

    // Article Management
    getArticles: async (siteId: string): Promise<any[]> => {
        try {
            const collectionName = `${siteId}_articles`;
            const articlesRef = collection(db, collectionName);
            const snapshot = await getDocs(articlesRef);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });
        } catch (error) {
            console.error("Error fetching articles:", error);
            return [];
        }
    },

    saveArticle: async (siteId: string, article: any, articleId?: string) => {
        try {
            const collectionName = `${siteId}_articles`;
            const timestamp = new Date().toISOString();

            if (articleId) {
                // Update
                const docRef = doc(db, collectionName, articleId);
                await updateDoc(docRef, {
                    ...article,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(db, collectionName);
                await addDoc(collectionRef, {
                    ...article,
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
            }
        } catch (error) {
            console.error("Error saving article:", error);
            throw error;
        }
    },

    deleteArticle: async (siteId: string, articleId: string) => {
        try {
            const collectionName = `${siteId}_articles`;
            const docRef = doc(db, collectionName, articleId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting article:", error);
            throw error;
        }
    },

    // Video Management
    getVideos: async (siteId: string): Promise<any[]> => {
        try {
            const collectionName = `${siteId}_videos`;
            const videosRef = collection(db, collectionName);
            const snapshot = await getDocs(videosRef);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });
        } catch (error) {
            console.error("Error fetching videos:", error);
            return [];
        }
    },

    saveVideo: async (siteId: string, video: any, videoId?: string) => {
        try {
            const collectionName = `${siteId}_videos`;
            const timestamp = new Date().toISOString();

            if (videoId) {
                // Update
                const docRef = doc(db, collectionName, videoId);
                await updateDoc(docRef, {
                    ...video,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(db, collectionName);
                await addDoc(collectionRef, {
                    ...video,
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
            }
        } catch (error) {
            console.error("Error saving video:", error);
            throw error;
        }
    },

    deleteVideo: async (siteId: string, videoId: string) => {
        try {
            const collectionName = `${siteId}_videos`;
            const docRef = doc(db, collectionName, videoId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting video:", error);
            throw error;
        }
    },

    // Partner Management
    getPartners: async (siteId: string): Promise<any[]> => {
        try {
            const collectionName = `${siteId}_partners`;
            const partnersRef = collection(db, collectionName);
            const snapshot = await getDocs(partnersRef);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });
        } catch (error) {
            console.error("Error fetching partners:", error);
            return [];
        }
    },

    savePartner: async (siteId: string, partner: any, partnerId?: string) => {
        try {
            const collectionName = `${siteId}_partners`;
            const timestamp = new Date().toISOString();

            if (partnerId) {
                // Update
                const docRef = doc(db, collectionName, partnerId);
                await updateDoc(docRef, {
                    ...partner,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(db, collectionName);
                await addDoc(collectionRef, {
                    ...partner,
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
            }
        } catch (error) {
            console.error("Error saving partner:", error);
            throw error;
        }
    },

    deletePartner: async (siteId: string, partnerId: string) => {
        try {
            const collectionName = `${siteId}_partners`;
            const docRef = doc(db, collectionName, partnerId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting partner:", error);
            throw error;
        }
    },

    // Product Management
    getProducts: async (siteId: string): Promise<any[]> => {
        try {
            const collectionName = `${siteId}_products`;
            const productsRef = collection(db, collectionName);
            const snapshot = await getDocs(productsRef);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    saveProduct: async (siteId: string, product: any, productId?: string) => {
        try {
            const collectionName = `${siteId}_products`;
            const timestamp = new Date().toISOString();

            if (productId) {
                // Update
                const docRef = doc(db, collectionName, productId);
                await updateDoc(docRef, {
                    ...product,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(db, collectionName);
                await addDoc(collectionRef, {
                    ...product,
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
            }
        } catch (error) {
            console.error("Error saving product:", error);
            throw error;
        }
    },

    deleteProduct: async (siteId: string, productId: string) => {
        try {
            const collectionName = `${siteId}_products`;
            const docRef = doc(db, collectionName, productId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }
};
