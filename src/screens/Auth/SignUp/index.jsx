import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import Animated, { 
    FadeInUp, 
    FadeInDown,
    Layout,
    BounceIn
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Animated.View 
                entering={FadeInDown.duration(1000).springify()}
                style={styles.header}
            >
                <Text variant="displaySmall" style={styles.title}>Criar Conta</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Junte-se a nós! É rápido e fácil
                </Text>
            </Animated.View>

            <Animated.View 
                entering={FadeInUp.duration(1000).springify()}
                style={styles.form}
            >
                <Animated.View entering={FadeInUp.delay(200)}>
                    <TextInput
                        label="Nome de usuário"
                        value={username}
                        onChangeText={setUsername}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="account" />}
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400)}>
                    <TextInput
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="email" />}
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600)}>
                    <TextInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={secureTextEntry}
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? "eye-off" : "eye"}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            />
                        }
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(800)}>
                    <TextInput
                        label="Confirmar Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={secureConfirmTextEntry}
                        left={<TextInput.Icon icon="lock-check" />}
                        right={
                            <TextInput.Icon
                                icon={secureConfirmTextEntry ? "eye-off" : "eye"}
                                onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                            />
                        }
                    />
                </Animated.View>

                <Animated.View 
                    entering={BounceIn.delay(1000)}
                    layout={Layout.springify()}
                >
                    <Button
                        mode="contained"
                        onPress={() => {/* Lógica de registro */}}
                        style={styles.button}
                    >
                        Criar Conta
                    </Button>
                </Animated.View>

                <Animated.View 
                    entering={FadeInUp.delay(1200)}
                    style={styles.loginContainer}
                >
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('SignIn')}
                        style={styles.loginLink}
                    >
                        <Text variant="bodyMedium">Já tem uma conta? </Text>
                        <Text variant="bodyMedium" style={styles.loginText}>
                            Faça login
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

export default SignUp;

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
        color: '#666',
    },
    form: {
        flex: 1,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        padding: 4,
        marginTop: 8,
        marginBottom: 24,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        fontWeight: 'bold',
    },
});
