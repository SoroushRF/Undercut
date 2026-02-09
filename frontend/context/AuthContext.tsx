'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (userId: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = 'http://localhost:8000';

    useEffect(() => {
        const checkAuth = async () => {
            const storedUserId = localStorage.getItem('undercut_user_id');
            if (storedUserId) {
                try {
                    const res = await fetch(`${API_URL}/users/me`, {
                        headers: { 'X-User-Id': storedUserId }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('undercut_user_id');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    // Do not clear user ID on network error, just don't set user
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (userId: string) => {
        setIsLoading(true);
        localStorage.setItem('undercut_user_id', userId);
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: { 'X-User-Id': userId }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error("Login failed:", error);
            localStorage.removeItem('undercut_user_id');
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('undercut_user_id');
        setUser(null);
        window.location.href = '/'; // Simple redirect to home
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
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
