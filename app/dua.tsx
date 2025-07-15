import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { BookMarked, Search, Heart, Sun, Moon, Utensils } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';

export default function DuaScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const duaCategories = [
    { 
      id: 'daily', 
      name: 'Daily Duas', 
      icon: Sun, 
      count: 15,
      description: 'Morning and evening supplications'
    },
    { 
      id: 'prayer', 
      name: 'Prayer Duas', 
      icon: BookMarked, 
      count: 12,
      description: 'Before and after prayer'
    },
    { 
      id: 'food', 
      name: 'Food & Drink', 
      icon: Utensils, 
      count: 8,
      description: 'Before and after meals'
    },
    { 
      id: 'night', 
      name: 'Night Duas', 
      icon: Moon, 
      count: 10,
      description: 'Before sleep and night prayers'
    },
    { 
      id: 'special', 
      name: 'Special Occasions', 
      icon: Heart, 
      count: 20,
      description: 'Eid, Ramadan, and other occasions'
    },
  ].filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sampleDuas = [
    {
      id: 1,
      title: 'Morning Dua',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
      transliteration: 'Asbahna wa asbahal mulku lillah',
      translation: 'We have entered the morning and the kingdom belongs to Allah',
      category: 'daily'
    },
    {
      id: 2,
      title: 'Before Eating',
      arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      transliteration: 'Bismillahi wa ala barakatillah',
      translation: 'In the name of Allah and with the blessings of Allah',
      category: 'food'
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ 
        title: "Daily Duas",
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background.light },
        headerTitleStyle: { color: Colors.text.dark }
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BookMarked size={32} color={Colors.primary.green} />
          <Text style={styles.title}>Daily Duas</Text>
          <Text style={styles.subtitle}>Islamic supplications for daily life</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search duas..."
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {duaCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => setSelectedCategory(category.id)}
            >
              <View style={styles.categoryIcon}>
                <category.icon size={24} color={Colors.primary.green} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{category.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Duas</Text>
          {sampleDuas.map((dua) => (
            <Card key={dua.id} style={styles.duaCard}>
              <Text style={styles.duaTitle}>{dua.title}</Text>
              <Text style={styles.duaArabic}>{dua.arabic}</Text>
              <Text style={styles.duaTransliteration}>{dua.transliteration}</Text>
              <Text style={styles.duaTranslation}>{dua.translation}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Duas</Text>
          <Text style={styles.infoText}>
            Dua (supplication) is a form of worship and a way to communicate with Allah. 
            These collected duas are from authentic Islamic sources and are recommended 
            for daily recitation.
          </Text>
          <Text style={styles.infoText}>
            Each dua includes Arabic text, transliteration for pronunciation, 
            and English translation for understanding.
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
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  categoryCard: {
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
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.green + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
  categoryCount: {
    backgroundColor: Colors.primary.green,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryCountText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 16,
  },
  duaCard: {
    marginBottom: 16,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 12,
  },
  duaArabic: {
    fontSize: 20,
    color: Colors.text.dark,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 32,
  },
  duaTransliteration: {
    fontSize: 16,
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  duaTranslation: {
    fontSize: 16,
    color: Colors.text.dark,
    lineHeight: 24,
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