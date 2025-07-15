import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/colors";
import useGoogleCalendarEvents from "@/hooks/useGoogleCalendarEvents";
import { useRouter } from "expo-router";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react-native";
import CalendarView from "@/components/CalendarView";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width >= 768;

export default function CalendarEventsScreen() {
  const { events, loading, error } = useGoogleCalendarEvents();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={isDesktop ? [] : ["top"]}>
      {!isDesktop && <AppHeader />}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Community Calendar & Events</Text>
            <TouchableOpacity 
              style={styles.calendarButton}
              onPress={() => router.push('/full-calendar')}
            >
              <Calendar size={24} color={Colors.primary.green} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Stay connected with our community events and programs
          </Text>
        </View>
        
        <View style={styles.calendarSection}>
          <CalendarView />
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.green} />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => {
                  if (event.htmlLink && event.htmlLink !== '#') {
                    router.push(event.htmlLink);
                  } else {
                    router.push(`/event/${event.id}`);
                  }
                }}
              >
                <View style={styles.eventDateContainer}>
                  <View style={styles.eventDateBox}>
                    <Text style={styles.eventDay}>{event.date.split(' ')[0]}</Text>
                    <Text style={styles.eventMonth}>{event.date.split(' ')[1]}</Text>
                  </View>
                </View>
                
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  
                  <View style={styles.eventMeta}>
                    <View style={styles.eventMetaRow}>
                      <Clock size={16} color={Colors.text.muted} />
                      <Text style={styles.eventMetaText}>{event.time}</Text>
                    </View>
                    <View style={styles.eventMetaRow}>
                      <MapPin size={16} color={Colors.text.muted} />
                      <Text style={styles.eventMetaText}>{event.location}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description}
                  </Text>
                </View>
                
                <View style={styles.eventArrow}>
                  <ChevronRight size={20} color={Colors.text.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>About Our Events</Text>
            <Text style={styles.infoText}>
              Al Kawthar Foundation hosts a variety of events throughout the year, including educational 
              programs, community gatherings, and special prayers. Many of our events are live-streamed 
              for those who cannot attend in person.
            </Text>
            <Text style={styles.infoText}>
              For more information about any event, please contact the mosque office or check our 
              YouTube channel for live streams and recordings.
            </Text>
          </View>
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
  calendarSection: {
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  calendarButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.muted,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.ui.error,
    textAlign: 'center',
  },
  eventsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  eventDateContainer: {
    width: 80,
    backgroundColor: Colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateBox: {
    alignItems: 'center',
    padding: 16,
  },
  eventDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
  },
  eventMonth: {
    fontSize: 14,
    color: Colors.text.light,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
    lineHeight: 22,
  },
  eventMeta: {
    marginBottom: 8,
    gap: 4,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventMetaText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
  },
  eventArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
  },
  infoSection: {
    padding: 16,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: Colors.background.offWhite,
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.dark,
    marginBottom: 12,
    lineHeight: 20,
  },
});