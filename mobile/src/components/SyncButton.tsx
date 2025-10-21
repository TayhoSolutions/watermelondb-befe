import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useSync } from "../sync";

/**
 * Example Sync Button Component
 * Shows how to use the sync service in your app
 *
 * Usage:
 * <SyncButton authToken="your-jwt-token" />
 */
interface SyncButtonProps {
    authToken?: string;
}

export const SyncButton: React.FC<SyncButtonProps> = ({ authToken }) => {
    const { sync, isSyncing, lastSyncAt, error } = useSync({ authToken });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, isSyncing && styles.buttonDisabled]}
                onPress={sync}
                disabled={isSyncing || !authToken}
            >
                {isSyncing ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{authToken ? "🔄 Sync" : "⚠️ Not logged in"}</Text>
                )}
            </TouchableOpacity>

            {lastSyncAt && <Text style={styles.lastSync}>Last synced: {lastSyncAt.toLocaleTimeString()}</Text>}

            {error && <Text style={styles.error}>Error: {error.message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: "center",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#999",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    lastSync: {
        marginTop: 8,
        fontSize: 12,
        color: "#666",
    },
    error: {
        marginTop: 8,
        fontSize: 12,
        color: "#ff3b30",
    },
});
