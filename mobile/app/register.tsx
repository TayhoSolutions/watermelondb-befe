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

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Fehler", "Bitte alle Pflichtfelder ausfüllen");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Fehler", "Passwörter stimmen nicht überein");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Fehler", "Passwort muss mindestens 6 Zeichen lang sein");
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, name || undefined);
            router.push("/profile");
        } catch (error: any) {
            Alert.alert("Registrierung fehlgeschlagen", error.message || "Bitte versupche es erneut", [{ text: "OK" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToLogin = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.logo}>📋</Text>
                    <Text style={styles.title}>Konto erstellen</Text>
                    <Text style={styles.subtitle}>Registriere dich kostenlos</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name (optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dein Name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-Mail *</Text>
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
                        <Text style={styles.label}>Passwort *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mindestens 6 Zeichen"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password-new"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Passwort bestätigen *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Passwort wiederholen"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoComplete="password-new"
                            editable={!isLoading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Registrieren</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>oder</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleGoToLogin} disabled={isLoading}>
                        <Text style={styles.loginButtonText}>Bereits registriert? Jetzt anmelden</Text>
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
    backButton: {
        alignSelf: "flex-start",
        padding: 8,
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
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
    registerButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    registerButtonDisabled: {
        backgroundColor: "#999",
    },
    registerButtonText: {
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
    loginButton: {
        padding: 16,
        alignItems: "center",
    },
    loginButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
