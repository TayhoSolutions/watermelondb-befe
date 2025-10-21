# Monorepo Structure - Mobile App

Die App wurde in einen `mobile/` Unterordner verschoben, um eine Monorepo-Struktur zu ermöglichen.

## Ordnerstruktur

```
watermelondb/
├── mobile/                          # React Native Expo App
│   ├── app/                         # Expo Router (File-based Routing)
│   │   ├── _layout.tsx             # Root Layout mit DatabaseProvider
│   │   ├── index.tsx               # Home Screen (Projects)
│   │   └── project-detail.tsx      # Project Detail Screen (Tasks)
│   ├── src/
│   │   ├── components/             # UI Components
│   │   │   ├── ProjectList.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── AddProjectForm.tsx
│   │   │   └── AddTaskForm.tsx
│   │   ├── database/               # WatermelonDB Configuration
│   │   │   ├── index.ts            # Database Instance (SQLite)
│   │   │   └── schema.ts           # Database Schema
│   │   ├── model/                  # WatermelonDB Models
│   │   │   ├── Project.ts
│   │   │   └── Task.ts
│   │   └── theme/                  # Design System
│   │       ├── colors.ts
│   │       └── styles.ts
│   ├── assets/                     # Images, Fonts, etc.
│   ├── app.json                    # Expo Configuration
│   ├── babel.config.js             # Babel with Decorators
│   ├── tsconfig.json               # TypeScript Configuration
│   └── package.json                # Mobile App Dependencies
├── package.json                    # Root Monorepo Configuration
├── .gitignore
└── README.md

```

## Vorteile der Monorepo-Struktur

### 1. **Skalierbarkeit**

-   Einfaches Hinzufügen von weiteren Apps/Packages:
    -   `backend/` - Node.js API Server
    -   `web/` - Next.js Web App
    -   `admin/` - Admin Dashboard
    -   `shared/` - Shared Code zwischen Apps

### 2. **Workspace Management**

-   NPM Workspaces für Dependency-Sharing
-   Einfache Cross-Package Entwicklung
-   Zentrale Dependency-Verwaltung

### 3. **CI/CD**

-   Build nur geänderte Packages
-   Einfachere Deployment-Pipeline
-   Shared Scripts im Root

## Verwendung

### Mobile App starten

```bash
# Vom Root-Verzeichnis
npm run mobile

# Oder direkt im mobile-Ordner
cd mobile
npm start
```

### Development Build erstellen

```bash
# iOS (vom Root)
npm run mobile:ios

# Android (vom Root)
npm run mobile:android

# Oder direkt im mobile-Ordner
cd mobile
npm run ios
# oder
npm run android
```

## Scripts (Root package.json)

```json
{
    "scripts": {
        "mobile": "cd mobile && npm start",
        "mobile:android": "cd mobile && npm run android",
        "mobile:ios": "cd mobile && npm run ios",
        "mobile:web": "cd mobile && npm run web"
    }
}
```

## Workspaces

Das Projekt verwendet NPM Workspaces:

```json
{
    "workspaces": ["mobile"]
}
```

**Vorteile**:

-   Dependencies werden im Root `node_modules/` geteilt
-   `npm install` im Root installiert alle Workspaces
-   Einfaches Package-Linking zwischen Workspaces

## Zukünftige Erweiterungen

### Backend hinzufügen

```bash
mkdir backend
cd backend
npm init -y
# Backend-Setup...
```

Dann in Root `package.json`:

```json
{
    "workspaces": ["mobile", "backend"]
}
```

### Shared Package hinzufügen

```bash
mkdir packages/shared
cd packages/shared
npm init -y
```

Verwendung in mobile:

```json
{
    "dependencies": {
        "shared": "workspace:*"
    }
}
```

## Migration von bisheriger Struktur

**Vorher:**

```
watermelondb/
├── app/
├── src/
├── app.json
├── babel.config.js
└── package.json
```

**Nachher:**

```
watermelondb/
├── mobile/          # <- Alles in diesem Ordner
│   ├── app/
│   ├── src/
│   └── ...
└── package.json     # <- Monorepo Root
```

## Wichtige Hinweise

### 1. **Imports bleiben gleich**

Alle Imports in der Mobile App bleiben unverändert:

```typescript
import { database } from "../src/database";
import Project from "../src/model/Project";
```

### 2. **Git Ignore**

Der Root `.gitignore` schützt `node_modules/` in allen Workspaces:

```
node_modules/
.expo/
```

### 3. **Development**

-   Entwicklung läuft **ganz normal** im `mobile/` Ordner
-   Alle Befehle können vom Root aus gestartet werden
-   Hot Reload funktioniert wie gewohnt

## Tech Stack (mobile/)

-   **Expo SDK 54** - React Native Framework
-   **WatermelonDB 0.28.0** - Offline-First Database
-   **SQLiteAdapter** - Persistente Datenbank (Development Build)
-   **Expo Router 6.0.12** - File-based Routing
-   **TypeScript 5.9.2** - Type Safety
-   **expo-sqlite 16.0.8** - Native SQLite Driver

## Nächste Schritte

1. ✅ Monorepo-Struktur erstellt
2. ✅ Mobile App im `mobile/` Ordner
3. ✅ Root `package.json` mit Scripts
4. ⏳ Development Build testen (`npm run mobile:ios`)
5. 🔜 Backend hinzufügen (optional)
6. 🔜 Shared Package erstellen (optional)
