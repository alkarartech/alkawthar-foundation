import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "@/components/Banner";
import AppHeader from "@/components/AppHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useState, useEffect } from "react";
import { init, toggleTimeFormat, updateTimeFormat, PrayerTimesData } from "@/hooks/prayerTimes";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react-native";

// Web-compatible WebView component
const WebViewComponent = Platform.select({
  web: ({ source, style }: { source: { uri: string }, style: any }) => (
    <iframe 
      src={source.uri} 
      style={{ 
        width: '100%', 
        height: '100%', 
        border: 'none',
        ...style 
      }} 
    />
  ),
  default: () => {
    try {
      const { WebView } = require('react-native-webview');
      return WebView;
    } catch {
      return ({ source, style }: { source: { uri: string }, style: any }) => (
        <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
          <Text>WebView not available on this platform</Text>
          <TouchableOpacity onPress={() => {
            if (Platform.OS === 'web') {
              window.open(source.uri, '_blank');
            }
          }}>
            <Text style={{ color: Colors.primary.green, textDecorationLine: 'underline' }}>
              Open in browser
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
});

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<PrayerTimesData>({ 
    todayPrayerTimes: { times: [] },
    monthlyPrayerTimes: []
  });
  const [is24Hour, setIs24Hour] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await init();
        setData(result);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    }
    fetchData();
  }, []);

  const handleToggleTime = () => {
    setIs24Hour(toggleTimeFormat());
    setData({
      ...data,
      todayPrayerTimes: {
        ...data.todayPrayerTimes,
        times: updateTimeFormat(data.todayPrayerTimes.times),
      },
      monthlyPrayerTimes: data.monthlyPrayerTimes?.map((row) => ({
        ...row,
        imsak: convertTimeFormat(row.imsak),
        fajr: convertTimeFormat(row.fajr),
        sunrise: convertTimeFormat(row.sunrise),
        dhuhr: convertTimeFormat(row.dhuhr),
        sunset: convertTimeFormat(row.sunset),
        maghrib: convertTimeFormat(row.maghrib),
      })),
    });
  };

  // Helper function for time conversion
  const convertTimeFormat = (timeStr: string) => {
    // Simple time format conversion - in a real app this would be more sophisticated
    return timeStr;
  };

  // Find the next prayer time
  const nextPrayer = (() => {
    if (!data.todayPrayerTimes?.times?.length) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerTimes = data.todayPrayerTimes.times;
    for (let i = 0; i < prayerTimes.length; i++) {
      // Simple time comparison - in a real app this would be more sophisticated
      const prayerTime = prayerTimes[i];
      return {
        name: prayerTime.label,
        adhan: prayerTime.value,
        iqamah: prayerTime.value, // Adjust if iqamah times are available separately
      };
    }
    return null;
  })();

  const upcomingEvents = [
    {
      id: '1',
      title: 'Friday Prayer & Sermon',
      date: '15',
      month: 'Jul',
      time: '1:00 PM',
      location: 'Main Prayer Hall',
    },
    {
      id: '2',
      title: 'Islamic Studies Class',
      date: '16',
      month: 'Jul',
      time: '7:00 PM',
      location: 'Education Room',
    },
    {
      id: '3',
      title: 'Community Iftar',
      date: '20',
      month: 'Jul',
      time: '8:00 PM',
      location: 'Community Hall',
    },
  ];

  const handleDonate = () => {
    setShowDonationModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner
          title="Welcome to Al Kawthar Foundation"
          subtitle="A center for spiritual growth and community"
          imageUrl="https://cdnarchitect.s3.ca-central-1.amazonaws.com/2024/07/03162500/01-1024x512.jpg"
        />

        <View style={styles.donateSection}>
          <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            Al Kawthar Foundation is dedicated to fostering a vibrant Muslim community in Surrey, BC,
            through spiritual growth, education, and community engagement, guided by Islamic values of
            compassion and unity.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Prayer</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push("/resources")}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={Colors.primary.green} />
            </TouchableOpacity>
          </View>

          {nextPrayer && (
            <Card style={styles.prayerCard}>
              <View style={styles.prayerContent}>
                <Text style={styles.prayerName}>{nextPrayer.name}</Text>
                <View style={styles.prayerTimes}>
                  <View style={styles.prayerTimeBlock}>
                    <Text style={styles.prayerTimeLabel}>Adhan</Text>
                    <Text style={styles.prayerTime}>{nextPrayer.adhan}</Text>
                  </View>
                  <View style={styles.prayerTimeBlock}>
                    <Text style={styles.prayerTimeLabel}>Iqamah</Text>
                    <Text style={styles.prayerTime}>{nextPrayer.iqamah}</Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push("/calendar-events")}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={Colors.primary.green} />
            </TouchableOpacity>
          </View>

          <View style={styles.eventsContainer}>
            {upcomingEvents.map((event) => (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventItem}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>{event.date}</Text>
                  <Text style={styles.eventMonth}>{event.month}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventMeta}>
                    <View style={styles.eventMetaItem}>
                      <Clock size={14} color={Colors.text.muted} />
                      <Text style={styles.eventMetaText}>{event.time}</Text>
                    </View>
                    <View style={styles.eventMetaItem}>
                      <MapPin size={14} color={Colors.text.muted} />
                      <Text style={styles.eventMetaText}>{event.location}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.text.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Card style={styles.servicesCard}>
            <Text style={styles.servicesTitle}>Our Services</Text>
            <View style={styles.servicesList}>
              <View style={styles.serviceItem}>
                <View style={styles.serviceDot} />
                <Text style={styles.serviceText}>Daily Prayer Services</Text>
              </View>
              <View style={styles.serviceItem}>
                <View style={styles.serviceDot} />
                <Text style={styles.serviceText}>Islamic Education Classes</Text>
              </View>
              <View style={styles.serviceItem}>
                <View style={styles.serviceDot} />
                <Text style={styles.serviceText}>Youth Programs</Text>
              </View>
              <View style={styles.serviceItem}>
                <View style={styles.serviceDot} />
                <Text style={styles.serviceText}>Community Events</Text>
              </View>
              <View style={styles.serviceItem}>
                <View style={styles.serviceDot} />
                <Text style={styles.serviceText}>Marriage Services</Text>
              </View>
              <View style={styles.serviceItem}>
                <View style={styles.serviceDot} />
                <Text style={styles.serviceText}>Funeral Services</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2015 Al Kawthar Foundation</Text>
          <Text style={styles.footerText}>Surrey, BC, Canada</Text>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showDonationModal}
        onRequestClose={() => setShowDonationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowDonationModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <WebViewComponent
            source={{ uri: "https://www.zeffy.com/en-US/donation-form/donate-to-contribute-to-the-new-mosque" }}
            style={styles.webview}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  donateSection: {
    padding: 16,
    alignItems: "center",
  },
  donateButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.light,
    textAlign: "center",
  },
  section: {
    padding: 16,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary.green,
    marginBottom: 8,
    textAlign: "center",
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.dark,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.dark,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary.green,
    fontWeight: "500",
  },
  prayerCard: {
    backgroundColor: Colors.primary.green,
  },
  prayerContent: {
    alignItems: "center",
  },
  prayerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.light,
    marginBottom: 12,
  },
  prayerTimes: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  prayerTimeBlock: {
    alignItems: "center",
  },
  prayerTimeLabel: {
    fontSize: 14,
    color: Colors.primary.lightGold,
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.light,
  },
  eventsContainer: {
    gap: 12,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  eventDate: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary.green,
    borderRadius: 8,
    width: 50,
    height: 50,
    marginRight: 16,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.light,
  },
  eventMonth: {
    fontSize: 12,
    color: Colors.text.light,
    textTransform: "uppercase",
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.dark,
    marginBottom: 4,
  },
  eventMeta: {
    gap: 8,
  },
  eventMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventMetaText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  servicesCard: {
    backgroundColor: Colors.primary.green,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.light,
    marginBottom: 16,
    textAlign: "center",
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.gold,
    marginRight: 12,
  },
  serviceText: {
    fontSize: 16,
    color: Colors.text.light,
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.background.offWhite,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  modalHeader: {
    padding: 16,
    backgroundColor: Colors.background.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.text.muted,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.primary.green,
    fontWeight: "600",
  },
  webview: {
    flex: 1,
  },
});