import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';

const DateSelector = ({ startDate, endDate, onSelectDates, onClear }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);

  const handleDayPress = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Selecionar data inicial
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else {
      // Selecionar data final
      setSelectedEndDate(day.dateString);
    }
  };

  const handleApply = () => {
    onSelectDates(selectedStartDate, selectedEndDate);
  };

  const markedDates = {};
  if (selectedStartDate) {
    markedDates[selectedStartDate] = { selected: true, startingDay: true, color: '#6200ea' };
  }
  if (selectedEndDate) {
    markedDates[selectedEndDate] = { selected: true, endingDay: true, color: '#6200ea' };
  }
  if (selectedStartDate && selectedEndDate) {
    let currentDate = selectedStartDate;
    while (currentDate !== selectedEndDate) {
      markedDates[currentDate] = { selected: true, color: '#c3aed6' };
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      currentDate = nextDay.toISOString().split('T')[0];
    }
    markedDates[selectedEndDate] = { selected: true, endingDay: true, color: '#6200ea' };
  }

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="period"
        style={styles.calendar}
      />
      <View style={styles.quickSelectButtons}>
        <Button
          mode="outlined"
          onPress={() => {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            setSelectedStartDate(todayString);
            setSelectedEndDate(null);
          }}
          style={styles.quickButton}
        >
          Hoje
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];
            setSelectedStartDate(yesterdayString);
            setSelectedEndDate(null);
          }}
          style={styles.quickButton}
        >
          Ontem
        </Button>
      </View>
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleApply}
          style={styles.applyButton}
        >
          Aplicar
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            onClear();
          }}
          style={styles.clearButton}
        >
          Limpar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  calendar: {
    marginBottom: 16,
  },
  quickSelectButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  applyButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#6200ea',
  },
  clearButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default DateSelector;