"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/firebaseConfig";

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

import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from "@/firebaseConfig";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [realProfile, setRealProfile] = useState<UserProfile | null>(null);
    const [impersonatedProfile, setImpersonatedProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const logAction = async (action: string, details: any) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'audit_logs'), {
                timestamp: serverTimestamp(),
                userId: user.uid,
                userEmail: user.email,
                realRole: realProfile?.role,
                action,
                details,
                activeRole: impersonatedProfile?.role || realProfile?.role
            });
        } catch (e) {
            console.error("Failed to log action", e);
        }
    };

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
        if (realProfile?.role !== 'super_admin') {
            console.warn("Security Alert: Non-admin attempted impersonation");
            return;
        }

        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const targetProfile = { ...userSnap.data(), uid: userId } as UserProfile;
                setImpersonatedProfile(targetProfile);
                localStorage.setItem('impersonatedUserId', userId);
                await logAction('impersonation_start', { targetUserId: userId, targetEmail: targetProfile.email });
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
        if (impersonatedProfile) {
            logAction('impersonation_stop', { targetUserId: impersonatedProfile.uid, targetEmail: impersonatedProfile.email });
        }
        setImpersonatedProfile(null);
        localStorage.removeItem('impersonatedUserId');
    };

    const value = React.useMemo(() => ({
        user,
        profile: impersonatedProfile || realProfile,
        isImpersonating: !!impersonatedProfile,
        loading,
        impersonate,
        stopImpersonation
    }), [user, impersonatedProfile, realProfile, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
