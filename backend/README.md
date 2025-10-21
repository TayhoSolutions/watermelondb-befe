# Backend - WatermelonDB Sync API

NestJS v11 Backend mit JWT-Authentifizierung und WatermelonDB Synchronisierung.

## 🚀 Features

- ✅ **NestJS v11 Framework** - Moderne TypeScript-basierte Node.js Architektur mit Express v5
- ✅ **JWT Authentifizierung** - Access & Refresh Tokens mit Passport
- ✅ **Argon2 Password Hashing** - Sicher und schnell
- ✅ **Prisma ORM** - Type-safe Database Queries
- ✅ **MySQL Database** - Relationale Datenbank
- ✅ **Redis Cache mit Keyv** - Performance-Optimierung (Cache Manager v6)
- ✅ **WatermelonDB Sync** - Pull/Push Synchronisierung für Mobile App
- ✅ **Modulare Architektur** - Auth, Users, Sync Module getrennt

## 📋 Voraussetzungen

- **Node.js >= 20.x** (v11 Requirement!)
- MySQL >= 8.0
- Redis >= 6.0 (optional, aber empfohlen)

> ⚠️ **Wichtig:** NestJS v11 benötigt Node.js v20 oder höher!

## 🛠️ Installation

```bash
# Dependencies installieren
npm install

# .env Datei erstellen
cp .env.example .env
# Dann .env mit deinen Datenbank-Credentials anpassen
```

## 🗄️ Datenbank Setup

```bash
# MySQL Datenbank erstellen
mysql -u root -p
CREATE DATABASE watermelondb;
exit;

# .env konfigurieren
DATABASE_URL="mysql://root:dein_passwort@localhost:3306/watermelondb"

# Prisma Client generieren
npm run prisma:generate

# Datenbank Migration
npm run prisma:migrate

# Redis starten (macOS mit Homebrew)
brew services start redis
```

## 🏃 Backend starten

```bash
# Development Mode mit Hot Reload
npm run start:dev

# Production Build
npm run build
npm run start:prod
```

Das Backend läuft dann auf: `http://localhost:3000/api`

## 📡 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Users

```
GET  /api/users/me
GET  /api/users
GET  /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id
```

### Sync (WatermelonDB)

```
POST /api/sync/pull
POST /api/sync/push
```

## 🔐 Authentifizierung

Alle Sync- und User-Endpoints benötigen einen JWT Access Token im Authorization Header:

```
Authorization: Bearer <access_token>
```

### Registrierung

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Response:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔄 WatermelonDB Synchronisierung

### Pull Changes

```bash
curl -X POST http://localhost:3000/api/sync/pull \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lastPulledAt": 0
  }'
```

Response:

```json
{
  "changes": {
    "projects": {
      "created": [...],
      "updated": [...],
      "deleted": [...]
    },
    "tasks": {
      "created": [...],
      "updated": [...],
      "deleted": [...]
    }
  },
  "timestamp": 1697900000000
}
```

### Push Changes

```bash
curl -X POST http://localhost:3000/api/sync/push \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "changes": {
      "projects": {
        "created": [...],
        "updated": [...],
        "deleted": [...]
      },
      "tasks": {
        "created": [...],
        "updated": [...],
        "deleted": [...]
      }
    }
  }'
```

## 🏗️ Projektstruktur

```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma Schema (Models)
│   └── migrations/        # Database Migrations
├── src/
│   ├── prisma/            # Prisma Service (Global)
│   ├── auth/              # Authentifizierung (JWT, Passport)
│   │   ├── strategies/    # Local, JWT, JWT-Refresh Strategies
│   │   ├── guards/        # Auth Guards
│   │   └── dto/           # Login, Register DTOs
│   ├── users/             # User Management
│   │   └── dto/           # User DTOs
│   ├── sync/              # WatermelonDB Sync
│   │   └── dto/           # Pull, Push DTOs
│   ├── config/            # Konfiguration
│   ├── common/            # Shared Code
│   ├── app.module.ts      # Root Module
│   └── main.ts            # Entry Point
├── package.json
├── tsconfig.json
└── .env
```

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔧 Nützliche Befehle

```bash
# Linting
npm run lint

# Formatierung
npm run format

# Build
npm run build
```

## 🌐 Integration mit Mobile App

In deiner Mobile App (`mobile/src/database/index.ts`) musst du die Sync-Konfiguration hinzufügen:

```typescript
import { synchronize } from "@nozbe/watermelondb/sync";

async function sync(database) {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
            const response = await fetch("http://localhost:3000/api/sync/pull", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ lastPulledAt }),
            });
            return response.json();
        },
        pushChanges: async ({ changes }) => {
            await fetch("http://localhost:3000/api/sync/push", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ changes }),
            });
        },
    });
}
```

## 📝 Hinweise

- Prisma Migrations für Schema-Änderungen verwenden
- JWT Secrets in `.env` ändern
- CORS Origins in Production spezifizieren
- Redis für bessere Performance nutzen
- `npm run prisma:studio` für GUI-Datenbank-Management

## 📚 Weitere Infos

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)

## 📄 Lizenz

MIT
