# API Documentation

Complete REST API documentation for the WatermelonDB Backend.

## 🔗 Base URL

```
Development: http://localhost:3000/api
Production:  https://api.your-domain.com/api
```

## 🔐 Authentication

All protected endpoints require a JWT Access Token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Flow

1. **Register/Login** → Receive Access Token + Refresh Token
2. **API Requests** → Use Access Token
3. **Token Expired** → Use Refresh Token for new Access Token
4. **Logout** → Invalidate Refresh Token

---

## 📡 Endpoints

### 1. Authentication

#### 1.1 Register

Register a new user.

**Endpoint:** `POST /auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe" // optional
}
```

**Response:** `200 OK`

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

-   `409 Conflict` - Email already registered
-   `400 Bad Request` - Validation Error

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

---

#### 1.2 Login

Login with existing credentials.

**Endpoint:** `POST /auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

-   `401 Unauthorized` - Falsche Credentials

**cURL Beispiel:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

#### 1.3 Refresh Token

Neuen Access Token mit Refresh Token erhalten.

**Endpoint:** `POST /auth/refresh`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

-   `401 Unauthorized` - Invalid Refresh Token

**cURL Beispiel:**

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

#### 1.4 Logout

Aktuellen Benutzer ausloggen (invalidiert Refresh Token).

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
    "message": "Logged out successfully"
}
```

**cURL Beispiel:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Users

#### 2.1 Get Current User Profile

Eigenes Profil abrufen.

**Endpoint:** `GET /users/me`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
    "id": "uuid-1234-5678",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

**cURL Beispiel:**

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 2.2 Get User by ID

Benutzer-Details abrufen.

**Endpoint:** `GET /users/:id`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
    "id": "uuid-1234-5678",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

**Errors:**

-   `404 Not Found` - User does not exist

**cURL Beispiel:**

```bash
curl -X GET http://localhost:3000/api/users/uuid-1234-5678 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 2.3 Update User

Benutzer-Daten aktualisieren.

**Endpoint:** `PATCH /users/:id`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "name": "Jane Doe",
    "email": "newemail@example.com", // optional
    "password": "newPassword123" // optional
}
```

**Response:** `200 OK`

```json
{
    "id": "uuid-1234-5678",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "isActive": true,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T12:00:00.000Z"
}
```

**cURL Beispiel:**

```bash
curl -X PATCH http://localhost:3000/api/users/uuid-1234-5678 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'
```

---

### 3. Sync (WatermelonDB)

#### 3.1 Pull Changes

Fetch changes from the server since last pull.

**Endpoint:** `POST /sync/pull`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "lastPulledAt": 0
}
```

**lastPulledAt:** Timestamp in Millisekunden. `0` für initialen Sync.

**Response:** `200 OK`

```json
{
    "changes": {
        "projects": {
            "created": [
                {
                    "id": "project-uuid-1",
                    "name": "My Project",
                    "description": "Project description",
                    "created_at": 1697900000000,
                    "updated_at": 1697900000000
                }
            ],
            "updated": [
                {
                    "id": "project-uuid-2",
                    "name": "Updated Project",
                    "description": "New description",
                    "created_at": 1697800000000,
                    "updated_at": 1697900000000
                }
            ],
            "deleted": ["project-uuid-3"]
        },
        "tasks": {
            "created": [
                {
                    "id": "task-uuid-1",
                    "title": "My Task",
                    "description": "Task description",
                    "is_completed": false,
                    "project_id": "project-uuid-1",
                    "created_at": 1697900000000,
                    "updated_at": 1697900000000
                }
            ],
            "updated": [],
            "deleted": []
        }
    },
    "timestamp": 1697950000000
}
```

**Wichtig:**

-   Speichere `timestamp` für nächsten Pull
-   `created`: Neue Records seit lastPulledAt
-   `updated`: Geänderte Records seit lastPulledAt
-   `deleted`: Gelöschte Record IDs (Soft Delete)

**cURL Beispiel:**

```bash
curl -X POST http://localhost:3000/api/sync/pull \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lastPulledAt": 0
  }'
```

---

#### 3.2 Push Changes

Send local changes to the server.

**Endpoint:** `POST /sync/push`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "changes": {
        "projects": {
            "created": [
                {
                    "id": "project-uuid-new",
                    "name": "New Project",
                    "description": "Created locally",
                    "created_at": 1697900000000,
                    "updated_at": 1697900000000
                }
            ],
            "updated": [
                {
                    "id": "project-uuid-1",
                    "name": "Updated Project Name",
                    "description": "Updated description",
                    "updated_at": 1697950000000
                }
            ],
            "deleted": ["project-uuid-old"]
        },
        "tasks": {
            "created": [
                {
                    "id": "task-uuid-new",
                    "title": "New Task",
                    "description": "Task desc",
                    "is_completed": false,
                    "project_id": "project-uuid-1",
                    "created_at": 1697900000000,
                    "updated_at": 1697900000000
                }
            ],
            "updated": [
                {
                    "id": "task-uuid-1",
                    "title": "Updated Task",
                    "is_completed": true,
                    "updated_at": 1697950000000
                }
            ],
            "deleted": []
        }
    }
}
```

**Response:** `200 OK`

```json
{
    "success": true
}
```

**Wichtig:**

-   Server überschreibt bei Konflikten (Last Write Wins)
-   Soft Delete: Records are marked with `isDeleted: true`
-   UUIDs are generated by the client (WatermelonDB)

**cURL Beispiel:**

```bash
curl -X POST http://localhost:3000/api/sync/push \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "changes": {
      "projects": {
        "created": [],
        "updated": [{
          "id": "project-uuid-1",
          "name": "Updated Name",
          "updated_at": 1697950000000
        }],
        "deleted": []
      },
      "tasks": {
        "created": [],
        "updated": [],
        "deleted": []
      }
    }
  }'
```

---

## 🔒 Error Responses

All endpoints can return the following standard errors:

### 400 Bad Request

```json
{
    "statusCode": 400,
    "message": ["email must be an email", "password must be at least 6 characters"],
    "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
    "statusCode": 403,
    "message": "Forbidden resource",
    "error": "Forbidden"
}
```

### 404 Not Found

```json
{
    "statusCode": 404,
    "message": "User with ID xyz not found",
    "error": "Not Found"
}
```

### 409 Conflict

```json
{
    "statusCode": 409,
    "message": "User with this email already exists",
    "error": "Conflict"
}
```

### 500 Internal Server Error

```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```

---

## 📊 Rate Limiting

In production, rate limiting should be enabled:

-   **Auth Endpoints**: 5 Requests / Minute
-   **Sync Endpoints**: 60 Requests / Minute
-   **Other Endpoints**: 100 Requests / Minute

**Response Header:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1697900000
```

Bei Überschreitung:

```json
{
    "statusCode": 429,
    "message": "Too Many Requests"
}
```

---

## 🔧 Testing mit Postman

### Collection Import

Erstelle eine Postman Collection mit diesen Endpoints:

1. **Environment Variables:**

    - `base_url`: `http://localhost:3000/api`
    - `access_token`: (set automatically)
    - `refresh_token`: (set automatically)

2. **Auth → Register:**

    ```
    POST {{base_url}}/auth/register
    Body: { email, password, name }
    Tests: pm.environment.set("access_token", pm.response.json().accessToken)
    ```

3. **Sync → Pull:**
    ```
    POST {{base_url}}/sync/pull
    Headers: Authorization: Bearer {{access_token}}
    Body: { lastPulledAt: 0 }
    ```

---

## 📚 Code Beispiele

### JavaScript/TypeScript

```typescript
const API_URL = "http://localhost:3000/api";

// Register
const register = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

// Pull Changes
const pullChanges = async (accessToken: string, lastPulledAt: number) => {
    const response = await fetch(`${API_URL}/sync/pull`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ lastPulledAt }),
    });
    return response.json();
};
```

### Python

```python
import requests

API_URL = 'http://localhost:3000/api'

# Register
def register(email, password):
    response = requests.post(
        f'{API_URL}/auth/register',
        json={'email': email, 'password': password}
    )
    return response.json()

# Pull Changes
def pull_changes(access_token, last_pulled_at):
    response = requests.post(
        f'{API_URL}/sync/pull',
        headers={'Authorization': f'Bearer {access_token}'},
        json={'lastPulledAt': last_pulled_at}
    )
    return response.json()
```

---

**Happy API Testing! 🚀**
