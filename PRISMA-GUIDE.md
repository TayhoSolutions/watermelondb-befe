# Prisma Setup & Migration Guide

Anleitung für Prisma ORM mit MySQL.

## 🚀 Quick Start

### 1. MySQL Datenbank erstellen

```bash
# MySQL starten (macOS mit Homebrew)
brew services start mysql

# MySQL Shell öffnen
mysql -u root -p

# Datenbank erstellen
CREATE DATABASE watermelondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. DATABASE_URL in .env konfigurieren

```bash
# backend/.env
DATABASE_URL="mysql://root:dein_passwort@localhost:3306/watermelondb"
```

**Format:**

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 3. Prisma Client generieren

```bash
cd backend
npm run prisma:generate
```

Dies generiert den type-safe Prisma Client in `node_modules/@prisma/client`.

### 4. Migration erstellen und ausführen

```bash
npm run prisma:migrate
```

Beim ersten Mal:

```bash
npx prisma migrate dev --name init
```

Das erstellt:

-   `prisma/migrations/` Ordner mit SQL Dateien
-   Wendet die Migration auf die Datenbank an
-   Generiert Prisma Client neu

## 📊 Prisma Studio

GUI für deine Datenbank:

```bash
npm run prisma:studio
```

Öffnet `http://localhost:5555` mit einer visuellen Oberfläche.

## 🔄 Workflow

### Schema Änderungen

1. **Schema bearbeiten:**

    ```prisma
    // prisma/schema.prisma
    model User {
      id    String  @id @default(uuid())
      email String  @unique
      // Neues Feld hinzufügen:
      phone String?
    }
    ```

2. **Migration erstellen:**

    ```bash
    npx prisma migrate dev --name add_phone_field
    ```

3. **Prisma Client neu generieren:**
    ```bash
    npm run prisma:generate
    ```

### Neue Tabelle hinzufügen

```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String   @db.Text
  userId    String   @map("user_id")
  taskId    String   @map("task_id")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])
  task Task @relation(fields: [taskId], references: [id])

  @@map("comments")
}
```

Dann:

```bash
npx prisma migrate dev --name add_comments
```

## 🛠️ Prisma Commands

### Development

```bash
# Client generieren (nach Schema-Änderung)
npm run prisma:generate

# Migration erstellen & ausführen
npm run prisma:migrate

# Prisma Studio öffnen
npm run prisma:studio

# Schema validieren
npx prisma validate

# Schema formatieren
npx prisma format
```

### Production

```bash
# Migrations ausführen (ohne Dev-Features)
npm run prisma:deploy

# Oder direkt:
npx prisma migrate deploy
```

### Datenbank Reset

⚠️ **Vorsicht: Löscht alle Daten!**

```bash
npx prisma migrate reset
```

Das:

1. Droppt die Datenbank
2. Erstellt sie neu
3. Führt alle Migrations aus
4. Führt Seed-Skript aus (falls vorhanden)

## 🌱 Database Seeding

Erstelle `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
    // Test User
    const password = await argon2.hash("password123");

    const user = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            password,
            name: "Admin User",
            lastModifiedAt: BigInt(Date.now()),
        },
    });

    console.log("Created user:", user);

    // Test Project
    const project = await prisma.project.create({
        data: {
            id: "test-project-1",
            name: "Sample Project",
            description: "This is a test project",
            userId: user.id,
            createdAtMs: BigInt(Date.now()),
            updatedAtMs: BigInt(Date.now()),
        },
    });

    console.log("Created project:", project);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```

In `package.json`:

```json
{
    "prisma": {
        "seed": "ts-node prisma/seed.ts"
    }
}
```

Seed ausführen:

```bash
npx prisma db seed
```

## 🔍 Prisma Query Beispiele

### Basis CRUD

```typescript
import { PrismaService } from "./prisma/prisma.service";

// CREATE
const user = await prisma.user.create({
    data: {
        email: "test@example.com",
        password: "hashed_password",
        name: "Test User",
        lastModifiedAt: BigInt(Date.now()),
    },
});

// READ
const user = await prisma.user.findUnique({
    where: { id: "user-id" },
});

const users = await prisma.user.findMany();

// UPDATE
const updated = await prisma.user.update({
    where: { id: "user-id" },
    data: { name: "New Name" },
});

// DELETE
await prisma.user.delete({
    where: { id: "user-id" },
});
```

### Relations & Includes

```typescript
// User mit allen Projects
const userWithProjects = await prisma.user.findUnique({
    where: { id: "user-id" },
    include: {
        projects: true,
    },
});

// Project mit Tasks
const project = await prisma.project.findUnique({
    where: { id: "project-id" },
    include: {
        tasks: {
            where: { isCompleted: false },
        },
    },
});
```

### Filtering

```typescript
// WHERE Klauseln
const completedTasks = await prisma.task.findMany({
    where: {
        isCompleted: true,
        userId: "user-id",
    },
});

// AND / OR / NOT
const tasks = await prisma.task.findMany({
    where: {
        OR: [{ isCompleted: true }, { title: { contains: "urgent" } }],
    },
});

// Greater Than (BigInt)
const recentProjects = await prisma.project.findMany({
    where: {
        updatedAtMs: {
            gt: BigInt(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
        },
    },
});
```

### Transactions

```typescript
// $transaction für atomare Operationen
const [user, project] = await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.project.create({ data: projectData }),
]);

// Interactive Transactions
const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const project = await tx.project.create({
        data: { ...projectData, userId: user.id },
    });
    return { user, project };
});
```

## 🐳 Docker mit Prisma

### docker-compose.yml

```yaml
services:
    backend:
        build: ./backend
        depends_on:
            mysql:
                condition: service_healthy
        environment:
            - DATABASE_URL=mysql://root:rootpass@mysql:3306/watermelondb
        command: sh -c "npx prisma migrate deploy && npm run start:prod"

    mysql:
        image: mysql:8.0
        environment:
            - MYSQL_ROOT_PASSWORD=rootpass
            - MYSQL_DATABASE=watermelondb
        healthcheck:
            test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
            timeout: 20s
            retries: 10
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
```

## 📝 Best Practices

### 1. Nie `synchronize: true` in Production

Prisma verwendet Migrations - keine automatische Schema-Synchronisation.

### 2. Migrations committen

```bash
git add prisma/migrations/
git commit -m "Add user table migration"
```

### 3. BigInt Handling

Prisma gibt BigInt zurück - konvertiere für JSON:

```typescript
const timestamp = Number(project.createdAtMs);
```

### 4. Soft Deletes

```typescript
// Soft Delete
await prisma.task.update({
    where: { id: taskId },
    data: { isDeleted: true },
});

// Nur nicht-gelöschte Tasks
const tasks = await prisma.task.findMany({
    where: { isDeleted: false },
});
```

### 5. Indexing

Wichtig für Performance:

```prisma
model Task {
  @@index([userId])
  @@index([projectId])
  @@index([updatedAtMs])
}
```

## 🆘 Troubleshooting

### Migration fehlgeschlagen

```bash
# Migration zurückrollen
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# Neu versuchen
npx prisma migrate dev
```

### "prisma generate" Error

```bash
# Cache löschen
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Neu installieren
npm install
npx prisma generate
```

### Inkonsistenter State

```bash
# Datenbank resetten (DEV only!)
npx prisma migrate reset

# Dann neu migrieren
npx prisma migrate dev
```

### Connection Error

```bash
# DATABASE_URL prüfen
echo $DATABASE_URL

# MySQL läuft?
brew services list
mysql -u root -p -e "SELECT 1"
```

## 📚 Weitere Ressourcen

-   [Prisma Docs](https://www.prisma.io/docs)
-   [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
-   [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
-   [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Happy Prisma! 🎉**
