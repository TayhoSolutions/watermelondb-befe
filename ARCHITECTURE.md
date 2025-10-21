# WatermelonDB Backend - Architektur Übersicht

## 🏗️ System Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)                 │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  WatermelonDB │  │ Auth Service │  │ Sync Service │      │
│  │  (SQLite)     │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │                  └─────────┬────────┘
          │                            │ HTTPS/JWT
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend API (NestJS)                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   API Gateway Layer                   │    │
│  │  - CORS, Validation, Global Pipes                    │    │
│  │  - JWT Guards, Exception Filters                     │    │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                        │
│  ┌──────────────────┼───────────────────────────────────┐   │
│  │                  ▼                                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │   Auth   │  │  Users   │  │   Sync   │           │   │
│  │  │  Module  │  │  Module  │  │  Module  │           │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘           │   │
│  │       │             │             │                   │   │
│  │  ┌────▼─────────────▼─────────────▼─────┐           │   │
│  │  │         TypeORM Repository Layer      │           │   │
│  │  └────┬─────────────┬─────────────┬──────┘           │   │
│  └───────┼─────────────┼─────────────┼──────────────────┘   │
│          │             │             │                        │
└──────────┼─────────────┼─────────────┼────────────────────────┘
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  MySQL   │  │  Redis   │  │  Argon2  │
    │ Database │  │  Cache   │  │  Hashing │
    └──────────┘  └──────────┘  └──────────┘
```

## 📦 Module Struktur

### 1. Auth Module

**Verantwortlichkeiten:**

-   Benutzer-Registrierung
-   Login mit Email/Password (Passport Local Strategy)
-   JWT Token Generation (Access + Refresh)
-   Token Refresh
-   Logout

**Komponenten:**

```
auth/
├── auth.module.ts              # Module Definition
├── auth.service.ts             # Business Logic
├── auth.controller.ts          # REST Endpoints
├── strategies/
│   ├── local.strategy.ts       # Email/Password Validation
│   ├── jwt.strategy.ts         # Access Token Validation
│   └── jwt-refresh.strategy.ts # Refresh Token Validation
├── guards/
│   ├── local-auth.guard.ts     # Login Protection
│   ├── jwt-auth.guard.ts       # API Protection
│   └── jwt-refresh.guard.ts    # Refresh Protection
└── dto/
    ├── login.dto.ts
    └── register.dto.ts
```

**Flow:**

```
1. Register: Email + Password → Argon2 Hash → Save to DB → Return Tokens
2. Login:    Credentials → Validate → Generate Tokens → Return
3. Refresh:  Refresh Token → Validate → New Access Token
4. Logout:   Invalidate Refresh Token in DB
```

### 2. Users Module

**Verantwortlichkeiten:**

-   User CRUD Operations
-   Password Management (Argon2)
-   Profile Management
-   Refresh Token Storage

**Komponenten:**

```
users/
├── users.module.ts
├── users.service.ts            # User Business Logic
├── users.controller.ts         # User Endpoints
└── dto/
    ├── create-user.dto.ts
    └── update-user.dto.ts
```

**Entity Schema:**

```typescript
UserEntity {
  id: UUID (Primary Key)
  email: String (Unique)
  password: String (Argon2 Hashed)
  name: String (Optional)
  isActive: Boolean
  refreshToken: String (Hashed)
  createdAt: Timestamp
  updatedAt: Timestamp
  lastModifiedAt: Number (Milliseconds)
}
```

### 3. Sync Module

**Verantwortlichkeiten:**

-   WatermelonDB Pull/Push Sync
-   Change Tracking
-   Soft Delete Handling
-   Conflict Resolution (Last Write Wins)

**Komponenten:**

```
sync/
├── sync.module.ts
├── sync.service.ts             # Sync Logic
├── sync.controller.ts          # Sync Endpoints
└── dto/
    ├── pull.dto.ts
    └── push.dto.ts
```

**Sync Flow:**

**Pull:**

```
1. Client sends lastPulledAt timestamp
2. Server queries all records where updatedAtMs > lastPulledAt
3. Separate into: created, updated, deleted
4. Return changes + new timestamp
```

**Push:**

```
1. Client sends local changes (created, updated, deleted)
2. Server validates ownership (userId)
3. Apply changes:
   - Created: INSERT if not exists
   - Updated: UPDATE where id + userId match
   - Deleted: Soft delete (set isDeleted = true)
4. Return success
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id              VARCHAR(36) PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password        VARCHAR(255) NOT NULL,
  name            VARCHAR(255),
  is_active       BOOLEAN DEFAULT TRUE,
  refresh_token   TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_modified_at BIGINT NOT NULL
);
```

### Projects Table

```sql
CREATE TABLE projects (
  id              VARCHAR(36) PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  user_id         VARCHAR(36) NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at_ms   BIGINT NOT NULL,
  updated_at_ms   BIGINT NOT NULL,
  is_deleted      BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id              VARCHAR(36) PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  is_completed    BOOLEAN DEFAULT FALSE,
  project_id      VARCHAR(36) NOT NULL,
  user_id         VARCHAR(36) NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at_ms   BIGINT NOT NULL,
  updated_at_ms   BIGINT NOT NULL,
  is_deleted      BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔒 Security Layer

### Authentication Flow

```
1. Registration/Login → Argon2 Password Hash
2. Generate JWT Access Token (15 min expiry)
3. Generate JWT Refresh Token (7 days expiry)
4. Store Hashed Refresh Token in DB
5. Return both tokens to client
```

### Request Flow

```
Client Request → JWT Guard → Extract User → Service → Repository → Database
                     ↓
              Validate Token
              Check Expiry
              Extract Payload
```

### Password Security

-   **Argon2id**: Memory-hard hashing algorithm
-   **Recommended by OWASP**: Better than bcrypt/scrypt
-   **Resistant to**: GPU cracking, side-channel attacks

## 📊 Data Flow

### Sync Pull Example

```
Mobile App                Backend                    Database
    │                        │                          │
    ├─────Pull Request──────>│                          │
    │  lastPulledAt: 0       │                          │
    │                        ├────Query Changes────────>│
    │                        │  WHERE updatedAtMs > 0   │
    │                        │                          │
    │                        │<────Return Records───────┤
    │                        │                          │
    │<────Sync Response──────┤                          │
    │  {changes, timestamp}  │                          │
    │                        │                          │
    ├─Apply Changes Locally  │                          │
    └─Save lastPulledAt      │                          │
```

### Sync Push Example

```
Mobile App                Backend                    Database
    │                        │                          │
    ├─────Push Request──────>│                          │
    │  {changes}             │                          │
    │                        ├────Validate User─────────>│
    │                        │                          │
    │                        ├────INSERT created────────>│
    │                        ├────UPDATE updated────────>│
    │                        ├────SOFT DELETE deleted───>│
    │                        │                          │
    │<────Success────────────┤                          │
    │                        │                          │
```

## 🚀 Performance Optimierung

### Redis Caching Strategy

```typescript
// Cache häufig abgerufene Daten
- User Profile: 5 Minuten TTL
- JWT Blacklist: Bis Token Expiry
- Sync Metadata: 1 Minute TTL
```

### Database Indexing

```sql
-- Performance-kritische Indices
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated_at_ms ON projects(updated_at_ms);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_updated_at_ms ON tasks(updated_at_ms);
```

### Query Optimierung

-   **Pagination**: Limit/Offset für große Datensätze
-   **Batch Operations**: Bulk INSERT/UPDATE für Sync
-   **Connection Pooling**: TypeORM Connection Pool
-   **Lazy Loading**: Relations nur bei Bedarf laden

## 🔄 Deployment Pipeline

```
Development → Staging → Production

1. Development:
   - Local MySQL
   - synchronize: true
   - Logging: verbose

2. Staging:
   - Cloud MySQL
   - synchronize: false
   - Migrations
   - Logging: errors only

3. Production:
   - Managed MySQL (AWS RDS / DigitalOcean)
   - Redis Cluster
   - Migrations only
   - Environment secrets
   - SSL/TLS
   - Rate Limiting
```

## 📈 Monitoring & Logging

-   **Application Logs**: Winston/NestJS Logger
-   **Database Logs**: TypeORM Query Logging
-   **Performance Metrics**: New Relic / DataDog
-   **Error Tracking**: Sentry
-   **API Analytics**: Prometheus + Grafana

---

**Diese Architektur ist skalierbar, sicher und production-ready! 🎯**
