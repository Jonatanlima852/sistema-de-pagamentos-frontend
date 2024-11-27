import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Surface, Text, Divider, HelperText, Portal, Dialog } from 'react-native-paper';
import { useAuth } from '../../../hooks/useAuth';
import SafeScreen from '../../../components/SafeScreen';
import { showMessage } from 'react-native-flash-message';

const EditProfile = ({ navigation }) => {
  const { authData, updateUser, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Dados do perfil
  const [name, setName] = useState(authData?.user?.name || '');
  const [email, setEmail] = useState(authData?.user?.email || '');
  
  // Dados da senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de visibilidade das senhas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      showMessage({
        message: 'Campos obrigatórios',
        description: 'Nome e email são obrigatórios',
        type: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      await updateUser({ name, email });
      showMessage({
        message: 'Perfil atualizado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Erro ao atualizar perfil',
        description: error.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage({
        message: 'Campos obrigatórios',
        description: 'Todos os campos de senha são obrigatórios',
        type: 'warning',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage({
        message: 'As senhas não coincidem',
        type: 'danger',
      });
      return;
    }

    if (newPassword.length < 6) {
      showMessage({
        message: 'Senha muito curta',
        description: 'A nova senha deve ter pelo menos 6 caracteres',
        type: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      await updateUser({
        name,
        email,
        currentPassword,
        newPassword,
      });
      
      // Limpa os campos de senha
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      showMessage({
        message: 'Senha atualizada com sucesso!',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Erro ao atualizar senha',
        description: error.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      // Não precisa fazer nada aqui pois o deleteAccount já faz o logout
    } catch (error) {
      showMessage({
        message: 'Erro ao deletar conta',
        description: error.message,
        type: 'danger',
      });
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Editar Perfil
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Atualize suas informações pessoais
          </Text>
        </Surface>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações Básicas
          </Text>
          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            disabled={loading}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Atualizar Perfil
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Alterar Senha
          </Text>
          <TextInput
            label="Senha Atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showCurrentPassword ? "eye-off" : "eye"}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
          />
          <TextInput
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock-plus" />}
            right={
              <TextInput.Icon
                icon={showNewPassword ? "eye-off" : "eye"}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
          <TextInput
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {newPassword !== confirmPassword && confirmPassword !== '' && (
            <HelperText type="error" visible={true}>
              As senhas não coincidem
            </HelperText>
          )}
          <Button
            mode="contained-tonal"
            onPress={handleUpdatePassword}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Atualizar Senha
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, styles.dangerText]}>
            Zona de Perigo
          </Text>
          <Text variant="bodyMedium" style={styles.warningText}>
            Atenção: Esta ação não pode ser desfeita e todos os seus dados serão perdidos.
          </Text>
          <Button
            mode="contained"
            onPress={() => setShowDeleteDialog(true)}
            style={[styles.button, styles.deleteButton]}
            disabled={loading}
          >
            Deletar Conta
          </Button>
        </View>
      </ScrollView>

      {/* Dialog de confirmação para deletar conta */}
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Confirmar exclusão</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button 
              onPress={handleDeleteAccount} 
              textColor="#FF0000"
              loading={loading}
              disabled={loading}
            >
              Deletar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 24,
  },
  dangerText: {
    color: '#DC2626',
  },
  warningText: {
    color: '#666',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
});

export default EditProfile; 