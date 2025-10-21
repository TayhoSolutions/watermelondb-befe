import { DatabaseProvider } from "@nozbe/watermelondb/react";
import React from "react";
import { Stack } from "expo-router";
import { database } from "../src/database";

export default function RootLayout() {
    return (
        <DatabaseProvider database={database}>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Projects" }} />
                <Stack.Screen name="project-detail" options={{ title: "Project Details" }} />
            </Stack>
        </DatabaseProvider>
    );
}
