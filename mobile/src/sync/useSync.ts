import { useEffect, useState, useCallback } from "react";
import { useDatabase } from "@nozbe/watermelondb/react";
import { createSyncService, getSyncService } from "./syncService";

/**
 * React Hook for syncing with the backend
 * Usage:
 *
 * const { sync, isSyncing, lastSyncAt, error } = useSync();
 *
 * // Trigger sync manually
 * await sync();
 *
 * // Or sync automatically on mount
 * const { sync, isSyncing } = useSync({ syncOnMount: true });
 */
export const useSync = (options?: { syncOnMount?: boolean; authToken?: string }) => {
    const database = useDatabase();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // Initialize sync service
    useEffect(() => {
        createSyncService(database);
    }, [database]);

    // Set auth token if provided
    useEffect(() => {
        if (options?.authToken) {
            const syncService = getSyncService();
            syncService.setAuthToken(options.authToken);
        }
    }, [options?.authToken]);

    /**
     * Trigger sync with the backend
     */
    const sync = useCallback(async () => {
        setIsSyncing(true);
        setError(null);

        try {
            const syncService = getSyncService();
            await syncService.syncWithRetry();
            setLastSyncAt(new Date());
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown sync error");
            setError(error);
            console.error("Sync error in hook:", error);
        } finally {
            setIsSyncing(false);
        }
    }, []);

    /**
     * Sync on mount if configured
     */
    useEffect(() => {
        if (options?.syncOnMount && options?.authToken) {
            sync();
        }
    }, [options?.syncOnMount, options?.authToken, sync]);

    return {
        sync,
        isSyncing,
        lastSyncAt,
        error,
    };
};

/**
 * Hook to set up automatic sync on database changes
 * This will sync whenever data changes in the specified tables
 *
 * Usage:
 * useAutoSync({
 *   authToken: 'your-jwt-token',
 *   tables: ['projects', 'tasks'],
 *   debounceMs: 5000, // Wait 5 seconds after last change
 * });
 */
export const useAutoSync = (options: {
    authToken?: string;
    tables?: string[];
    debounceMs?: number;
    enabled?: boolean;
}) => {
    const database = useDatabase();
    const { sync, isSyncing, lastSyncAt, error } = useSync({ authToken: options.authToken });
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const debounceMs = options.debounceMs || 5000;
    const tables = options.tables || ["projects", "tasks"];
    const enabled = options.enabled !== false;

    useEffect(() => {
        if (!enabled || !options.authToken) {
            return;
        }

        // Subscribe to changes in specified tables
        const subscription = database.withChangesForTables(tables).subscribe(() => {
            // Clear existing timer
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            // Set new timer
            const timer = setTimeout(() => {
                console.log("Auto-sync triggered by database changes");
                sync();
            }, debounceMs);

            setDebounceTimer(timer);
        });

        // Cleanup
        return () => {
            subscription.unsubscribe();
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [database, enabled, options.authToken, debounceMs, tables, sync, debounceTimer]);

    return {
        isSyncing,
        lastSyncAt,
        error,
        manualSync: sync,
    };
};
