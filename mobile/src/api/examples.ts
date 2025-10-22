/**
 * Example: Using the Type-Safe API Client
 *
 * This file demonstrates how to use the apiClient in your React Native app.
 */

import { apiClient } from "./client";
import type { LoginDto, RegisterDto, UpdateUserDto } from "../types/api";

// ==================== Authentication Examples ====================

/**
 * Example: Register a new user
 */
async function registerExample() {
    try {
        const registerData: RegisterDto = {
            email: "newuser@example.com",
            password: "securePassword123",
            name: "John Doe",
        };

        const response = await apiClient.register(registerData);

        console.log("Registration successful!");
        console.log("Access Token:", response.accessToken);
        console.log("User:", response.user);

        // Token and user are automatically saved by authService
        return response;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}

/**
 * Example: Login existing user
 */
async function loginExample() {
    try {
        const loginData: LoginDto = {
            email: "user@example.com",
            password: "password123",
        };

        const response = await apiClient.login(loginData);

        console.log("Login successful!");
        console.log("User ID:", response.user.id);
        console.log("User Email:", response.user.email);

        return response;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

/**
 * Example: Logout
 */
async function logoutExample() {
    try {
        await apiClient.logout();
        console.log("Logged out successfully");
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

/**
 * Example: Refresh access token
 */
async function refreshTokenExample() {
    try {
        const tokens = await apiClient.refreshToken();
        console.log("Token refreshed:", tokens.accessToken);
        return tokens;
    } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
    }
}

// ==================== User Management Examples ====================

/**
 * Example: Get current user profile
 */
async function getCurrentUserExample() {
    try {
        const user = await apiClient.getCurrentUser();

        console.log("Current User:", user);
        console.log("Name:", user.name);
        console.log("Email:", user.email);

        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;
    }
}

/**
 * Example: Update user profile
 */
async function updateUserExample(userId: string) {
    try {
        const updateData: UpdateUserDto = {
            name: "Jane Doe",
            // email: 'newemail@example.com', // optional
        };

        const updatedUser = await apiClient.updateUser(userId, updateData);

        console.log("User updated:", updatedUser);
        return updatedUser;
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
}

/**
 * Example: Get all users (admin)
 */
async function getAllUsersExample() {
    try {
        const users = await apiClient.getAllUsers();

        console.log(`Found ${users.length} users`);
        users.forEach((user) => {
            console.log(`- ${user.name} (${user.email})`);
        });

        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}

// ==================== Sync Examples ====================

/**
 * Example: Pull changes from server
 */
async function syncPullExample() {
    try {
        const lastPulledAt = Date.now() - 60000; // 1 minute ago

        const response = await apiClient.syncPull({
            lastPulledAt,
            schemaVersion: 1,
            migration: null,
        });

        console.log("Pull successful");
        console.log("Server timestamp:", response.timestamp);
        console.log("Projects created:", response.changes.projects.created.length);
        console.log("Projects updated:", response.changes.projects.updated.length);
        console.log("Projects deleted:", response.changes.projects.deleted.length);

        return response;
    } catch (error) {
        console.error("Pull failed:", error);
        throw error;
    }
}

/**
 * Example: Push local changes to server
 */
async function syncPushExample() {
    try {
        const response = await apiClient.syncPush({
            changes: {
                projects: {
                    created: [
                        {
                            id: "project-1",
                            name: "New Project",
                            description: "A test project",
                        },
                    ],
                    updated: [],
                    deleted: [],
                },
                tasks: {
                    created: [],
                    updated: [
                        {
                            id: "task-1",
                            name: "Updated Task",
                            completed: true,
                        },
                    ],
                    deleted: ["task-2"],
                },
            },
            lastPulledAt: Date.now().toString(),
        });

        console.log("Push successful:", response.success);
        return response;
    } catch (error) {
        console.error("Push failed:", error);
        throw error;
    }
}

// ==================== Health Check Example ====================

/**
 * Example: Check API health
 */
async function healthCheckExample() {
    try {
        const health = await apiClient.healthCheck();

        console.log("Service:", health.service);
        console.log("Status:", health.status);
        console.log("Timestamp:", health.timestamp);

        return health;
    } catch (error) {
        console.error("Health check failed:", error);
        throw error;
    }
}

// ==================== Error Handling Examples ====================

/**
 * Example: Proper error handling with retry logic
 */
async function robustApiCallExample() {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const user = await apiClient.getCurrentUser();
            return user;
        } catch (err) {
            attempt++;
            const error = err as Error;

            if (error.message.includes("401")) {
                // Unauthorized - try to refresh token
                console.log("Token expired, refreshing...");
                try {
                    await refreshTokenExample();
                    // Retry the request
                    continue;
                } catch (refreshError) {
                    // Refresh failed - user needs to login again
                    console.error("Token refresh failed, please login again");
                    throw refreshError;
                }
            }

            if (attempt >= maxRetries) {
                console.error(`Failed after ${maxRetries} attempts`);
                throw error;
            }

            // Wait before retrying
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

/**
 * Example: Using with React Query (requires @tanstack/react-query package)
 *
 * Install: npm install @tanstack/react-query
 *
 * Note: This is optional and only needed if you want to use React Query
 */

// Uncomment if you have @tanstack/react-query installed:
/*
import { useQuery, useMutation } from '@tanstack/react-query';

function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useUpdateUser(userId: string) {
  return useMutation({
    mutationFn: (data: UpdateUserDto) => apiClient.updateUser(userId, data),
    onSuccess: () => {
      console.log('User updated successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to update user:', error);
    },
  });
}

export { useCurrentUser, useUpdateUser };
*/

// Export examples
export {
    registerExample,
    loginExample,
    logoutExample,
    refreshTokenExample,
    getCurrentUserExample,
    updateUserExample,
    getAllUsersExample,
    syncPullExample,
    syncPushExample,
    healthCheckExample,
    robustApiCallExample,
};
