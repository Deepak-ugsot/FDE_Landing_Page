"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "@/lib/api";

export type CurrentStatus = "student" | "working_professional" | "fresher" | "other";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  currentStatus?: CurrentStatus;
  source?: string;
  role?: string;
  hasPaid: boolean;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SignupPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  currentStatus?: CurrentStatus;
};

type AuthResponse = { token: string; user: User };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasPaid: boolean;
  signup: (payload: SignupPayload) => Promise<User>;
  login: (payload: { email: string; password: string }) => Promise<User>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, fetch the current user.
  useEffect(() => {
    const init = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.get<{ user: User }>("/auth/me");
        setUser(user);
      } catch {
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const data = await api.post<AuthResponse>("/auth/signup", payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const data = await api.post<AuthResponse>("/auth/login", payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    hasPaid: !!user?.hasPaid,
    signup,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
