import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const dailyData = {
  '2024-12-01': { consumed: 3000, goal: 3500 },
  '2024-12-02': { consumed: 3500, goal: 3500 },
  '2024-12-03': { consumed: 2800, goal: 3500 },
  '2024-12-04': { consumed: 3000, goal: 3500 },
  '2024-12-05': { consumed: 3500, goal: 3500 },
  '2024-12-06': { consumed: 1500, goal: 3500 },
  '2024-12-07': { consumed: 2500, goal: 3500 },
  '2024-12-08': { consumed: 0, goal: 3500 },
  // Devamını sen ekleyebilirsin...
};

const getMonthDays = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export default function CustomCalendar() {
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState(11); // Aralık
  const [year, setYear] = useState(2024);

  useEffect(() => {
    const daysInMonth = getMonthDays(month, year);
    setDays(daysInMonth);
  }, [month, year]);

  const handleDayPress = (dateStr, data) => {
    if (data) {
      Alert.alert(
        `${dateStr} Detayları`,
        `İçilen: ${data.consumed}ml\nHedef: ${data.goal}ml\nTamamlanma: %${Math.round(
          (data.consumed / data.goal) * 100
        )}`
      );
    } else {
      Alert.alert(`${dateStr}`, 'Veri bulunamadı.');
    }
  };

  const renderDay = (day) => {
    const dateStr = `${day.getFullYear()}-${(day.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    const data = dailyData[dateStr];
    const progress = data ? data.consumed / data.goal : 0;

    return (
      <TouchableOpacity
        key={dateStr}
        style={styles.dayWrapper}
        onPress={() => handleDayPress(dateStr, data)}
      >
        <Progress.Circle
          progress={progress}
          size={36}
          thickness={3}
          showsText={true}
          formatText={() => `${day.getDate()}`}
          color="#2196f3"
          unfilledColor="#e0e0e0"
          borderWidth={0}
        />
      </TouchableOpacity>
    );
  };

  const getEmptyStartDays = () => {
    const firstDay = new Date(year, month, 1);
    let dayIndex = firstDay.getDay(); // 0 (Pazar) - 6 (Cumartesi)
    if (dayIndex === 0) dayIndex = 7; // Pazarı sona al
    return Array(dayIndex - 1).fill(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="water" size={24} color="#2196f3" />
        <Text style={styles.headerTitle}>History</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </View>

      <View style={styles.monthNav}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.monthText}>December 2024</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>

      <View style={styles.weekDaysRow}>
        {weekdays.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {getEmptyStartDays().map((_, index) => (
          <View key={`empty-${index}`} style={styles.dayWrapper} />
        ))}
        {days.map((day) => renderDay(day))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  weekDayText: {
    width: SCREEN_WIDTH / 7 - 8,
    textAlign: 'center',
    color: '#555',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dayWrapper: {
    width: SCREEN_WIDTH / 7 - 8,
    alignItems: 'center',
    marginVertical: 6,
  },
});
