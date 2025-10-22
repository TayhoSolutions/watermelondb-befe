# WatermelonDB Full-Stack App - Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Expo](https://img.shields.io/badge/Expo-54.x-blue.svg)](https://expo.dev/)

A production-ready, offline-first full-stack application with React Native Expo mobile app and NestJS backend, featuring real-time bidirectional sync powered by WatermelonDB.

## 🚀 Quick Start

### Backend API

```bash

# Or start backend only (requires MySQL & Redis running)
cd backend && npm install
cd ..
npm run d:u
```

### Mobile App

```bash
# Install dependencies
cd mobile && npm install

# Start development server
npm start

# Build and run on device
npm run ios      # iOS
npm run android  # Android
```

## 📁 Project Structure

```
watermelondb/
├── mobile/                      # React Native Expo App
│   ├── app/                    # Expo Router Screens
│   │   ├── _layout.tsx         # Root Layout with Auth Protection
│   │   ├── index.tsx           # Projects List (Home)
│   │   ├── login.tsx           # Login Screen
│   │   ├── register.tsx        # Registration Screen
│   │   ├── profile.tsx         # User Profile & Settings
│   │   ├── project-detail.tsx  # Project Details & Tasks
│   │   └── sync-settings.tsx   # Sync Status & Debug Info
│   ├── src/
│   │   ├── api/                # API Client Configuration
│   │   ├── components/         # Reusable UI Components
│   │   ├── config/             # App Configuration
│   │   ├── contexts/           # React Context Providers
│   │   ├── database/           # WatermelonDB Configuration
│   │   ├── model/              # WatermelonDB Models (User, Project, Task)
│   │   ├── services/           # Auth & Sync Services
│   │   ├── sync/               # WatermelonDB Sync Implementation
│   │   ├── theme/              # Design Tokens & Styling
│   │   └── types/              # TypeScript Type Definitions
│   └── package.json
│
├── backend/                     # NestJS API Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database Schema (User, Project, Task)
│   │   └── migrations/         # Database Migrations
│   ├── src/
│   │   ├── auth/               # JWT Authentication Module
│   │   │   ├── strategies/     # Passport Strategies (Local, JWT, Refresh)
│   │   │   ├── guards/         # Auth Guards
│   │   │   └── dto/            # Data Transfer Objects
│   │   ├── users/              # User Management Module
│   │   ├── sync/               # WatermelonDB Sync Module (Pull/Push)
│   │   ├── config/             # Configuration Module
│   │   ├── common/             # Shared Utilities
│   │   ├── app.module.ts       # Root Module
│   │   └── main.ts             # Application Entry Point
│   ├── tests/                  # HTTP Tests & API Examples
│   └── package.json
│
├── docker-compose.yml           # Docker Setup
├── LICENSE                      # MIT License
├── SECURITY.md                  # Security Policy
└── package.json                # Monorepo Root
```

## 🛠 Tech Stack

### Mobile App

-   **React Native 0.81** - Cross-platform mobile framework
-   **Expo SDK 54** - Development tooling and managed workflow
-   **WatermelonDB 0.28** - High-performance reactive database built on SQLite
-   **Expo Router 6.0** - File-based routing with type-safe navigation
-   **TypeScript 5.9** - Static type checking
-   **React 19** - UI library with latest features
-   **AsyncStorage** - Persistent key-value storage for tokens

### Backend

-   **NestJS 11** - Progressive Node.js framework with TypeScript
-   **Prisma 6.17** - Next-generation ORM with type safety
-   **MySQL 8** - Relational database
-   **Redis 5** - In-memory caching and session storage
-   **Passport JWT** - Token-based authentication strategy
-   **Argon2** - Memory-hard password hashing (OWASP recommended)
-   **Swagger/OpenAPI** - Auto-generated API documentation
-   **Class Validator** - DTO validation with decorators

## ✨ Features

### Mobile App

-   ✅ **Offline-First Architecture**: Full app functionality without internet connection
-   ✅ **Local SQLite Database**: All data stored locally with WatermelonDB
-   ✅ **Bidirectional Sync**: Pull changes from server, push local changes
-   ✅ **Reactive UI**: Automatic UI updates when data changes (no manual refresh)
-   ✅ **Type-Safe**: Full TypeScript coverage with strict mode
-   ✅ **Authentication**: JWT-based login/register with token persistence
-   ✅ **Multi-User Support**: User-specific data isolation
-   ✅ **Projects & Tasks**: Hierarchical data models with relations
-   ✅ **Sync Status UI**: Visual sync state and debug information
-   ✅ **Performance**: Lazy loading and optimized queries

### Backend API

-   ✅ **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
-   ✅ **Secure Password Storage**: Argon2id hashing (memory-hard, GPU-resistant)
-   ✅ **WatermelonDB Sync Protocol**: Official pull/push implementation
-   ✅ **Soft Delete**: Records marked as deleted, not removed
-   ✅ **Last-Write-Wins**: Simple conflict resolution strategy
-   ✅ **Redis Caching**: Session storage and performance optimization
-   ✅ **Prisma ORM**: Type-safe database queries with migrations
-   ✅ **RESTful API**: Standard HTTP endpoints with proper status codes
-   ✅ **Modular Architecture**: Separate Auth, Users, and Sync modules
-   ✅ **API Documentation**: Auto-generated Swagger UI
-   ✅ **Input Validation**: DTO validation with class-validator
-   ✅ **Database Indexing**: Optimized queries for sync operations

## 💻 Installation & Setup

### Prerequisites

**Required:**

-   Node.js >= 20.x (LTS recommended)
-   MySQL >= 8.0
-   Redis >= 5.0
-   Docker & Docker Compose (optional, recommended)

**For mobile development:**

-   iOS: Xcode 15+ (macOS only)
-   Android: Android Studio with SDK 34+

### Quick Setup with Docker

```bash
# 1. Clone the repository
git clone https://github.com/TayhoSolutions/watermelondb.git
cd watermelondb

# 2. Start backend with Docker
npm run d:u

# Backend is now running at http://localhost:3000/api
```

### Manual Setup

#### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Mobile
cd ../mobile && npm install
```

#### 2. Configure Backend

```bash
cd backend
cp .env.example .env.development
```

Edit `.env.development` with your configuration:

```bash
# Database
DATABASE_URL="mysql://root:your_password@localhost:3306/watermelondb"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

#### 3. Setup Database

**Using Docker:**

```bash
docker compose up mysql redis -d
```

**Manual MySQL setup:**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE watermelondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### 4. Run Migrations

```bash
cd backend
npm run prisma:migrate
```

#### 5. Start Development

**Backend:**

```bash
cd backend
npm run start:dev
```

Backend runs at: `http://localhost:3000/api`  
API Documentation: `http://localhost:3000/api/docs`

**Mobile:**

```bash
cd mobile
npm start

# In another terminal:
npm run ios     # iOS
npm run android # Android
```

## 🎯 Development

### Backend Development

```bash
# Development mode with hot reload
cd backend
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm test
npm run test:e2e

# Database operations
npm run prisma:studio  # Open Prisma Studio
npm run prisma:migrate # Run migrations
```

### Mobile Development

```bash
cd mobile

# Start Metro bundler
npm start

# Run on device
npm run ios
npm run android

# Clear cache if needed
npm start -- --clear
```

### Docker Commands

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f backend

# Rebuild after changes
docker compose up --build

# Stop all services
docker compose down
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

Full API documentation available at: `http://localhost:3000/api/docs`

### Authentication

```http
POST   /api/auth/register    Register new user
POST   /api/auth/login        Login with email/password
POST   /api/auth/refresh      Refresh access token
POST   /api/auth/logout       Logout and invalidate refresh token
```

### Users

```http
GET    /api/users/me          Get current user profile
GET    /api/users/:id         Get user by ID
PATCH  /api/users/:id         Update user profile
DELETE /api/users/:id         Delete user account
```

### Sync (WatermelonDB Protocol)

```http
POST   /api/sync/pull         Pull changes since last sync
POST   /api/sync/push         Push local changes to server
```

**Example Sync Pull Request:**

```bash
curl -X POST http://localhost:3000/api/sync/pull \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"lastPulledAt": 0}'
```

## 🐳 Docker Setup

Start the complete system with one command:

```bash
# Start all services (Backend, MySQL, Redis)
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f backend

# Stop all services
docker compose down
```

The backend will be available at `http://localhost:3000/api`

## ✅ Testing the API

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Register a User

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

### Use the API with Token

```bash
# Save the token from login response
TOKEN="your_access_token_here"

# Get user profile
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🔧 Troubleshooting

### Backend Issues

**Backend won't start:**

```bash
# Check if MySQL is running
mysql -u root -p

# Check if Redis is running
redis-cli ping

# Check logs
cd backend && npm run start:dev
```

**Database connection errors:**

-   Verify `DATABASE_URL` in `.env`
-   Ensure database exists: `CREATE DATABASE watermelondb;`
-   Run migrations: `npm run prisma:migrate`

### Mobile App Issues

**Sync errors:**

-   Is backend running? `curl http://localhost:3000/api/health`
-   Check API URL in `mobile/src/config/api.ts`
    -   iOS Simulator: use `localhost`
    -   Android Emulator: use `10.0.2.2`
    -   Physical device: use computer's IP address
-   Is access token valid? Check token expiration

**Build failures:**

```bash
# Clear cache and reinstall
cd mobile
rm -rf node_modules ios android
npm install
npm run ios  # or android
```

**SQLite errors:**

-   Delete app and reinstall (clears local database)
-   Check WatermelonDB model definitions in `mobile/src/model/`

## 🚀 Production Deployment

### Backend Deployment

**Docker (Recommended):**

```bash
docker compose up -d
```

**Manual Deployment:**

1. Build the application: `npm run build`
2. Set production environment variables
3. Use managed services:
    - Database: AWS RDS, DigitalOcean Managed MySQL
    - Redis: AWS ElastiCache, Redis Cloud
    - Hosting: AWS EC2, DigitalOcean Droplets, Railway, Fly.io

### Mobile App Deployment

**Build for production:**

```bash
cd mobile

# iOS
npm run ios --variant release

# Android
npm run android --variant release
```

**App Store Submission:**

-   Use Expo EAS Build for easier deployment
-   Configure app signing certificates
-   Submit to Apple App Store and Google Play Store
-   Update API URLs in production build

## 📊 Project Status

-   ✅ Mobile App with WatermelonDB offline storage
-   ✅ NestJS Backend with JWT authentication
-   ✅ MySQL Database with Prisma ORM
-   ✅ Redis caching layer
-   ✅ WatermelonDB Sync (Pull/Push) fully implemented
-   ✅ User authentication & authorization
-   ✅ Projects & Tasks models with relations
-   ✅ Docker development environment
-   ✅ Comprehensive documentation
-   ✅ MIT License & Security policy
-   🚧 E2E tests
-   🚧 CI/CD pipeline
-   🚧 Production deployment guide

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
