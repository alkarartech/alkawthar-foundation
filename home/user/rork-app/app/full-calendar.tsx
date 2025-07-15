import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Clock,
  MapPin,
  Info
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import useGoogleCalendarEvents, { ProcessedEvent } from '@/hooks/useGoogleCalendarEvents';
import CalendarView from '@/components/CalendarView';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width >= 768;

export default function FullCalendarScreen() {
  const { events, loading, error } = useGoogleCalendarEvents();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showInfo, setShowInfo] = useState(false);

  const handleSyncCalendar = async () => {
    const icalUrl = 'https://calendar.google.com/calendar/ical/alkawtharfoundationbc%40gmail.com/public/basic.ics';
    
    if (Platform.OS === 'web') {
      // For web, open the iCal URL directly
      window.open(icalUrl, '_blank');
    } else {
      // For mobile, try to open with system calendar app
      try {
        const supported = await Linking.canOpenURL(icalUrl);
        if (supported) {
          await Linking.openURL(icalUrl);
        } else {
          Alert.alert(
            'Sync Calendar',
            'To sync with your iOS Calendar:\n\n1. Copy this URL: ' + icalUrl + '\n2. Open Settings > Calendar > Accounts\n3. Add Account > Other > Add Subscribed Calendar\n4. Paste the URL',
            [
              { text: 'Copy URL', onPress: () => {
                // In a real app, you'd use Clipboard API here
                Alert.alert('URL copied to clipboard');
              }},
              { text: 'OK' }
            ]
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to open calendar sync');
      }
    }
  };

  const getEventsForDate = (date: Date): ProcessedEvent[] => {
    return events.filter((event: ProcessedEvent) => {
      const eventDate = event.startDate;
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const todaysEvents = getEventsForDate(new Date());
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <SafeAreaView style={styles.container} edges={isDesktop ? [] : ['top']}>
      <Stack.Screen
        options={{
          title: 'Full Calendar',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={Colors.primary.green} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.headerButton}>
                <Info size={20} color={Colors.primary.green} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSyncCalendar} style={styles.headerButton}>
                <Download size={20} color={Colors.primary.green} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {showInfo && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Calendar Sync</Text>
            <Text style={styles.infoText}>
              Tap the download icon to sync this calendar with your device's calendar app.
              This will allow you to receive notifications and view events offline.
            </Text>
            <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.closeInfo}>
              <Text style={styles.closeInfoText}>Got it</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Calendar Navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
            <ChevronLeft size={20} color={Colors.primary.green} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
            <ChevronRight size={20} color={Colors.primary.green} />
          </TouchableOpacity>
        </View>

        {/* Embedded Google Calendar */}
        <View style={styles.calendarContainer}>
          <CalendarView style={styles.calendar} />
        </View>

        {/* Today's Events */}
        {todaysEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Events</Text>
            <View style={styles.eventsContainer}>
              {todaysEvents.map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard}>
                  <View style={styles.eventTime}>
                    <Clock size={16} color={Colors.primary.green} />
                    <Text style={styles.eventTimeText}>{event.time}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventLocation}>
                    <MapPin size={14} color={Colors.text.muted} />
                    <Text style={styles.eventLocationText}>{event.location}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.eventsContainer}>
            {events.slice(0, 5).map((event: ProcessedEvent) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => {
                  if (event.htmlLink && event.htmlLink !== '#') {
                    Linking.openURL(event.htmlLink);
                  }
                }}
              >
                <View style={styles.eventHeader}>
                  <View style={styles.eventDateBadge}>
                    <Text style={styles.eventDateText}>{event.date}</Text>
                  </View>
                  <View style={styles.eventTime}>
                    <Clock size={16} color={Colors.primary.green} />
                    <Text style={styles.eventTimeText}>{event.time}</Text>
                  </View>
                </View>
                
                <Text style={styles.eventTitle}>{event.title}</Text>
                
                <View style={styles.eventLocation}>
                  <MapPin size={14} color={Colors.text.muted} />
                  <Text style={styles.eventLocationText}>{event.location}</Text>
                </View>
                
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
                
                {event.htmlLink && event.htmlLink !== '#' && (
                  <View style={styles.eventLink}>
                    <ExternalLink size={14} color={Colors.primary.green} />
                    <Text style={styles.eventLinkText}>View in Google Calendar</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sync Instructions */}
        <View style={styles.syncSection}>
          <Text style={styles.syncTitle}>Sync with Your Calendar</Text>
          <Text style={styles.syncDescription}>
            Stay up to date with all mosque events by syncing our calendar with your device.
          </Text>
          <TouchableOpacity style={styles.syncButton} onPress={handleSyncCalendar}>
            <Download size={20} color={Colors.text.light} />
            <Text style={styles.syncButtonText}>Sync Calendar</Text>
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primary.lightGreen,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.green,
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
    lineHeight: 20,
    marginBottom: 12,
  },
  closeInfo: {
    alignSelf: 'flex-end',
  },
  closeInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.green,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.offWhite,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.light,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  calendarContainer: {
    height: isDesktop ? 500 : 400,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  calendar: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventDateBadge: {
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.light,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventTimeText: {
    fontSize: 14,
    color: Colors.primary.green,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  eventLocationText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
    marginBottom: 8,
  },
  eventLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventLinkText: {
    fontSize: 12,
    color: Colors.primary.green,
    fontWeight: '500',
  },
  syncSection: {
    margin: 16,
    padding: 20,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 12,
    alignItems: 'center',
  },
  syncTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  syncDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
  },
});