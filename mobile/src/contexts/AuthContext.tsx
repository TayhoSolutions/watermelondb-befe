import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, User } from "../services/authService";
import { getSyncService } from "../sync";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth data on mount
    useEffect(() => {
        loadAuthData();
    }, []);

    // Update sync service when token changes
    useEffect(() => {
        if (token) {
            try {
                const syncService = getSyncService();
                syncService.setAuthToken(token);
            } catch (error) {
                console.warn("Sync service not initialized yet");
            }
        }
    }, [token]);

    const loadAuthData = async () => {
        try {
            const [savedToken, savedUser] = await Promise.all([authService.getToken(), authService.getUser()]);

            setToken(savedToken);
            setUser(savedUser);
        } catch (error) {
            console.error("Failed to load auth data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);
            setToken(response.accessToken);
            setUser(response.user);

            // Set token in sync service
            const syncService = getSyncService();
            syncService.setAuthToken(response.accessToken);

            // Optional: Trigger initial sync
            try {
                await syncService.syncWithRetry();
            } catch (syncError) {
                console.warn("Initial sync failed:", syncError);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name?: string) => {
        try {
            const response = await authService.register(email, password, name);
            setToken(response.accessToken);
            setUser(response.user);

            // Set token in sync service
            const syncService = getSyncService();
            syncService.setAuthToken(response.accessToken);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Sync before logout
            if (token) {
                try {
                    const syncService = getSyncService();
                    await syncService.syncWithRetry();
                } catch (syncError) {
                    console.warn("Final sync failed:", syncError);
                }
            }

            await authService.logout();
            setToken(null);
            setUser(null);

            // Clear sync service token
            const syncService = getSyncService();
            syncService.clearAuthToken();
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
