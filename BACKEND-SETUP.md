# Backend Setup & Installation Guide

Komplette Anleitung zur Einrichtung des WatermelonDB Backend mit MySQL und Redis.

## 📋 Voraussetzungen

Bevor du startest, stelle sicher, dass folgende Software installiert ist:

-   **Node.js** >= 18.x ([Download](https://nodejs.org/))
-   **MySQL** >= 8.0
-   **Redis** >= 6.0 (optional, aber empfohlen)
-   **npm** oder **yarn**

## 🍎 macOS Setup

### 1. Homebrew installieren (falls nicht vorhanden)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. MySQL installieren

```bash
# MySQL installieren
brew install mysql

# MySQL Server starten
brew services start mysql

# MySQL absichern (Root Passwort setzen)
mysql_secure_installation
```

### 3. Redis installieren

```bash
# Redis installieren
brew install redis

# Redis Server starten
brew services start redis

# Testen ob Redis läuft
redis-cli ping
# Sollte "PONG" zurückgeben
```

### 4. Datenbank erstellen

```bash
# MySQL Shell öffnen
mysql -u root -p
# Passwort eingeben, das du bei mysql_secure_installation gesetzt hast
```

In der MySQL Shell:

```sql
-- Datenbank erstellen
CREATE DATABASE watermelondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Überprüfen
SHOW DATABASES;

-- Optional: Dedizierten User erstellen
CREATE USER 'watermelon'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON watermelondb.* TO 'watermelon'@'localhost';
FLUSH PRIVILEGES;

-- MySQL Shell verlassen
EXIT;
```

## 🐧 Linux (Ubuntu/Debian) Setup

### MySQL installieren

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Redis installieren

```bash
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

### Datenbank erstellen

```bash
sudo mysql -u root -p
```

Dann die gleichen SQL Befehle wie bei macOS ausführen.

## 🪟 Windows Setup

### MySQL installieren

1. Download MySQL Installer von [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Führe den Installer aus und wähle "Developer Default"
3. Setze ein Root Passwort während der Installation

### Redis installieren

```powershell
# Mit Chocolatey
choco install redis-64

# Oder WSL2 verwenden und Linux-Anleitung folgen
```

## 🚀 Backend Installation

### 1. Dependencies installieren

```bash
# Im Root des Monorepos
cd /Users/renebedbur/Dev/watermelondb

# Alle Dependencies installieren (Mobile + Backend)
npm run install:all

# Oder nur Backend
cd backend
npm install
```

### 2. Environment Konfiguration

```bash
cd backend

# .env Datei erstellen
cp .env.example .env

# .env mit deinem Editor öffnen und anpassen
nano .env
# oder
code .env
```

Wichtige Einstellungen in `.env`:

```bash
# Datenbank
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root                    # oder 'watermelon' wenn du einen dedizierten User erstellt hast
DB_PASSWORD=dein_mysql_passwort     # WICHTIG: Dein echtes Passwort eintragen!
DB_DATABASE=watermelondb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets - UNBEDINGT ÄNDERN FÜR PRODUCTION!
JWT_SECRET=dein-super-geheimer-jwt-schluessel-hier
JWT_REFRESH_SECRET=dein-super-geheimer-refresh-schluessel-hier
```

### 3. Datenbank-Verbindung testen

```bash
# Im backend/ Ordner
cd backend

# Backend im Dev-Mode starten
npm run start:dev
```

Du solltest sehen:

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000/api
```

## ✅ Verbindung testen

### Health Check

```bash
curl http://localhost:3000/api/health
```

Erwartete Antwort:

```json
{
    "status": "ok",
    "timestamp": "2025-10-21T...",
    "service": "WatermelonDB Sync Backend"
}
```

### Benutzer registrieren

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Du erhältst:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🎯 Nächste Schritte

1. **Mobile App konfigurieren**: Siehe `mobile/` Ordner für Sync-Integration
2. **API testen**: Verwende Postman oder Insomnia für API-Tests
3. **Datenbank inspizieren**:
    ```bash
    mysql -u root -p watermelondb
    SHOW TABLES;
    SELECT * FROM users;
    ```

## 🔧 Troubleshooting

### MySQL Verbindungsfehler

```
Error: ER_NOT_SUPPORTED_AUTH_MODE
```

**Lösung:**

```sql
mysql -u root -p

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dein_passwort';
FLUSH PRIVILEGES;
```

### Redis Verbindungsfehler

```bash
# Redis Status prüfen
redis-cli ping

# Wenn nicht läuft:
brew services start redis    # macOS
sudo systemctl start redis   # Linux
```

### Port 3000 bereits belegt

In `.env` ändern:

```bash
PORT=3001
```

### TypeORM Synchronize Warnung

In Production setze in `app.module.ts`:

```typescript
synchronize: false,  // Use migrations in production
```

## 📚 Weitere Ressourcen

-   [NestJS Dokumentation](https://docs.nestjs.com/)
-   [TypeORM Dokumentation](https://typeorm.io/)
-   [WatermelonDB Sync](https://nozbe.github.io/WatermelonDB/Advanced/Sync.html)
-   [JWT Best Practices](https://jwt.io/introduction)

## 🆘 Hilfe bekommen

Bei Problemen:

1. Logs überprüfen: `npm run start:dev` zeigt alle Fehler an
2. MySQL Logs: `/usr/local/var/mysql/*.err` (macOS)
3. Redis Logs: `redis-cli` → `CONFIG GET dir`

---

**Viel Erfolg! 🚀**
