import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export interface UserProfile {
    email: string;
    displayName?: string;
    role: 'super_admin' | 'editor';
    allowedSites?: string[];
    uid: string;
}

interface AuthContextType {
    user: User | null;     // The Firebase Auth User
    profile: UserProfile | null; // The effective profile (real or impersonated)
    isImpersonating: boolean;
    loading: boolean;
    impersonate: (userId: string) => Promise<void>;
    stopImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isImpersonating: false,
    loading: true,
    impersonate: async () => { },
    stopImpersonation: () => { }
});

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [realProfile, setRealProfile] = useState<UserProfile | null>(null);
    const [impersonatedProfile, setImpersonatedProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // 1. Sync user to Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);
                let currentProfile: UserProfile | null = null;

                if (userSnap.exists()) {
                    currentProfile = { ...userSnap.data(), uid: currentUser.uid } as UserProfile;
                } else {
                    currentProfile = {
                        email: currentUser.email!,
                        displayName: currentUser.displayName || '',
                        role: 'editor' as const,
                        allowedSites: [],
                        uid: currentUser.uid
                    };
                    await setDoc(userRef, currentProfile);
                }
                setRealProfile(currentProfile);

                // 2. Check for persisted impersonation
                const persistedImpersonationId = localStorage.getItem('impersonatedUserId');
                if (persistedImpersonationId) {
                    await attemptRestoreImpersonation(persistedImpersonationId);
                }
            } else {
                setRealProfile(null);
                setImpersonatedProfile(null);
                localStorage.removeItem('impersonatedUserId');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const attemptRestoreImpersonation = async (userId: string) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setImpersonatedProfile({ ...userSnap.data(), uid: userId } as UserProfile);
            } else {
                localStorage.removeItem('impersonatedUserId');
            }
        } catch (e) {
            console.error("Failed to restore impersonation", e);
            localStorage.removeItem('impersonatedUserId');
        }
    };

    const impersonate = async (userId: string) => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setImpersonatedProfile({ ...userSnap.data(), uid: userId } as UserProfile);
                localStorage.setItem('impersonatedUserId', userId);
            } else {
                alert("User not found");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to impersonate");
        } finally {
            setLoading(false);
        }
    };

    const stopImpersonation = () => {
        setImpersonatedProfile(null);
        localStorage.removeItem('impersonatedUserId');
    };

    const value = {
        user,
        profile: impersonatedProfile || realProfile,
        isImpersonating: !!impersonatedProfile,
        loading,
        impersonate,
        stopImpersonation
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
