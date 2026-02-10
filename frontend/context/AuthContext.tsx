"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  annual_income?: number;
  buying_power?: number;
  preferred_body_types?: string[];
  preferred_brands?: string[];
  additional_instructions?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_BASE_URL } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = API_BASE_URL;

  useEffect(() => {
    const checkAuth = async () => {
      let storedUserId = sessionStorage.getItem("undercut_user_id");

      // If no ID, generate a new one (Session-only Guest)
      if (!storedUserId) {
        storedUserId = crypto.randomUUID();
        sessionStorage.setItem("undercut_user_id", storedUserId);
        console.log("Generated Guest ID:", storedUserId);
      }

      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { "X-User-Id": storedUserId },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else if (res.status === 404) {
          // This is likely a new guest. In Phase 1 Task 3,
          // the backend will auto-create this. For now,
          // we'll set a basic guest state until the user saves preferences.
          setUser({ id: storedUserId, email: "guest@demo.local" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userId: string) => {
    setIsLoading(true);
    sessionStorage.setItem("undercut_user_id", userId);
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { "X-User-Id": userId },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Login failed:", error);
      sessionStorage.removeItem("undercut_user_id");
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("undercut_user_id");
    setUser(null);
    window.location.href = "/"; // Simple redirect to home
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
