import { useState, useEffect, useCallback } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };
const STORAGE_KEY = "xsense_auth_user";

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setUser(getStoredUser());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      storeUser(data.user);
      setUser(data.user);
      return data.user as AuthUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      storeUser(data.user);
      setUser(data.user);
      return data.user as AuthUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storeUser(null);
    setUser(null);
    setError(null);
  }, []);

  return { user, loading, error, login, register, logout, isLoggedIn: !!user };
}

export function getAuthUser(): AuthUser | null {
  return getStoredUser();
}
