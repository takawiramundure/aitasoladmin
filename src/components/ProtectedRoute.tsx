import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: ('super_admin' | 'editor')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/signin" />;

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
}
