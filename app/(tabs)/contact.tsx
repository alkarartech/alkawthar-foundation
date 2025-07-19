import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Linking, ScrollView, Alert, Platform } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';

const ContactScreen = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSend = async () => {
    if (!title || !name || !email || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Use Formspree for both web and mobile - it's reliable and free
      const response = await fetch('https://formspree.io/f/xdkogqpz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: title,
          name: name,
          email: email,
          message: message,
          _replyto: email,
          _subject: `${title} - Message from ${name}`,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your message has been sent successfully!');
        setTitle('');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email send error:', error);
      // Fallback to device's email client
      const emailUrl = `mailto:alkawtharfoundationBC@gmail.com?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      
      try {
        const canOpen = await Linking.canOpenURL(emailUrl);
        if (canOpen) {
          await Linking.openURL(emailUrl);
          Alert.alert('Email Client Opened', 'Please send the email from your email app.');
        } else {
          Alert.alert('Error', 'Unable to send email. Please contact us directly at alkawtharfoundationBC@gmail.com');
        }
      } catch (linkingError) {
        Alert.alert('Error', 'Unable to send email. Please contact us directly at alkawtharfoundationBC@gmail.com');
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.header}>Contact Al Kawthar Foundation</Text>
        <Text style={styles.mission}>Spreading knowledge, unity, and community service across Vancouver and beyond.</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100083609100746')} style={styles.socialButton}>
            <Facebook size={24} color={Colors.primary.green} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/alkawtharfoundation/')} style={styles.socialButton}>
            <Instagram size={24} color={Colors.primary.green} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/@AlKawtharIslamicAssociation/featured')} style={styles.socialButton}>
            <Youtube size={24} color={Colors.primary.green} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <TouchableOpacity 
            onPress={() => Linking.openURL('tel:+16045904115')} 
            style={styles.contactItem}
          >
            <Phone size={18} color={Colors.primary.green} />
            <Text style={styles.contactText}>+1 604-590-4115</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL('mailto:alkawtharfoundationBC@gmail.com')} 
            style={styles.contactItem}
          >
            <Mail size={18} color={Colors.primary.green} />
            <Text style={styles.contactText}>alkawtharfoundationBC@gmail.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://maps.google.com/?q=6655+154+St,+Surrey,+BC+V3S+7C6,+Canada')} 
            style={styles.contactItem}
          >
            <MapPin size={18} color={Colors.primary.green} />
            <Text style={styles.contactText}>6655 154 St, Surrey, BC V3S 7C6, Canada</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.formHeader}>Send Us a Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Subject/Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Your Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
          onPress={handleEmailSend}
          disabled={isLoading}
        >
          <Text style={styles.sendText}>
            {isLoading ? 'Sending...' : 'Send Message'}
          </Text>
        </TouchableOpacity>



        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://alkarartech.com')}>
            <Image source={require('@/assets/images/alkarartech.png')} style={styles.footerLogo} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollContainer: {
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.primary.green,
  },
  mission: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.text.muted,
    lineHeight: 22,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 15,
  },
  socialButton: {
    backgroundColor: Colors.background.light,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  infoContainer: {
    marginBottom: 30,
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    padding: 15,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactText: {
    fontSize: 16,
    color: Colors.text.dark,
    flex: 1,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: Colors.primary.green,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: Colors.background.light,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.text.muted,
  },
  sendText: {
    color: Colors.text.light,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.border,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  footerLogo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    marginTop: 5,
  },
});

export default ContactScreen;