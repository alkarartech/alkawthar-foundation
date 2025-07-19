import { StyleSheet, Text, View, ScrollView, Dimensions, Platform, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, ExternalLink, Calendar } from "lucide-react-native";
import AppHeader from "@/components/AppHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import WebViewWrapper from "@/components/WebViewWrapper";
import Colors from "@/constants/colors";
import { Linking } from "react-native";
import useYouTubeStreams from "@/hooks/useYouTubeStreams";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width >= 768;

export default function WatchScreen() {
  const { videos, liveStream, loading, error } = useYouTubeStreams();

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

  const handleOpenVideo = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        if (Platform.OS === 'web') {
          window.open(url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={isDesktop ? [] : ["top"]}>
      {!isDesktop && <AppHeader />}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Watch Our Programs</Text>
        <Text style={styles.subtitle}>
          Join us live or watch recordings of our Islamic programs and events
        </Text>

        {/* Live Stream Section */}
        {liveStream ? (
          <Card style={styles.liveCard}>
            <View style={styles.liveHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            
            <View style={styles.videoContainer}>
              <WebViewWrapper 
                source={{ uri: `https://www.youtube.com/embed/live_stream?channel=UCChannelId&autoplay=1` }}
                style={styles.webView}
              />
            </View>
            
            <View style={styles.liveInfo}>
              <Text style={styles.liveTitle}>{liveStream.title}</Text>
              <Text style={styles.liveDescription}>{liveStream.description}</Text>
              <Button 
                title="Watch on YouTube"
                onPress={() => handleOpenVideo(liveStream.url)}
                style={styles.liveButton}
              />
            </View>
          </Card>
        ) : (
          <Card style={styles.noLiveCard}>
            <Text style={styles.noLiveTitle}>No Live Stream</Text>
            <Text style={styles.noLiveDescription}>
              We're not currently live. Check back during our scheduled programs or browse our archived content below.
            </Text>
            <Button 
              title="Visit Our Channel"
              variant="outline"
              onPress={handleOpenYouTube}
              style={styles.channelButton}
            />
          </Card>
        )}

        {/* Archived Streams Section */}
        <View style={styles.archivedSection}>
          <Text style={styles.sectionTitle}>Archived Streams</Text>
          <Text style={styles.sectionSubtitle}>
            Watch previous programs and events
          </Text>
          
          {loading ? (
            <Card style={styles.loadingCard}>
              <Text style={styles.loadingText}>Loading videos...</Text>
            </Card>
          ) : error ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </Card>
          ) : (
            <View style={styles.videoGrid}>
              {videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoItem}
                  onPress={() => handleOpenVideo(video.url)}
                >
                  <Card style={styles.videoCard}>
                    <View style={styles.thumbnailContainer}>
                      <Image 
                        source={{ uri: video.thumbnail }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.playOverlay}>
                        <Play size={24} color={Colors.text.light} fill={Colors.text.light} />
                      </View>
                    </View>
                    
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {video.title}
                      </Text>
                      <Text style={styles.videoDescription} numberOfLines={2}>
                        {video.description}
                      </Text>
                      <View style={styles.videoMeta}>
                        <Calendar size={14} color={Colors.text.muted} />
                        <Text style={styles.videoDate}>
                          {formatDate(video.publishedAt)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Channel Info */}
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

        {/* Program Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Live Stream Schedule</Text>
          
          <Card style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Friday Prayers</Text>
            <Text style={styles.scheduleTime}>Every Friday at 1:00 PM PST</Text>
            <Text style={styles.scheduleDescription}>
              Join us for weekly Friday prayers with inspiring sermons.
            </Text>
          </Card>

          <Card style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Islamic Studies Classes</Text>
            <Text style={styles.scheduleTime}>Saturdays at 7:00 PM PST</Text>
            <Text style={styles.scheduleDescription}>
              Educational sessions on Islamic jurisprudence and history.
            </Text>
          </Card>

          <Card style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Youth Programs</Text>
            <Text style={styles.scheduleTime}>Sundays at 2:00 PM PST</Text>
            <Text style={styles.scheduleDescription}>
              Engaging programs designed for young Muslims.
            </Text>
          </Card>
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
    fontSize: 28,
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
    lineHeight: 22,
  },
  // Live Stream Styles
  liveCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  liveHeader: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  liveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.light,
    letterSpacing: 1,
  },
  liveInfo: {
    padding: 16,
  },
  liveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  liveDescription: {
    fontSize: 16,
    color: Colors.text.muted,
    marginBottom: 16,
    lineHeight: 22,
  },
  liveButton: {
    backgroundColor: Colors.primary.green,
  },
  noLiveCard: {
    marginBottom: 24,
    alignItems: 'center',
    padding: 24,
  },
  noLiveTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  noLiveDescription: {
    fontSize: 16,
    color: Colors.text.muted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  // Video Container
  videoContainer: {
    width: '100%',
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  // Archived Streams
  archivedSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.text.muted,
    marginBottom: 16,
  },
  videoGrid: {
    gap: 16,
  },
  videoItem: {
    marginBottom: 16,
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.5625 * 0.7, // Smaller aspect ratio for thumbnails
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
    lineHeight: 22,
  },
  videoDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 12,
    lineHeight: 20,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoDate: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  // Loading and Error States
  loadingCard: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  errorCard: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fee',
  },
  errorText: {
    fontSize: 16,
    color: '#c33',
    textAlign: 'center',
  },
  // Channel Info
  channelCard: {
    marginBottom: 24,
    alignItems: 'center',
    padding: 24,
  },
  channelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 12,
    textAlign: 'center',
  },
  channelDescription: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  channelButton: {
    marginTop: 8,
  },
  // Schedule Section
  scheduleSection: {
    marginBottom: 16,
  },
  scheduleCard: {
    marginBottom: 12,
    padding: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  scheduleDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    lineHeight: 20,
  },
});