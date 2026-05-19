import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { AuthResponseData, AuthUser, LoginRequestBody, RegisterRequestBody } from '@/types/auth';
import { loginUser, registerUser } from '@/api/authApi';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginRequestBody) => Promise<void>;
  register: (payload: RegisterRequestBody) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface StoredAuthState {
  user: AuthUser;
  token: string;
}

const authStorageKey = 'smart-leads-auth';

const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    (candidate.role === 'admin' || candidate.role === 'sales') &&
    typeof candidate.createdAt === 'string'
  );
};

const getStoredAuthState = (): StoredAuthState | null => {
  const rawAuthState = localStorage.getItem(authStorageKey);

  if (!rawAuthState) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawAuthState) as unknown;

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const candidate = parsed as Record<string, unknown>;

    if (typeof candidate.token !== 'string' || !isAuthUser(candidate.user)) {
      return null;
    }

    return {
      token: candidate.token,
      user: candidate.user
    };
  } catch {
    return null;
  }
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAuthState = getStoredAuthState();

    if (storedAuthState) {
      setUser(storedAuthState.user);
      setToken(storedAuthState.token);
    }
  }, []);

  const persistAuthState = (nextState: StoredAuthState): void => {
    localStorage.setItem(authStorageKey, JSON.stringify(nextState));
    setUser(nextState.user);
    setToken(nextState.token);
  };

  const login = async (payload: LoginRequestBody): Promise<void> => {
    const authResponse = await loginUser(payload);
    persistAuthState(authResponse);
  };

  const register = async (payload: RegisterRequestBody): Promise<void> => {
    const authResponse = await registerUser(payload);
    persistAuthState(authResponse);
  };

  const logout = (): void => {
    localStorage.removeItem(authStorageKey);
    localStorage.removeItem('smart-leads-token');
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('smart-leads-token', token);
    }
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token)
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
