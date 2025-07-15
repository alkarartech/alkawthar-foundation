import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Clock, 
  BookOpen, 
  Heart, 
  Users, 
  Plane,
  BookMarked,
  Search,
  ChevronRight 
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ResourcesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      id: 'prayer',
      title: 'Prayer Times',
      subtitle: 'View daily prayer times and Qibla direction',
      icon: Clock,
      route: '/prayer-times',
    },
    {
      id: 'quran',
      title: 'Holy Quran',
      subtitle: 'Read Quran with translations and audio',
      icon: BookOpen,
      route: '/quran',
    },
    {
      id: 'dua',
      title: 'Daily Duas',
      subtitle: 'Access categorized supplications',
      icon: BookMarked,
      route: '/dua',
    },
    {
      id: 'wedding',
      title: 'Wedding Services',
      subtitle: 'Request Islamic wedding ceremony services',
      icon: Heart,
      route: '/wedding',
    },
    {
      id: 'burial',
      title: 'Burial Services',
      subtitle: 'Islamic funeral and burial support',
      icon: Users,
      route: '/burial',
    },
    {
      id: 'hajj',
      title: 'Hajj & Umrah',
      subtitle: 'Pilgrimage guidance and training',
      icon: Plane,
      route: '/hajj-umrah',
    },
  ].filter(feature => 
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.text.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          placeholderTextColor={Colors.text.muted}
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
            style={styles.featureCard}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.iconContainer}>
              <item.icon size={24} color={Colors.primary.green} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
            </View>
            <ChevronRight size={20} color={Colors.text.muted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text.dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.background.offWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.dark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Colors.background.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: Colors.primary.green + '15',
    shadowColor: Colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.text.dark,
  },
  featureSubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    lineHeight: 20,
  },
});