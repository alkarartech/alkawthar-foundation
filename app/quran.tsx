import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { BookOpen, Search, Play, Pause } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';

export default function QuranScreen() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Surahs data
  const surahs = [
    { number: 1, name: 'Al-Fatiha', arabicName: 'الفاتحة', verses: 7, revelation: 'Meccan' },
    { number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', verses: 286, revelation: 'Medinan' },
    { number: 3, name: 'Ali Imran', arabicName: 'آل عمران', verses: 200, revelation: 'Medinan' },
    { number: 4, name: 'An-Nisa', arabicName: 'النساء', verses: 176, revelation: 'Medinan' },
    { number: 5, name: 'Al-Maidah', arabicName: 'المائدة', verses: 120, revelation: 'Medinan' },
  ].filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ 
        title: "Holy Quran",
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background.light },
        headerTitleStyle: { color: Colors.text.dark }
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BookOpen size={32} color={Colors.primary.green} />
          <Text style={styles.title}>Holy Quran</Text>
          <Text style={styles.subtitle}>Read and listen to the Quran</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Surahs..."
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Arabic text with translation</Text>
            <Text style={styles.featureItem}>• Audio recitation</Text>
            <Text style={styles.featureItem}>• Verse-by-verse navigation</Text>
            <Text style={styles.featureItem}>• Bookmarks and notes</Text>
          </View>
        </Card>

        <View style={styles.surahsList}>
          <Text style={styles.sectionTitle}>Surahs</Text>
          {surahs.map((surah) => (
            <TouchableOpacity
              key={surah.number}
              style={styles.surahCard}
              onPress={() => setSelectedSurah(surah.number)}
            >
              <View style={styles.surahNumber}>
                <Text style={styles.surahNumberText}>{surah.number}</Text>
              </View>
              <View style={styles.surahInfo}>
                <Text style={styles.surahName}>{surah.name}</Text>
                <Text style={styles.surahArabic}>{surah.arabicName}</Text>
                <Text style={styles.surahDetails}>
                  {surah.verses} verses • {surah.revelation}
                </Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Play size={20} color={Colors.primary.green} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>About This Feature</Text>
          <Text style={styles.infoText}>
            This Quran reader provides access to the complete Holy Quran with Arabic text, 
            English translations, and audio recitations. The interface is designed to be 
            user-friendly for both Arabic readers and those learning the language.
          </Text>
          <Text style={styles.infoText}>
            In a full implementation, this would connect to Quran.com API or similar 
            services to provide complete functionality.
          </Text>
        </Card>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  featuresCard: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
  },
  surahsList: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  surahNumberText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  surahArabic: {
    fontSize: 18,
    color: Colors.primary.green,
    marginTop: 2,
  },
  surahDetails: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 4,
  },
  playButton: {
    padding: 8,
  },
  infoCard: {
    backgroundColor: Colors.background.offWhite,
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
    marginBottom: 12,
    lineHeight: 20,
  },
});