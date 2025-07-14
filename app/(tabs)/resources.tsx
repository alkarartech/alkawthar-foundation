import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Compass, 
  Clock, 
  BookOpen, 
  Heart, 
  Users, 
  Plane,
  Search,
  ChevronRight 
} from 'lucide-react-native';
import useThemeStore from '../../stores/themeStore';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Layout from '../../constants/layout';
import { getTranslation } from '../../constants/translations';
import usePrayerTimes from '@/hooks/usePrayerTimes';
import useBooking, { BookingFormData } from '@/hooks/useBooking';

export default function ResourcesScreen() {
  const router = useRouter();
  const themeStore = useThemeStore();
  const { isDarkMode, language } = themeStore;
  const colors = themeStore.getColors();
  const { prayerTimes, loading, error, nextPrayerIndex } = usePrayerTimes();
  const { loading: bookingLoading, error: bookingError, success: bookingSuccess, bookingId, submitBooking } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      id: 'prayer',
      title: getTranslation(language, 'prayerTimes') || 'Prayer Times',
      subtitle: getTranslation(language, 'prayerTimesSubtitle') || 'View daily prayer times and Qibla direction',
      icon: Clock,
      route: '/prayer-times',
    },
    {
      id: 'quran',
      title: getTranslation(language, 'quran') || 'Holy Quran',
      subtitle: getTranslation(language, 'quranSubtitle') || 'Read Quran with translations and audio',
      icon: BookOpen,
      route: '/quran',
    },
    {
      id: 'dua',
      title: getTranslation(language, 'dua') || 'Daily Duas',
      subtitle: getTranslation(language, 'duaSubtitle') || 'Access categorized supplications',
      icon: Heart,
      route: '/dua',
    },
    {
      id: 'wedding',
      title: getTranslation(language, 'wedding') || 'Wedding Services',
      subtitle: getTranslation(language, 'weddingSubtitle') || 'Request Islamic wedding ceremony services',
      icon: Heart,
      route: '/wedding',
    },
    {
      id: 'burial',
      title: getTranslation(language, 'burial') || 'Burial Services',
      subtitle: getTranslation(language, 'burialSubtitle') || 'Islamic funeral and burial support',
      icon: Users,
      route: '/burial',
    },
    {
      id: 'hajj',
      title: getTranslation(language, 'hajjUmrah') || 'Hajj & Umrah',
      subtitle: getTranslation(language, 'hajjUmrahSubtitle') || 'Pilgrimage guidance and training',
      icon: Plane,
      route: '/hajj-umrah',
    },
  ].filter(feature => 
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? colors.background : Colors.background.light }
    ]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle,
          { color: isDarkMode ? colors.text.primary : Colors.text.primary }
        ]}>
          {getTranslation(language, 'resources') || 'Resources'}
        </Text>
      </View>

      <View style={[
        styles.searchContainer,
        { backgroundColor: isDarkMode ? colors.card : Colors.card }
      ]}>
        <Search size={20} color={isDarkMode ? colors.text.secondary : Colors.text.secondary} />
        <TextInput
          style={[
            styles.searchInput,
            { color: isDarkMode ? colors.text.primary : Colors.text.primary }
          ]}
          placeholder="Search resources..."
          placeholderTextColor={isDarkMode ? colors.text.secondary : Colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {features.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.featureCard,
              { backgroundColor: isDarkMode ? colors.card : Colors.card }
            ]}
            onPress={() => router.push(item.route)}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: Colors.primary.green + '20' }
            ]}>
              <item.icon size={24} color={Colors.primary.green} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[
                styles.featureTitle,
                { color: isDarkMode ? colors.text.primary : Colors.text.primary }
              ]}>
                {item.title}
              </Text>
              <Text style={[
                styles.featureSubtitle,
                { color: isDarkMode ? colors.text.secondary : Colors.text.secondary }
              ]}>
                {item.subtitle}
              </Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? colors.text.secondary : Colors.text.secondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xl,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.md,
    marginBottom: Layout.spacing.xs,
  },
  featureSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
  },
});