import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Text, IconButton, TextInput, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import { currencyMask } from '../../../utils/masks';
import CustomPicker from '../../../components/CustomPicker';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TransactionDetailsModal = ({ visible, onDismiss, transaction, onUpdate, onDelete }) => {
    const { accounts, categories } = useFinances();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTransaction, setEditedTransaction] = useState(null);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showAccountPicker, setShowAccountPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const insets = useSafeAreaInsets();
    
    // Referência para o Modal
    const modalizeRef = useRef(null);
    
    // Abrir/fechar o modal baseado na prop visible
    useEffect(() => {
        if (visible && modalizeRef.current) {
            modalizeRef.current.open();
        } else if (!visible && modalizeRef.current) {
            modalizeRef.current.close();
        }
    }, [visible]);

    // Handle dismiss sem usar evento sintético diretamente
    const handleDismiss = useCallback(() => {
        onDismiss();
    }, [onDismiss]);

    useEffect(() => {
        if (transaction) {
            setEditedTransaction({
                ...transaction,
                amount: Number(transaction.amount),
                date: transaction.date,
                description: transaction.description || '',
                notes: transaction.notes || '',
                categoryId: Number(transaction.categoryId),
                accountId: Number(transaction.accountId),
            });
        }
    }, [transaction]);

    useEffect(() => {
        if (!visible) {
            setIsEditing(false);
        }
    }, [visible]);

    if (!transaction || !editedTransaction) return null;

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
            const updateData = {
                description: editedTransaction.description,
                amount: Number(editedTransaction.amount),
                date: new Date(editedTransaction.date).toISOString(),
                type: editedTransaction.type,
                isRecurring: Boolean(editedTransaction.isRecurring),
                categoryId: Number(editedTransaction.categoryId),
                accountId: Number(editedTransaction.accountId),
            };

            await onUpdate({
                id: transaction.id,
                ...updateData
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a transação. Tente novamente.');
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
                    onPress: () => {
                        try {
                            onDelete(transaction.id);
                            handleDismiss();
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

    const handleStartEditing = () => {
        setEditedTransaction({
            ...transaction,
            amount: Number(transaction.amount),
            date: transaction.date,
            description: transaction.description || '',
            notes: transaction.notes || '',
            categoryId: Number(transaction.categoryId),
            accountId: Number(transaction.accountId),
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedTransaction({
            ...transaction,
            amount: Number(transaction.amount),
            date: transaction.date,
            description: transaction.description || '',
            notes: transaction.notes || '',
            categoryId: Number(transaction.categoryId),
            accountId: Number(transaction.accountId),
        });
    };

    const renderField = (label, value, icon, editableField) => {
        if (isEditing && editableField) {
            if (editableField === 'categoryId') {
                return (
                    <View style={styles.detailRow}>
                        <CustomPicker
                            label="Categoria"
                            selectedValue={editedTransaction.categoryId}
                            onValueChange={(value) => setEditedTransaction(prev => ({ ...prev, categoryId: Number(value) }))}
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
                            onValueChange={(value) => setEditedTransaction(prev => ({ ...prev, accountId: Number(value) }))}
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
                                const dateEvent = event;
                                dateEvent.persist && dateEvent.persist();
                                
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
                        value={editableField === 'amount' 
                            ? currencyMask(((editedTransaction[editableField] || 0) * 100).toString()) 
                            : editedTransaction[editableField] || ''}
                        onChangeText={(text) => {
                            let newValue = text;
                            if (editableField === 'amount') {
                                newValue = text.replace(/[^0-9]/g, '');
                                setEditedTransaction(prev => ({
                                    ...prev,
                                    [editableField]: newValue ? parseFloat(newValue) / 100 : 0
                                }));
                            } else {
                                setEditedTransaction(prev => ({
                                    ...prev,
                                    [editableField]: text || ''
                                }));
                            }
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
                    <Icon name={icon} size={22} color={themeColor} />
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={styles.value}>{value}</Text>
            </View>
        );
    };

    const modalHeight = Dimensions.get('window').height * 0.85;

    return (
        <Portal>
            <Modalize
                ref={modalizeRef}
                modalHeight={modalHeight}
                threshold={100}
                velocity={840}
                closeOnOverlayTap={true}
                panGestureEnabled={true}
                withHandle={true}
                handlePosition="outside"
                onClose={handleDismiss}
                handleStyle={{ backgroundColor: themeColor, width: 50, height: 5 }}
                modalStyle={{
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
                overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
                adjustToContentHeight={false}
                HeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.headerActions}>
                            <IconButton
                                icon={isEditing ? "content-save" : "pencil"}
                                size={24}
                                iconColor={themeColor}
                                onPress={isEditing ? handleSave : handleStartEditing}
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
                        <Text variant="titleLarge" style={styles.title}>Detalhes da Transação</Text>
                        <View style={styles.actionSpace} />
                    </View>
                }
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.content}
                >
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.scrollContent, 
                            { paddingBottom: insets.bottom + 20 }
                        ]}
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

                        <Divider style={styles.divider} />

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
                                    onPress={handleCancel}
                                    style={styles.cancelButton}
                                >
                                    Cancelar
                                </Button>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modalize>
        </Portal>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 80,
    },
    actionSpace: {
        width: 80,
    },
    actionIcon: {
        marginLeft: -4,
    },
    title: {
        textAlign: 'center',
        color: colors.text,
        flex: 1,
        fontWeight: 'bold',
        fontSize: 18,
    },
    divider: {
        height: 1,
        backgroundColor: colors.outline,
        marginVertical: 24,
    },
    detailsContainer: {
        gap: 24,
        marginTop: 16,
    },
    detailRow: {
        minHeight: 54,
        justifyContent: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
    },
    label: {
        fontSize: 16,
        color: colors.text,
        opacity: 0.7,
    },
    value: {
        fontSize: 18,
        color: colors.text,
        paddingLeft: 32,
        marginTop: 6,
        fontWeight: '500',
    },
    buttonContainer: {
        marginVertical: 20,
        gap: 16,
    },
    input: {
        backgroundColor: colors.background,
        marginLeft: 32,
        marginTop: 4,
        height: 48,
        fontSize: 18,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 8,
        height: 54,
    },
    cancelButton: {
        borderColor: colors.text,
        borderWidth: 1.5,
        borderRadius: 12,
        backgroundColor: colors.surface,
        textColor: colors.text,
    },
});

export default TransactionDetailsModal; 