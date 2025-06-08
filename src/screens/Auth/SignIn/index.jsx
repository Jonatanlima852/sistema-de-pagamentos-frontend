import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { colors } from '../../../theme';
import { useAuth } from '../../../hooks/useAuth';
import RequestReset from './RequestReset';

const SignIn = ({ navigation }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleSignIn = async () => {
        setEmailError("");
        setPasswordError("");
        setGeneralError("");

        try {
            await signIn(email, password);
        } catch (error) {
            console.error("Erro no login:", error);

            if (error?.response?.data?.errors) {
                error.response.data.errors.forEach(err => {
                    if (err.path === "email") {
                        setEmailError(err.msg);
                    }
                    if (err.path === "password") {
                        setPasswordError(err.msg);
                    }
                });
            }

            if (error?.response?.data?.message) {
                setGeneralError(error.response.data.message);
            }
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="displaySmall" style={styles.title}>Bem-vindo</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>Faça login para continuar</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    label="Senha"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={secureTextEntry}
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? "eye-off" : "eye"}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        />
                    }
                />

                {(generalError || emailError || passwordError) && (
                    <View style={styles.errorContainer}>
                        {generalError ? <Text style={styles.errorText}>• {generalError}</Text> : null}
                        {emailError ? <Text style={styles.errorText}>• {emailError}</Text> : null}
                        {passwordError ? <Text style={styles.errorText}>• {passwordError}</Text> : null}
                    </View>
                )}

                <TouchableOpacity
                onPress={() => navigation.navigate('RequestReset')}
                style={styles.forgotPassword}
                >
                <Text variant="bodyMedium" style={styles.forgotPasswordText}>
                    Esqueceu sua senha?
                </Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    onPress={handleSignIn}
                    style={styles.button}
                >
                    Conectar
                </Button>

                <View style={styles.dividerContainer}>
                    <Divider style={styles.divider} />
                    <Text style={styles.orText}>ou</Text>
                    <Divider style={styles.divider} />
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={styles.registerContainer}
                >
                    <Text variant="bodyMedium">Não tem uma conta? </Text>
                    <Text variant="bodyMedium" style={styles.registerText}>
                        Registre-se
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginTop: 140,
        marginBottom: 40,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: colors.textLight,
    },
    form: {
        flex: 1,
    },
    input: {
        marginBottom: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: colors.textLight,
    },
    button: {
        padding: 4,
        marginBottom: 24,
        color: colors.primary,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
    },
    orText: {
        marginHorizontal: 16,
        color: colors.textLight,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: '#ffe6e6',
        borderColor: '#ff4d4d',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    errorText: {
        color: '#ff1a1a',
        fontSize: 14,
        textAlign: 'left',
    },
});