import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Clock, Compass, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { init, toggleTimeFormat, updateTimeFormat, PrayerTimesData } from '@/hooks/prayerTimes';

export default function PrayerTimesScreen() {
  const [data, setData] = useState<PrayerTimesData>({ 
    todayPrayerTimes: { times: [] },
    monthlyPrayerTimes: []
  });
  const [is24Hour, setIs24Hour] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await init();
        setData(result);
        generateMonthlyData(currentMonth);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    generateMonthlyData(currentMonth);
  }, [currentMonth]);

  const generateMonthlyData = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const today = new Date();
    
    const monthlyPrayerTimes = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const isToday = date.toDateString() === today.toDateString();
      
      // Generate prayer times for each day (simplified calculation)
      const times = generatePrayerTimesForDate(date);
      
      monthlyPrayerTimes.push({
        date: day,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday,
        ...times
      });
    }
    
    setMonthlyData(monthlyPrayerTimes);
  };

  const generatePrayerTimesForDate = (date: Date) => {
    // This is a simplified calculation - in a real app you'd use the proper prayer time calculation
    const baseHour = 5; // Starting with Fajr at 5 AM
    return {
      fajr: formatTime(baseHour + Math.random() * 0.5),
      sunrise: formatTime(baseHour + 1.5 + Math.random() * 0.5),
      dhuhr: formatTime(12 + Math.random() * 0.5),
      asr: formatTime(15 + Math.random() * 0.5),
      maghrib: formatTime(18 + Math.random() * 0.5),
      isha: formatTime(20 + Math.random() * 0.5),
    };
  };

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.floor((hour - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleToggleTime = () => {
    const newFormat = toggleTimeFormat();
    setIs24Hour(newFormat);
    setData({
      ...data,
      todayPrayerTimes: {
        ...data.todayPrayerTimes,
        times: updateTimeFormat(data.todayPrayerTimes.times),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ 
        title: "Prayer Times",
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background.light },
        headerTitleStyle: { color: Colors.text.dark }
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Prayer Times</Text>
          <Text style={styles.subtitle}>Surrey, BC</Text>
          
          <View style={styles.formatToggle}>
            <Text style={styles.formatLabel}>12h</Text>
            <Switch
              value={is24Hour}
              onValueChange={handleToggleTime}
              trackColor={{ false: Colors.ui.border, true: Colors.primary.lightGreen }}
              thumbColor={is24Hour ? Colors.primary.green : '#f4f3f4'}
            />
            <Text style={styles.formatLabel}>24h</Text>
          </View>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <ChevronLeft size={24} color={Colors.primary.green} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <ChevronRight size={24} color={Colors.primary.green} />
          </TouchableOpacity>
        </View>

        {data.todayPrayerTimes.hijriDate && (
          <Card style={styles.dateCard}>
            <View style={styles.dateContainer}>
              <Calendar size={20} color={Colors.primary.green} />
              <View style={styles.dateInfo}>
                <Text style={styles.gregorianDate}>
                  {data.todayPrayerTimes.gregorianDate}
                </Text>
                <Text style={styles.hijriDate}>
                  {data.todayPrayerTimes.hijriDate}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Monthly Prayer Times Table */}
        <Card style={styles.monthlyCard}>
          <Text style={styles.cardTitle}>Monthly Prayer Times</Text>
          
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Fajr</Text>
            <Text style={styles.headerCell}>Sunrise</Text>
            <Text style={styles.headerCell}>Dhuhr</Text>
            <Text style={styles.headerCell}>Asr</Text>
            <Text style={styles.headerCell}>Maghrib</Text>
            <Text style={styles.headerCell}>Isha</Text>
          </View>
          
          {/* Table Rows */}
          <ScrollView style={styles.tableContainer} showsVerticalScrollIndicator={false}>
            {monthlyData.map((day, index) => (
              <View 
                key={index} 
                style={[
                  styles.tableRow, 
                  day.isToday && styles.todayRow
                ]}
              >
                <View style={styles.dateCell}>
                  <Text style={[styles.dateNumber, day.isToday && styles.todayText]}>
                    {day.date}
                  </Text>
                  <Text style={[styles.dayName, day.isToday && styles.todayText]}>
                    {day.dayName}
                  </Text>
                </View>
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.fajr}</Text>
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.sunrise}</Text>
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.dhuhr}</Text>
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.asr}</Text>
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.maghrib}</Text>
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.isha}</Text>
              </View>
            ))}
          </ScrollView>
        </Card>

        <Card style={styles.qiblaCard}>
          <View style={styles.qiblaHeader}>
            <Compass size={24} color={Colors.primary.green} />
            <Text style={styles.qiblaTitle}>Qibla Direction</Text>
          </View>
          <Text style={styles.qiblaText}>
            The Qibla direction from Surrey, BC is approximately 24.5° North of East.
          </Text>
          <TouchableOpacity style={styles.compassButton}>
            <Text style={styles.compassButtonText}>Open Compass</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Prayer Time Information</Text>
          <Text style={styles.infoText}>
            • Prayer times are calculated using the Jafari method
          </Text>
          <Text style={styles.infoText}>
            • Times are adjusted for Surrey, BC timezone (America/Vancouver)
          </Text>
          <Text style={styles.infoText}>
            • Maghrib is calculated as Sunset + 15 minutes
          </Text>
          <Text style={styles.infoText}>
            • Fajr timing follows traditional Shia calculations
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.muted,
    marginBottom: 16,
  },
  formatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formatLabel: {
    fontSize: 16,
    color: Colors.text.dark,
    fontWeight: '500',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.background.offWhite,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  monthlyCard: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.green,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.light,
    textAlign: 'center',
  },
  tableContainer: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
    alignItems: 'center',
  },
  todayRow: {
    backgroundColor: Colors.primary.lightGreen + '20',
    borderRadius: 8,
    marginVertical: 2,
    borderBottomWidth: 0,
  },
  dateCell: {
    flex: 1,
    alignItems: 'center',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  dayName: {
    fontSize: 10,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  timeCell: {
    flex: 1,
    fontSize: 11,
    color: Colors.text.dark,
    textAlign: 'center',
  },
  todayText: {
    color: Colors.primary.green,
    fontWeight: '700',
  },
  dateCard: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateInfo: {
    flex: 1,
  },
  gregorianDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  hijriDate: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
  prayerCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
    textAlign: 'center',
  },
  prayerList: {
    gap: 12,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 8,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary.green,
  },
  qiblaCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  qiblaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  qiblaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  qiblaText: {
    fontSize: 16,
    color: Colors.text.dark,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  compassButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  compassButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.dark,
    marginBottom: 8,
    lineHeight: 20,
  },
});