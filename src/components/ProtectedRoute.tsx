"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: ('super_admin' | 'editor')[];
    children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const { user, profile, loading, mfaVerified } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/signin');
            } else if (!mfaVerified) {
                if (profile && profile.mfaSetupComplete) {
                    router.replace('/mfa-verify');
                } else if (profile) {
                    router.replace('/mfa-enroll');
                }
            } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
                router.replace('/unauthorized');
            }
        }
    }, [user, profile, loading, allowedRoles, router, mfaVerified]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) return null;

    if (!mfaVerified) return null;

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        return null;
    }

    return <>{children}</>;
}
