# API Integration & Type Safety

Dieses Projekt verwendet **Swagger/OpenAPI** für API-Dokumentation und **Type-Safe API Clients** für das Frontend.

## 🔧 Backend: Swagger/OpenAPI

Das Backend stellt eine vollständige API-Dokumentation über Swagger bereit.

### Swagger UI zugreifen

1. Backend starten:

```bash
cd backend
npm run start:dev
```

2. Swagger UI öffnen:

```
http://localhost:3000/api/docs
```

### OpenAPI JSON Schema

Das OpenAPI-Schema ist verfügbar unter:

```
http://localhost:3000/api/docs-json
```

## 📱 Frontend: Type-Safe API Client

Das Frontend verwendet einen **typisierten API-Client** (`apiClient`), der automatisch:

-   ✅ Type-Safety für alle API-Calls bietet
-   ✅ Auth-Headers automatisch hinzufügt
-   ✅ Fehlerbehandlung übernimmt
-   ✅ Response-Typen validiert

### Verwendung des API Clients

```typescript
import { apiClient } from "@/api/client";

// Login
const response = await apiClient.login({
    email: "user@example.com",
    password: "password123",
});
// response ist vom Typ AuthResponseDto

// Get current user
const user = await apiClient.getCurrentUser();
// user ist vom Typ User

// Sync pull
const pullResponse = await apiClient.syncPull({
    lastPulledAt: Date.now(),
    schemaVersion: 1,
});
// pullResponse ist vom Typ PullResponse
```

## 🔄 Automatische Type-Generierung

Du kannst TypeScript-Typen automatisch aus dem Swagger-Schema generieren:

### Option 1: openapi-typescript (empfohlen)

```bash
# Backend starten
cd backend && npm run start:dev

# Typen generieren (im mobile-Ordner)
cd mobile
npx openapi-typescript http://localhost:3000/api/docs-json -o src/types/api-generated.ts
```

### Option 2: swagger-typescript-api

```bash
# Backend starten
cd backend && npm run start:dev

# API Client + Typen generieren
cd mobile
npx swagger-typescript-api -p http://localhost:3000/api/docs-json -o ./src/api -n generated-api.ts
```

## 📝 API Type Definitions

Alle API-Typen sind definiert in:

-   **`mobile/src/types/api.ts`** - Manuell gepflegte Typen (aktuell verwendet)
-   **`mobile/src/api/client.ts`** - Type-safe API Client

### Wichtige Typen:

#### Auth Types

```typescript
interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: User;
}

interface LoginDto {
    email: string;
    password: string;
}

interface RegisterDto {
    email: string;
    password: string;
    name?: string;
}
```

#### User Types

```typescript
interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

#### Sync Types

```typescript
interface PullDto {
    lastPulledAt: number;
    schemaVersion: number;
    migration?: any;
}

interface PushDto {
    changes: Changes;
    lastPulledAt: string;
}
```

## 🔐 Authentication Flow

Das Backend gibt bei Login/Register folgende Daten zurück:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "cm6j3n4pa0000pn4n8eqj0kze",
        "email": "user@example.com",
        "name": "John Doe",
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
    }
}
```

Der `authService` speichert automatisch:

-   `accessToken` → für API-Requests (15 min Gültigkeit)
-   `refreshToken` → zum Erneuern des Access Tokens (7 Tage Gültigkeit)
-   `user` → User-Daten

## 🧪 Testing mit HTTP Files

Alle Endpoints können mit REST Client getestet werden:

```bash
cd backend/tests
# Öffne eine .http Datei in VS Code
# Klicke auf "Send Request" über der jeweiligen Request-Definition
```

Verfügbare Test-Files:

-   `auth.http` - Authentication endpoints
-   `users.http` - User management
-   `sync.http` - Sync endpoints
-   `app.http` - Health checks
-   `complete-api-test.http` - Full flow test

## 📚 Weitere Dokumentation

-   **Backend API**: http://localhost:3000/api/docs
-   **WatermelonDB Sync**: https://watermelondb.dev/docs/Sync/Frontend
-   **NestJS Swagger**: https://docs.nestjs.com/openapi/introduction
-   **OpenAPI Spec**: https://swagger.io/specification/

## 🔧 Troubleshooting

### Typen stimmen nicht überein?

Wenn Backend und Frontend Typen nicht übereinstimmen:

1. Backend neu builden: `cd backend && npm run build`
2. Swagger-Schema prüfen: http://localhost:3000/api/docs-json
3. Typen neu generieren (siehe oben)
4. Frontend `api.ts` manuell aktualisieren

### API Client Fehler?

```typescript
try {
    const user = await apiClient.getCurrentUser();
} catch (error) {
    console.error("API Error:", error.message);
    // Fehlerbehandlung
}
```

### Token abgelaufen?

Der `apiClient` verwendet automatisch den gespeicherten Token. Bei 401-Fehlern:

```typescript
// Token manuell erneuern
const newTokens = await apiClient.refreshToken();
await authService.saveAuthData(newTokens);
```

## ✨ Best Practices

1. **Immer den `apiClient` verwenden** statt direkter `fetch`-Calls
2. **Type Guards** für Runtime-Validierung nutzen
3. **Error Boundaries** für API-Fehler implementieren
4. **Retry Logic** für netzwerkbedingte Fehler
5. **Token Refresh** automatisch bei 401-Fehlern
