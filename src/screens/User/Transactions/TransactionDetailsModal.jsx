import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, IconButton, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import { currencyMask } from '../../../utils/masks';
import CustomPicker from '../../../components/CustomPicker';
import CustomDatePicker from '../../../components/CustomDatePicker';

const TransactionDetailsModal = ({ visible, onDismiss, transaction, onUpdate, onDelete }) => {
    const { accounts, categories } = useFinances();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTransaction, setEditedTransaction] = useState(transaction);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showAccountPicker, setShowAccountPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    if (!transaction) return null;

    const themeColor = transaction.type.toUpperCase() === 'INCOME' ? colors.income : colors.expense;

    const getTransactionDetails = () => {
        const category = categories.find(cat => cat.id === transaction.categoryId);
        const account = accounts.find(acc => acc.id === transaction.accountId);
        return { category, account };
    };

    const { category, account } = getTransactionDetails();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleSave = async () => {
        try {
            await onUpdate(editedTransaction);
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    const getAccountDisplayValue = (accountId) => {
        return accounts.find(acc => acc.id === accountId)?.name;
    };

    const getCategoryDisplayValue = (categoryId) => {
        return categories.find(cat => cat.id === categoryId)?.name;
    };

    const handleDelete = () => {
        Alert.alert(
            'Excluir Transação',
            'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: async () => {
                        try {
                            await onDelete(transaction.id);
                            onDismiss();
                        } catch (error) {
                            console.error('Erro ao excluir transação:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a transação. Tente novamente.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const renderEditButton = () => (
        <IconButton
            icon={isEditing ? "content-save" : "pencil"}
            size={24}
            iconColor={themeColor}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            style={styles.editIcon}
        />
    );

    const renderField = (label, value, icon, editableField) => {
        if (isEditing && editableField) {
            if (editableField === 'categoryId') {
                return (
                    <View style={styles.detailRow}>
                        <CustomPicker
                            label="Categoria"
                            selectedValue={editedTransaction.categoryId}
                            onValueChange={(value) => setEditedTransaction(prev => ({ ...prev, categoryId: value }))}
                            items={categories}
                            placeholder="Selecione uma categoria"
                            showPicker={showCategoryPicker}
                            setShowPicker={setShowCategoryPicker}
                            themeColor={themeColor}
                            getDisplayValue={getCategoryDisplayValue}
                        />
                    </View>
                );
            }

            if (editableField === 'accountId') {
                return (
                    <View style={styles.detailRow}>
                        <CustomPicker
                            label="Conta"
                            selectedValue={editedTransaction.accountId}
                            onValueChange={(value) => setEditedTransaction(prev => ({ ...prev, accountId: value }))}
                            items={accounts}
                            placeholder="Selecione uma conta"
                            showPicker={showAccountPicker}
                            setShowPicker={setShowAccountPicker}
                            themeColor={themeColor}
                            getDisplayValue={getAccountDisplayValue}
                        />
                    </View>
                );
            }

            if (editableField === 'date') {
                return (
                    <View style={styles.detailRow}>
                        <CustomDatePicker
                            label="Data"
                            date={new Date(editedTransaction.date)}
                            showPicker={showDatePicker}
                            onPress={() => setShowDatePicker(true)}
                            onDateChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setEditedTransaction(prev => ({
                                        ...prev,
                                        date: selectedDate.toISOString(),
                                    }));
                                }
                            }}
                            themeColor={themeColor}
                            maximumDate={new Date()}
                        />
                    </View>
                );
            }

            return (
                <View style={styles.detailRow}>
                    <View style={styles.labelContainer}>
                        <Icon name={icon} size={20} color={themeColor} />
                        <Text style={styles.label}>{label}</Text>
                    </View>
                    <TextInput
                        value={editableField === 'amount' ? currencyMask(editedTransaction[editableField].toString()) : editedTransaction[editableField]}
                        onChangeText={(text) => {
                            let newValue = text;
                            if (editableField === 'amount') {
                                newValue = text.replace(/[^0-9]/g, '');
                            }
                            setEditedTransaction(prev => ({
                                ...prev,
                                [editableField]: editableField === 'amount' ? parseFloat(newValue) / 100 : text
                            }));
                        }}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={themeColor}
                        activeOutlineColor={themeColor}
                        keyboardType={editableField === 'amount' ? 'numeric' : 'default'}
                    />
                </View>
            );
        }

        return (
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <Icon name={icon} size={20} color={themeColor} />
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={styles.value}>{value}</Text>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onDismiss}
            animationType="slide"
            transparent={true}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <View style={styles.headerActions}>
                                <IconButton
                                    icon={isEditing ? "content-save" : "pencil"}
                                    size={24}
                                    iconColor={themeColor}
                                    onPress={isEditing ? handleSave : () => setIsEditing(true)}
                                    style={styles.actionIcon}
                                />
                                <IconButton
                                    icon="delete-outline"
                                    size={24}
                                    iconColor={colors.error}
                                    onPress={handleDelete}
                                    style={styles.actionIcon}
                                />
                            </View>
                            <Text variant="titleLarge" style={styles.title}>Detalhes</Text>
                            <IconButton
                                icon="close"
                                size={24}
                                onPress={onDismiss}
                                style={styles.closeIcon}
                            />
                        </View>

                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >

                            <View style={styles.detailsContainer}>
                                {renderField(
                                    'Valor',
                                    formatCurrency(transaction.amount),
                                    'cash',
                                    'amount'
                                )}

                                {renderField(
                                    'Descrição',
                                    transaction.description,
                                    'text-box-outline',
                                    'description'
                                )}

                                {renderField(
                                    'Data',
                                    formatDate(transaction.date),
                                    'calendar',
                                    'date'
                                )}

                                {category && renderField(
                                    'Categoria',
                                    category.name,
                                    'tag-outline',
                                    'categoryId'
                                )}

                                {account && renderField(
                                    'Conta',
                                    account.name,
                                    'bank-outline',
                                    'accountId'
                                )}

                                {transaction.notes && renderField(
                                    'Observações',
                                    transaction.notes,
                                    'note-text-outline',
                                    'notes'
                                )}
                            </View>

                            {isEditing && (
                                <View style={styles.buttonContainer}>
                                    <Button
                                        mode="contained"
                                        onPress={handleSave}
                                        style={[styles.button, { backgroundColor: themeColor }]}
                                    >
                                        Salvar Alterações
                                    </Button>
                                    <Button
                                        mode="outlined"
                                        onPress={() => {
                                            setIsEditing(false);
                                            setEditedTransaction(transaction);
                                        }}
                                        style={styles.cancelButton}
                                    >
                                        Cancelar
                                    </Button>
                                </View>
                            )}

                            {!isEditing && (
                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        onPress={onDismiss}
                                        style={({ pressed }) => [
                                            styles.closeButton,
                                            { backgroundColor: pressed ? `${themeColor}15` : 'transparent' }
                                        ]}
                                    >
                                        <Text style={[styles.closeButtonText, { color: themeColor }]}>Fechar</Text>
                                    </Pressable>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
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
        minHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: -8,
    },
    actionIcon: {
        marginLeft: -4,
    },
    title: {
        textAlign: 'center',
        color: colors.text,
        flex: 1,
    },
    closeIcon: {
        marginRight: 8,
    },
    editIcon: {
        marginLeft: -8,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: colors.outline,
        marginVertical: 24,
    },
    detailsContainer: {
        gap: 24,
    },
    detailRow: {
        minHeight: 54,
        justifyContent: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: colors.text,
        opacity: 0.7,
    },
    value: {
        fontSize: 16,
        color: colors.text,
        paddingLeft: 28,
        marginTop: 4,
    },
    buttonContainer: {
        marginTop: 32,
    },
    closeButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.background,
        marginLeft: 28,
        height: 40,
    },
    buttonContainer: {
        marginTop: 32,
        gap: 8,
    },
    button: {
        borderRadius: 8,
    },
    cancelButton: {
        borderColor: colors.text,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: colors.surface,
        textColor: colors.text,
    },
});

export default TransactionDetailsModal; 