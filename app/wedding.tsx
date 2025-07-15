import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Heart, Calendar, Clock, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function WeddingScreen() {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    contactEmail: '',
    contactPhone: '',
    preferredDate: '',
    preferredTime: '',
    guestCount: '',
    venue: '',
    specialRequests: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.brideName) errors.brideName = 'Bride name is required';
    if (!formData.groomName) errors.groomName = 'Groom name is required';
    if (!formData.contactEmail) errors.contactEmail = 'Email is required';
    if (!formData.contactPhone) errors.contactPhone = 'Phone number is required';
    if (!formData.preferredDate) errors.preferredDate = 'Preferred date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // Simulate form submission
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Request Submitted',
          'Your wedding service request has been submitted. We will contact you within 24 hours.',
          [{ text: 'OK' }]
        );
        // Reset form
        setFormData({
          brideName: '',
          groomName: '',
          contactEmail: '',
          contactPhone: '',
          preferredDate: '',
          preferredTime: '',
          guestCount: '',
          venue: '',
          specialRequests: '',
        });
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ 
        title: "Wedding Services",
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background.light },
        headerTitleStyle: { color: Colors.text.dark }
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Heart size={32} color={Colors.primary.green} />
          <Text style={styles.title}>Wedding Services</Text>
          <Text style={styles.subtitle}>Islamic Nikah ceremony arrangements</Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Our Wedding Services Include:</Text>
          <View style={styles.servicesList}>
            <Text style={styles.serviceItem}>• Islamic Nikah ceremony</Text>
            <Text style={styles.serviceItem}>• Pre-marriage counseling</Text>
            <Text style={styles.serviceItem}>• Marriage contract preparation</Text>
            <Text style={styles.serviceItem}>• Venue coordination</Text>
            <Text style={styles.serviceItem}>• Religious guidance and support</Text>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Wedding Service Request</Text>
          
          <View style={styles.coupleSection}>
            <Text style={styles.sectionTitle}>Couple Information</Text>
            <Input
              label="Bride's Full Name"
              value={formData.brideName}
              onChangeText={(value) => handleChange('brideName', value)}
              error={formErrors.brideName}
            />
            <Input
              label="Groom's Full Name"
              value={formData.groomName}
              onChangeText={(value) => handleChange('groomName', value)}
              error={formErrors.groomName}
            />
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Input
              label="Email Address"
              value={formData.contactEmail}
              onChangeText={(value) => handleChange('contactEmail', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={formErrors.contactEmail}
            />
            <Input
              label="Phone Number"
              value={formData.contactPhone}
              onChangeText={(value) => handleChange('contactPhone', value)}
              keyboardType="phone-pad"
              error={formErrors.contactPhone}
            />
          </View>

          <View style={styles.eventSection}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <Input
              label="Preferred Date"
              value={formData.preferredDate}
              onChangeText={(value) => handleChange('preferredDate', value)}
              placeholder="MM/DD/YYYY"
              error={formErrors.preferredDate}
            />
            <Input
              label="Preferred Time"
              value={formData.preferredTime}
              onChangeText={(value) => handleChange('preferredTime', value)}
              placeholder="e.g., 2:00 PM"
            />
            <Input
              label="Expected Number of Guests"
              value={formData.guestCount}
              onChangeText={(value) => handleChange('guestCount', value)}
              keyboardType="numeric"
              placeholder="Approximate count"
            />
            <Input
              label="Venue (if decided)"
              value={formData.venue}
              onChangeText={(value) => handleChange('venue', value)}
              placeholder="Venue name and address"
            />
          </View>

          <Input
            label="Special Requests or Notes"
            value={formData.specialRequests}
            onChangeText={(value) => handleChange('specialRequests', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            placeholder="Any special requirements or questions..."
          />

          <Button
            title="Submit Request"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>

        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need More Information?</Text>
          <Text style={styles.contactText}>
            For immediate assistance or to discuss your wedding requirements, 
            please contact our office directly.
          </Text>
          <View style={styles.contactDetails}>
            <Text style={styles.contactDetail}>📞 (604) 374-6706</Text>
            <Text style={styles.contactDetail}>✉️ alkawtharfoundation015@gmail.com</Text>
          </View>
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
  infoCard: {
    marginBottom: 16,
    backgroundColor: Colors.primary.green + '10',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 12,
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  coupleSection: {
    marginBottom: 20,
  },
  contactSection: {
    marginBottom: 20,
  },
  eventSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
  },
  contactCard: {
    backgroundColor: Colors.background.offWhite,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text.dark,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactDetails: {
    gap: 8,
  },
  contactDetail: {
    fontSize: 14,
    color: Colors.primary.green,
    textAlign: 'center',
  },
});