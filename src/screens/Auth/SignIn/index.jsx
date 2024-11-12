import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { colors } from '../../../theme';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);

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

                <TouchableOpacity 
                    onPress={() => {/* Navegação para recuperação de senha */}}
                    style={styles.forgotPassword}
                >
                    <Text variant="bodyMedium" style={styles.forgotPasswordText}>
                        Esqueceu sua senha?
                    </Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    onPress={() => {/* Lógica de login */}}
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
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        marginTop: 60,
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
});

