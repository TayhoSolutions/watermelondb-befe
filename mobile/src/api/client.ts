import { authService } from "../services/authService";
import { API_URL } from "../config/api";
import type {
    AuthResponseDto,
    RefreshTokenResponseDto,
    LoginDto,
    RegisterDto,
    User,
    CreateUserDto,
    UpdateUserDto,
    PullDto,
    PushDto,
    PullResponse,
    PushResponse,
    HealthCheckResponse,
    ErrorResponse,
} from "../types/api";

/**
 * Type-safe API Client
 *
 * Provides strongly-typed methods for all backend endpoints.
 * Automatically handles authentication headers.
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    // ==================== Private Helper Methods ====================

    private async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await authService.getToken();
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getAuthHeaders();

        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error: ErrorResponse = await response.json().catch(() => ({
                statusCode: response.status,
                message: response.statusText,
            }));
            throw new Error(Array.isArray(error.message) ? error.message.join(", ") : error.message);
        }

        // Handle empty responses (204 No Content, etc.)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return {} as T;
        }

        return response.json();
    }

    // ==================== Authentication Endpoints ====================

    async register(data: RegisterDto): Promise<AuthResponseDto> {
        return this.request<AuthResponseDto>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async login(data: LoginDto): Promise<AuthResponseDto> {
        return this.request<AuthResponseDto>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async refreshToken(): Promise<RefreshTokenResponseDto> {
        const refreshToken = await authService.getRefreshToken();
        return this.request<RefreshTokenResponseDto>("/auth/refresh", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
    }

    async logout(): Promise<{ message: string }> {
        return this.request<{ message: string }>("/auth/logout", {
            method: "POST",
        });
    }

    // ==================== User Endpoints ====================

    async createUser(data: CreateUserDto): Promise<User> {
        return this.request<User>("/users", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getAllUsers(): Promise<User[]> {
        return this.request<User[]>("/users", {
            method: "GET",
        });
    }

    async getCurrentUser(): Promise<User> {
        return this.request<User>("/users/me", {
            method: "GET",
        });
    }

    async getUserById(id: string): Promise<User> {
        return this.request<User>(`/users/${id}`, {
            method: "GET",
        });
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<User> {
        return this.request<User>(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteUser(id: string): Promise<void> {
        return this.request<void>(`/users/${id}`, {
            method: "DELETE",
        });
    }

    // ==================== Sync Endpoints ====================

    async syncPull(data: PullDto): Promise<PullResponse> {
        return this.request<PullResponse>("/sync/pull", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async syncPush(data: PushDto): Promise<PushResponse> {
        return this.request<PushResponse>("/sync/push", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    // ==================== Health Endpoint ====================

    async healthCheck(): Promise<HealthCheckResponse> {
        return this.request<HealthCheckResponse>("/health", {
            method: "GET",
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export { ApiClient };
