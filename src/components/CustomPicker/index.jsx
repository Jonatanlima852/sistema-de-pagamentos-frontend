import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { List } from 'react-native-paper';
import { colors } from '../../theme';

const CustomPicker = ({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder,
  showPicker,
  setShowPicker,
  themeColor,
  getDisplayValue
}) => {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={[
            styles.pickerButton,
            { borderColor: themeColor }
          ]}
        >
          <Text style={[styles.pickerButtonText, { color: selectedValue ? colors.text : colors.placeholder }]}>
            {selectedValue ? getDisplayValue(selectedValue) : placeholder}
          </Text>
        </Pressable>

        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.iosPickerModal}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <Pressable
                  onPress={() => setShowPicker(false)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    { 
                      opacity: pressed ? 0.7 : 1,
                      borderWidth: 1,
                      borderColor: `${themeColor}50`,
                      borderRadius: 8,
                    }
                  ]}
                >
                  <Text style={[styles.closeButtonText, { color: themeColor }]}>
                    Fechar
                  </Text>
                </Pressable>
              </View>
              {items.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  onPress={() => {
                    onValueChange(item.id.toString());
                    setShowPicker(false);
                  }}
                  style={[
                    styles.iosPickerItem,
                    selectedValue === item.id.toString() && styles.iosPickerItemSelected
                  ]}
                  titleStyle={[
                    styles.iosPickerItemText,
                    selectedValue === item.id.toString() && { color: themeColor }
                  ]}
                  right={props => 
                    selectedValue === item.id.toString() && 
                    <List.Icon {...props} icon="check" color={themeColor} />
                  }
                />
              ))}
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Android Picker
  return (
    <View style={styles.pickerWrapper}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={[styles.pickerContainer, { borderColor: themeColor }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          mode="dropdown"
          dropdownIconColor={themeColor}
        >
          <Picker.Item
            enabled={false}
            label={placeholder}
            value=""
            color={colors.placeholder}
          />
          {items.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.name}
              value={item.id.toString()}
              color={themeColor}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    marginTop: 16,
    marginBottom: 0,
  },
  pickerLabel: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
    marginLeft: 4,
  },
  pickerButton: {
    borderWidth: 2,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  iosPickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosPickerContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  iosPickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iosPickerItemSelected: {
    backgroundColor: '#f0f0f0',
  },
  iosPickerItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  picker: {
    flex: 1,
    height: '100%',
    color: colors.text,
  },
});

export default CustomPicker; 