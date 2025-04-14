import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Pressable, 
  Platform, 
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Text, TextInput, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';

const AddCategoryModal = ({ visible, onDismiss, themeColor, initialType }) => {
  const { addCategory, loading } = useFinances();
  const [name, setName] = useState('');
  const [type, setType] = useState(initialType);
  const [error, setError] = useState('');
  const [nestedThemeColor, setNestedThemeColor] = useState(themeColor);
  const insets = useSafeAreaInsets();
  
  // Referência para o Modalize
  const modalizeRef = useRef(null);
  
  // Abrir/fechar o modal baseado na prop visible
  useEffect(() => {
    if (visible && modalizeRef.current) {
      modalizeRef.current.open();
    } else if (!visible && modalizeRef.current) {
      modalizeRef.current.close();
    }
  }, [visible]);
  
  useEffect(() => {
    setNestedThemeColor(type === 'EXPENSE' ? colors.expense : colors.income);
  }, [type]);

  const handleNameChange = useCallback((text) => {
    const e = { persist: () => {} };
    e.persist();
    setName(text);
  }, []);

  // Limpar o formulário
  const cleanForm = useCallback(() => {
    setName('');
    setError('');
    setType(initialType);
  }, [initialType]);

  const handleDismiss = useCallback(() => {
    cleanForm();
    onDismiss();
  }, [cleanForm, onDismiss]);

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        setError('Nome da categoria é obrigatório');
        return;
      }

      const categoryData = {
        name: name.trim(),
        type,
      };

      await addCategory(categoryData);
      handleDismiss();
    } catch (err) {
      setError('Erro ao criar categoria. Tente novamente.');
      console.error('Erro ao criar categoria:', err);
    }
  };


  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalHeight={400}
        threshold={100}
        velocity={840}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
        withHandle={true}
        handlePosition="outside"
        onClose={handleDismiss}
        handleStyle={{ 
          backgroundColor: nestedThemeColor, 
          marginTop: 30,
          width: 50, 
          height: 5 
        }}
        modalStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 500,
        }}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
            keyboardShouldPersistTaps="handled"
          >
            <Text variant="titleLarge" style={styles.title}>Nova Categoria</Text>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <SegmentedButtons
              value={type}
              onValueChange={(value) => {
                const e = { persist: () => {} };
                e.persist();
                setType(value);
                setName('');
              }}
              buttons={[
                {
                  value: 'EXPENSE',
                  label: 'Despesa',
                  style: {
                    borderColor: type === 'EXPENSE' ? `${colors.expense}` : '#999',
                    borderWidth: type === 'EXPENSE' ? 4 : 1,
                    backgroundColor: type === 'EXPENSE' ? `${colors.expense}15` : 'transparent',
                  },
                  textColor: colors.expense,
                },
                {
                  value: 'INCOME',
                  label: 'Receita',
                  style: {
                    borderColor: type === 'INCOME' ? `${colors.income}` : '#999',
                    borderWidth: type === 'INCOME' ? 4 : 1,
                    backgroundColor: type === 'INCOME' ? `${colors.income}15` : 'transparent',
                  },
                  textColor: colors.income,
                },
              ]}
              style={styles.segmentedButton}
            />

            <TextInput
              label="Nome da Categoria"
              value={name}
              onChangeText={handleNameChange}
              mode="outlined"
              style={styles.input}
              outlineColor={nestedThemeColor}
              activeOutlineColor={nestedThemeColor}
            />

            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                style={({ pressed }) => [
                  styles.saveButton,
                  {
                    backgroundColor: pressed 
                      ? `${nestedThemeColor}80`
                      : nestedThemeColor,

                    elevation: pressed 
                      ? 0 
                      : 4,
                  }
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    Salvar
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modalize>
    </Portal>
  );
};

AddCategoryModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
  initialType: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 44,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 22,
  },
  segmentedButton: {
    marginBottom: 24,
  },
  input: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: colors.background,
    height: 56,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  saveButton: {
    borderRadius: 12,
    padding: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: colors.error,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 15,
  },
});

export default AddCategoryModal; 