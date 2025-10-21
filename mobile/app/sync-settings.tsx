import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { useSync } from "../src/sync";

/**
 * Sync Settings Screen
 * Zeigt Sync-Status und ermöglicht manuelles Synchronisieren
 */
export default function SyncSettingsScreen() {
    // TODO: JWT-Token sollte aus Auth-Context oder AsyncStorage kommen
    const authToken = "null"; // Ersetze dies mit echtem Token

    const { sync, isSyncing, lastSyncAt, error } = useSync({
        authToken: authToken || undefined,
    });

    const handleSync = async () => {
        if (!authToken) {
            Alert.alert("Nicht angemeldet", "Bitte melde dich an, um zu synchronisieren.", [{ text: "OK" }]);
            return;
        }

        try {
            await sync();
            Alert.alert("Erfolgreich", "Synchronisation erfolgreich abgeschlossen!", [{ text: "OK" }]);
        } catch (err) {
            Alert.alert("Fehler", "Synchronisation fehlgeschlagen. Bitte versuche es erneut.", [{ text: "OK" }]);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Synchronisation</Text>
                <Text style={styles.description}>Synchronisiere deine lokalen Daten mit dem Server.</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.statusRow}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={[styles.value, isSyncing && styles.syncing, error && styles.error]}>
                        {isSyncing
                            ? "🔄 Synchronisiert..."
                            : error
                            ? "❌ Fehler"
                            : authToken
                            ? "✅ Bereit"
                            : "⚠️ Nicht angemeldet"}
                    </Text>
                </View>

                {lastSyncAt && (
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Letzter Sync:</Text>
                        <Text style={styles.value}>
                            {lastSyncAt.toLocaleString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error.message}</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[styles.syncButton, (isSyncing || !authToken) && styles.syncButtonDisabled]}
                onPress={handleSync}
                disabled={isSyncing || !authToken}
            >
                <Text style={styles.syncButtonText}>
                    {isSyncing ? "🔄 Synchronisiert..." : "🔄 Jetzt synchronisieren"}
                </Text>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hinweise</Text>
                <Text style={styles.hint}>
                    • Die Synchronisation erfolgt automatisch im Hintergrund bei Datenänderungen
                </Text>
                <Text style={styles.hint}>
                    • Du kannst auch manuell synchronisieren, um sicherzustellen, dass alles aktuell ist
                </Text>
                <Text style={styles.hint}>• Bei Konflikten hat der Server immer Vorrang</Text>
                <Text style={styles.hint}>• Eine Internetverbindung ist erforderlich</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    section: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    description: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    label: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500",
    },
    value: {
        fontSize: 16,
        color: "#333",
    },
    syncing: {
        color: "#007AFF",
    },
    error: {
        color: "#ff3b30",
    },
    errorBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: "#ffebee",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#ff3b30",
    },
    errorText: {
        fontSize: 14,
        color: "#c62828",
        lineHeight: 20,
    },
    syncButton: {
        backgroundColor: "#007AFF",
        padding: 16,
        margin: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    syncButtonDisabled: {
        backgroundColor: "#999",
        shadowOpacity: 0,
        elevation: 0,
    },
    syncButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },
    hint: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 8,
    },
});
