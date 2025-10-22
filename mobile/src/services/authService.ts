import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

/**
 * Authentication Service
 * Handles login, registration, logout, and token management
 */
class AuthService {
    private token: string | null = null;
    private refreshToken: string | null = null;
    private user: User | null = null;

    /**
     * Register a new user
     */
    async register(email: string, password: string, name?: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Registration failed");
            }

            const data: AuthResponse = await response.json();
            await this.saveAuthData(data);

            return data;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Login failed");
            }

            const data: AuthResponse = await response.json();
            await this.saveAuthData(data);

            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Optional: Call backend logout endpoint
            if (this.token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                }).catch((err) => console.warn("Logout endpoint failed:", err));
            }
        } finally {
            await this.clearAuthData();
        }
    }

    /**
     * Get current auth token
     */
    async getToken(): Promise<string | null> {
        if (!this.token) {
            this.token = await AsyncStorage.getItem(TOKEN_KEY);
        }
        return this.token;
    }

    /**
     * Get refresh token
     */
    async getRefreshToken(): Promise<string | null> {
        if (!this.refreshToken) {
            this.refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return this.refreshToken;
    }

    /**
     * Get current user
     */
    async getUser(): Promise<User | null> {
        if (!this.user) {
            const userData = await AsyncStorage.getItem(USER_KEY);
            this.user = userData ? JSON.parse(userData) : null;
        }
        return this.user;
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return token !== null;
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(): Promise<string | null> {
        try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
                return null;
            }

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            });

            if (!response.ok) {
                await this.clearAuthData();
                return null;
            }

            const data = await response.json();
            this.token = data.accessToken;
            this.refreshToken = data.refreshToken;

            await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

            return data.accessToken;
        } catch (error) {
            console.error("Token refresh error:", error);
            await this.clearAuthData();
            return null;
        }
    }

    /**
     * Save auth data to storage
     */
    private async saveAuthData(data: AuthResponse): Promise<void> {
        this.token = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.user = data.user;

        await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    /**
     * Clear auth data from storage
     */
    private async clearAuthData(): Promise<void> {
        this.token = null;
        this.refreshToken = null;
        this.user = null;

        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    }
}

export const authService = new AuthService();
