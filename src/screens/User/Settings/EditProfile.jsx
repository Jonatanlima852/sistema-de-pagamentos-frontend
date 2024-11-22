import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../../../hooks/useAuth';
import SafeScreen from '../../../components/SafeScreen';

const EditProfile = () => {
  const { authData } = useAuth();
  const [name, setName] = useState(authData?.user?.name || '');
  const [email, setEmail] = useState(authData?.user?.email || '');

  const handleSave = async () => {
    try {
      // Implementar lógica de atualização do perfil
      console.log('Dados a serem salvos:', { name, email });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Salvar Alterações
        </Button>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default EditProfile; 