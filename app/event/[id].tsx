import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Colors from "@/constants/colors";
import useEvents, { Event } from "@/hooks/useEvents";
import { Calendar, Clock, MapPin } from "lucide-react-native";

const { width } = Dimensions.get('window');

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, loading } = useEvents();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (events.length > 0 && id) {
      const foundEvent = events.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [events, id]);

  const handleAddToCalendar = () => {
    if (Platform.OS === 'web') {
      alert('Calendar integration would be implemented here');
    } else {
      Alert.alert(
        'Add to Calendar',
        'Calendar integration would be implemented here',
        [{ text: 'OK' }]
      );
    }
  };

  const handleShareEvent = () => {
    if (Platform.OS === 'web') {
      alert('Event sharing would be implemented here');
    } else {
      Alert.alert(
        'Share Event',
        'Event sharing would be implemented here',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Event Details" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.green} />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Event Details" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <Button 
            title="Go Back to Events" 
            onPress={() => router.push('/calendar-events')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Event Details" showBackButton />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Calendar size={18} color={Colors.primary.green} />
              <Text style={styles.detailText}>{event.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={18} color={Colors.primary.green} />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={18} color={Colors.primary.green} />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
          </View>
        </View>
        
        <Card style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Card>
        
        {event.youtubeId && (
          <Card style={styles.videoCard}>
            <Text style={styles.videoTitle}>Event Live Stream</Text>
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>YouTube Video</Text>
                <Text style={styles.videoPlaceholderSubtext}>
                  YouTube video would be embedded here
                </Text>
              </View>
            </View>
          </Card>
        )}
        
        <View style={styles.actionsContainer}>
          <Button 
            title="Add to Calendar" 
            onPress={handleAddToCalendar}
            style={styles.actionButton}
          />
          
          <Button 
            title="Share Event" 
            variant="outline"
            onPress={handleShareEvent}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Additional Information</Text>
          <Text style={styles.infoText}>
            • Please arrive 15 minutes before the event starts.
          </Text>
          <Text style={styles.infoText}>
            • Parking is available in the mosque parking lot.
          </Text>
          <Text style={styles.infoText}>
            • For questions about this event, please contact the mosque office.
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.muted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.ui.error,
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 8,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.dark,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text.dark,
    lineHeight: 24,
  },
  videoCard: {
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  videoContainer: {
    width: '100%',
    height: width * 0.5625, // 16:9 aspect ratio
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  videoPlaceholderSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
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