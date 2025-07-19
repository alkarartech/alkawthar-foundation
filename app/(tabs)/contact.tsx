import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Linking, ScrollView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize EmailJS
  React.useEffect(() => {
    emailjs.init({
      publicKey: "pr973Oj1-Zn5YBcz6",
    });
  }, []);

  const handleEmailSend = async () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: 'alkawtharfoundationBC@gmail.com',
      };

      await emailjs.send(
        'service_rdevwae',
        'template_tph2uqc',
        templateParams
      );

      Alert.alert('Success', 'Your message has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('EmailJS error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Contact Us" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.header}>Contact Al Kawthar Foundation</Text>
        <Text style={styles.mission}>Spreading knowledge, unity, and community service across Vancouver and beyond.</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100083609100746')} style={styles.socialButton}>
            <Text style={styles.socialText}>📘 Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/alkawtharfoundation/')} style={styles.socialButton}>
            <Text style={styles.socialText}>📷 Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:alkawtharfoundationBC@gmail.com')} style={styles.socialButton}>
            <Text style={styles.socialText}>✉️ Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.contactText}>📞 Contact Board: +1 (778) 223-0111</Text>
          <Text style={styles.contactText}>📧 Email: alkawtharfoundationBC@gmail.com</Text>
        </View>

        <Text style={styles.formHeader}>Send Us a Message</Text>
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

        <Text style={styles.formHeader}>Google Feedback Form</Text>
        <View style={{ height: 400, width: '100%', marginVertical: 10 }}>
          <WebView source={{ uri: 'https://docs.google.com/forms/d/e/1FAIpQLSd23ZB7AvmvfhuYSwk8p3iNGRkgaFehXYE-K7L83ZYzjLK6bg/viewform?usp=sf_link' }} />
        </View>

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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  mission: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  socialButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 5,
  },
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLogo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    marginTop: 5,
  },
});

export default ContactScreen;