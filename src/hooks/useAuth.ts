import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { fetchCurrentUser, loginUser, logoutUser, registerUser, sessionExpired } from '@/store/slices/authSlice';
import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  // Listen for the global session-expired event dispatched by the API interceptor
  useEffect(() => {
    const handler = () => dispatch(sessionExpired());
    window.addEventListener('auth:session-expired', handler);
    return () => window.removeEventListener('auth:session-expired', handler);
  }, [dispatch]);

  return {
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || status === 'idle',
    login: (payload: LoginPayload) => dispatch(loginUser(payload)),
    register: (payload: RegisterPayload) => dispatch(registerUser(payload)),
    logout: () => dispatch(logoutUser()),
    restoreSession: () => dispatch(fetchCurrentUser()),
  };
}
