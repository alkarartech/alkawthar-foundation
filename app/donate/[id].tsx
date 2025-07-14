import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Colors from "@/constants/colors";
import useDonations, { Campaign, DonationFormData } from "@/hooks/useDonations";

export default function DonateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { campaigns, loading, error, success, submitDonation } = useDonations();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  
  const [formData, setFormData] = useState<DonationFormData>({
    amount: '',
    name: '',
    email: '',
    isRecurring: false,
    frequency: 'monthly',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DonationFormData, string>>>({});

  useEffect(() => {
    if (campaigns.length > 0 && id) {
      const foundCampaign = campaigns.find(c => c.id === id);
      if (foundCampaign) {
        setCampaign(foundCampaign);
      }
    }
  }, [campaigns, id]);

  const handleChange = (field: keyof DonationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof DonationFormData, string>> = {};
    
    if (!formData.amount) errors.amount = 'Please enter an amount';
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    if (!formData.name) errors.name = 'Please enter your name';
    if (!formData.email) errors.email = 'Please enter your email';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && campaign) {
      submitDonation(campaign.id, formData);
    }
  };

  if (loading && !campaign) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Donate" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.green} />
          <Text style={styles.loadingText}>Loading donation form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Donate" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Campaign not found</Text>
          <Button 
            title="Go Back to Donations" 
            onPress={() => router.push('/donate')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Donate" showBackButton />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {success ? (
          <Card style={styles.successCard}>
            <Text style={styles.successTitle}>Thank You for Your Donation!</Text>
            <Text style={styles.successText}>
              Your generous contribution of ${formData.amount} to {campaign.title} has been received.
              A receipt has been sent to your email.
            </Text>
            <Button 
              title="Return to Donations" 
              onPress={() => router.push('/donate')}
              style={styles.successButton}
            />
          </Card>
        ) : (
          <>
            <Card style={styles.campaignCard}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignDescription}>{campaign.description}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }
                    ]} 
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>${campaign.raised.toLocaleString()} raised</Text>
                  <Text style={styles.progressText}>${campaign.goal.toLocaleString()} goal</Text>
                </View>
              </View>
            </Card>
            
            <Card style={styles.formCard}>
              <Text style={styles.formTitle}>Donation Amount</Text>
              
              <View style={styles.amountButtons}>
                <Button 
                  title="$25" 
                  variant={formData.amount === '25' ? 'primary' : 'outline'}
                  onPress={() => handleChange('amount', '25')}
                  style={styles.amountButton}
                />
                <Button 
                  title="$50" 
                  variant={formData.amount === '50' ? 'primary' : 'outline'}
                  onPress={() => handleChange('amount', '50')}
                  style={styles.amountButton}
                />
                <Button 
                  title="$100" 
                  variant={formData.amount === '100' ? 'primary' : 'outline'}
                  onPress={() => handleChange('amount', '100')}
                  style={styles.amountButton}
                />
                <Button 
                  title="$250" 
                  variant={formData.amount === '250' ? 'primary' : 'outline'}
                  onPress={() => handleChange('amount', '250')}
                  style={styles.amountButton}
                />
              </View>
              
              <Input
                label="Custom Amount"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={formData.amount}
                onChangeText={(value) => handleChange('amount', value)}
                error={formErrors.amount}
              />
              
              <View style={styles.recurringContainer}>
                <Text style={styles.recurringLabel}>Make this a recurring donation</Text>
                <Switch
                  value={formData.isRecurring}
                  onValueChange={(value) => handleChange('isRecurring', value)}
                  trackColor={{ false: Colors.ui.border, true: Colors.primary.lightGreen }}
                  thumbColor={formData.isRecurring ? Colors.primary.green : '#f4f3f4'}
                />
              </View>
              
              {formData.isRecurring && (
                <View style={styles.frequencyButtons}>
                  <Button 
                    title="Monthly" 
                    variant={formData.frequency === 'monthly' ? 'primary' : 'outline'}
                    onPress={() => handleChange('frequency', 'monthly')}
                    style={styles.frequencyButton}
                  />
                  <Button 
                    title="Quarterly" 
                    variant={formData.frequency === 'quarterly' ? 'primary' : 'outline'}
                    onPress={() => handleChange('frequency', 'quarterly')}
                    style={styles.frequencyButton}
                  />
                  <Button 
                    title="Annually" 
                    variant={formData.frequency === 'annually' ? 'primary' : 'outline'}
                    onPress={() => handleChange('frequency', 'annually')}
                    style={styles.frequencyButton}
                  />
                </View>
              )}
              
              <Text style={styles.formTitle}>Donor Information</Text>
              
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                error={formErrors.name}
              />
              
              <Input
                label="Email"
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                error={formErrors.email}
              />
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              
              <Button 
                title={`Donate $${formData.amount || '0'}`} 
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
                disabled={!formData.amount}
              />
            </Card>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Donation Information</Text>
              <Text style={styles.infoText}>
                • Al Kawthar Foundation is a registered non-profit organization.
              </Text>
              <Text style={styles.infoText}>
                • All donations are tax-deductible.
              </Text>
              <Text style={styles.infoText}>
                • A receipt will be sent to your email address.
              </Text>
              <Text style={styles.infoText}>
                • For questions about donations, please contact our office.
              </Text>
            </View>
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.muted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.ui.error,
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 8,
  },
  campaignCard: {
    marginBottom: 16,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 16,
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.ui.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.green,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 16,
    marginTop: 8,
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountButton: {
    width: '48%',
    marginBottom: 8,
  },
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  recurringLabel: {
    fontSize: 16,
    color: Colors.text.dark,
  },
  frequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  frequencyButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    marginTop: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: Colors.background.offWhite,
    borderRadius: 8,
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
  successCard: {
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: Colors.text.dark,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  successButton: {
    marginTop: 8,
  },
});