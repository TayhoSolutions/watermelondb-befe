/**
 * API Type Definitions
 *
 * These types match the backend Swagger/OpenAPI schema.
 * To generate these automatically from Swagger:
 *
 * 1. Start backend server: cd backend && npm run start
 * 2. Access Swagger JSON: http://localhost:3000/api/docs-json
 * 3. Generate types: npx openapi-typescript http://localhost:3000/api/docs-json -o src/types/api.ts
 *
 * Or use swagger-typescript-api:
 * npx swagger-typescript-api -p http://localhost:3000/api/docs-json -o ./src/api -n api.ts
 */

// ==================== User Types ====================

export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDto {
    email: string;
    password: string;
    name?: string;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    name?: string;
    isActive?: boolean;
}

// ==================== Auth Types ====================

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name?: string;
}

export interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
}

// ==================== Sync Types ====================

export interface PullDto {
    lastPulledAt: number;
    schemaVersion: number;
    migration?: any;
}

export interface TableChanges {
    created: any[];
    updated: any[];
    deleted: string[];
}

export interface Changes {
    projects: TableChanges;
    tasks: TableChanges;
}

export interface PushDto {
    changes: Changes;
    lastPulledAt: string;
}

export interface PullResponse {
    changes: Changes;
    timestamp: number;
}

export interface PushResponse {
    success: boolean;
}

// ==================== Health Types ====================

export interface HealthCheckResponse {
    status: string;
    timestamp: string;
    service: string;
}

// ==================== Error Types ====================

export interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string;
}

// ==================== API Client Types ====================

export interface ApiRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
}
