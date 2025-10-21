import React, { useEffect } from "react";

import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { createSyncService } from "../src/sync";
import { database } from "../src/database";

export default function RootLayout() {
    useEffect(() => {
        createSyncService(database);
    }, []);

    return (
        <DatabaseProvider database={database}>
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Projects",
                        tabBarLabel: "Projects",
                        tabBarIcon: () => <Text>📋</Text>,
                    }}
                />
                <Tabs.Screen
                    name="sync-settings"
                    options={{
                        title: "Sync Settings",
                        tabBarLabel: "Sync",
                        tabBarIcon: () => <Text>🔄</Text>,
                    }}
                />
                <Tabs.Screen
                    name="project-detail"
                    options={{
                        href: null, // Versteckt diesen Screen aus dem Tab-Navigator
                        title: "Project Details",
                    }}
                />
            </Tabs>
        </DatabaseProvider>
    );
}
