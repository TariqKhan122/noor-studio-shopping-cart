import { createContext, useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { authReducer, INITIAL_AUTH_STATE } from '../reducers/authReducer';
import type { AuthState, OrderRecord, UserProfile } from '../types';
import { readStorageJSON, removeStorageKey, writeStorageJSON } from '../utils/storage';

const AUTH_STORAGE_KEY = 'noor_studio_auth_v1';

export interface LoginCredentials {
  email: string;
  name?: string;
}

export interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithCredentials: (credentials: LoginCredentials) => void;
  loginAsDemoUser: () => void;
  logout: () => void;
  updateProfile: (updates: { name?: string; city?: string; email?: string }) => void;
  recordOrder: (order: OrderRecord) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isValidUserProfile(candidate: unknown): candidate is UserProfile {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const record = candidate as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.email === 'string' &&
    typeof record.city === 'string' &&
    typeof record.memberSince === 'string' &&
    typeof record.isDemo === 'boolean' &&
    Array.isArray(record.orders)
  );
}

function isValidAuthState(value: unknown): value is AuthState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.isAuthenticated !== 'boolean') {
    return false;
  }

  if (record.isAuthenticated) {
    return isValidUserProfile(record.user);
  }

  return record.user === null;
}

function loadInitialAuthState(): AuthState {
  return readStorageJSON<AuthState>(AUTH_STORAGE_KEY, INITIAL_AUTH_STATE, isValidAuthState);
}

function deriveNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? 'Atelier Member';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, loadInitialAuthState);

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      writeStorageJSON(AUTH_STORAGE_KEY, state);
    } else {
      removeStorageKey(AUTH_STORAGE_KEY);
    }
  }, [state]);

  const loginWithCredentials = useCallback((credentials: LoginCredentials) => {
    const cleanEmail = credentials.email.trim().toLowerCase();
    const cleanName = credentials.name?.trim() || deriveNameFromEmail(cleanEmail);
    const user: UserProfile = {
      id: `usr_${cleanEmail.replace(/[^a-z0-9]/g, '').slice(0, 12) || 'member'}`,
      name: cleanName,
      email: cleanEmail,
      city: 'Lahore',
      memberSince: new Date().toISOString().slice(0, 10),
      isDemo: false,
      orders: [],
    };
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  }, []);

  const loginAsDemoUser = useCallback(() => {
    const demoUser: UserProfile = {
      id: 'usr_demo_amira',
      name: 'Amira Siddiqui',
      email: 'amira@noorstudio.com',
      city: 'Lahore',
      memberSince: '2025-09-14',
      isDemo: true,
      orders: [],
    };
    dispatch({ type: 'LOGIN_SUCCESS', payload: demoUser });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateProfile = useCallback(
    (updates: { name?: string; city?: string; email?: string }) => {
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    },
    []
  );

  const recordOrder = useCallback((order: OrderRecord) => {
    dispatch({ type: 'RECORD_ORDER', payload: order });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      loginWithCredentials,
      loginAsDemoUser,
      logout,
      updateProfile,
      recordOrder,
    }),
    [
      state.user,
      state.isAuthenticated,
      loginWithCredentials,
      loginAsDemoUser,
      logout,
      updateProfile,
      recordOrder,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
