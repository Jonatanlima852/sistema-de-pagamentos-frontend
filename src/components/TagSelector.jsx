import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, TextInput, Chip, IconButton } from 'react-native-paper';
import { colors } from '../theme';

const TagSelector = ({ 
  selectedTags = [], 
  onTagsChange,
  availableTags = [],
  onCreateTag,
  themeColor = colors.primary,
  label = 'Tags'
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = async () => {
    if (!tagInput.trim()) return;
    
    // Verifica se a tag já existe nos disponíveis
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === tagInput.trim().toLowerCase()
    );
    
    if (existingTag) {
      // Se a tag já existe e não está selecionada, adiciona à seleção
      if (!selectedTags.some(tag => tag.id === existingTag.id)) {
        onTagsChange([...selectedTags, existingTag]);
      }
    } else {
      // Se a tag não existe, cria uma nova
      if (onCreateTag) {
        const newTag = await onCreateTag(tagInput.trim());
        if (newTag) {
          onTagsChange([...selectedTags, newTag]);
        }
      }
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tagId) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleSubmitEditing = (e) => {
    // Garantindo que o evento é persistido antes do processamento assíncrono
    if (e && e.persist) {
      e.persist();
    }
    handleAddTag();
  };

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>{label}</Text>
      
      <View style={[styles.inputContainer, { borderColor: themeColor }]}>
        <TextInput
          value={tagInput}
          onChangeText={setTagInput}
          placeholder="Digite uma tag e adicione"
          style={styles.input}
          dense
          mode="flat"
          onSubmitEditing={handleSubmitEditing}
          right={
            <TextInput.Icon
              icon="plus"
              color={themeColor}
              onPress={handleAddTag}
            />
          }
        />
      </View>
      
      {selectedTags.length > 0 && (
        <View style={styles.tagsContainer}>
          {selectedTags.map(tag => (
            <Chip
              key={tag.id}
              style={[styles.tagChip, { borderColor: themeColor }]}
              textStyle={{ color: themeColor }}
              onClose={() => handleRemoveTag(tag.id)}
              closeIconColor={themeColor}
            >
              {tag.name}
            </Chip>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    color: colors.text,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: 'transparent',
    height: 46,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tagChip: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});

export default TagSelector; 