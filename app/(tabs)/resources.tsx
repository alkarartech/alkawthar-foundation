import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform, TouchableOpacity, Switch, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import PrayerTimeCard from "@/components/PrayerTimeCard";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/colors";
import usePrayerTimes from "@/hooks/usePrayerTimes";
import useBooking, { BookingFormData } from "@/hooks/useBooking";
import { Compass, Clock, BookOpen, Heart, Users, Plane } from "lucide-react-native";
import { useEffect } from "react";

type ResourceSection = 'prayer' | 'quran' | 'dua' | 'wedding' | 'burial' | 'hajj';

export default function ResourcesScreen() {
  const { prayerTimes, loading, error, nextPrayerIndex } = usePrayerTimes();
  const { loading: bookingLoading, error: bookingError, success: bookingSuccess, bookingId, submitBooking } = useBooking();
  
  const [activeSection, setActiveSection] = useState<ResourceSection>('prayer');
  const [date, setDate] = useState("");
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    eventType: '',
    date: '',
    time: '',
    attendees: '',
    requirements: '',
    name: '',
    email: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

  // Wedding form state
  const [weddingForm, setWeddingForm] = useState({
    brideName: '',
    groomName: '',
    preferredDate: '',
    preferredTime: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
  });

  // Hajj/Umrah form state
  const [hajjForm, setHajjForm] = useState({
    name: '',
    email: '',
    phone: '',
    passportNumber: '',
    preferredDate: '',
    numberOfPeople: '',
    serviceType: 'hajj', // hajj or umrah
    notes: '',
  });

  useEffect(() => {
    // Set current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDate(now.toLocaleDateString(undefined, options));

    // Simulate getting qibla direction
    setTimeout(() => {
      setQiblaDirection(45); // Example direction in degrees
    }, 1000);
  }, []);

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof BookingFormData, string>> = {};
    
    if (!formData.eventType) errors.eventType = 'Please select an event type';
    if (!formData.date) errors.date = 'Please enter a date';
    if (!formData.time) errors.time = 'Please enter a time';
    if (!formData.attendees) errors.attendees = 'Please enter number of attendees';
    if (!formData.name) errors.name = 'Please enter your name';
    if (!formData.email) errors.email = 'Please enter your email';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.phone) errors.phone = 'Please enter your phone number';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      submitBooking(formData);
    }
  };

  const handleWeddingSubmit = () => {
    if (Platform.OS === 'web') {
      alert('Wedding service request submitted successfully! We will contact you within 2 business days.');
    } else {
      Alert.alert(
        'Request Submitted',
        'Wedding service request submitted successfully! We will contact you within 2 business days.',
        [{ text: 'OK' }]
      );
    }
    // Reset form
    setWeddingForm({
      brideName: '',
      groomName: '',
      preferredDate: '',
      preferredTime: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: '',
    });
  };

  const handleHajjSubmit = () => {
    if (Platform.OS === 'web') {
      alert('Hajj/Umrah booking request submitted successfully! We will contact you with more details.');
    } else {
      Alert.alert(
        'Request Submitted',
        'Hajj/Umrah booking request submitted successfully! We will contact you with more details.',
        [{ text: 'OK' }]
      );
    }
    // Reset form
    setHajjForm({
      name: '',
      email: '',
      phone: '',
      passportNumber: '',
      preferredDate: '',
      numberOfPeople: '',
      serviceType: 'hajj',
      notes: '',
    });
  };

  const renderSectionTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'prayer' && styles.activeTab]}
          onPress={() => setActiveSection('prayer')}
        >
          <Clock size={16} color={activeSection === 'prayer' ? Colors.text.light : Colors.text.muted} />
          <Text style={[styles.tabText, activeSection === 'prayer' && styles.activeTabText]}>
            Prayer Times
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'quran' && styles.activeTab]}
          onPress={() => setActiveSection('quran')}
        >
          <BookOpen size={16} color={activeSection === 'quran' ? Colors.text.light : Colors.text.muted} />
          <Text style={[styles.tabText, activeSection === 'quran' && styles.activeTabText]}>
            Qur'an
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeSection === 'dua' && styles.activeTab]}
          onPress={() => setActiveSection('dua')}
        >
          <Heart size={16} color={activeSection === 'dua' ? Colors.text.light : Colors.text.muted} />
          <Text style={[styles.tabText, activeSection === 'dua' && styles.activeTabText]}>
            Dua
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeSection === 'wedding' && styles.activeTab]}
          onPress={() => setActiveSection('wedding')}
        >
          <Heart size={16} color={activeSection === 'wedding' ? Colors.text.light : Colors.text.muted} />
          <Text style={[styles.tabText, activeSection === 'wedding' && styles.activeTabText]}>
            Wedding
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeSection === 'burial' && styles.activeTab]}
          onPress={() => setActiveSection('burial')}
        >
          <Users size={16} color={activeSection === 'burial' ? Colors.text.light : Colors.text.muted} />
          <Text style={[styles.tabText, activeSection === 'burial' && styles.activeTabText]}>
            Burial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeSection === 'hajj' && styles.activeTab]}
          onPress={() => setActiveSection('hajj')}
        >
          <Plane size={16} color={activeSection === 'hajj' ? Colors.text.light : Colors.text.muted} />
          <Text style={[styles.tabText, activeSection === 'hajj' && styles.activeTabText]}>
            Hajj/Umrah
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderPrayerSection = () => (
    <>
      <Text style={styles.date}>{date}</Text>
      
      <Card style={styles.locationCard}>
        <Text style={styles.locationTitle}>Surrey, BC, Canada</Text>
        <Text style={styles.locationSubtitle}>Al Kawthar Foundation</Text>
        <View style={styles.timeFormatToggle}>
          <Text style={styles.toggleLabel}>24-hour format</Text>
          <Switch
            value={is24Hour}
            onValueChange={setIs24Hour}
            trackColor={{ false: Colors.ui.border, true: Colors.primary.lightGreen }}
            thumbColor={is24Hour ? Colors.primary.green : '#f4f3f4'}
          />
        </View>
      </Card>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.green} />
          <Text style={styles.loadingText}>Loading prayer times...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.prayerTimesContainer}>
          {prayerTimes.map((prayer, index) => (
            <PrayerTimeCard 
              key={prayer.name} 
              prayer={prayer} 
              isNext={index === nextPrayerIndex}
            />
          ))}
        </View>
      )}

      {Platform.OS !== 'web' && (
        <Card style={styles.qiblaCard}>
          <Text style={styles.qiblaTitle}>Qibla Direction</Text>
          <View style={styles.qiblaContainer}>
            {qiblaDirection !== null ? (
              <View style={styles.compassContainer}>
                <View 
                  style={[
                    styles.compass, 
                    { transform: [{ rotate: `${qiblaDirection}deg` }] }
                  ]}
                >
                  <Compass size={100} color={Colors.primary.green} />
                  <View style={styles.compassNeedle} />
                </View>
                <Text style={styles.qiblaText}>
                  Qibla is {qiblaDirection}° from North
                </Text>
              </View>
            ) : (
              <ActivityIndicator size="small" color={Colors.primary.green} />
            )}
          </View>
        </Card>
      )}
    </>
  );

  const renderQuranSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Holy Qur'an</Text>
      
      <Card style={styles.featureCard}>
        <Text style={styles.featureTitle}>Read the Qur'an</Text>
        <Text style={styles.featureDescription}>
          Access the complete Qur'an with Arabic text, English translation, and audio recitation.
        </Text>
        <Button 
          title="Open Qur'an Reader" 
          onPress={() => {
            // In a real app, this would open a Quran reader
            if (Platform.OS === 'web') {
              window.open('https://quran.com', '_blank');
            }
          }}
          style={styles.featureButton}
        />
      </Card>

      <Card style={styles.featureCard}>
        <Text style={styles.featureTitle}>Daily Verses</Text>
        <Text style={styles.featureDescription}>
          Receive daily verses from the Qur'an with translation and reflection.
        </Text>
        <View style={styles.verseContainer}>
          <Text style={styles.arabicText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.translationText}>
            "In the name of Allah, the Entirely Merciful, the Especially Merciful."
          </Text>
          <Text style={styles.verseReference}>- Al-Fatiha 1:1</Text>
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Features</Text>
        <Text style={styles.infoText}>• Complete Qur'an with Arabic text</Text>
        <Text style={styles.infoText}>• English translation</Text>
        <Text style={styles.infoText}>• Audio recitation by renowned Qaris</Text>
        <Text style={styles.infoText}>• Search functionality</Text>
        <Text style={styles.infoText}>• Bookmarking and notes</Text>
      </Card>
    </View>
  );

  const renderDuaSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Daily Duas & Supplications</Text>
      
      <Card style={styles.duaCard}>
        <Text style={styles.duaTitle}>Morning Dua</Text>
        <Text style={styles.arabicText}>
          أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ
        </Text>
        <Text style={styles.translationText}>
          "We have reached the morning and at this very time unto Allah belongs all sovereignty."
        </Text>
      </Card>

      <Card style={styles.duaCard}>
        <Text style={styles.duaTitle}>Evening Dua</Text>
        <Text style={styles.arabicText}>
          أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ
        </Text>
        <Text style={styles.translationText}>
          "We have reached the evening and at this very time unto Allah belongs all sovereignty."
        </Text>
      </Card>

      <Card style={styles.duaCard}>
        <Text style={styles.duaTitle}>Before Meals</Text>
        <Text style={styles.arabicText}>
          بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ
        </Text>
        <Text style={styles.translationText}>
          "In the name of Allah and with the blessings of Allah."
        </Text>
      </Card>

      <Card style={styles.duaCard}>
        <Text style={styles.duaTitle}>After Meals</Text>
        <Text style={styles.arabicText}>
          الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا
        </Text>
        <Text style={styles.translationText}>
          "Praise be to Allah who has fed us and given us drink."
        </Text>
      </Card>

      <View style={styles.duaCategoriesContainer}>
        <Text style={styles.categoriesTitle}>Dua Categories</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Travel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Protection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Forgiveness</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderWeddingSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Wedding Services (Nikah)</Text>
      <Text style={styles.sectionSubtitle}>
        Request our Islamic wedding ceremony services
      </Text>
      
      <Card style={styles.formCard}>
        <Text style={styles.formTitle}>Wedding Service Request</Text>
        
        <Input
          label="Bride's Full Name"
          placeholder="Enter bride's full name"
          value={weddingForm.brideName}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, brideName: value }))}
        />
        
        <Input
          label="Groom's Full Name"
          placeholder="Enter groom's full name"
          value={weddingForm.groomName}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, groomName: value }))}
        />
        
        <Input
          label="Preferred Date"
          placeholder="MM/DD/YYYY"
          value={weddingForm.preferredDate}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, preferredDate: value }))}
        />
        
        <Input
          label="Preferred Time"
          placeholder="HH:MM AM/PM"
          value={weddingForm.preferredTime}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, preferredTime: value }))}
        />
        
        <Input
          label="Contact Person Name"
          placeholder="Your full name"
          value={weddingForm.contactName}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, contactName: value }))}
        />
        
        <Input
          label="Contact Email"
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={weddingForm.contactEmail}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, contactEmail: value }))}
        />
        
        <Input
          label="Contact Phone"
          placeholder="(123) 456-7890"
          keyboardType="phone-pad"
          value={weddingForm.contactPhone}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, contactPhone: value }))}
        />
        
        <Input
          label="Additional Notes"
          placeholder="Any special requirements or notes"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textArea}
          value={weddingForm.notes}
          onChangeText={(value) => setWeddingForm(prev => ({ ...prev, notes: value }))}
        />
        
        <Button 
          title="Submit Wedding Request" 
          onPress={handleWeddingSubmit}
          style={styles.submitButton}
        />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Wedding Services Information</Text>
        <Text style={styles.infoText}>• Islamic wedding ceremony (Nikah)</Text>
        <Text style={styles.infoText}>• Pre-marital counseling available</Text>
        <Text style={styles.infoText}>• Marriage certificate processing</Text>
        <Text style={styles.infoText}>• Venue can be arranged at the mosque</Text>
        <Text style={styles.infoText}>• Imam services for the ceremony</Text>
      </Card>
    </View>
  );

  const renderBurialSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Burial Services</Text>
      <Text style={styles.sectionSubtitle}>
        Islamic funeral and burial guidance and support
      </Text>
      
      <Card style={styles.serviceCard}>
        <Text style={styles.serviceTitle}>Emergency Contact</Text>
        <Text style={styles.serviceDescription}>
          For immediate burial service needs, please contact us 24/7:
        </Text>
        <Text style={styles.contactInfo}>📞 (604) 123-4567</Text>
        <Text style={styles.contactInfo}>📧 burial@alkawtharfoundation.com</Text>
      </Card>

      <Card style={styles.serviceCard}>
        <Text style={styles.serviceTitle}>Our Burial Services</Text>
        <Text style={styles.serviceText}>• Islamic funeral prayers (Janazah)</Text>
        <Text style={styles.serviceText}>• Body preparation according to Islamic rites</Text>
        <Text style={styles.serviceText}>• Coordination with Islamic cemeteries</Text>
        <Text style={styles.serviceText}>• Grief counseling and support</Text>
        <Text style={styles.serviceText}>• Memorial service arrangements</Text>
      </Card>

      <Card style={styles.serviceCard}>
        <Text style={styles.serviceTitle}>Islamic Burial Guidelines</Text>
        <Text style={styles.serviceDescription}>
          We follow traditional Islamic burial practices including proper washing (Ghusl), 
          shrouding (Kafan), funeral prayer (Salat al-Janazah), and burial facing Qibla.
        </Text>
      </Card>

      <Card style={styles.serviceCard}>
        <Text style={styles.serviceTitle}>Support for Families</Text>
        <Text style={styles.serviceDescription}>
          Our community provides ongoing support for bereaved families including meal 
          preparation, childcare assistance, and spiritual guidance during the mourning period.
        </Text>
      </Card>

      <Button 
        title="Contact for Burial Services" 
        onPress={() => {
          if (Platform.OS === 'web') {
            window.open('tel:+16041234567', '_self');
          }
        }}
        style={styles.emergencyButton}
      />
    </View>
  );

  const renderHajjSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Hajj & Umrah Services</Text>
      <Text style={styles.sectionSubtitle}>
        Plan your spiritual journey to the Holy Land
      </Text>
      
      <Card style={styles.formCard}>
        <Text style={styles.formTitle}>Hajj/Umrah Booking Request</Text>
        
        <View style={styles.serviceTypeContainer}>
          <Text style={styles.serviceTypeLabel}>Service Type:</Text>
          <View style={styles.serviceTypeButtons}>
            <TouchableOpacity 
              style={[styles.serviceTypeButton, hajjForm.serviceType === 'hajj' && styles.activeServiceType]}
              onPress={() => setHajjForm(prev => ({ ...prev, serviceType: 'hajj' }))}
            >
              <Text style={[styles.serviceTypeText, hajjForm.serviceType === 'hajj' && styles.activeServiceTypeText]}>
                Hajj
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.serviceTypeButton, hajjForm.serviceType === 'umrah' && styles.activeServiceType]}
              onPress={() => setHajjForm(prev => ({ ...prev, serviceType: 'umrah' }))}
            >
              <Text style={[styles.serviceTypeText, hajjForm.serviceType === 'umrah' && styles.activeServiceTypeText]}>
                Umrah
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Input
          label="Full Name"
          placeholder="Your full name as on passport"
          value={hajjForm.name}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, name: value }))}
        />
        
        <Input
          label="Email"
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={hajjForm.email}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, email: value }))}
        />
        
        <Input
          label="Phone Number"
          placeholder="(123) 456-7890"
          keyboardType="phone-pad"
          value={hajjForm.phone}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, phone: value }))}
        />
        
        <Input
          label="Passport Number"
          placeholder="Enter passport number"
          value={hajjForm.passportNumber}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, passportNumber: value }))}
        />
        
        <Input
          label="Preferred Travel Date"
          placeholder="MM/DD/YYYY"
          value={hajjForm.preferredDate}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, preferredDate: value }))}
        />
        
        <Input
          label="Number of People"
          placeholder="How many people will be traveling?"
          keyboardType="number-pad"
          value={hajjForm.numberOfPeople}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, numberOfPeople: value }))}
        />
        
        <Input
          label="Additional Notes"
          placeholder="Special requirements, health conditions, etc."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textArea}
          value={hajjForm.notes}
          onChangeText={(value) => setHajjForm(prev => ({ ...prev, notes: value }))}
        />
        
        <Button 
          title="Submit Hajj/Umrah Request" 
          onPress={handleHajjSubmit}
          style={styles.submitButton}
        />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Our Hajj/Umrah Services</Text>
        <Text style={styles.infoText}>• Complete travel packages</Text>
        <Text style={styles.infoText}>• Visa processing assistance</Text>
        <Text style={styles.infoText}>• Accommodation arrangements</Text>
        <Text style={styles.infoText}>• Experienced group leaders</Text>
        <Text style={styles.infoText}>• Pre-departure orientation</Text>
        <Text style={styles.infoText}>• 24/7 support during travel</Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Package Information</Text>
        <Text style={styles.infoText}>• Economy, Standard, and Premium packages available</Text>
        <Text style={styles.infoText}>• Group discounts for families and communities</Text>
        <Text style={styles.infoText}>• Flexible payment plans</Text>
        <Text style={styles.infoText}>• All-inclusive packages with meals and transportation</Text>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader />
      
      {renderSectionTabs()}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {activeSection === 'prayer' && renderPrayerSection()}
        {activeSection === 'quran' && renderQuranSection()}
        {activeSection === 'dua' && renderDuaSection()}
        {activeSection === 'wedding' && renderWeddingSection()}
        {activeSection === 'burial' && renderBurialSection()}
        {activeSection === 'hajj' && renderHajjSection()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  tabContainer: {
    backgroundColor: Colors.background.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  tabScrollContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary.green,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.muted,
  },
  activeTabText: {
    color: Colors.text.light,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.text.muted,
    marginBottom: 24,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: Colors.text.muted,
    marginBottom: 16,
    textAlign: 'center',
  },
  locationCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 16,
  },
  timeFormatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: Colors.text.dark,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.muted,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.ui.error,
    textAlign: 'center',
  },
  prayerTimesContainer: {
    marginBottom: 24,
  },
  qiblaCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  qiblaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  qiblaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  compassContainer: {
    alignItems: 'center',
  },
  compass: {
    marginBottom: 16,
  },
  compassNeedle: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: 50,
    backgroundColor: Colors.primary.gold,
    transform: [{ translateX: -1 }],
  },
  qiblaText: {
    fontSize: 16,
    color: Colors.text.dark,
  },
  featureCard: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 16,
    lineHeight: 24,
  },
  featureButton: {
    marginTop: 8,
  },
  verseContainer: {
    backgroundColor: Colors.background.offWhite,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  arabicText: {
    fontSize: 20,
    color: Colors.primary.green,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  translationText: {
    fontSize: 16,
    color: Colors.text.dark,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  duaCard: {
    marginBottom: 16,
    backgroundColor: Colors.background.offWhite,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 12,
  },
  duaCategoriesContainer: {
    marginTop: 24,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: '45%',
    alignItems: 'center',
  },
  categoryText: {
    color: Colors.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 12,
    lineHeight: 24,
  },
  serviceText: {
    fontSize: 14,
    color: Colors.text.dark,
    marginBottom: 8,
    lineHeight: 20,
  },
  contactInfo: {
    fontSize: 16,
    color: Colors.primary.green,
    fontWeight: '600',
    marginBottom: 4,
  },
  emergencyButton: {
    backgroundColor: Colors.ui.error,
    marginTop: 16,
  },
  serviceTypeContainer: {
    marginBottom: 16,
  },
  serviceTypeLabel: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 8,
  },
  serviceTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.green,
    alignItems: 'center',
  },
  activeServiceType: {
    backgroundColor: Colors.primary.green,
  },
  serviceTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
  },
  activeServiceTypeText: {
    color: Colors.text.light,
  },
  infoCard: {
    backgroundColor: Colors.background.offWhite,
    marginBottom: 16,
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