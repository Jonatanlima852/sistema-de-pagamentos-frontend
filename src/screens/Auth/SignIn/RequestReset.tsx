import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';

const RequestReset = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSendEmail = async () => {
    setErrors([]);
    try {
      await axios.post('/forgot-password', { email });
      setStep('CODE');
    } catch (err) {
      setErrors(['E-mail não encontrado.']);
    }
  };

  const handleVerifyCode = async () => {
    setErrors([]);
    try {
      await axios.post('/verify-code', { email, code });
      navigation.navigate('ResetPassword', { email });
    } catch (err) {
      setErrors(['Código inválido.']);
    }
  };

  return (
    <View style={styles.container}>
      {step === 'EMAIL' ? (
        <>
          <Text variant="titleLarge" style={styles.title}>Recuperar senha</Text>
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((msg, index) => (
                <Text key={index} style={styles.errorText}>• {msg}</Text>
              ))}
            </View>
          )}
          <Button mode="contained" onPress={handleSendEmail}>Enviar código</Button>
        </>
      ) : (
        <>
          <Text variant="titleLarge" style={styles.title}>Digite o código enviado</Text>
          <TextInput
            label="Código de verificação"
            value={code}
            onChangeText={setCode}
            mode="outlined"
            style={styles.input}
          />
          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((msg, index) => (
                <Text key={index} style={styles.errorText}>• {msg}</Text>
              ))}
            </View>
          )}
          <Button mode="contained" onPress={handleVerifyCode}>Verificar</Button>
        </>
      )}
    </View>
  );
};

export default RequestReset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    marginBottom: 16
  },
  title: {
    marginBottom: 20,
    textAlign: 'center'
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
  }
});