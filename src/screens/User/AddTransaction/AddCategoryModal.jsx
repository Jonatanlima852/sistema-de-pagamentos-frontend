import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, Animated, Pressable } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import PropTypes from 'prop-types';

const AddCategoryModal = React.memo(({ visible, onDismiss, themeColor, initialType }) => {
  const { addCategory, loading } = useFinances();
  const [name, setName] = useState('');
  const [type, setType] = useState(initialType);
  const [error, setError] = useState('');
  const [nestedThemeColor, setNestedThemeColor] = useState(themeColor);

  useEffect(() => {
    setNestedThemeColor(type === 'EXPENSE' ? colors.expense : colors.income);
  }, [type]);

  const handleNameChange = useCallback((text) => {
    setName(text);
  }, []);

  const handleTypeChange = useCallback((newType) => {
    setType(newType);
  }, []);

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
      onDismiss();
      setName('');
      setError('');
    } catch (err) {
      setError('Erro ao criar categoria. Tente novamente.');
      console.error('Erro ao criar categoria:', err);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text variant="titleLarge" style={styles.title}>Nova Categoria</Text>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <SegmentedButtons
            value={type}
            onValueChange={(value) => {
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

            <Button
              mode="outlined"
              onPress={onDismiss}
              style={[styles.button, styles.cancelButton]}
              textColor={colors.text}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
});

AddCategoryModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
  initialType: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 16,
  },
  saveButton: {
    marginBottom: 8,
    borderRadius: 24,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: colors.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AddCategoryModal; 