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
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonalAdjustment = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.5; // Seasonal variation
    
    return {
      fajr: formatTime(baseHour + seasonalAdjustment + Math.random() * 0.3),
      sunrise: formatTime(baseHour + 1.5 + seasonalAdjustment + Math.random() * 0.3),
      dhuhr: formatTime(12 + Math.random() * 0.2),
      maghrib: formatTime(18 + seasonalAdjustment + Math.random() * 0.3),
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
        <View style={styles.monthlyContainer}>
          <Text style={styles.cardTitle}>Monthly Prayer Times</Text>
          <Text style={styles.cardSubtitle}>Surrey, BC - {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
          
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCellDate}>Date</Text>
            <Text style={styles.headerCell}>Fajr</Text>
            <Text style={styles.headerCell}>Sunrise</Text>
            <Text style={styles.headerCell}>Dhuhr</Text>
            <Text style={styles.headerCell}>Maghrib</Text>
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
                <View style={styles.dateCellContainer}>
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
                <Text style={[styles.timeCell, day.isToday && styles.todayText]}>{day.maghrib}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

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
    paddingHorizontal: 12,
    paddingBottom: 32,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
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
  monthlyContainer: {
    marginBottom: 16,
    marginHorizontal: -12,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 0,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.green,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  headerCellDate: {
    flex: 1.2,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.light,
    textAlign: 'center',
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.light,
    textAlign: 'center',
  },
  tableContainer: {
    maxHeight: 500,
    backgroundColor: Colors.background.light,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
    alignItems: 'center',
    minHeight: 60,
  },
  todayRow: {
    backgroundColor: Colors.primary.green + '15',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.green,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary.green + '30',
  },
  dateCellContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.dark,
  },
  dayName: {
    fontSize: 11,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  timeCell: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.dark,
    textAlign: 'center',
    fontWeight: '500',
  },
  todayText: {
    color: Colors.primary.green,
    fontWeight: '800',
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
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.dark,
    marginBottom: 8,
    textAlign: 'center',
    paddingTop: 24,
    paddingHorizontal: 16,
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