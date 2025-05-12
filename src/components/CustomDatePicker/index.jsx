import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../theme';

const CustomDatePicker = ({ 
  label, 
  date, 
  showPicker, 
  onPress, 
  onDateChange, 
  themeColor,
  maximumDate 
}) => {
  // Função que persiste o evento antes de chamar o callback
  const handleDateChange = (event, selectedDate) => {
    if (event && event.persist) {
      event.persist();
    }
    onDateChange(event, selectedDate);
  };

  return (
    <View style={styles.pickerWrapper}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.dateButton,
          {
            borderColor: themeColor,
            backgroundColor: pressed ? `${themeColor}30` : `${themeColor}15`,
          }
        ]}
      >
        <View style={styles.dateButtonContent}>
          <Text style={[styles.dateButtonText, { color: themeColor }]}>
            {date.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maximumDate}
        />
      )}
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
  dateButton: {
    borderWidth: 2,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomDatePicker; 