import { SyncDatabaseChangeSet, SyncPullResult, synchronize } from "@nozbe/watermelondb/sync";

import { Database } from "@nozbe/watermelondb";
import { ENDPOINTS } from "../config/api";

// Type definitions for sync
interface SyncPullArgs {
    lastPulledAt?: number;
    schemaVersion: number;
    migration: any;
}

interface SyncPushArgs {
    changes: SyncDatabaseChangeSet;
    lastPulledAt: number;
}

/**
 * Sync Service for WatermelonDB
 * Implements the WatermelonDB Sync Protocol
 * @see https://watermelondb.dev/docs/Sync/Frontend
 */
export class SyncService {
    private database: Database;
    private authToken: string | null = null;
    private isSyncing: boolean = false;

    constructor(database: Database) {
        this.database = database;
    }

    /**
     * Set the authentication token for API requests
     */
    setAuthToken(token: string) {
        this.authToken = token;
    }

    /**
     * Clear the authentication token
     */
    clearAuthToken() {
        this.authToken = null;
    }

    /**
     * Check if currently syncing
     */
    getIsSyncing(): boolean {
        return this.isSyncing;
    }

    /**
     * Main synchronization function
     * Call this to sync local changes with the server
     */
    async sync(): Promise<void> {
        if (this.isSyncing) {
            console.log("Sync already in progress, skipping...");
            return;
        }

        if (!this.authToken) {
            throw new Error("Authentication token not set. Please login first.");
        }

        this.isSyncing = true;

        try {
            await synchronize({
                database: this.database,
                pullChanges: this.pullChanges.bind(this),
                pushChanges: this.pushChanges.bind(this),
                migrationsEnabledAtVersion: 1,
            });
            console.log("✅ Sync completed successfully");
        } catch (error) {
            console.error("❌ Sync failed:", error);
            throw error;
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Sync with retry logic
     * Recommended by WatermelonDB to handle server-side conflicts
     */
    async syncWithRetry(): Promise<void> {
        try {
            await this.sync();
        } catch (error) {
            console.log("Sync failed, retrying once...");
            try {
                await this.sync();
            } catch (retryError) {
                console.error("Sync failed after retry:", retryError);
                throw retryError;
            }
        }
    }

    /**
     * Pull changes from server
     * Called by WatermelonDB during sync
     */
    private async pullChanges(args: SyncPullArgs): Promise<SyncPullResult> {
        const { lastPulledAt, schemaVersion, migration } = args;

        console.log("📥 Pulling changes from server...", {
            lastPulledAt: lastPulledAt ? `${lastPulledAt} / ${new Date(lastPulledAt).toISOString()}` : "first sync",
            schemaVersion,
        });

        try {
            const response = await fetch(ENDPOINTS.SYNC_PULL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.authToken}`,
                },
                body: JSON.stringify({
                    lastPulledAt: lastPulledAt || 0,
                    schemaVersion,
                    migration,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Pull failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();

            console.log("📥 Pull completed:", {
                timestamp: `${result.timestamp} / ${new Date(result.timestamp).toISOString()}`,
                projectsCreated: result.changes.projects?.created?.length || 0,
                projectsUpdated: result.changes.projects?.updated?.length || 0,
                projectsDeleted: result.changes.projects?.deleted?.length || 0,
                tasksCreated: result.changes.tasks?.created?.length || 0,
                tasksUpdated: result.changes.tasks?.updated?.length || 0,
                tasksDeleted: result.changes.tasks?.deleted?.length || 0,
            });

            return result;
        } catch (error) {
            console.error("❌ Pull changes error:", error);
            throw error;
        }
    }

    /**
     * Push local changes to server
     * Called by WatermelonDB during sync
     */
    private async pushChanges(args: SyncPushArgs): Promise<void> {
        const { changes, lastPulledAt } = args;

        // Calculate statistics for logging
        const stats = Object.entries(changes).reduce((acc, [table, tableChanges]: [string, any]) => {
            acc[`${table}Created`] = tableChanges.created?.length || 0;
            acc[`${table}Updated`] = tableChanges.updated?.length || 0;
            acc[`${table}Deleted`] = tableChanges.deleted?.length || 0;
            return acc;
        }, {} as Record<string, number>);

        console.log("📤 Pushing changes to server...", {
            lastPulledAt: new Date(lastPulledAt).toISOString(),
            ...stats,
        });

        try {
            const response = await fetch(ENDPOINTS.SYNC_PUSH, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.authToken}`,
                },
                body: JSON.stringify({
                    changes,
                    lastPulledAt,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Push failed: ${response.status} - ${errorText}`);
            }

            console.log("📤 Push completed successfully");
        } catch (error) {
            console.error("❌ Push changes error:", error);
            throw error;
        }
    }
}

/**
 * Create a singleton instance of the sync service
 */
let syncServiceInstance: SyncService | null = null;

export const createSyncService = (database: Database): SyncService => {
    if (!syncServiceInstance) {
        syncServiceInstance = new SyncService(database);
    }
    return syncServiceInstance;
};

export const getSyncService = (): SyncService => {
    if (!syncServiceInstance) {
        throw new Error("SyncService not initialized. Call createSyncService first.");
    }
    return syncServiceInstance;
};
