# API Test Quick Reference

## 🚀 Schnellstart (1 Minute)

```bash
# 1. Backend starten
cd backend && npm run start:dev

# 2. VS Code öffnen → tests/complete-api-test.http

# 3. Klicke "Send Request" bei jedem Test von oben nach unten
```

## 📋 Test-Checklist

### ✅ Basis-Tests (2 Min)

```
□ GET /api/health → Status: ok
□ POST /api/auth/register → Token erhalten
□ POST /api/auth/login → Token erhalten
□ GET /api/users/me → User-Daten erhalten
□ POST /api/sync/pull → Changes erhalten
```

### ✅ Vollständige Tests (5 Min)

```
Health Checks:
□ GET / → 200
□ GET /health → 200

Authentication:
□ POST /auth/register → 201
□ POST /auth/login → 200
□ POST /auth/refresh → 200
□ POST /auth/logout → 200

Users:
□ GET /users/me → 200
□ GET /users → 200
□ GET /users/:id → 200
□ PATCH /users/:id → 200

Sync:
□ POST /sync/pull (initial) → 200
□ POST /sync/push (create) → 200
□ POST /sync/pull (incremental) → 200
□ POST /sync/push (update) → 200
□ POST /sync/push (delete) → 200

Errors:
□ No token → 401
□ Wrong password → 401
□ Duplicate email → 409
```

## 🔑 Token-Flow

```
1. Register → Copy accessToken
2. Use token: Authorization: Bearer <token>
3. Test protected routes
```

## 📁 Test-Dateien

```
tests/
├── complete-api-test.http  ← START HIER (automatische Variablen)
├── auth.http               ← Auth einzeln testen
├── users.http              ← Users einzeln testen
├── sync.http               ← Sync einzeln testen
└── app.http                ← Health checks
```

## ⚡ Schnelle Befehle

```bash
# Backend starten
npm run start:dev

# Datenbank zurücksetzen
npx prisma migrate reset

# Logs anschauen
# Backend-Terminal beobachten
```

## 🐛 Häufige Fehler

| Fehler           | Lösung                         |
| ---------------- | ------------------------------ |
| Cannot connect   | Backend läuft? Port 3000 frei? |
| 401 Unauthorized | Token kopieren und einfügen    |
| 404 Not Found    | `/api` Prefix vergessen?       |
| 409 Conflict     | Email bereits registriert      |

## 📊 Erwartete Responses

### ✅ Success (200/201)

```json
{
    "accessToken": "eyJhbGc...",
    "user": { "id": "...", "email": "..." }
}
```

### ❌ Error (400/401/409)

```json
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

## 🎯 Wichtigste Tests

1. **Health**: `GET /health`
2. **Register**: `POST /auth/register`
3. **Login**: `POST /auth/login`
4. **Profile**: `GET /users/me` (mit Token)
5. **Sync Pull**: `POST /sync/pull` (mit Token)
6. **Sync Push**: `POST /sync/push` (mit Token)

---

**Los geht's! Öffne `complete-api-test.http` und starte!** 🚀
