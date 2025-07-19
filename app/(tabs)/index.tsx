import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "@/components/Banner";
import AppHeader from "@/components/AppHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useState, useEffect } from "react";
import { init, toggleTimeFormat, updateTimeFormat, PrayerTimesData } from "@/hooks/prayerTimes";
import { Calendar, Clock, MapPin, ChevronRight, X } from "lucide-react-native";
import WebViewWrapper from "@/components/WebViewWrapper";
import useGoogleCalendarEvents from "@/hooks/useGoogleCalendarEvents";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width >= 768;

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<PrayerTimesData>({ 
    todayPrayerTimes: { times: [] },
    monthlyPrayerTimes: []
  });
  const [is24Hour, setIs24Hour] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState('');
  const { events: calendarEvents, loading: eventsLoading } = useGoogleCalendarEvents();

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
    
    // Filter to only show Fajr, Sunrise, Dhuhr, Maghrib
    const relevantPrayers = data.todayPrayerTimes.times.filter(prayer => 
      ['Fajr', 'Sunrise', 'Dhuhr', 'Maghrib'].includes(prayer.label)
    );
    
    for (let i = 0; i < relevantPrayers.length; i++) {
      const prayer = relevantPrayers[i];
      try {
        const [time, period] = prayer.value.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let prayerMinutes = hours * 60 + minutes;
        if (period === 'PM' && hours !== 12) prayerMinutes += 12 * 60;
        if (period === 'AM' && hours === 12) prayerMinutes = minutes;
        
        if (prayerMinutes > currentMinutes) {
          const minutesUntil = prayerMinutes - currentMinutes;
          return {
            name: prayer.label,
            time: prayer.value,
            minutesUntil
          };
        }
      } catch (error) {
        console.error('Error parsing prayer time:', error);
      }
    }
    
    // If no prayer found today, return first prayer of tomorrow
    const firstPrayer = relevantPrayers[0];
    if (firstPrayer) {
      try {
        const [time, period] = firstPrayer.value.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let prayerMinutes = hours * 60 + minutes;
        if (period === 'PM' && hours !== 12) prayerMinutes += 12 * 60;
        if (period === 'AM' && hours === 12) prayerMinutes = minutes;
        
        const minutesUntil = (24 * 60) - currentMinutes + prayerMinutes;
        return {
          name: firstPrayer.label,
          time: firstPrayer.value,
          minutesUntil
        };
      } catch (error) {
        console.error('Error parsing prayer time:', error);
      }
    }
    
    return null;
  })();
  
  // Update countdown every minute
  useEffect(() => {
    const updateCountdown = () => {
      if (nextPrayer) {
        const hours = Math.floor(nextPrayer.minutesUntil / 60);
        const minutes = nextPrayer.minutesUntil % 60;
        if (hours > 0) {
          setNextPrayerCountdown(`in ${hours}h ${minutes}m`);
        } else {
          setNextPrayerCountdown(`in ${minutes}m`);
        }
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [nextPrayer]);

  // Get next 3 upcoming events from Google Calendar
  const upcomingEvents = calendarEvents.slice(0, 3).map(event => {
    const [day, month] = event.date.split(' ');
    return {
      id: event.id,
      title: event.title,
      date: day,
      month: month,
      time: event.time,
      location: event.location,
    };
  });

  const handleDonate = () => {
    setShowDonationModal(true);
  };

  // Slideshow images
  const bannerImages = [
    "https://i.ytimg.com/vi/_Jr9_TNyPmI/maxresdefault.jpg",
    "https://i.ytimg.com/vi/3OJw68SfDg4/maxresdefault.jpg",
    "https://cdnarchitect.s3.ca-central-1.amazonaws.com/2024/07/03162500/01-1024x512.jpg"
  ];

  return (
    <SafeAreaView style={styles.container} edges={isDesktop ? [] : ["top"]}>
      {!isDesktop && <AppHeader />}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner
          title="Welcome to Al Kawthar Foundation"
          subtitle="A center for spiritual growth and community"
          images={bannerImages}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prayer Times</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push("/prayer-times")}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={Colors.primary.green} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.nextPrayerCard}
            onPress={() => setShowPrayerModal(true)}
          >
            {nextPrayer ? (
              <>
                <View style={styles.nextPrayerHeader}>
                  <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
                  <Clock size={20} color={Colors.primary.green} />
                </View>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
                <Text style={styles.nextPrayerCountdown}>{nextPrayerCountdown}</Text>
              </>
            ) : (
              <Text style={styles.nextPrayerName}>Prayer times loading...</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.donateSection}>
          <TouchableOpacity 
            style={styles.donateButton} 
            onPress={handleDonate}
          >
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
          
          {/* Donation Thermometer */}
          <View style={styles.thermometerContainer}>
            <WebViewWrapper
              source={{ uri: "https://www.zeffy.com/embed/thermometer/donate-to-contribute-to-the-new-mosque-2" }}
              style={styles.thermometer}
            />
          </View>
          
          {/* Mission Statement - moved closer to donation */}
          <View style={styles.missionContainer}>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              Al Kawthar Foundation is dedicated to fostering a vibrant Muslim community in Surrey, BC,
              through spiritual growth, education, and community engagement, guided by Islamic values of
              compassion and unity.
            </Text>
          </View>
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

          {eventsLoading ? (
            <Card style={styles.loadingCard}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </Card>
          ) : upcomingEvents.length > 0 ? (
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
          ) : (
            <Card style={styles.noEventsCard}>
              <Text style={styles.noEventsText}>No upcoming events</Text>
            </Card>
          )}
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

      {/* Donation Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showDonationModal}
        onRequestClose={() => setShowDonationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Donate</Text>
            <TouchableOpacity
              onPress={() => setShowDonationModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.text.dark} />
            </TouchableOpacity>
          </View>
          <WebViewWrapper
            source={{ uri: "https://www.zeffy.com/embed/donation-form/donate-to-contribute-to-the-new-mosque-2?modal=true" }}
            style={styles.webview}
          />
        </SafeAreaView>
      </Modal>
      
      {/* Prayer Times Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPrayerModal}
        onRequestClose={() => setShowPrayerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.prayerModalContainer}>
            <View style={styles.prayerModalHeader}>
              <Text style={styles.prayerModalTitle}>Today's Prayer Times</Text>
              <TouchableOpacity
                onPress={() => setShowPrayerModal(false)}
                style={styles.prayerCloseButton}
              >
                <X size={24} color={Colors.text.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.prayerModalContent}>
              {data.todayPrayerTimes?.times?.filter(prayer => 
                ['Fajr', 'Sunrise', 'Dhuhr', 'Maghrib'].includes(prayer.label)
              ).map((prayer, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.prayerModalItem,
                    nextPrayer?.name === prayer.label && styles.prayerModalItemActive
                  ]}
                >
                  <Text style={[
                    styles.prayerModalName,
                    nextPrayer?.name === prayer.label && styles.prayerModalNameActive
                  ]}>
                    {prayer.label}
                  </Text>
                  <Text style={[
                    styles.prayerModalTime,
                    nextPrayer?.name === prayer.label && styles.prayerModalTimeActive
                  ]}>
                    {prayer.value}
                  </Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.viewFullTimesButton}
              onPress={() => {
                setShowPrayerModal(false);
                router.push('/prayer-times');
              }}
            >
              <Text style={styles.viewFullTimesText}>View Full Prayer Times</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  thermometerContainer: {
    marginTop: 16,
    width: "100%",
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
  },
  missionContainer: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  thermometer: {
    flex: 1,
  },
  donateButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  donateButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.light,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  section: {
    padding: 16,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary.green,
    marginBottom: 8,
    textAlign: "center",
  },
  missionText: {
    fontSize: 14,
    lineHeight: 20,
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
  nextPrayerCard: {
    backgroundColor: Colors.background.light,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  nextPrayerName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  nextPrayerTime: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  nextPrayerCountdown: {
    fontSize: 16,
    color: Colors.text.muted,
    fontWeight: '500',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  closeButton: {
    padding: 4,
  },
  loadingCard: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  noEventsCard: {
    padding: 20,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  prayerModalContainer: {
    backgroundColor: Colors.background.light,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  prayerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  prayerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  prayerCloseButton: {
    padding: 4,
  },
  prayerModalContent: {
    padding: 20,
  },
  prayerModalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 12,
  },
  prayerModalItemActive: {
    backgroundColor: Colors.primary.green,
  },
  prayerModalName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  prayerModalNameActive: {
    color: Colors.text.light,
  },
  prayerModalTime: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.dark,
  },
  prayerModalTimeActive: {
    color: Colors.text.light,
  },
  viewFullTimesButton: {
    margin: 20,
    marginTop: 0,
    backgroundColor: Colors.primary.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewFullTimesText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
  },
  webview: {
    flex: 1,
  },
});