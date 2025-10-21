# Sync Service

WatermelonDB Sync Service für die Mobile App - Implementiert nach der [offiziellen WatermelonDB Sync Dokumentation](https://watermelondb.dev/docs/Sync/Frontend).

## Dateien

-   **`syncService.ts`**: Haupt-Sync-Service mit Pull/Push Logik
-   **`useSync.ts`**: React Hooks für einfache Integration
-   **`index.ts`**: Export-Modul

## Quick Start

```typescript
import { useSync } from "./src/sync";

function MyComponent() {
    const { sync, isSyncing } = useSync({
        authToken: "your-jwt-token",
        syncOnMount: true,
    });

    return <Button onPress={sync} disabled={isSyncing} title="Sync" />;
}
```

## Features

✅ Pull changes from server  
✅ Push local changes to server  
✅ Automatic conflict resolution  
✅ Retry logic  
✅ React Hooks  
✅ Auto-sync on data changes  
✅ Migration support

Siehe [MOBILE-SYNC-INTEGRATION.md](../../../MOBILE-SYNC-INTEGRATION.md) für Details.
