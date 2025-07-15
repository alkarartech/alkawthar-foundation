import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Users, Phone, Mail, Heart, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function BurialScreen() {
  const handleCall = () => {
    Linking.openURL('tel:+16043746706');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:alkawtharfoundation015@gmail.com?subject=Burial Services Inquiry');
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ 
        title: "Burial Services",
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background.light },
        headerTitleStyle: { color: Colors.text.dark }
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Users size={32} color={Colors.primary.green} />
          <Text style={styles.title}>Burial Services</Text>
          <Text style={styles.subtitle}>Islamic funeral and burial support</Text>
        </View>

        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Clock size={24} color={Colors.ui.error} />
            <Text style={styles.emergencyTitle}>24/7 Emergency Support</Text>
          </View>
          <Text style={styles.emergencyText}>
            For immediate assistance during a time of loss, please contact us directly.
          </Text>
          <View style={styles.emergencyButtons}>
            <Button
              title="Call Now"
              onPress={handleCall}
              style={styles.emergencyButton}
            />
            <Button
              title="Send Email"
              variant="outline"
              onPress={handleEmail}
              style={styles.emergencyButton}
            />
          </View>
        </Card>

        <Card style={styles.servicesCard}>
          <Text style={styles.servicesTitle}>Our Burial Services</Text>
          <View style={styles.servicesList}>
            <View style={styles.serviceItem}>
              <Heart size={16} color={Colors.primary.green} />
              <Text style={styles.serviceText}>Ghusl (ritual washing) arrangements</Text>
            </View>
            <View style={styles.serviceItem}>
              <Heart size={16} color={Colors.primary.green} />
              <Text style={styles.serviceText}>Kafan (shrouding) preparation</Text>
            </View>
            <View style={styles.serviceItem}>
              <Heart size={16} color={Colors.primary.green} />
              <Text style={styles.serviceText}>Janazah prayer coordination</Text>
            </View>
            <View style={styles.serviceItem}>
              <Heart size={16} color={Colors.primary.green} />
              <Text style={styles.serviceText}>Burial arrangements</Text>
            </View>
            <View style={styles.serviceItem}>
              <Heart size={16} color={Colors.primary.green} />
              <Text style={styles.serviceText}>Family support and guidance</Text>
            </View>
            <View style={styles.serviceItem}>
              <Heart size={16} color={Colors.primary.green} />
              <Text style={styles.serviceText}>Documentation assistance</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.processCard}>
          <Text style={styles.processTitle}>Islamic Burial Process</Text>
          <View style={styles.processList}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Immediate Care</Text>
                <Text style={styles.stepDescription}>
                  Contact us immediately. We will guide you through the initial steps 
                  and coordinate with funeral homes.
                </Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Preparation</Text>
                <Text style={styles.stepDescription}>
                  Ghusl and Kafan are performed according to Islamic traditions 
                  by trained community members.
                </Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Janazah Prayer</Text>
                <Text style={styles.stepDescription}>
                  The funeral prayer is conducted at the mosque or appropriate venue 
                  with community participation.
                </Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Burial</Text>
                <Text style={styles.stepDescription}>
                  We coordinate with Islamic cemeteries and assist with all 
                  burial arrangements according to Shia traditions.
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.supportCard}>
          <Text style={styles.supportTitle}>Ongoing Support</Text>
          <Text style={styles.supportText}>
            Our support does not end with the burial. We provide:
          </Text>
          <View style={styles.supportList}>
            <Text style={styles.supportItem}>• Grief counseling and spiritual guidance</Text>
            <Text style={styles.supportItem}>• Community support network</Text>
            <Text style={styles.supportItem}>• Memorial service arrangements</Text>
            <Text style={styles.supportItem}>• Assistance with religious observances</Text>
            <Text style={styles.supportItem}>• Connection with local Islamic resources</Text>
          </View>
        </Card>

        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Phone size={20} color={Colors.primary.green} />
              <Text style={styles.contactText}>Malik Ibrahim: (604) 374-6706</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={20} color={Colors.primary.green} />
              <Text style={styles.contactText}>alkawtharfoundation015@gmail.com</Text>
            </View>
          </View>
          <Text style={styles.contactNote}>
            Available 24/7 for emergency situations. Please do not hesitate to reach out 
            during your time of need.
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
  emergencyCard: {
    marginBottom: 16,
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: Colors.ui.error,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.ui.error,
  },
  emergencyText: {
    fontSize: 14,
    color: Colors.text.dark,
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
  },
  servicesCard: {
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceText: {
    fontSize: 14,
    color: Colors.text.dark,
    flex: 1,
    lineHeight: 20,
  },
  processCard: {
    marginBottom: 16,
  },
  processTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  processList: {
    gap: 20,
  },
  processStep: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
  },
  supportCard: {
    marginBottom: 16,
    backgroundColor: Colors.background.offWhite,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: Colors.text.dark,
    marginBottom: 12,
    lineHeight: 20,
  },
  supportList: {
    gap: 8,
  },
  supportItem: {
    fontSize: 14,
    color: Colors.text.dark,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: Colors.primary.green + '10',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  contactInfo: {
    gap: 12,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text.dark,
  },
  contactNote: {
    fontSize: 12,
    color: Colors.text.muted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});