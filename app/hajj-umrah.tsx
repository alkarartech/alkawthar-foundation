import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Plane, Calendar, Users, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function HajjUmrahScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
    pilgrimage: 'hajj',
    preferredDate: '',
    numberOfPeople: '',
    packageType: 'standard',
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
    
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.passportNumber) errors.passportNumber = 'Passport number is required';
    if (!formData.preferredDate) errors.preferredDate = 'Preferred date is required';
    if (!formData.numberOfPeople) errors.numberOfPeople = 'Number of people is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Request Submitted',
          'Your Hajj/Umrah inquiry has been submitted. Our team will contact you within 48 hours with detailed information.',
          [{ text: 'OK' }]
        );
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          passportNumber: '',
          pilgrimage: 'hajj',
          preferredDate: '',
          numberOfPeople: '',
          packageType: 'standard',
          specialRequests: '',
        });
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ 
        title: "Hajj & Umrah",
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background.light },
        headerTitleStyle: { color: Colors.text.dark }
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Plane size={32} color={Colors.primary.green} />
          <Text style={styles.title}>Hajj & Umrah</Text>
          <Text style={styles.subtitle}>Sacred pilgrimage guidance and booking</Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Our Pilgrimage Services</Text>
          <View style={styles.servicesList}>
            <Text style={styles.serviceItem}>• Complete Hajj and Umrah packages</Text>
            <Text style={styles.serviceItem}>• Visa processing assistance</Text>
            <Text style={styles.serviceItem}>• Accommodation arrangements</Text>
            <Text style={styles.serviceItem}>• Transportation coordination</Text>
            <Text style={styles.serviceItem}>• Spiritual guidance and preparation</Text>
            <Text style={styles.serviceItem}>• Group and individual packages</Text>
          </View>
        </Card>

        <Card style={styles.packagesCard}>
          <Text style={styles.packagesTitle}>Package Options</Text>
          <View style={styles.packagesList}>
            <View style={styles.packageItem}>
              <Text style={styles.packageName}>Economy Package</Text>
              <Text style={styles.packageDescription}>
                Basic accommodation and transportation with essential services
              </Text>
            </View>
            <View style={styles.packageItem}>
              <Text style={styles.packageName}>Standard Package</Text>
              <Text style={styles.packageDescription}>
                Comfortable accommodation with additional amenities and guided tours
              </Text>
            </View>
            <View style={styles.packageItem}>
              <Text style={styles.packageName}>Premium Package</Text>
              <Text style={styles.packageDescription}>
                Luxury accommodation with VIP services and personalized guidance
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Pilgrimage Inquiry Form</Text>
          
          <Input
            label="Full Name (as on passport)"
            value={formData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            error={formErrors.fullName}
          />
          
          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
          />
          
          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            keyboardType="phone-pad"
            error={formErrors.phone}
          />
          
          <Input
            label="Passport Number"
            value={formData.passportNumber}
            onChangeText={(value) => handleChange('passportNumber', value)}
            error={formErrors.passportNumber}
          />
          
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Type of Pilgrimage</Text>
            <View style={styles.selectButtons}>
              <Button
                title="Hajj"
                variant={formData.pilgrimage === 'hajj' ? 'primary' : 'outline'}
                onPress={() => handleChange('pilgrimage', 'hajj')}
                style={styles.selectButton}
              />
              <Button
                title="Umrah"
                variant={formData.pilgrimage === 'umrah' ? 'primary' : 'outline'}
                onPress={() => handleChange('pilgrimage', 'umrah')}
                style={styles.selectButton}
              />
            </View>
          </View>
          
          <Input
            label="Preferred Travel Date"
            value={formData.preferredDate}
            onChangeText={(value) => handleChange('preferredDate', value)}
            placeholder="MM/YYYY or specific dates"
            error={formErrors.preferredDate}
          />
          
          <Input
            label="Number of People"
            value={formData.numberOfPeople}
            onChangeText={(value) => handleChange('numberOfPeople', value)}
            keyboardType="numeric"
            error={formErrors.numberOfPeople}
          />
          
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Package Type</Text>
            <View style={styles.packageButtons}>
              <Button
                title="Economy"
                variant={formData.packageType === 'economy' ? 'primary' : 'outline'}
                onPress={() => handleChange('packageType', 'economy')}
                style={styles.packageButton}
              />
              <Button
                title="Standard"
                variant={formData.packageType === 'standard' ? 'primary' : 'outline'}
                onPress={() => handleChange('packageType', 'standard')}
                style={styles.packageButton}
              />
              <Button
                title="Premium"
                variant={formData.packageType === 'premium' ? 'primary' : 'outline'}
                onPress={() => handleChange('packageType', 'premium')}
                style={styles.packageButton}
              />
            </View>
          </View>
          
          <Input
            label="Special Requests or Medical Needs"
            value={formData.specialRequests}
            onChangeText={(value) => handleChange('specialRequests', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            placeholder="Any special requirements, dietary needs, or medical considerations..."
          />
          
          <Button
            title="Submit Inquiry"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>

        <Card style={styles.additionalInfoCard}>
          <Text style={styles.additionalInfoTitle}>Important Information</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoText}>• Economy, Standard, and Premium packages available</Text>
            <Text style={styles.infoText}>• Group discounts for families and communities</Text>
            <Text style={styles.infoText}>• Flexible payment plans</Text>
            <Text style={styles.infoText}>• All-inclusive packages with meals and transportation</Text>
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
  packagesCard: {
    marginBottom: 16,
  },
  packagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  packagesList: {
    gap: 16,
  },
  packageItem: {
    padding: 16,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 8,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  packageDescription: {
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
  selectContainer: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text.dark,
  },
  selectButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  selectButton: {
    flex: 1,
  },
  packageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  packageButton: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
  },
  additionalInfoCard: {
    backgroundColor: Colors.background.offWhite,
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  infoList: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
  },
});