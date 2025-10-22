import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Fehler", "Bitte E-Mail und Passwort eingeben");
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            // Navigation happens automatically through auth state change
        } catch (error: any) {
            Alert.alert("Login fehlgeschlagen", error.message || "Bitte überprüfe deine Zugangsdaten", [
                { text: "OK" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToRegister = () => {
        router.push("/register");
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.logo}>📋</Text>
                    <Text style={styles.title}>WatermelonDB</Text>
                    <Text style={styles.subtitle}>Willkommen zurück</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-Mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="deine@email.de"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Passwort</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                            editable={!isLoading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Anmelden</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>oder</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleGoToRegister} disabled={isLoading}>
                        <Text style={styles.registerButtonText}>Noch kein Konto? Jetzt registrieren</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    form: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#f8f8f8",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#333",
    },
    loginButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    loginButtonDisabled: {
        backgroundColor: "#999",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#e0e0e0",
    },
    dividerText: {
        marginHorizontal: 16,
        color: "#999",
        fontSize: 14,
    },
    registerButton: {
        padding: 16,
        alignItems: "center",
    },
    registerButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
