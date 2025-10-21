/**
 * Sync Service Test Utilities
 * Hilfsfunktionen zum Testen des Sync-Services
 */

import { getSyncService } from "./syncService";
import { database } from "../database";

/**
 * Test 1: Pull changes from server
 * Testet, ob Änderungen vom Server abgerufen werden können
 */
export const testPullChanges = async (authToken: string) => {
    console.log("=== Test: Pull Changes ===");

    try {
        const syncService = getSyncService();
        syncService.setAuthToken(authToken);

        await syncService.sync();

        console.log("✅ Pull test successful");

        // Zeige Datenbank-Statistiken
        const projectCount = await database.collections.get("projects").query().fetchCount();
        const taskCount = await database.collections.get("tasks").query().fetchCount();

        console.log(`📊 Local data: ${projectCount} projects, ${taskCount} tasks`);

        return true;
    } catch (error) {
        console.error("❌ Pull test failed:", error);
        return false;
    }
};

/**
 * Test 2: Push local changes to server
 * Testet, ob lokale Änderungen zum Server gesendet werden
 */
export const testPushChanges = async (authToken: string) => {
    console.log("=== Test: Push Changes ===");

    try {
        // Erstelle ein Test-Projekt
        const testProject = await database.write(async () => {
            const projectsCollection = database.collections.get("projects");
            return await projectsCollection.create((project: any) => {
                project.name = "Test Project " + Date.now();
                project.description = "Created for sync testing";
            });
        });

        console.log("📝 Created test project:", testProject.id);

        // Synchronisiere
        const syncService = getSyncService();
        syncService.setAuthToken(authToken);

        await syncService.sync();

        console.log("✅ Push test successful");

        return testProject.id;
    } catch (error) {
        console.error("❌ Push test failed:", error);
        return null;
    }
};

/**
 * Test 3: Sync with retry
 * Testet die Retry-Logik bei Fehlern
 */
export const testSyncWithRetry = async (authToken: string) => {
    console.log("=== Test: Sync with Retry ===");

    try {
        const syncService = getSyncService();
        syncService.setAuthToken(authToken);

        const startTime = Date.now();
        await syncService.syncWithRetry();
        const duration = Date.now() - startTime;

        console.log(`✅ Sync with retry successful (${duration}ms)`);

        return true;
    } catch (error) {
        console.error("❌ Sync with retry failed:", error);
        return false;
    }
};

/**
 * Test 4: Test ohne Token (sollte fehlschlagen)
 */
export const testSyncWithoutAuth = async () => {
    console.log("=== Test: Sync without Auth (should fail) ===");

    try {
        const syncService = getSyncService();
        syncService.clearAuthToken();

        await syncService.sync();

        console.error("❌ Test failed: Should have thrown error");
        return false;
    } catch (error: any) {
        if (error.message.includes("Authentication token not set")) {
            console.log("✅ Test passed: Correctly rejected sync without token");
            return true;
        }

        console.error("❌ Test failed with unexpected error:", error);
        return false;
    }
};

/**
 * Test 5: Bidirektionaler Sync
 * Testet Pull und Push in einer Sequenz
 */
export const testBidirectionalSync = async (authToken: string) => {
    console.log("=== Test: Bidirectional Sync ===");

    try {
        const syncService = getSyncService();
        syncService.setAuthToken(authToken);

        // 1. Hole Server-Änderungen
        console.log("1️⃣ Pulling from server...");
        await syncService.sync();

        // 2. Erstelle lokale Änderung
        console.log("2️⃣ Creating local change...");
        const project = await database.write(async () => {
            const projectsCollection = database.collections.get("projects");
            return await projectsCollection.create((p: any) => {
                p.name = "Bidirectional Test " + Date.now();
                p.description = "Testing bidirectional sync";
            });
        });

        console.log("📝 Created project:", project.id);

        // 3. Sende zum Server
        console.log("3️⃣ Pushing to server...");
        await syncService.sync();

        console.log("✅ Bidirectional sync test successful");

        return true;
    } catch (error) {
        console.error("❌ Bidirectional sync test failed:", error);
        return false;
    }
};

/**
 * Test Suite: Alle Tests ausführen
 */
export const runAllTests = async (authToken: string) => {
    console.log("\n🧪 Running Sync Service Test Suite...\n");

    const results = {
        pullChanges: false,
        pushChanges: false,
        syncWithRetry: false,
        syncWithoutAuth: false,
        bidirectionalSync: false,
    };

    // Test 1
    results.pullChanges = await testPullChanges(authToken);
    await sleep(1000);

    // Test 2
    const projectId = await testPushChanges(authToken);
    results.pushChanges = projectId !== null;
    await sleep(1000);

    // Test 3
    results.syncWithRetry = await testSyncWithRetry(authToken);
    await sleep(1000);

    // Test 4
    results.syncWithoutAuth = await testSyncWithoutAuth();
    await sleep(1000);

    // Test 5
    results.bidirectionalSync = await testBidirectionalSync(authToken);

    // Ergebnisse
    console.log("\n📊 Test Results:");
    console.log("================");
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? "✅" : "❌"} ${test}`);
    });

    const passedCount = Object.values(results).filter((r) => r).length;
    const totalCount = Object.values(results).length;

    console.log(`\n${passedCount}/${totalCount} tests passed`);

    if (passedCount === totalCount) {
        console.log("🎉 All tests passed!");
    } else {
        console.log("⚠️ Some tests failed");
    }

    return results;
};

/**
 * Hilfsfunktion: Sleep
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Debug-Funktion: Zeige Datenbank-Statistiken
 */
export const showDatabaseStats = async () => {
    console.log("\n📊 Database Statistics:");
    console.log("=====================");

    const projects = await database.collections.get("projects").query().fetch();
    const tasks = await database.collections.get("tasks").query().fetch();

    console.log(`Projects: ${projects.length}`);
    projects.forEach((p) => {
        console.log(`  - ${p.id}: ${(p as any).name}`);
    });

    console.log(`\nTasks: ${tasks.length}`);
    tasks.forEach((t) => {
        console.log(`  - ${t.id}: ${(t as any).title}`);
    });

    console.log("");
};
