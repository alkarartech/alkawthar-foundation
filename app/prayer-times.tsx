import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Clock, Compass, Calendar } from 'lucide-react-native';
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

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await init();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
          <Text style={styles.subtitle}>Surrey, BC - Today</Text>
          
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

        <Card style={styles.prayerCard}>
          <Text style={styles.cardTitle}>Today's Prayer Times</Text>
          <View style={styles.prayerList}>
            {data.todayPrayerTimes.times.map((prayer, index) => (
              <View key={index} style={styles.prayerRow}>
                <Text style={styles.prayerName}>{prayer.label}</Text>
                <Text style={styles.prayerTime}>{prayer.value}</Text>
              </View>
            ))}
          </View>
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