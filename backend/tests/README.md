# Backend API Tests

HTTP-basierte Tests für alle Backend-Endpoints mit REST Client / HTTP Client Plugins.

## 📦 Test-Dateien

```
backend/tests/
├── README.md                    # Diese Datei
├── complete-api-test.http       # Vollständiger Test-Flow mit Variablen
├── app.http                     # Health checks
├── auth.http                    # Authentifizierungs-Endpoints
├── users.http                   # User-Management-Endpoints
└── sync.http                    # Sync-Endpoints
```

## 🚀 Setup

### 1. VS Code Extension installieren

Installiere eine der folgenden Extensions:

- **REST Client** (Huachao Mao) - Empfohlen
- **Thunder Client** (Ranga Vadhineni)
- **HTTP Client** (IntelliJ)

### 2. Backend starten

```bash
cd backend
npm run start:dev
```

Backend läuft auf: `http://localhost:3000/api`

### 3. Datenbank vorbereiten

```bash
# Prisma migrieren
npx prisma migrate dev

# Optional: Datenbank zurücksetzen
npx prisma migrate reset
```

## 📝 Test-Dateien verwenden

### complete-api-test.http (Empfohlen für Anfang)

Vollständiger Test-Flow mit Variablen-Extraktion:

1. Öffne `tests/complete-api-test.http`
2. Klicke auf "Send Request" über jedem Request
3. Tests werden automatisch durchgeführt
4. Variablen (Token, User-ID) werden automatisch extrahiert

**Features:**

- ✅ Automatische Token-Extraktion
- ✅ Variable Wiederverwendung
- ✅ Kompletter Flow von Anfang bis Ende
- ✅ Timestamp-Generierung

### Einzelne Test-Dateien

#### app.http - Health Checks

```http
GET http://localhost:3000/api/health
```

#### auth.http - Authentifizierung

- `POST /auth/register` - Neuen User registrieren
- `POST /auth/login` - Einloggen
- `POST /auth/refresh` - Token erneuern
- `POST /auth/logout` - Abmelden

#### users.http - User-Management

- `GET /users/me` - Eigenes Profil
- `GET /users` - Alle User
- `GET /users/:id` - User nach ID
- `PATCH /users/:id` - User aktualisieren
- `DELETE /users/:id` - User löschen

#### sync.http - Synchronisation

- `POST /sync/pull` - Änderungen vom Server holen
- `POST /sync/push` - Lokale Änderungen zum Server senden

## 🔑 Variablen & Token

### Manuell (einzelne Dateien)

1. **Registrieren & Login:**

    ```http
    POST http://localhost:3000/api/auth/register
    {
      "email": "test@example.com",
      "password": "password123",
      "name": "Test User"
    }
    ```

2. **Token aus Response kopieren:**

    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": { "id": "123", ... }
    }
    ```

3. **In Requests verwenden:**
    ```http
    GET http://localhost:3000/api/users/me
    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    ```

### Automatisch (complete-api-test.http)

```http
# Token wird automatisch extrahiert
@accessToken = {{login.response.body.accessToken}}

# Verwendung in Requests
GET {{baseUrl}}/users/me
Authorization: Bearer {{accessToken}}
```

## 📋 Test-Reihenfolge (Manuell)

### 1. Health Check

```bash
1. GET /api/health
   ✅ Status: 200
```

### 2. Authentication Flow

```bash
1. POST /api/auth/register
   ✅ Status: 201, Returns: accessToken, user

2. POST /api/auth/login
   ✅ Status: 200, Returns: accessToken, refreshToken, user

3. POST /api/auth/logout (mit Token)
   ✅ Status: 200
```

### 3. User Management

```bash
Voraussetzung: Eingeloggt (Token vorhanden)

1. GET /api/users/me
   ✅ Status: 200, Returns: user data

2. GET /api/users
   ✅ Status: 200, Returns: user array

3. PATCH /api/users/:id
   ✅ Status: 200, Returns: updated user
```

### 4. Sync Operations

```bash
Voraussetzung: Eingeloggt (Token vorhanden)

1. POST /api/sync/pull (lastPulledAt: 0)
   ✅ Status: 200, Returns: changes, timestamp

2. POST /api/sync/push (mit changes)
   ✅ Status: 200, Returns: { success: true }

3. POST /api/sync/pull (mit timestamp)
   ✅ Status: 200, Returns: neue changes
```

## 🧪 Automatisierte Test-Suite

### complete-api-test.http ausführen

1. Öffne `tests/complete-api-test.http`
2. Klicke auf **"Send Request"** beim ersten Test
3. Warte auf Response
4. Gehe zum nächsten Test
5. Wiederhole für alle Tests

**Oder:** Nutze "Send All Requests" (falls Extension unterstützt)

### Erwartete Ergebnisse:

```
✅ 1. Health Checks (2 Tests)
   - GET / → 200
   - GET /health → 200

✅ 2. Authentication (2 Tests)
   - POST /auth/register → 201
   - POST /auth/login → 200

✅ 3. User Management (4 Tests)
   - GET /users/me → 200
   - GET /users → 200
   - GET /users/:id → 200
   - PATCH /users/:id → 200

✅ 4. Sync Operations (5 Tests)
   - POST /sync/pull (initial) → 200
   - POST /sync/push (create) → 200
   - POST /sync/pull (incremental) → 200
   - POST /sync/push (update) → 200
   - POST /sync/push (delete) → 200

✅ 5. Token Operations (2 Tests)
   - POST /auth/refresh → 200
   - POST /auth/logout → 200

✅ 6. Error Tests (5 Tests)
   - Ohne Token → 401
   - Falsches Passwort → 401
   - Duplicate Email → 409
   - Invalid Email → 400
   - Sync ohne Auth → 401
```

**Total: 20 Tests**

## 🔍 Debugging

### Response überprüfen

```http
### Request
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Response (Beispiel)
HTTP/1.1 200 OK
Content-Type: application/json

{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "cm2k1...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Fehler analysieren

```http
### 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}

### 400 Bad Request
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}

### 409 Conflict
{
  "statusCode": 409,
  "message": "User already exists"
}
```

## 📊 Testabdeckung

### Endpoints getestet:

| Endpoint       | Methode | Auth | Status | Tests |
| -------------- | ------- | ---- | ------ | ----- |
| /              | GET     | ❌   | ✅     | 1     |
| /health        | GET     | ❌   | ✅     | 1     |
| /auth/register | POST    | ❌   | ✅     | 4     |
| /auth/login    | POST    | ❌   | ✅     | 3     |
| /auth/refresh  | POST    | ✅   | ✅     | 1     |
| /auth/logout   | POST    | ✅   | ✅     | 1     |
| /users         | GET     | ✅   | ✅     | 1     |
| /users/me      | GET     | ✅   | ✅     | 2     |
| /users/:id     | GET     | ✅   | ✅     | 1     |
| /users/:id     | PATCH   | ✅   | ✅     | 2     |
| /users/:id     | DELETE  | ✅   | ✅     | 1     |
| /sync/pull     | POST    | ✅   | ✅     | 4     |
| /sync/push     | POST    | ✅   | ✅     | 5     |

**Total: 13 Endpoints, 27+ Tests**

## 🛠️ Tipps

### 1. Environment Variables

Erstelle eine `http-client.env.json` für verschiedene Umgebungen:

```json
{
    "dev": {
        "baseUrl": "http://localhost:3000/api",
        "email": "dev@example.com",
        "password": "devpassword"
    },
    "prod": {
        "baseUrl": "https://api.production.com",
        "email": "prod@example.com",
        "password": "prodpassword"
    }
}
```

### 2. Schnelle Tests

Keyboard Shortcuts (VS Code REST Client):

- `Ctrl+Alt+R` (Windows/Linux) oder `Cmd+Alt+R` (Mac) - Send Request
- `Ctrl+Alt+C` - Cancel Request
- `Ctrl+Alt+E` - Switch Environment

### 3. Response History

REST Client speichert alle Responses im `.httpbook` Ordner.

### 4. Collection Run

Für automatisierte Tests alle Requests in Reihenfolge ausführen.

## 🐛 Troubleshooting

### Backend nicht erreichbar

```bash
# Backend Status prüfen
npm run start:dev

# Port prüfen
lsof -i :3000

# Logs anschauen
# Backend sollte laufen und Logs zeigen
```

### 401 Unauthorized

```bash
# Token abgelaufen → Neu einloggen
POST /api/auth/login

# Token ungültig → Format prüfen
Authorization: Bearer <token>  # Kein Komma, kein Semikolon
```

### 404 Not Found

```bash
# Basis-URL prüfen
http://localhost:3000/api  # Mit /api prefix!

# Endpoint-Namen prüfen (case-sensitive)
/api/users  ✅
/api/Users  ❌
```

### Datenbank-Fehler

```bash
# Datenbank zurücksetzen
cd backend
npx prisma migrate reset

# Neustart
npm run start:dev
```

## 📚 Weitere Ressourcen

- [REST Client Extension Docs](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [HTTP Client IntelliJ](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)
- [Backend API Dokumentation](../API-DOCUMENTATION.md)
- [Sync Protocol](../MOBILE-SYNC-INTEGRATION.md)

## ✅ Quick Start

```bash
# 1. Backend starten
cd backend && npm run start:dev

# 2. VS Code öffnen
code .

# 3. Test-Datei öffnen
# Öffne: tests/complete-api-test.http

# 4. Tests ausführen
# Klicke auf "Send Request" über jedem Request

# 5. Erfolg prüfen
# Alle Requests sollten 200/201 zurückgeben
```

**Happy Testing! 🎉**
