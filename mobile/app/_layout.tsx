import { ActivityIndicator, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";

import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { createSyncService } from "../src/sync";
import { database } from "../src/database";

function RootLayoutNav() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Projects",
                    tabBarLabel: "Projects",
                    tabBarIcon: () => <Text>📋</Text>,
                    // href: isAuthenticated ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="sync-settings"
                options={{
                    title: "Sync Settings",
                    tabBarLabel: "Sync",
                    tabBarIcon: () => <Text>🔄</Text>,
                    // href: isAuthenticated ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarLabel: "Profil",
                    tabBarIcon: () => <Text>👤</Text>,
                    href: isAuthenticated ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="project-detail"
                options={{
                    href: null,
                    title: "Project Details",
                }}
            />
            <Tabs.Screen
                name="login"
                options={{
                    title: "Login",
                    tabBarLabel: "Login",
                    tabBarIcon: () => <Text>👤</Text>,
                    href: isAuthenticated ? null : undefined,
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    href: null,
                    title: "Registrieren",
                }}
            />
        </Tabs>
    );
}

export default function RootLayout() {
    useEffect(() => {
        createSyncService(database);
    }, []);

    return (
        <DatabaseProvider database={database}>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </DatabaseProvider>
    );
}
