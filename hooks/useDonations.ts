import { useState } from 'react';

export type Campaign = {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
};

export type DonationFormData = {
  amount: string;
  name: string;
  email: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually';
};

export default function useDonations() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Mosque Expansion Project',
      description: 'Help us expand our prayer hall to accommodate our growing community.',
      goal: 250000,
      raised: 175000,
    },
    {
      id: '2',
      title: 'Ramadan Food Drive',
      description: 'Support our initiative to provide iftar meals for those in need during Ramadan.',
      goal: 15000,
      raised: 9500,
    },
    {
      id: '3',
      title: 'Islamic School Scholarship Fund',
      description: 'Contribute to our scholarship fund to help children access Islamic education.',
      goal: 50000,
      raised: 12500,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitDonation = async (campaignId: string, formData: DonationFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would submit to a payment processor
      console.log('Donation submitted:', { campaignId, ...formData });
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting donation:', err);
      setError('Failed to process donation. Please try again later.');
      setLoading(false);
    }
  };

  return { campaigns, loading, error, success, submitDonation };
}