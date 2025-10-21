# Sync Service - Integrationsleitfaden

Dieser Leitfaden zeigt, wie der Sync-Service in die bestehende App integriert werden kann.

## 🎯 Voraussetzungen

1. Backend läuft unter `http://localhost:3000`
2. JWT-Token für Authentifizierung verfügbar
3. WatermelonDB korrekt konfiguriert

## 📱 Integration in bestehende App

### Schritt 1: API-URL konfigurieren

Bearbeite `mobile/src/config/api.ts`:

```typescript
// Für iOS Simulator
export const API_URL = "http://localhost:3000";

// Für Android Emulator
// export const API_URL = 'http://10.0.2.2:3000';

// Für physisches Gerät (ersetze mit deiner IP)
// export const API_URL = 'http://192.168.1.100:3000';
```

### Schritt 2: Sync-Service initialisieren

Im Root-Layout (`app/_layout.tsx`):

```typescript
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { Stack } from "expo-router";
import { database } from "../src/database";
import { createSyncService } from "../src/sync";
import { useEffect } from "react";

export default function RootLayout() {
    // Sync-Service initialisieren
    useEffect(() => {
        createSyncService(database);
    }, []);

    return (
        <DatabaseProvider database={database}>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Projects" }} />
                <Stack.Screen name="project-detail" options={{ title: "Project Details" }} />
                <Stack.Screen name="sync-settings" options={{ title: "Sync Settings" }} />
            </Stack>
        </DatabaseProvider>
    );
}
```

### Schritt 3: Sync-Button hinzufügen

Option A: Verwende die fertige `SyncButton` Komponente:

```typescript
import { SyncButton } from "../src/components/SyncButton";

function MyScreen() {
    const authToken = "your-jwt-token"; // Aus Auth-Context holen

    return (
        <View>
            <SyncButton authToken={authToken} />
            {/* Rest deiner UI */}
        </View>
    );
}
```

Option B: Eigene Implementierung mit Hook:

```typescript
import { useSync } from "../src/sync";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

function MyScreen() {
    const authToken = "your-jwt-token";
    const { sync, isSyncing, lastSyncAt, error } = useSync({ authToken });

    return (
        <TouchableOpacity onPress={sync} disabled={isSyncing}>
            {isSyncing ? <ActivityIndicator /> : <Text>Sync</Text>}
        </TouchableOpacity>
    );
}
```

### Schritt 4: Auto-Sync bei Datenänderungen (Optional)

Im Root-Layout oder in einer Haupt-Komponente:

```typescript
import { useAutoSync } from "../src/sync";

function App() {
    const authToken = "your-jwt-token";

    // Automatischer Sync 5 Sekunden nach letzter Änderung
    useAutoSync({
        authToken,
        tables: ["projects", "tasks"],
        debounceMs: 5000,
        enabled: true,
    });

    return <YourApp />;
}
```

## 🔐 Authentication Integration

### Auth-Token verwalten

```typescript
import { getSyncService } from "../src/sync";

// Nach erfolgreichem Login
const handleLogin = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const { accessToken } = await response.json();

    // Token setzen
    const syncService = getSyncService();
    syncService.setAuthToken(accessToken);

    // Optional: Sofort synchronisieren
    await syncService.syncWithRetry();
};

// Bei Logout
const handleLogout = async () => {
    const syncService = getSyncService();

    // Erst synchronisieren, dann Token löschen
    try {
        await syncService.syncWithRetry();
    } catch (error) {
        console.error("Final sync failed:", error);
    }

    syncService.clearAuthToken();
};
```

### Mit AsyncStorage (Token-Persistierung)

```bash
npm install @react-native-async-storage/async-storage
```

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSyncService } from "../src/sync";

// Token speichern
const saveToken = async (token: string) => {
    await AsyncStorage.setItem("auth_token", token);
    getSyncService().setAuthToken(token);
};

// Token laden beim App-Start
const loadToken = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
        getSyncService().setAuthToken(token);
        // Optional: Auto-Sync beim Start
        try {
            await getSyncService().syncWithRetry();
        } catch (error) {
            console.error("Initial sync failed:", error);
        }
    }
};

// Im Root-Component
useEffect(() => {
    loadToken();
}, []);
```

## 🎨 UI-Patterns

### Pattern 1: Sync-Indikator in der Navigation

```typescript
function NavigationHeader() {
    const { isSyncing, lastSyncAt } = useSync({ authToken });

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isSyncing && <ActivityIndicator size="small" />}
            {lastSyncAt && !isSyncing && (
                <Text style={{ fontSize: 10, color: "#666" }}>Synced {formatRelativeTime(lastSyncAt)}</Text>
            )}
        </View>
    );
}
```

### Pattern 2: Pull-to-Refresh

```typescript
import { RefreshControl, ScrollView } from "react-native";

function ProjectListScreen() {
    const { sync, isSyncing } = useSync({ authToken });

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isSyncing} onRefresh={sync} />}>
            <ProjectList />
        </ScrollView>
    );
}
```

### Pattern 3: Offline-Indikator

```typescript
import NetInfo from "@react-native-community/netinfo";

function OfflineBar() {
    const [isOffline, setIsOffline] = useState(false);
    const { isSyncing, error } = useSync({ authToken });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOffline(!state.isConnected);
        });
        return unsubscribe;
    }, []);

    if (isOffline) {
        return (
            <View style={{ backgroundColor: "#ff9800", padding: 8 }}>
                <Text style={{ color: "white", textAlign: "center" }}>
                    ⚠️ Offline - Änderungen werden später synchronisiert
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ backgroundColor: "#f44336", padding: 8 }}>
                <Text style={{ color: "white", textAlign: "center" }}>❌ Sync-Fehler - Bitte erneut versuchen</Text>
            </View>
        );
    }

    return null;
}
```

## 🔄 Sync-Strategien

### Strategie 1: Manueller Sync

Benutzer entscheidet, wann synchronisiert wird (z.B. über Button).

**Vorteile:**

-   Volle Kontrolle für User
-   Geringer Netzwerk-Traffic

**Nachteile:**

-   User muss daran denken
-   Potentiell veraltete Daten

```typescript
const { sync } = useSync({ authToken });
<Button onPress={sync} title="Sync" />;
```

### Strategie 2: Auto-Sync bei App-Start

Synchronisiert automatisch beim App-Start.

**Vorteile:**

-   Immer aktuelle Daten beim Start
-   Transparent für User

**Nachteile:**

-   Verzögert App-Start
-   Verbraucht Daten bei jedem Start

```typescript
useSync({
    authToken,
    syncOnMount: true,
});
```

### Strategie 3: Auto-Sync bei Datenänderungen

Synchronisiert automatisch nach lokalen Änderungen.

**Vorteile:**

-   Daten fast immer aktuell
-   Automatische Backups

**Nachteile:**

-   Höherer Netzwerk-Traffic
-   Mehr Batterie-Verbrauch

```typescript
useAutoSync({
    authToken,
    tables: ["projects", "tasks"],
    debounceMs: 5000,
});
```

### Strategie 4: Hybrid (Empfohlen)

Kombination aus Auto-Sync + manuellem Sync + Pull-to-Refresh.

```typescript
function App() {
    const authToken = useAuthToken();

    // Auto-Sync mit langem Debounce
    useAutoSync({
        authToken,
        debounceMs: 30000, // 30 Sekunden
    });

    // Sync beim App-Start
    useSync({
        authToken,
        syncOnMount: true,
    });

    // Manueller Sync über UI verfügbar
    // Pull-to-Refresh in Listen
}
```

## 📊 Sync-Monitoring

### Sync-Status verfolgen

```typescript
function SyncMonitor() {
    const { isSyncing, lastSyncAt, error } = useSync({ authToken });

    useEffect(() => {
        if (error) {
            // Fehler loggen oder an Error-Tracking senden
            console.error("Sync error:", error);
            // Sentry.captureException(error);
        }
    }, [error]);

    useEffect(() => {
        if (lastSyncAt) {
            // Erfolgreichen Sync tracken
            console.log("Sync completed at:", lastSyncAt);
            // Analytics.track('sync_completed');
        }
    }, [lastSyncAt]);

    return null; // Unsichtbare Komponente
}
```

## 🐛 Debugging

### Console-Logs aktivieren

Die Sync-Service gibt bereits detaillierte Logs aus:

```
📥 Pulling changes from server...
📥 Pull completed: { projectsCreated: 2, tasksUpdated: 5 }
📤 Pushing changes to server...
📤 Push completed successfully
✅ Sync completed successfully
```

### React Native Debugger

1. Installiere React Native Debugger
2. Starte App mit Debug-Modus
3. Öffne Network Tab
4. Beobachte Sync-Requests

### Manuelles Testen

```typescript
// In einem Dev-Screen oder Button
const testSync = async () => {
    const syncService = getSyncService();

    console.log("=== Testing Sync ===");
    console.log("Is syncing:", syncService.getIsSyncing());

    try {
        await syncService.syncWithRetry();
        console.log("✅ Sync test successful");
    } catch (error) {
        console.error("❌ Sync test failed:", error);
    }
};
```

## 🔧 Troubleshooting

### "Authentication token not set"

**Problem:** Token wurde nicht gesetzt  
**Lösung:** Stelle sicher, dass `setAuthToken()` nach Login aufgerufen wird

```typescript
// Falsch
const token = await login();
// Token nicht gesetzt!

// Richtig
const token = await login();
getSyncService().setAuthToken(token);
```

### "Network request failed"

**Problem:** App kann Backend nicht erreichen  
**Lösung:**

1. Prüfe API_URL in `config/api.ts`
2. Bei Android: Verwende `10.0.2.2` statt `localhost`
3. Bei Device: Verwende lokale IP-Adresse
4. Prüfe Firewall/Netzwerk

```bash
# Lokale IP herausfinden
ipconfig getifaddr en0  # macOS
```

### "Sync already in progress"

**Problem:** Mehrere Sync-Aufrufe gleichzeitig  
**Lösung:** Das ist normal! Zweiter Aufruf wird übersprungen

```typescript
// Die Library verhindert doppelte Syncs automatisch
await sync(); // Startet Sync
await sync(); // Wird übersprungen, kein Fehler
```

### Pull/Push Fehler 4xx/5xx

**Problem:** Backend-Fehler  
**Lösung:**

1. Prüfe Backend-Logs
2. Validiere JWT-Token
3. Teste Backend-Endpoints mit Postman

## 📚 Weitere Ressourcen

-   [WatermelonDB Sync Docs](https://watermelondb.dev/docs/Sync/Frontend)
-   [Backend Sync Implementation](../backend/src/sync/)
-   [Sync Settings Screen](./app/sync-settings.tsx)
-   [Hauptdokumentation](../../MOBILE-SYNC-INTEGRATION.md)

## ✅ Checkliste für Production

-   [ ] API_URL für Production konfiguriert
-   [ ] Token-Refresh implementiert
-   [ ] Error-Tracking eingerichtet
-   [ ] Offline-Modus getestet
-   [ ] Sync-Konflikte getestet
-   [ ] Performance bei großen Daten getestet
-   [ ] Battery-Impact gemessen
-   [ ] Network-Traffic optimiert
-   [ ] User-Feedback bei Sync-Fehlern
-   [ ] Analytics für Sync-Events

## 🤝 Support

Bei Fragen oder Problemen:

1. Prüfe diese Dokumentation
2. Siehe Console-Logs
3. Teste Backend-Endpoints direkt
4. Kontaktiere das Team
