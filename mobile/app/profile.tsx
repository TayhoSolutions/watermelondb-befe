import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert("Abmelden", "Möchtest du dich wirklich abmelden?", [
            {
                text: "Abbrechen",
                style: "cancel",
            },
            {
                text: "Abmelden",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logout();
                        router.push("/login");
                    } catch (error) {
                        Alert.alert("Fehler", "Abmeldung fehlgeschlagen");
                    }
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>👤</Text>
                </View>
                <Text style={styles.name}>{user?.name || "Benutzer"}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Konto</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Benutzer-ID:</Text>
                    <Text style={styles.infoValue}>{user?.id}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>E-Mail:</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                </View>

                {user?.name && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name:</Text>
                        <Text style={styles.infoValue}>{user.name}</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Aktionen</Text>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Profil bearbeiten</Text>
                    <Text style={styles.actionButtonIcon}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Passwort ändern</Text>
                    <Text style={styles.actionButtonIcon}>›</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Abmelden</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>WatermelonDB v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        fontSize: 48,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: "#666",
    },
    section: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    infoLabel: {
        fontSize: 16,
        color: "#666",
    },
    infoValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        flex: 1,
        textAlign: "right",
    },
    actionButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    actionButtonText: {
        fontSize: 16,
        color: "#333",
    },
    actionButtonIcon: {
        fontSize: 24,
        color: "#999",
    },
    logoutButton: {
        backgroundColor: "#ff3b30",
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    footer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 12,
        color: "#999",
    },
});
