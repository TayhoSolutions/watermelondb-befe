# Mobile App - Backend Sync Integration

Anleitung zur Integration der WatermelonDB Synchronisierung in die React Native App.

## 📱 Übersicht

Die Mobile App kommuniziert mit dem Backend über die Sync-Endpoints für:

-   **Pull**: Änderungen vom Server holen
-   **Push**: Lokale Änderungen zum Server senden
-   **Authentifizierung**: JWT-basierte Auth

## 🔐 1. Auth Service erstellen

Erstelle eine neue Datei: `mobile/src/services/auth.service.ts`

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000/api"; // Für iOS Simulator: http://localhost:3000
// Für Android Emulator: http://10.0.2.2:3000
// Für echtes Gerät: http://deine-ip:3000

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    async register(email: string, password: string, name?: string): Promise<AuthTokens> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        const tokens: AuthTokens = await response.json();
        await this.saveTokens(tokens);
        return tokens;
    }

    async login(email: string, password: string): Promise<AuthTokens> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const tokens: AuthTokens = await response.json();
        await this.saveTokens(tokens);
        return tokens;
    }

    async logout(): Promise<void> {
        const token = await this.getAccessToken();
        if (token) {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        await this.clearTokens();
    }

    async refreshAccessToken(): Promise<string> {
        const refreshToken = await this.getRefreshToken();
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            await this.clearTokens();
            throw new Error("Token refresh failed");
        }

        const tokens: AuthTokens = await response.json();
        await this.saveTokens(tokens);
        return tokens.accessToken;
    }

    async getAccessToken(): Promise<string | null> {
        if (!this.accessToken) {
            this.accessToken = await AsyncStorage.getItem("accessToken");
        }
        return this.accessToken;
    }

    async getRefreshToken(): Promise<string | null> {
        if (!this.refreshToken) {
            this.refreshToken = await AsyncStorage.getItem("refreshToken");
        }
        return this.refreshToken;
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getAccessToken();
        return token !== null;
    }

    private async saveTokens(tokens: AuthTokens): Promise<void> {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        await AsyncStorage.setItem("accessToken", tokens.accessToken);
        await AsyncStorage.setItem("refreshToken", tokens.refreshToken);
    }

    private async clearTokens(): Promise<void> {
        this.accessToken = null;
        this.refreshToken = null;
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
    }
}

export const authService = new AuthService();
```

## 🔄 2. Sync Service erstellen

Erstelle: `mobile/src/services/sync.service.ts`

```typescript
import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../database";
import { authService } from "./auth.service";

const API_URL = "http://localhost:3000/api";

export async function syncDatabase() {
    const accessToken = await authService.getAccessToken();

    if (!accessToken) {
        throw new Error("Not authenticated");
    }

    try {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const response = await fetch(`${API_URL}/sync/pull`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ lastPulledAt }),
                });

                if (response.status === 401) {
                    // Token expired, try to refresh
                    const newToken = await authService.refreshAccessToken();
                    // Retry with new token
                    const retryResponse = await fetch(`${API_URL}/sync/pull`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${newToken}`,
                        },
                        body: JSON.stringify({ lastPulledAt }),
                    });

                    if (!retryResponse.ok) {
                        throw new Error("Pull failed");
                    }

                    return retryResponse.json();
                }

                if (!response.ok) {
                    throw new Error("Pull failed");
                }

                const result = await response.json();
                return result;
            },

            pushChanges: async ({ changes, lastPulledAt }) => {
                const response = await fetch(`${API_URL}/sync/push`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ changes }),
                });

                if (response.status === 401) {
                    const newToken = await authService.refreshAccessToken();
                    const retryResponse = await fetch(`${API_URL}/sync/push`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${newToken}`,
                        },
                        body: JSON.stringify({ changes }),
                    });

                    if (!retryResponse.ok) {
                        throw new Error("Push failed");
                    }
                    return;
                }

                if (!response.ok) {
                    throw new Error("Push failed");
                }
            },
        });

        console.log("✅ Sync successful");
    } catch (error) {
        console.error("❌ Sync failed:", error);
        throw error;
    }
}
```

## 📦 3. Dependencies installieren

```bash
cd mobile
npm install @react-native-async-storage/async-storage
```

## 🎨 4. Login/Register UI erstellen

Erstelle: `mobile/src/components/AuthForm.tsx`

```typescript
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { authService } from "../services/auth.service";

interface AuthFormProps {
    onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                await authService.login(email, password);
            } else {
                await authService.register(email, password, name);
            }
            onAuthSuccess();
        } catch (err) {
            setError(isLogin ? "Login failed" : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

            {!isLogin && <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />}

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                title={loading ? "Loading..." : isLogin ? "Login" : "Register"}
                onPress={handleSubmit}
                disabled={loading}
            />

            <Button
                title={isLogin ? "Need an account? Register" : "Have an account? Login"}
                onPress={() => setIsLogin(!isLogin)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
});
```

## 🏠 5. App.tsx aktualisieren

```typescript
import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import { authService } from "./src/services/auth.service";
import { syncDatabase } from "./src/services/sync.service";
import AuthForm from "./src/components/AuthForm";
import ProjectList from "./src/components/ProjectList";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        setLoading(false);
    };

    const handleSync = async () => {
        try {
            await syncDatabase();
            alert("Sync successful!");
        } catch (error) {
            alert("Sync failed");
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        setIsAuthenticated(false);
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!isAuthenticated) {
        return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
                <Button title="Sync" onPress={handleSync} />
                <Button title="Logout" onPress={handleLogout} />
            </View>
            <ProjectList />
        </View>
    );
}
```

## 🚀 6. Testen

1. **Backend starten:**

    ```bash
    cd backend
    npm run start:dev
    ```

2. **MySQL & Redis prüfen:**

    ```bash
    mysql -u root -p watermelondb
    redis-cli ping
    ```

3. **Mobile App starten:**

    ```bash
    cd mobile
    npm start
    ```

4. **Registrieren & Sync testen**

## 📝 Wichtige Hinweise

### API URL für verschiedene Plattformen

-   **iOS Simulator**: `http://localhost:3000`
-   **Android Emulator**: `http://10.0.2.2:3000`
-   **Echtes Gerät**: `http://192.168.x.x:3000` (deine lokale IP)

### Lokale IP herausfinden

```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

### Schema Sync

Stelle sicher, dass das Mobile Schema mit dem Backend übereinstimmt:

**Mobile** (`mobile/src/database/schema.ts`):

-   `created_at` und `updated_at` sind Timestamps in Millisekunden

**Backend** (`entities/*.entity.ts`):

-   `createdAtMs` und `updatedAtMs` entsprechen den Mobile Timestamps

## 🐛 Troubleshooting

### Network Request Failed

-   Überprüfe API_URL
-   iOS: Erlaubt HTTP in Info.plist?
-   Android: Internet Permission in AndroidManifest.xml?

### 401 Unauthorized

-   Access Token abgelaufen → Refresh Token verwenden
-   Logout und neu einloggen

### Sync Conflicts

WatermelonDB behandelt Konflikte durch "Last Write Wins" - der Server hat immer Recht.

---

**Viel Erfolg mit der Integration! 🎉**
