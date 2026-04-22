import { getDb } from "../firebaseConfig";
import { getSiteById } from "../config/sites";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { SiteSettings } from "../types/siteSettings";

export interface PageContent {
    title?: string;
    seo?: {
        title?: string;
        description?: string;
        image?: string;
    };
    sections?: Record<string, SectionContent>;
    lastUpdated?: string;
    updatedBy?: string;
    [key: string]: any; // Allow flexible content structure
}

export interface SectionContent {
    heading?: string;   // Optional — not all section types require a heading
    content?: string;   // Optional — not all section types require body text
    images?: { url: string; alt: string }[];
    imageAlignment?: 'top' | 'left' | 'right';
    enabled?: boolean;
    subtitle?: string;
    buttonText?: string;
    buttonUrl?: string;
    order?: number;
    stats?: { value: string; label: string }[];
    items?: any[]; // Generic array for varying lists (testimonials, pillars, features)
    list?: any[];  // Specifically for lists of people or structured items
    quote?: string;
    author_name?: string;
    author_title?: string;
    signature?: string;
    videoUrl?: string;
    // New fields for Careers and dynamic layouts
    location?: string;
    jobType?: string;
    pdfUrl?: string;
    externalLink?: string;
    footerImage?: string;
    sidebarContent?: {
        showNews?: boolean;
        showDonate?: boolean;
        showSocials?: boolean;
        customContent?: string;
    };
}

export interface ThemeSettings {
    typography: {
        displayFont: string;
        bodyFont: string;
        h1Font?: string;
        h2Font?: string;
        h3Font?: string;
        h4Font?: string;
        h5Font?: string;
        h6Font?: string;
        highlightFont?: string;
        h1Align?: 'left' | 'center' | 'right';
        h2Align?: 'left' | 'center' | 'right';
        h3Align?: 'left' | 'center' | 'right';
        h4Align?: 'left' | 'center' | 'right';
        h5Align?: 'left' | 'center' | 'right';
        h6Align?: 'left' | 'center' | 'right';
        highlightAlign?: 'left' | 'center' | 'right';
        h1Size: string;
        h2Size: string;
        h3Size: string;
        h4Size: string;
        h5Size: string;
        h6Size: string;
        bodySize: string;
        highlightSize: string;
        alignment: 'left' | 'center' | 'right';
        headingAlignment: 'left' | 'center' | 'right';
    };
    colors?: {
        primary: string;
        highlight: string;
        accent: string;
        cream: string;
        charcoal: string;
    };
}

export const FirestoreService = {
    // Fetch content for a specific page with siteId
    getPageContent: async (pageId: string, siteId: string): Promise<PageContent | null> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_content` : 'content';
            const docRef = doc(dbInstance, collectionName, pageId);
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

    // Fetch comprehensive content across multiple collections (for SEO audit)
    getComprehensiveSiteContent: async (siteId: string): Promise<any[]> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const contentPrefix = site?.usePrefix !== false ? siteId : '';
            
            const docs: any[] = [];

            // 1. Pages (Content)
            const contentRef = collection(dbInstance, contentPrefix ? `${contentPrefix}_content` : 'content');
            const contentSnap = await getDocs(contentRef);
            contentSnap.docs.forEach(doc => docs.push({ id: doc.id, collection: 'page', ...doc.data() }));

            // 2. Events
            const eventsRef = collection(dbInstance, contentPrefix ? `${contentPrefix}_events` : 'events');
            const eventsSnap = await getDocs(eventsRef);
            eventsSnap.docs.forEach(doc => docs.push({ id: doc.id, collection: 'event', ...doc.data() }));

            // 3. Articles/Blog
            const articlesRef = collection(dbInstance, contentPrefix ? `${contentPrefix}_articles` : 'articles');
            const articlesSnap = await getDocs(articlesRef);
            articlesSnap.docs.forEach(doc => docs.push({ id: doc.id, collection: 'article', ...doc.data() }));

            return docs;
        } catch (error) {
            console.error("Error fetching comprehensive content:", error);
            return [];
        }
    },


    // Update or Create content for a specific page with siteId
    savePageContent: async (pageId: string, data: PageContent, siteId: string) => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_content` : 'content';
            const docRef = doc(dbInstance, collectionName, pageId);
            await setDoc(docRef, {
                ...data,
                siteId, // Store siteId for reference
                lastUpdated: new Date().toISOString(),
            }); // No merge — full overwrite so deleted sections are removed

        } catch (error) {
            console.error("Error saving page content:", error);
            throw error;
        }
    },
    // User Management
    getUsers: async (): Promise<any[]> => {
        try {
            const dbInstance = getDb('nspc'); // Use any site to get the shared project app, or getDb with no id if we modify it
            const usersRef = collection(dbInstance, "users");
            const snapshot = await getDocs(usersRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    },

    updateUserRole: async (userId: string, role: 'super_admin' | 'editor') => {
        try {
            const dbInstance = getDb('nspc'); // Users are global to the project
            const userRef = doc(dbInstance, "users", userId);
            await setDoc(userRef, { role }, { merge: true });
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    },

    // Site Settings Management
    getSiteSettings: async (siteId: string): Promise<SiteSettings | null> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, "config");
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, "config");
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_events` : 'events';
            const eventsRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_events` : 'events';
            if (eventId) {
                // Update
                const docRef = doc(dbInstance, collectionName, eventId);
                await updateDoc(docRef, { ...event });
            } else {
                // Add
                const collectionRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_events` : 'events';
            const docRef = doc(dbInstance, collectionName, eventId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting event:", error);
            throw error;
        }
    },

    // Article Management
    getArticles: async (siteId: string): Promise<any[]> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_articles` : 'articles';
            const articlesRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_articles` : 'articles';
            const timestamp = new Date().toISOString();

            if (articleId) {
                // Upsert with a specific ID — setDoc creates if missing, merges if exists
                const docRef = doc(dbInstance, collectionName, articleId);
                await setDoc(docRef, {
                    ...article,
                    updatedAt: timestamp
                }, { merge: true });
            } else {
                // Auto-ID — add new document
                const collectionRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_articles` : 'articles';
            const docRef = doc(dbInstance, collectionName, articleId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting article:", error);
            throw error;
        }
    },

    // Video Management
    getVideos: async (siteId: string): Promise<any[]> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_videos` : 'videos';
            const videosRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_videos` : 'videos';
            const timestamp = new Date().toISOString();

            if (videoId) {
                // Update
                const docRef = doc(dbInstance, collectionName, videoId);
                await updateDoc(docRef, {
                    ...video,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_videos` : 'videos';
            const docRef = doc(dbInstance, collectionName, videoId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting video:", error);
            throw error;
        }
    },

    // Partner Management
    getPartners: async (siteId: string): Promise<any[]> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_partners` : 'partners';
            const partnersRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_partners` : 'partners';
            const timestamp = new Date().toISOString();

            if (partnerId) {
                // Update
                const docRef = doc(dbInstance, collectionName, partnerId);
                await updateDoc(docRef, {
                    ...partner,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_partners` : 'partners';
            const docRef = doc(dbInstance, collectionName, partnerId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting partner:", error);
            throw error;
        }
    },

    // Product Management
    getProducts: async (siteId: string): Promise<any[]> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_products` : 'products';
            const productsRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_products` : 'products';
            const timestamp = new Date().toISOString();

            if (productId) {
                // Update
                const docRef = doc(dbInstance, collectionName, productId);
                await updateDoc(docRef, {
                    ...product,
                    updatedAt: timestamp
                });
            } else {
                // Add
                const collectionRef = collection(dbInstance, collectionName);
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
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_products` : 'products';
            const docRef = doc(dbInstance, collectionName, productId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },

    // SEO Management
    getSEOData: async (siteId: string): Promise<any | null> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, "seo");
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error fetching SEO data:", error);
            throw error;
        }
    },

    saveSEOData: async (siteId: string, seoData: any) => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, "seo");
            await setDoc(docRef, seoData);
        } catch (error) {
            console.error("Error saving SEO data:", error);
            throw error;
        }
    },

    // Footer Management
    getFooterData: async (siteId: string): Promise<any | null> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_content` : 'content';
            const docRef = doc(dbInstance, collectionName, "footer");
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error fetching footer data:", error);
            throw error;
        }
    },

    saveFooterData: async (data: any, siteId: string) => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_content` : 'content';
            const docRef = doc(dbInstance, collectionName, 'footer');
            await setDoc(docRef, { ...data, lastUpdated: new Date().toISOString() });
        } catch (error) {
            console.error("Error saving footer data:", error);
            throw error;
        }
    },

    // Theme Settings
    getThemeSettings: async (siteId: string): Promise<ThemeSettings | null> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, 'theme');
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() as ThemeSettings : null;
        } catch (error) {
            console.error("Error fetching theme settings:", error);
            return null;
        }
    },

    saveThemeSettings: async (data: ThemeSettings, siteId: string) => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, 'theme');
            await setDoc(docRef, { ...data, lastUpdated: new Date().toISOString() });
        } catch (error) {
            console.error("Error saving theme settings:", error);
            throw error;
        }
    },

    // Generic Settings Management
    getSettings: async (siteId: string, docId: string): Promise<any | null> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, docId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error(`Error fetching ${docId} settings:`, error);
            throw error;
        }
    },

    saveSettings: async (siteId: string, docId: string, data: any) => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const collectionName = site?.usePrefix !== false ? `${siteId}_settings` : 'settings';
            const docRef = doc(dbInstance, collectionName, docId);
            await setDoc(docRef, { ...data, lastUpdated: new Date().toISOString() }, { merge: true });
        } catch (error) {
            console.error(`Error saving ${docId} settings:`, error);
            throw error;
        }
    },

    // Message Management
    getMessages: async (siteId: string, collectionOverride?: string): Promise<any[]> => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const defaultCollection = collectionOverride || 'messages';
            const collectionName = site?.usePrefix !== false ? `${siteId}_${defaultCollection}` : defaultCollection;
            const messagesRef = collection(dbInstance, collectionName);
            const snapshot = await getDocs(messagesRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a: any, b: any) => {
                    const timeA = (a.createdAt?.seconds || a.timestamp?.seconds || 0);
                    const timeB = (b.createdAt?.seconds || b.timestamp?.seconds || 0);
                    return timeB - timeA;
                });
        } catch (error) {
            console.error(`Error fetching ${collectionOverride || 'messages'}:`, error);
            return [];
        }
    },

    deleteMessage: async (siteId: string, messageId: string, collectionOverride?: string) => {
        try {
            const site = getSiteById(siteId);
            const dbInstance = getDb(siteId);
            const defaultCollection = collectionOverride || 'messages';
            const collectionName = site?.usePrefix !== false ? `${siteId}_${defaultCollection}` : defaultCollection;
            const docRef = doc(dbInstance, collectionName, messageId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting ${collectionOverride || 'message'}:`, error);
            throw error;
        }
    },

    // Analytics Management
    getAnalyticsEvents: async (siteId: string, limitCount: number = 100): Promise<any[]> => {
        try {
            const dbInstance = getDb(siteId);
            const eventsRef = collection(dbInstance, "analytics_events");
            // In a real app we'd add sorting and limiting here
            const snapshot = await getDocs(eventsRef);
            return snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((ev: any) => ev.siteId === siteId)
                .slice(0, limitCount);
        } catch (error) {
            console.error("Error fetching analytics events:", error);
            return [];
        }
    },

    getAnalyticsAggregates: async (siteId: string, type: 'daily' | 'monthly'): Promise<any[]> => {
        try {
            const dbInstance = getDb(siteId);
            const aggregatesRef = collection(dbInstance, "analytics_aggregates");
            const snapshot = await getDocs(aggregatesRef);
            return snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((agg: any) => agg.siteId === siteId && (type === 'daily' ? !!agg.date : !!agg.month));
        } catch (error) {
            console.error("Error fetching analytics aggregates:", error);
            return [];
        }
    },

    getAnalyticsPages: async (siteId: string): Promise<any[]> => {
        try {
            const dbInstance = getDb(siteId);
            const pagesRef = collection(dbInstance, "analytics_pages");
            const snapshot = await getDocs(pagesRef);
            return snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((p: any) => p.siteId === siteId);
        } catch (error) {
            console.error("Error fetching analytics pages:", error);
            return [];
        }
    },

    // Sharing Snapshots
    saveAnalyticsSnapshot: async (siteId: string, data: any): Promise<string> => {
        try {
            const dbInstance = getDb(siteId);
            const snapshotsRef = collection(dbInstance, "shared_analytics");
            const docRef = await addDoc(snapshotsRef, {
                ...data,
                id: '', // Will be updated
            });
            await updateDoc(docRef, { id: docRef.id });
            return docRef.id;
        } catch (error) {
            console.error("Error saving analytics snapshot:", error);
            throw error;
        }
    },

    getAnalyticsSnapshot: async (snapshotId: string, siteId: string): Promise<any | null> => {
        try {
            const dbInstance = getDb(siteId);
            const docRef = doc(dbInstance, "shared_analytics", snapshotId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error fetching analytics snapshot:", error);
            return null;
        }
    }
};
