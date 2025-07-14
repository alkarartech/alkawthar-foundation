// contact.tsx - Updated with organization branding, social links, feedback form, and developer credit

import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react-native";
import useContact, { ContactFormData } from "@/hooks/useContact";
import WebViewWrapper from "@/components/WebViewWrapper";

export default function ContactScreen() {
  const { loading, error, success, submitContactForm } = useContact();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!formData.name) errors.name = 'Please enter your name';
    if (!formData.email) errors.email = 'Please enter your email';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.message) errors.message = 'Please enter a message';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Send to alternate email
      const subject = encodeURIComponent("Message from Al Kawthar Foundation App");
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
      const mailto = `mailto:alkawtharfoundationBC@gmail.com?subject=${subject}&body=${body}`;
      Linking.openURL(mailto);
    }
  };

  const openURL = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Contact Us" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        {/* Logo and About Section */}
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.aboutText}>
            Al Kawthar Foundation is a Shia Islamic non-profit based in Surrey, BC. We provide religious, educational,
            and social services to the Muslim community including prayer, Nikah, burial, and Hajj/Umrah services.
          </Text>
        </View>

        {/* Contact and Social Links */}
        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Information</Text>

          <View style={styles.contactItem}>
            <MapPin size={20} color={Colors.primary.green} />
            <Text style={styles.contactText}>5460 Canada Way, Burnaby, BC V5E 3N5</Text>
          </View>

          <View style={styles.contactItem}>
            <Phone size={20} color={Colors.primary.green} />
            <Text style={[styles.contactText, styles.contactLink]} onPress={() => Linking.openURL("tel:+16043746706")}>Malik Ibrahim (604) 374-6706</Text>
          </View>

          <View style={styles.contactItem}>
            <Mail size={20} color={Colors.primary.green} />
            <Text style={[styles.contactText, styles.contactLink]} onPress={() => Linking.openURL("mailto:alkawtharfoundation015@gmail.com")}>alkawtharfoundation015@gmail.com</Text>
          </View>

          <View style={styles.socialIcons}>
            <Facebook size={24} color={Colors.primary.green} onPress={() => openURL("https://www.facebook.com/alkawtharfoundation.van/")} />
            <Instagram size={24} color={Colors.primary.green} onPress={() => openURL("https://www.instagram.com/alkawtharfoundation/?hl=en")} />
            <Youtube size={24} color={Colors.primary.green} onPress={() => openURL("https://www.youtube.com/@AlKawtharIslamicAssociation")} />
          </View>
        </Card>

        {/* Message Form */}
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Send Us a Message</Text>
          <Input label="Name" value={formData.name} onChangeText={value => handleChange("name", value)} error={formErrors.name} />
          <Input label="Email" value={formData.email} keyboardType="email-address" autoCapitalize="none" onChangeText={value => handleChange("email", value)} error={formErrors.email} />
          <Input label="Message" value={formData.message} onChangeText={value => handleChange("message", value)} multiline numberOfLines={6} textAlignVertical="top" style={styles.textArea} error={formErrors.message} />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button title="Send Message" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
        </Card>

        {/* Feedback Form (WebView) */}
        <Card style={{ height: 400, marginBottom: 16 }}>
          <Text style={styles.formTitle}>Feedback Form</Text>
          <WebViewWrapper source={{ uri: 'https://forms.gle/YSA8ZtFu4ioNB4Ri9' }} style={{ flex: 1 }} />
        </Card>

        {/* Developer Credit */}
        <Card style={{ alignItems: 'center', paddingVertical: 16 }}>
          <Image source={require("@/assets/images/alkarartech.png")} style={{ height: 40, width: 160, resizeMode: 'contain', marginBottom: 8 }} />
          <Text style={styles.devText} onPress={() => openURL("https://alkarartech.com")}>Developed by Alkarar Tech</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.light },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logo: { height: 80, width: 80, resizeMode: 'contain', marginBottom: 8 },
  aboutText: { fontSize: 14, textAlign: 'center', color: Colors.text.dark },
  contactCard: { marginBottom: 16 },
  contactTitle: { fontSize: 18, fontWeight: '600', color: Colors.text.dark, marginBottom: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  contactText: { fontSize: 16, color: Colors.text.dark, marginLeft: 12 },
  contactLink: { textDecorationLine: 'underline', color: Colors.primary.green },
  socialIcons: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 12 },
  formCard: { marginBottom: 16 },
  formTitle: { fontSize: 18, fontWeight: '600', color: Colors.text.dark, marginBottom: 12 },
  textArea: { height: 120, textAlignVertical: 'top' },
  errorText: { color: Colors.ui.error, textAlign: 'center', marginTop: 8 },
  submitButton: { marginTop: 16 },
  devText: { color: Colors.primary.green, fontSize: 14, textDecorationLine: 'underline' },
});
