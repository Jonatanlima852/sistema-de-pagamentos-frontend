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
import { Text, IconButton, TextInput, Button, Divider, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import { currencyMask } from '../../../utils/masks';
import CustomPicker from '../../../components/CustomPicker';
import CustomDatePicker from '../../../components/CustomDatePicker';
import TagSelector from '../../../components/TagSelector';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TransactionDetailsModal = ({ visible, onDismiss, transaction, onUpdate, onDelete }) => {
    const { accounts, categories, tags, addTag } = useFinances();
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
                tags: transaction.tags || [],
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
                tags: editedTransaction.tags.map(tag => tag.id),
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
            tags: transaction.tags || [],
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
            tags: transaction.tags || [],
        });
    };

    // Função para atualizar as tags do editedTransaction
    const handleTagsChange = (newTags) => {
        setEditedTransaction(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    // Função para criar uma nova tag
    const handleCreateTag = async (name) => {
        try {
            return await addTag(name);
        } catch (error) {
            console.error('Erro ao criar tag:', error);
            Alert.alert('Erro', 'Não foi possível criar a tag');
            return null;
        }
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
                                // Garantindo que o evento é persistido
                                if (event && event.persist) {
                                    event.persist();
                                }
                                
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

            if (editableField === 'tags') {
                return (
                    <View style={styles.detailRow}>
                        <TagSelector
                            selectedTags={editedTransaction.tags}
                            onTagsChange={handleTagsChange}
                            availableTags={tags}
                            onCreateTag={handleCreateTag}
                            themeColor={themeColor}
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
                            if (editableField === 'amount') {
                                const numericValue = parseFloat(text.replace(/\D/g, '')) / 100;
                                setEditedTransaction(prev => ({
                                    ...prev,
                                    [editableField]: numericValue
                                }));
                            } else {
                                setEditedTransaction(prev => ({
                                    ...prev,
                                    [editableField]: text
                                }));
                            }
                        }}
                        keyboardType={editableField === 'amount' ? 'numeric' : 'default'}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={themeColor}
                        activeOutlineColor={themeColor}
                    />
                </View>
            );
        }

        if (editableField === 'tags') {
            return (
                <View style={styles.detailRow}>
                    <View style={styles.labelContainer}>
                        <Icon name={icon} size={20} color={themeColor} />
                        <Text style={styles.label}>{label}</Text>
                    </View>
                    <View style={styles.tagsContainer}>
                        {transaction.tags && transaction.tags.length > 0 ? (
                            transaction.tags.map(tag => (
                                <Chip
                                    key={tag.id}
                                    style={[styles.tagChip, { borderColor: themeColor }]}
                                    textStyle={{ color: themeColor }}
                                >
                                    {tag.name}
                                </Chip>
                            ))
                        ) : (
                            <Text style={styles.noTagsText}>Sem tags</Text>
                        )}
                    </View>
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

    const renderDetails = () => {
        return (
            <View style={styles.detailsContainer}>
                {renderField('Descrição', editedTransaction.description, 'text-subject', 'description')}
                {renderField('Valor', formatCurrency(transaction.amount), 'currency-usd', 'amount')}
                {renderField('Data', formatDate(transaction.date), 'calendar', 'date')}
                {renderField('Categoria', category?.name, 'shape-outline', 'categoryId')}
                {renderField('Conta', account?.name, 'bank-outline', 'accountId')}
                {renderField('Tags', '', 'tag-outline', 'tags')}
                {renderField('Observações', editedTransaction.notes, 'text-box-outline', 'notes')}
            </View>
        );
    };

    return (
        <Portal>
            <Modalize
                ref={modalizeRef}
                modalHeight={Dimensions.get('window').height * 0.85}
                threshold={100}
                velocity={840}
                closeOnOverlayTap={true}
                panGestureEnabled={true}
                withHandle={true}
                handlePosition="outside"
                onClose={handleDismiss}
                handleStyle={{ backgroundColor: themeColor, width: 50, height: 5, marginTop: 30 }}
                modalStyle={{
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
                overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
                adjustToContentHeight={false}
                HeaderComponent={
                    <View style={styles.modalHeader}>
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            onPress={isEditing ? handleCancel : handleDismiss}
                            style={styles.backButton}
                        />
                        <Text variant="titleLarge" style={styles.modalTitle}>
                            {isEditing ? 'Editar Transação' : 'Detalhes da Transação'}
                        </Text>
                        {!isEditing ? (
                            <IconButton
                                icon="pencil"
                                size={24}
                                onPress={handleStartEditing}
                                iconColor={themeColor}
                            />
                        ) : (
                            <IconButton
                                icon="content-save"
                                size={24}
                                onPress={handleSave}
                                iconColor={themeColor}
                            />
                        )}
                    </View>
                }
                FooterComponent={
                    <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
                        <Button
                            mode="contained"
                            onPress={handleDelete}
                            buttonColor={colors.error}
                            style={styles.deleteButton}
                        >
                            Excluir Transação
                        </Button>
                    </View>
                }
            >
                <ScrollView style={styles.content}>
                    {renderDetails()}
                </ScrollView>
            </Modalize>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    backButton: {
        marginRight: 16,
    },
    modalTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    detailsContainer: {
        marginTop: 20,
    },
    detailRow: {
        marginBottom: 24,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.text,
        opacity: 0.7,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    input: {
        backgroundColor: 'transparent',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.outline,
    },
    deleteButton: {
        borderRadius: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    noTagsText: {
        color: colors.placeholder,
        fontStyle: 'italic',
    },
});

export default TransactionDetailsModal; 