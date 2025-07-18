import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Dimensions, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/colors";
import useGoogleCalendarEvents, { ProcessedEvent } from "@/hooks/useGoogleCalendarEvents";
import { useRouter } from "expo-router";
import { Calendar, Clock, MapPin, ChevronRight, Download, ExternalLink, Bell, CalendarDays, List } from "lucide-react-native";
import WebViewWrapper from "@/components/WebViewWrapper";
import * as Notifications from 'expo-notifications';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width >= 768;

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function CalendarEventsScreen() {
  const { events, loading, error } = useGoogleCalendarEvents();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'month' | 'schedule'>('schedule');
  const [notificationPermission, setNotificationPermission] = useState<string | null>(null);

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotificationPermission(status);
      }
    };
    requestPermissions();
  }, []);

  const scheduleEventNotification = async (event: ProcessedEvent) => {
    if (Platform.OS === 'web' || notificationPermission !== 'granted') {
      Alert.alert(
        'Notifications',
        Platform.OS === 'web' 
          ? 'Notifications are not supported on web. Please use your calendar app to set reminders.'
          : 'Please enable notifications in your device settings to receive event reminders.'
      );
      return;
    }

    try {
      const notificationTime = new Date(event.startDate.getTime() - 30 * 60 * 1000); // 30 minutes before
      
      if (notificationTime > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Upcoming Event',
            body: `${event.title} starts in 30 minutes at ${event.location}`,
            data: { eventId: event.id },
          },
          trigger: notificationTime,
        });
        
        Alert.alert(
          'Notification Scheduled',
          `You'll receive a reminder 30 minutes before "${event.title}" starts.`
        );
      } else {
        Alert.alert('Event Time Passed', 'This event has already started or passed.');
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={isDesktop ? [] : ["top"]}>
      {!isDesktop && <AppHeader />}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Events & Calendar</Text>
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
        
        {/* Sync Buttons */}
        <View style={styles.syncButtonsContainer}>
          <TouchableOpacity 
            style={styles.syncButtonPrimary}
            onPress={() => {
              const icalUrl = "https://calendar.google.com/calendar/ical/alkawtharfoundationbc%40gmail.com/public/basic.ics";
              if (Platform.OS === 'web') {
                window.open(icalUrl, '_blank');
              } else {
                Linking.openURL(icalUrl);
              }
            }}
          >
            <Download size={20} color={Colors.text.light} />
            <Text style={styles.syncButtonPrimaryText}>Sync with iCal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.syncButtonSecondary}
            onPress={() => {
              const googleCalUrl = "https://calendar.google.com/calendar/u/0?cid=YWxrYXd0aGFyZm91bmRhdGlvbmJjQGdtYWlsLmNvbQ";
              if (Platform.OS === 'web') {
                window.open(googleCalUrl, '_blank');
              } else {
                Linking.openURL(googleCalUrl);
              }
            }}
          >
            <ExternalLink size={18} color={Colors.primary.green} />
            <Text style={styles.syncButtonSecondaryText}>Add to Google Calendar</Text>
          </TouchableOpacity>
        </View>
        
        {/* View Mode Toggle */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity 
            style={[styles.viewToggleButton, viewMode === 'month' && styles.viewToggleButtonActive]}
            onPress={() => setViewMode('month')}
          >
            <CalendarDays size={20} color={viewMode === 'month' ? Colors.text.light : Colors.primary.green} />
            <Text style={[styles.viewToggleText, viewMode === 'month' && styles.viewToggleTextActive]}>
              Month View
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.viewToggleButton, viewMode === 'schedule' && styles.viewToggleButtonActive]}
            onPress={() => setViewMode('schedule')}
          >
            <List size={20} color={viewMode === 'schedule' ? Colors.text.light : Colors.primary.green} />
            <Text style={[styles.viewToggleText, viewMode === 'schedule' && styles.viewToggleTextActive]}>
              Schedule View
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Calendar View */}
        {viewMode === 'month' && (
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>Monthly Calendar</Text>
            <View style={styles.agendaContainer}>
              <WebViewWrapper
                source={{ 
                  uri: "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FVancouver&showPrint=0&title=Al%20Kawthar%20Calendar&mode=MONTH&src=YWxrYXd0aGFyZm91bmRhdGlvbmJjQGdtYWlsLmNvbQ&src=ZW4uaXNsYW1pYyNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039be5&color=%234285f4"
                }}
                style={styles.agendaWebView}
              />
            </View>
          </View>
        )}
        
        {viewMode === 'schedule' && (
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>Schedule View</Text>
            <View style={styles.agendaContainer}>
              <WebViewWrapper
                source={{ 
                  uri: "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FVancouver&showPrint=0&title=Al%20Kawthar%20Calendar&mode=AGENDA&src=YWxrYXd0aGFyZm91bmRhdGlvbmJjQGdtYWlsLmNvbQ&src=ZW4uaXNsYW1pYyNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039be5&color=%234285f4"
                }}
                style={styles.agendaWebView}
              />
            </View>
          </View>
        )}
        
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
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {events.length === 0 ? (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No upcoming events at this time.</Text>
                <Text style={styles.noEventsSubtext}>Check back soon for new events!</Text>
              </View>
            ) : (
              events.map((event: ProcessedEvent) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => {
                    if (event.htmlLink && event.htmlLink !== '#') {
                      if (Platform.OS === 'web') {
                        window.open(event.htmlLink, '_blank');
                      } else {
                        Linking.openURL(event.htmlLink);
                      }
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
                      {event.location && (
                        <View style={styles.eventMetaRow}>
                          <MapPin size={16} color={Colors.text.muted} />
                          <Text style={styles.eventMetaText}>{event.location}</Text>
                        </View>
                      )}
                    </View>
                    
                    {event.description && (
                      <Text style={styles.eventDescription} numberOfLines={2}>
                        {event.description}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      style={styles.notificationButton}
                      onPress={() => scheduleEventNotification(event)}
                    >
                      <Bell size={16} color={Colors.primary.green} />
                    </TouchableOpacity>
                    <ChevronRight size={20} color={Colors.text.muted} />
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  syncButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  syncButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.green,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
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
  syncButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.light,
  },
  syncButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.offWhite,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.green,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  syncButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.green,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 12,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.primary.green,
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.green,
  },
  viewToggleTextActive: {
    color: Colors.text.light,
  },
  calendarSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
    paddingHorizontal: isDesktop ? 0 : 16,
  },
  agendaContainer: {
    height: isDesktop ? 500 : 400,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.offWhite,
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
  agendaWebView: {
    flex: 1,
    borderRadius: 12,
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
    marginBottom: 24,
  },
  noEventsContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: Colors.background.offWhite,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
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
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 12,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.background.offWhite,
  },

  infoSection: {
    padding: 16,
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