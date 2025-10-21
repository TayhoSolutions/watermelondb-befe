# NestJS v11 Migration Guide

## Übersicht

Dieses Dokument beschreibt die durchgeführte Migration von NestJS v10 auf v11.

## Wichtige Änderungen

### 1. Node.js Version Requirement

-   **Alt:** Node.js v16/v18 unterstützt
-   **Neu:** Node.js v20+ erforderlich
-   ✅ **Aktion:** `engines` Feld in `package.json` hinzugefügt

```json
"engines": {
  "node": ">=20.0.0"
}
```

### 2. Express v5 Integration

NestJS v11 nutzt Express v5 als Standard. Dies bringt folgende Änderungen:

#### Query Parameter Parsing

-   **Problem:** Express v5 nutzt standardmäßig den "simple" Parser, der keine verschachtelten Objekte/Arrays unterstützt
-   **Lösung:** `query parser` auf `extended` gesetzt in `main.ts`

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set("query parser", "extended");
```

#### Wildcard Routes (Falls verwendet)

-   **Alt:** `@Get('users/*')` oder `.forRoutes('*')`
-   **Neu:** `@Get('users/*splat')` oder `.forRoutes('{*splat}')`
-   ✅ **Status:** Keine Wildcards im aktuellen Code verwendet

### 3. Cache Manager v6 mit Keyv

Die größte Änderung betrifft das Caching-System:

#### Alte Konfiguration (v10)

```typescript
import * as redisStore from "cache-manager-redis-store";

CacheModule.registerAsync({
    useFactory: async () => ({
        store: redisStore,
        host: "localhost",
        port: 6379,
        // ...
    }),
});
```

#### Neue Konfiguration (v11)

```typescript
import KeyvRedis from "@keyv/redis"; // Default Import!

CacheModule.registerAsync({
    useFactory: async () => {
        const redisUrl = `redis://${host}:${port}/${db}`;
        return {
            stores: [new KeyvRedis(redisUrl)],
            ttl: 300000, // jetzt in Millisekunden!
        };
    },
});
```

#### Wichtige Unterschiede

1. **Keyv Adapter:** Nutzt `@keyv/redis` statt `cache-manager-redis-store`
2. **Connection String:** Redis-Verbindung als URL statt einzelner Parameter
3. **TTL in Millisekunden:** War vorher in Sekunden (300 → 300000)
4. **Datenstruktur:** Gecachte Daten haben jetzt `value` und `expires` Felder

### 4. ConfigModule Änderungen

-   `ignoreEnvVars` deprecated → nutze `validatePredefined: false`
-   Neue Option `skipProcessEnv` verfügbar
-   **Änderung in Priorität:**
    -   **Neu:** Interne Config → Validierte Env Vars → `process.env`
    -   **Alt:** Env Vars hatten höhere Priorität

✅ **Status:** Keine Anpassungen nötig, da wir keine Schema-Validierung nutzen

### 5. Paket-Aktualisierungen

#### Core NestJS Pakete

```json
"@nestjs/common": "^11.0.0",
"@nestjs/core": "^11.0.0",
"@nestjs/config": "^4.0.0",
"@nestjs/platform-express": "^11.0.0",
"@nestjs/passport": "^11.0.0",
"@nestjs/jwt": "^11.0.0",
"@nestjs/cache-manager": "^3.0.0"
```

#### Cache Manager

```json
"cache-manager": "^6.1.0",
"@keyv/redis": "^3.0.1"
```

Entfernt: `"cache-manager-redis-store": "^3.0.1"`

#### Express & TypeScript

```json
"@types/express": "^5.0.0",
"@types/node": "^22.0.0",
"@typescript-eslint/eslint-plugin": "^8.0.0",
"@typescript-eslint/parser": "^8.0.0",
"eslint": "^9.0.0",
"supertest": "^7.0.0"
```

## Migrationsschritte

### 1. Dependencies installieren

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 2. TypeScript Kompilierung prüfen

```bash
npm run build
```

### 3. Tests ausführen (optional)

```bash
npm run test
```

### 4. Prisma Client neu generieren

```bash
npm run prisma:generate
```

### 5. Anwendung starten

```bash
npm run start:dev
```

## Potenzielle Breaking Changes

### ✅ Lifecycle Hooks Reihenfolge

-   Termination Hooks werden jetzt in **umgekehrter Reihenfolge** ausgeführt
-   `OnModuleDestroy`, `BeforeApplicationShutdown`, `OnApplicationShutdown`
-   **Status:** Keine Lifecycle Hooks im Code → keine Anpassung nötig

### ✅ Middleware Registration Order

-   Global Middleware wird jetzt **immer zuerst** ausgeführt
-   **Status:** Keine Custom Middleware → keine Anpassung nötig

### ✅ Module Resolution Algorithm

-   Dynamische Module nutzen jetzt Objektreferenzen statt Hashes
-   **Potentielles Problem:** Integration Tests mit dynamischen Modulen
-   **Status:** Keine Tests vorhanden → später beachten

### ✅ Reflector Type Inference

-   `getAllAndOverride` gibt jetzt `T | undefined` zurück
-   `getAllAndMerge` gibt bei einzelnen Objekten ein Objekt statt Array zurück
-   **Status:** Keine direkte Nutzung im Code → keine Anpassung nötig

## Neue Features (Optional)

### 1. Mau Deployment Platform

```bash
npm install -g @nestjs/mau
mau deploy
```

Offizielle NestJS Deployment-Plattform für AWS.

## Nach der Migration

### Funktionalität testen

1. **Health Check:**

    ```bash
    curl http://localhost:3000/api
    ```

2. **Authentifizierung:**

    ```bash
    # Registrierung
    curl -X POST http://localhost:3000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"Test123!"}'

    # Login
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"Test123!"}'
    ```

3. **Sync Endpoints:**
    ```bash
    # Pull Changes (mit JWT Token)
    curl http://localhost:3000/api/sync/pull?lastPulledAt=0 \
      -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

### Redis Cache prüfen

```bash
# Redis CLI
redis-cli
> KEYS *
> GET [key]
```

Beachte: Gecachte Werte haben jetzt die Struktur:

```json
{
    "value": "yourData",
    "expires": 1678901234567
}
```

## Troubleshooting

### Problem: "Cannot find module '@keyv/redis'"

**Lösung:**

```bash
npm install
```

### Problem: Query Parameters werden nicht geparst

**Lösung:** Prüfe, ob in `main.ts` die `query parser` Konfiguration gesetzt ist:

```typescript
app.set("query parser", "extended");
```

### Problem: Cache Fehler

**Lösung:**

1. Redis läuft?

    ```bash
    redis-cli ping  # sollte "PONG" zurückgeben
    ```

2. Redis URL korrekt?
    ```typescript
    // Format: redis://[:password@]host[:port][/db-number]
    const redisUrl = `redis://${host}:${port}/${db}`;
    ```

### Problem: TypeScript Compile Errors

**Lösung:**

```bash
# Alte Build-Artefakte löschen
rm -rf dist

# Neu kompilieren
npm run build
```

## Referenzen

-   [Official NestJS v11 Migration Guide](https://docs.nestjs.com/migration-guide)
-   [Express v5 Migration Guide](https://expressjs.com/en/guide/migrating-5.html)
-   [Keyv Documentation](https://keyv.org/)
-   [NestJS v11 Announcement](https://trilon.io/blog/announcing-nestjs-11-whats-new)

## Zusammenfassung

✅ **Erfolgreich migriert:**

-   NestJS Core v10 → v11
-   Express v4 → v5 mit Query Parser Konfiguration
-   Cache Manager v5 → v6 mit Keyv/Redis
-   ConfigModule v3 → v4
-   Node.js Requirement auf v20+
-   Alle Dependencies aktualisiert
-   TypeScript Kompilierung erfolgreich

✅ **Durchgeführte Code-Änderungen:**

1. `package.json`: Alle NestJS Dependencies auf v11, Cache Manager auf v6, @keyv/redis hinzugefügt
2. `main.ts`: NestExpressApplication Type + Express v5 Query Parser Konfiguration
3. `app.module.ts`: Cache Manager von redis-store auf Keyv/Redis migriert

🔄 **Nächste Schritte:**

1. ✅ Dependencies installiert (`npm install` - 840 packages)
2. 🔄 Application testen mit `npm run start:dev`
3. 🔄 API Endpoints verifizieren
4. 🔄 Cache-Funktionalität prüfen
