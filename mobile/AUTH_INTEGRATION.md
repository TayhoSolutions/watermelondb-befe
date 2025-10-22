# Authentication Integration - Schnellstart

## ✅ Was wurde implementiert?

Die vollständige Authentifizierungs-Lösung für die Mobile App:

### 📁 Erstellte Dateien:

1. **`mobile/src/services/authService.ts`** - Auth-Service (Login, Register, Logout)
2. **`mobile/src/contexts/AuthContext.tsx`** - React Context für Auth-State
3. **`mobile/app/login.tsx`** - Login-Screen
4. **`mobile/app/register.tsx`** - Registrierungs-Screen
5. **`mobile/app/profile.tsx`** - Profil-Screen mit Logout

### 🔄 Aktualisierte Dateien:

1. **`mobile/app/_layout.tsx`** - Auth-Provider & Navigation basierend auf Auth-Status
2. **`mobile/app/sync-settings.tsx`** - Verwendet jetzt Auth-Context für Token
3. **`mobile/src/config/api.ts`** - Auth-Endpoints hinzugefügt

### 📦 Installierte Pakete:

-   `@react-native-async-storage/async-storage` - Token-Persistierung

## 🎯 Features

✅ **Login** - Benutzer-Anmeldung mit E-Mail/Passwort  
✅ **Registrierung** - Neue Benutzer registrieren  
✅ **Logout** - Abmeldung mit finalem Sync  
✅ **Token-Management** - Automatisches Speichern/Laden von Tokens  
✅ **Sync-Integration** - Auth-Token wird automatisch an Sync-Service übergeben  
✅ **Navigation** - Automatische Weiterleitung basierend auf Auth-Status  
✅ **Profil-Screen** - Benutzerinformationen und Abmeldung

## 🚀 Navigation

### Tab-Navigation (Footer):

Nur sichtbar wenn **angemeldet**:

-   📋 **Projects** - Projektliste
-   🔄 **Sync** - Sync-Einstellungen
-   👤 **Profil** - Benutzerprofil & Logout

### Versteckte Screens:

-   🔐 **Login** - Login-Formular (nur wenn abgemeldet)
-   ✍️ **Register** - Registrierungs-Formular (nur wenn abgemeldet)
-   📄 **Project Detail** - Projekt-Details (kein Tab, nur per Navigation)

## 🔄 Auth-Flow

### 1. App-Start

```
App startet → AuthProvider lädt Token →
  ├─ Token gefunden → Zeige App-Screens
  └─ Kein Token → Redirect zu Login
```

### 2. Login

```
Login-Screen → Email/Passwort eingeben →
  ├─ Erfolgreich → Token speichern → Sync-Service setzen → Redirect zu Projects
  └─ Fehler → Fehlermeldung anzeigen
```

### 3. Registrierung

```
Register-Screen → Daten eingeben →
  ├─ Erfolgreich → Token speichern → Redirect zu Projects
  └─ Fehler → Fehlermeldung anzeigen
```

### 4. Logout

```
Profil → Logout-Button → Bestätigung →
  ├─ Finaler Sync → Token löschen → Redirect zu Login
  └─ Abbrechen → Zurück zu Profil
```

## 📱 Verwendung

### Auth-Context verwenden

```typescript
import { useAuth } from "../src/contexts/AuthContext";

function MyComponent() {
    const { user, token, isAuthenticated, login, logout } = useAuth();

    return <View>{isAuthenticated ? <Text>Hallo {user?.email}</Text> : <Text>Nicht angemeldet</Text>}</View>;
}
```

### Login programmatisch

```typescript
const { login } = useAuth();

try {
    await login("user@example.com", "password");
    console.log("Login erfolgreich!");
} catch (error) {
    console.error("Login fehlgeschlagen:", error);
}
```

### Logout programmatisch

```typescript
const { logout } = useAuth();

try {
    await logout();
    console.log("Logout erfolgreich!");
} catch (error) {
    console.error("Logout fehlgeschlagen:", error);
}
```

## 🔐 Backend-Integration

Der Auth-Service kommuniziert mit folgenden Backend-Endpoints:

### POST /api/auth/register

**Request:**

```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "Optional Name"
}
```

**Response:**

```json
{
    "accessToken": "jwt-token",
    "user": {
        "id": "user-id",
        "email": "user@example.com",
        "name": "Optional Name"
    }
}
```

### POST /api/auth/login

**Request:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**

```json
{
    "accessToken": "jwt-token",
    "user": {
        "id": "user-id",
        "email": "user@example.com",
        "name": "Optional Name"
    }
}
```

### POST /api/auth/logout

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
    "success": true
}
```

## 🎨 UI-Screens

### Login-Screen

-   E-Mail-Eingabe
-   Passwort-Eingabe
-   Anmelden-Button
-   Link zur Registrierung
-   Schönes Design mit Logo

### Registrierungs-Screen

-   Name (optional)
-   E-Mail
-   Passwort
-   Passwort bestätigen
-   Registrieren-Button
-   Link zum Login
-   Validierung (Passwort-Länge, Übereinstimmung)

### Profil-Screen

-   Benutzer-Avatar
-   Name & E-Mail
-   Benutzer-ID
-   Aktionen (Profil bearbeiten, Passwort ändern)
-   **Abmelden-Button** (rot, mit Bestätigung)
-   App-Version im Footer

## 🔧 Konfiguration

### API-URL

Die Backend-URL ist in `src/config/api.ts` konfiguriert:

```typescript
export const API_URL = __DEV__
    ? "http://localhost:3000/api" // Development
    : "https://your-production-api.com"; // Production
```

**Wichtig für lokale Entwicklung:**

-   iOS Simulator: `http://localhost:3000/api`
-   Android Emulator: `http://10.0.2.2:3000/api`
-   Physisches Gerät: `http://YOUR_IP:3000/api`

## 🔄 Sync-Integration

Der Auth-Service ist vollständig mit dem Sync-Service integriert:

### Automatisch beim Login

```typescript
// Auth-Context setzt Token automatisch
await login(email, password);
// → Sync-Service bekommt automatisch das Token
// → Optional: Initaler Sync wird durchgeführt
```

### Automatisch beim Logout

```typescript
// Finaler Sync vor Logout
await logout();
// → Sync wird durchgeführt
// → Token wird gelöscht
// → Sync-Service wird gecleart
```

## 🐛 Troubleshooting

### "Network request failed"

-   Prüfe API_URL in `src/config/api.ts`
-   Bei Android: Verwende `10.0.2.2` statt `localhost`
-   Bei Device: Verwende lokale IP-Adresse

### "Registration failed" / "Login failed"

-   Prüfe Backend-Logs
-   Validiere Request-Format
-   Teste Endpoints mit Postman

### Token wird nicht gespeichert

-   Prüfe AsyncStorage-Permissions
-   Console-Logs für Fehler überprüfen

### Logout-Sync schlägt fehl

-   Ist nicht kritisch
-   Token wird trotzdem gelöscht
-   Warnung in Console

## ✅ Testen

### 1. Registrierung testen

1. App starten (sollte Login-Screen zeigen)
2. "Jetzt registrieren" klicken
3. Daten eingeben
4. Registrieren
5. Sollte zu Projects-Screen weitergeleitet werden

### 2. Logout & Login testen

1. Zu Profil-Tab wechseln
2. "Abmelden" klicken
3. Bestätigen
4. Sollte zu Login-Screen weitergeleitet werden
5. Mit denselben Daten einloggen
6. Sollte wieder zu Projects-Screen weitergeleitet werden

### 3. Token-Persistierung testen

1. Einloggen
2. App komplett schließen
3. App neu starten
4. Sollte direkt bei Projects sein (kein erneuter Login nötig)

## 📚 Weitere Features (Optional)

### Passwort vergessen

-   Screen für Passwort-Reset
-   E-Mail mit Reset-Link

### Social Login

-   Google / Apple Login
-   OAuth-Integration

### Token-Refresh

-   Automatisches Erneuern abgelaufener Tokens
-   Refresh-Token-Mechanismus

### Profil bearbeiten

-   Name ändern
-   E-Mail ändern
-   Passwort ändern

## 🎉 Zusammenfassung

Die komplette Authentifizierung ist implementiert und funktionsfähig:

✅ Login & Registrierung  
✅ Token-Management  
✅ Profil & Logout  
✅ Sync-Integration  
✅ Navigation basierend auf Auth-Status  
✅ Schönes UI-Design  
✅ Error Handling  
✅ Validierung

**Die App ist jetzt bereit für Multi-User-Betrieb!** 🚀
