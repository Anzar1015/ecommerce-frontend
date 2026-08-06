import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth.types';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

interface ProtectedRouteProps {
  /** If provided, only these roles may access the nested routes. */
  allowedRoles?: UserRole[];
}

/**
 * Guards nested routes behind authentication (and optionally a role).
 * Session state is restored from the httpOnly cookie once at app
 * startup (see App.tsx), so by the time routes render we know
 * definitively whether the user is authenticated.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, status } = useAuth();
  const location = useLocation();

  if (isLoading && status === 'idle') {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
