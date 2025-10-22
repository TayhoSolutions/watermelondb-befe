# WatermelonDB Full-Stack App - Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Expo](https://img.shields.io/badge/Expo-54.x-blue.svg)](https://expo.dev/)

A production-ready, offline-first full-stack application with React Native Expo mobile app and NestJS backend, featuring real-time bidirectional sync powered by WatermelonDB.

## 🚀 Quick Start

### Mobile App

```bash
# iOS Development Build
npm run mobile:ios

# Android Development Build
npm run mobile:android

# Development Server (nach Build)
npm run mobile
```

### Backend API

```bash
# Alle Dependencies installieren
npm run install:all

# Backend starten (MySQL & Redis müssen laufen!)
npm run backend
```

## 📁 Projekt-Struktur

```
watermelondb/
├── mobile/                    # React Native Expo App
│   ├── app/                  # Expo Router Screens
│   │   ├── _layout.tsx       # Root Layout
│   │   ├── index.tsx         # Home (Projects)
│   │   └── project-detail.tsx
│   ├── src/
│   │   ├── components/       # UI Components
│   │   ├── database/         # WatermelonDB Config
│   │   ├── model/            # Database Models
│   │   ├── services/         # Auth & Sync Services
│   │   └── theme/            # Design System
│   └── package.json
│
├── backend/                   # NestJS API Server
│   ├── src/
│   │   ├── auth/             # JWT Authentication Module
│   │   │   ├── strategies/   # Passport Strategies
│   │   │   ├── guards/       # Auth Guards
│   │   │   └── dto/          # DTOs
│   │   ├── users/            # User Management Module
│   │   ├── sync/             # WatermelonDB Sync Module
│   │   ├── entities/         # TypeORM Entities
│   │   ├── app.module.ts     # Root Module
│   │   └── main.ts           # Entry Point
│   ├── .env                  # Environment Config
│   └── package.json
│
├── docker-compose.yml         # Docker Setup
└── package.json              # Monorepo Root
```

## 🛠 Tech Stack

### Mobile App

-   **Expo SDK 54** - React Native Framework
-   **WatermelonDB 0.28.0** - Offline-First Database
-   **Expo Router 6.0.12** - File-based Routing
-   **TypeScript 5.9.2** - Type Safety

### Backend

-   **NestJS 10.3.0** - Progressive Node.js Framework
-   **TypeORM 0.3.19** - Database ORM
-   **MySQL 8.0** - Relational Database
-   **Redis 7** - Caching Layer
-   **Passport JWT** - Authentication
-   **Argon2** - Password Hashing

## 📱 Features

### Mobile

-   ✅ **Offline-First**: Alle Daten lokal mit SQLite
-   ✅ **Real-time Sync**: Bidirektionale Synchronisierung
-   ✅ **Type-Safe**: Vollständig in TypeScript
-   ✅ **Reactive UI**: Automatische Updates bei Datenänderungen

### Backend

-   ✅ **JWT Authentication**: Access & Refresh Tokens
-   ✅ **Argon2 Hashing**: Sichere Passwort-Verschlüsselung
-   ✅ **RESTful API**: Standard HTTP Endpoints
-   ✅ **WatermelonDB Sync**: Pull/Push Mechanismus
-   ✅ **Redis Caching**: Performance-Optimierung
-   ✅ **Modular Architecture**: Auth, Users, Sync getrennt

## 💻 Installation & Setup

### 1. Voraussetzungen

**Erforderlich:**

-   Node.js >= 18.x
-   MySQL >= 8.0
-   Redis >= 6.0 (optional, aber empfohlen)

**macOS:**

```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# MySQL & Redis
brew install mysql redis
brew services start mysql
brew services start redis
```

### 2. Datenbank erstellen

```bash
mysql -u root -p
```

```sql
CREATE DATABASE watermelondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Dependencies installieren

```bash
# Alle Pakete installieren (Mobile + Backend)
npm run install:all
```

### 4. Backend konfigurieren

```bash
cd backend
cp .env.example .env
# .env bearbeiten und Datenbank-Credentials eintragen
```

Wichtig in `.env`:

```bash
DB_PASSWORD=dein_mysql_passwort
JWT_SECRET=dein-geheimer-jwt-schluessel
JWT_REFRESH_SECRET=dein-geheimer-refresh-schluessel
```

### 5. Backend starten

```bash
npm run backend
```

Backend läuft auf: `http://localhost:3000/api`

### 6. Mobile App starten

```bash
npm run mobile:ios    # oder mobile:android
```

## 🎯 Entwicklung

### Backend Development

```bash
# Development Mode mit Hot Reload
npm run backend

# Production Build
npm run backend:build
npm run backend:prod

# Tests
cd backend && npm test
```

### Mobile Development

```bash
# Metro Bundler starten
npm run mobile

# iOS Development Build
npm run mobile:ios

# Android Development Build
npm run mobile:android
```

## 📚 Dokumentation

### Setup & Installation

-   [📘 BACKEND-SETUP.md](./BACKEND-SETUP.md) - Komplette Backend-Installation (MySQL, Redis, etc.)
-   [📱 MOBILE-SYNC-INTEGRATION.md](./MOBILE-SYNC-INTEGRATION.md) - Mobile App Sync-Integration

### Architektur & Konzepte

-   [🏗️ ARCHITECTURE.md](./ARCHITECTURE.md) - System-Architektur und Datenfluss
-   [📁 MONOREPO-STRUCTURE.md](./MONOREPO-STRUCTURE.md) - Monorepo-Struktur

### Deployment

-   [🐳 DOCKER-DEPLOYMENT.md](./DOCKER-DEPLOYMENT.md) - Docker Setup & Production Deployment

### Externe Docs

-   [WatermelonDB Docs](https://watermelondb.dev)
-   [NestJS Docs](https://docs.nestjs.com/)
-   [TypeORM Docs](https://typeorm.io/)

## 🔐 API Endpoints

### Authentication

```
POST /api/auth/register   - Benutzer registrieren
POST /api/auth/login      - Login
POST /api/auth/refresh    - Token erneuern
POST /api/auth/logout     - Logout
```

### Users

```
GET  /api/users/me        - Eigenes Profil
GET  /api/users/:id       - User Details
PATCH /api/users/:id      - User aktualisieren
```

### Sync

```
POST /api/sync/pull       - Änderungen vom Server holen
POST /api/sync/push       - Änderungen zum Server senden
```

## 🐳 Docker Setup

Komplettes System mit einem Befehl starten:

```bash
# Alles starten (Backend, MySQL, Redis)
docker-compose up -d

# Status prüfen
docker-compose ps

# Logs anschauen
docker-compose logs -f backend
```

Siehe [DOCKER-DEPLOYMENT.md](./DOCKER-DEPLOYMENT.md) für Details.

## ✅ API Testen

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Registrieren

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
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

## 🔧 Troubleshooting

### Backend startet nicht

```bash
# MySQL läuft?
mysql -u root -p

# Redis läuft?
redis-cli ping

# Logs checken
cd backend && npm run start:dev
```

### Mobile App Sync-Fehler

-   Backend läuft? `curl http://localhost:3000/api/health`
-   Korrekte API URL? (iOS: localhost, Android: 10.0.2.2)
-   Access Token gültig?

Siehe auch:

-   [BACKEND-SETUP.md](./BACKEND-SETUP.md#troubleshooting)
-   [MOBILE-SYNC-INTEGRATION.md](./MOBILE-SYNC-INTEGRATION.md#troubleshooting)

## 🚀 Production Deployment

### Option 1: Docker

```bash
docker-compose -f docker-compose.yml up -d
```

### Option 2: Manual

1. **Backend**: Build & Deploy zu Cloud (AWS, DigitalOcean, Heroku)
2. **Database**: Managed MySQL (AWS RDS, DigitalOcean DBaaS)
3. **Redis**: Managed Redis (AWS ElastiCache, Redis Cloud)
4. **Mobile**: Expo EAS Build & Submit zu App Stores

Siehe [DOCKER-DEPLOYMENT.md](./DOCKER-DEPLOYMENT.md) für Details.

## 📊 Projekt-Status

-   ✅ Mobile App mit WatermelonDB
-   ✅ NestJS Backend mit JWT Auth
-   ✅ MySQL Database mit TypeORM
-   ✅ Redis Caching
-   ✅ Sync Pull/Push Endpoints
-   ✅ Docker Setup
-   ✅ Comprehensive Documentation
-   🚧 Mobile Sync Integration (in Progress)
-   🚧 E2E Tests
-   🚧 CI/CD Pipeline

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

-   TypeScript for all code
-   Follow existing code conventions
-   Add tests for new features
-   Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This project uses the following open source packages:

-   [WatermelonDB](https://github.com/Nozbe/WatermelonDB) - MIT License
-   [NestJS](https://github.com/nestjs/nest) - MIT License
-   [React Native](https://github.com/facebook/react-native) - MIT License
-   [Expo](https://github.com/expo/expo) - MIT License
-   [Prisma](https://github.com/prisma/prisma) - Apache 2.0 License

## 🙏 Acknowledgments

-   [WatermelonDB](https://watermelondb.dev) for the amazing offline-first database
-   [NestJS](https://nestjs.com) for the powerful Node.js framework
-   [Expo](https://expo.dev) for simplifying React Native development

## 💬 Support

-   📫 Open an issue for bug reports or feature requests
-   ⭐ Star this repository if you find it helpful
-   🔄 Share with others who might benefit

---

**Made with ❤️ using WatermelonDB, NestJS, and React Native**
