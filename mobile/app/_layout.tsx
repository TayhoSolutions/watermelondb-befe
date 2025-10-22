import React, { useEffect } from "react";

import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Text, ActivityIndicator, View } from "react-native";
import { createSyncService } from "../src/sync";
import { database } from "../src/database";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";

function RootLayoutNav() {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "login" || segments[0] === "register";

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace("/login");
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if authenticated
            router.replace("/");
        }
    }, [isAuthenticated, isLoading, segments]);

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
                    href: isAuthenticated ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="sync-settings"
                options={{
                    title: "Sync Settings",
                    tabBarLabel: "Sync",
                    tabBarIcon: () => <Text>🔄</Text>,
                    href: isAuthenticated ? undefined : null,
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
                    href: null,
                    title: "Login",
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
