import { StyleSheet, Text, View, ScrollView, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { Linking } from "react-native";

const { width } = Dimensions.get('window');

export default function WatchScreen() {
  const handleOpenYouTube = async () => {
    const youtubeUrl = "https://www.youtube.com/@AlKawtharIslamicAssociation";
    
    try {
      const supported = await Linking.canOpenURL(youtubeUrl);
      if (supported) {
        await Linking.openURL(youtubeUrl);
      } else {
        if (Platform.OS === 'web') {
          window.open(youtubeUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Error opening YouTube link:', error);
    }
  };

  const handleWatchLive = async () => {
    // In a real implementation, this would check for live streams
    const liveUrl = "https://www.youtube.com/@AlKawtharIslamicAssociation/live";
    
    try {
      const supported = await Linking.canOpenURL(liveUrl);
      if (supported) {
        await Linking.openURL(liveUrl);
      } else {
        if (Platform.OS === 'web') {
          window.open(liveUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Error opening live stream:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Watch Our Programs</Text>
        <Text style={styles.subtitle}>
          Join us live or watch recordings of our Islamic programs and events
        </Text>

        <Card style={styles.liveCard}>
          <Text style={styles.liveTitle}>🔴 Live Stream</Text>
          <Text style={styles.liveDescription}>
            Watch our live prayers, lectures, and special events as they happen.
          </Text>
          <Button 
            title="Watch Live Now"
            onPress={handleWatchLive}
            style={styles.liveButton}
          />
        </Card>

        <Card style={styles.videoCard}>
          <Text style={styles.videoTitle}>Featured Video</Text>
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>YouTube Video Player</Text>
              <Text style={styles.videoPlaceholderSubtext}>
                Latest sermon or program would be embedded here
              </Text>
            </View>
          </View>
          <Text style={styles.videoDescription}>
            Watch our latest Friday sermon and Islamic teachings.
          </Text>
        </Card>

        <View style={styles.programsSection}>
          <Text style={styles.sectionTitle}>Our Programs</Text>
          
          <Card style={styles.programCard}>
            <Text style={styles.programTitle}>Friday Sermons</Text>
            <Text style={styles.programTime}>Every Friday at 1:00 PM</Text>
            <Text style={styles.programDescription}>
              Weekly Friday prayers with inspiring sermons and community gathering.
            </Text>
          </Card>

          <Card style={styles.programCard}>
            <Text style={styles.programTitle}>Islamic Studies Classes</Text>
            <Text style={styles.programTime}>Saturdays at 7:00 PM</Text>
            <Text style={styles.programDescription}>
              Learn about Islamic jurisprudence, history, and spiritual development.
            </Text>
          </Card>

          <Card style={styles.programCard}>
            <Text style={styles.programTitle}>Youth Programs</Text>
            <Text style={styles.programTime}>Sundays at 2:00 PM</Text>
            <Text style={styles.programDescription}>
              Engaging programs designed for young Muslims to learn and connect.
            </Text>
          </Card>

          <Card style={styles.programCard}>
            <Text style={styles.programTitle}>Special Events</Text>
            <Text style={styles.programTime}>Various times</Text>
            <Text style={styles.programDescription}>
              Eid celebrations, Ramadan programs, and community gatherings.
            </Text>
          </Card>
        </View>

        <Card style={styles.channelCard}>
          <Text style={styles.channelTitle}>Al Kawthar Islamic Association</Text>
          <Text style={styles.channelDescription}>
            Subscribe to our YouTube channel to never miss our programs and get notified 
            when we go live for prayers and special events.
          </Text>
          <Button 
            title="Visit Our YouTube Channel"
            variant="outline"
            onPress={handleOpenYouTube}
            style={styles.channelButton}
          />
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Streaming Information</Text>
          <Text style={styles.infoText}>
            • All programs are streamed live on our YouTube channel
          </Text>
          <Text style={styles.infoText}>
            • Recordings are available after each live session
          </Text>
          <Text style={styles.infoText}>
            • Subscribe and turn on notifications to get alerts for live streams
          </Text>
          <Text style={styles.infoText}>
            • For technical issues during live streams, please contact our office
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
    marginBottom: 24,
    textAlign: 'center',
  },
  liveCard: {
    marginBottom: 16,
    backgroundColor: Colors.primary.green,
  },
  liveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 8,
    textAlign: 'center',
  },
  liveDescription: {
    fontSize: 16,
    color: Colors.text.light,
    marginBottom: 16,
    textAlign: 'center',
  },
  liveButton: {
    backgroundColor: Colors.primary.gold,
  },
  videoCard: {
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    height: width * 0.5625, // 16:9 aspect ratio
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
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
    textAlign: 'center',
  },
  videoDescription: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  programsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  programCard: {
    marginBottom: 12,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  programTime: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    lineHeight: 20,
  },
  channelCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
    textAlign: 'center',
  },
  channelDescription: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  channelButton: {
    marginTop: 8,
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