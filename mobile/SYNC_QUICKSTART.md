# 🔄 WatermelonDB Sync Service - Schnellstart

Komplette Synchronisierungs-Lösung für die Mobile App nach WatermelonDB Best Practices.

## 📦 Was wurde implementiert?

### Core Files

```
mobile/src/
├── config/
│   └── api.ts                    # API-Konfiguration
├── sync/
│   ├── syncService.ts            # Haupt-Sync-Service
│   ├── useSync.ts                # React Hooks
│   ├── testUtils.ts              # Test-Utilities
│   ├── index.ts                  # Exports
│   └── README.md                 # Dokumentation
└── components/
    └── SyncButton.tsx            # UI-Komponente

mobile/app/
└── sync-settings.tsx             # Beispiel-Screen

mobile/
├── SYNC_INTEGRATION_GUIDE.md    # Detaillierte Anleitung
└── (README wird aktualisiert)
```

## 🚀 Quick Start (5 Minuten)

### 1. API-URL konfigurieren

```typescript
// mobile/src/config/api.ts
export const API_URL = "http://localhost:3000"; // Anpassen!
```

### 2. Sync-Service initialisieren

```typescript
// mobile/app/_layout.tsx
import { createSyncService } from "../src/sync";
import { useEffect } from "react";

export default function RootLayout() {
    useEffect(() => {
        createSyncService(database);
    }, []);

    return <YourApp />;
}
```

### 3. Sync-Button hinzufügen

```typescript
import { SyncButton } from "../src/components/SyncButton";

function MyScreen() {
    return <SyncButton authToken="your-jwt-token" />;
}
```

✅ **Fertig!** Der Sync ist jetzt funktionsfähig.

## 📖 Verwendung

### Manueller Sync

```typescript
import { useSync } from "./src/sync";

const { sync, isSyncing } = useSync({ authToken });
await sync();
```

### Auto-Sync bei Änderungen

```typescript
import { useAutoSync } from "./src/sync";

useAutoSync({
    authToken,
    tables: ["projects", "tasks"],
    debounceMs: 5000,
});
```

### Direkter Service-Zugriff

```typescript
import { getSyncService } from "./src/sync";

const service = getSyncService();
service.setAuthToken(token);
await service.syncWithRetry();
```

## 🧪 Testing

```typescript
import { runAllTests } from "./src/sync/testUtils";

// Führe alle Tests aus
await runAllTests("your-jwt-token");
```

## 📱 Beispiel-Screens

### Sync Settings Screen

Vollständiger Sync-Management-Screen verfügbar unter:

```
mobile/app/sync-settings.tsx
```

In Navigation einbinden:

```typescript
<Stack.Screen name="sync-settings" options={{ title: "Sync Settings" }} />
```

## 🔑 Auth-Integration

```typescript
// Nach Login
const syncService = getSyncService();
syncService.setAuthToken(jwtToken);

// Nach Logout
syncService.clearAuthToken();
```

## 📚 Dokumentation

-   **[SYNC_INTEGRATION_GUIDE.md](./SYNC_INTEGRATION_GUIDE.md)** - Detaillierte Integration
-   **[mobile/src/sync/README.md](./src/sync/README.md)** - Sync-Service Docs
-   **[WatermelonDB Docs](https://watermelondb.dev/docs/Sync/Frontend)** - Offizielle Docs

## ✨ Features

✅ Pull changes from server  
✅ Push local changes  
✅ Automatic conflict resolution  
✅ Retry logic  
✅ React Hooks (useSync, useAutoSync)  
✅ Auto-sync on data changes  
✅ Migration support  
✅ Detailed logging  
✅ Error handling  
✅ Test utilities  
✅ Example components

## 🐛 Troubleshooting

### Network Request Failed

-   Prüfe `API_URL` in `src/config/api.ts`
-   Android: Verwende `10.0.2.2` statt `localhost`
-   Device: Verwende lokale IP (z.B. `192.168.1.100`)

### Auth Token Not Set

-   Rufe `setAuthToken()` nach Login auf
-   Prüfe, ob Token gültig ist

### Sync Already in Progress

-   Das ist normal! Verhindert doppelte Syncs
-   Kein Fehler, einfach ignorieren

## 📊 Backend-Kompatibilität

Kompatibel mit Backend unter `../backend/src/sync`:

**Endpoints:**

-   `POST /sync/pull` - Pull changes
-   `POST /sync/push` - Push changes

**Auth:** Bearer Token im Authorization Header

## 🎯 Next Steps

1. ✅ API_URL für dein Setup konfigurieren
2. ✅ Auth-Token nach Login setzen
3. ✅ Sync-Button in UI einbauen
4. ⏳ Optional: Auto-Sync aktivieren
5. ⏳ Optional: Pull-to-Refresh implementieren
6. ⏳ Optional: Offline-Indikator hinzufügen

## 💡 Best Practices

1. **Immer `syncWithRetry()` verwenden** statt `sync()`
2. **Auto-Sync debounced** (mindestens 3-5 Sekunden)
3. **Sync bei App-Start** für aktuelle Daten
4. **Sync vor Logout** um Daten zu sichern
5. **Error Handling** dem User anzeigen

## 🤝 Support

Bei Fragen:

1. Siehe Dokumentation oben
2. Prüfe Console-Logs (sehr detailliert!)
3. Teste Backend-Endpoints direkt
4. Siehe [Backend-Dokumentation](../backend/src/sync/README.md)

---

**Happy Syncing! 🎉**
