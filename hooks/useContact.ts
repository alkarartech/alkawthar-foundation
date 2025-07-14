import { useState } from 'react';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContactForm = async (formData: ContactFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would submit to a backend
      console.log('Contact form submitted:', formData);
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('Failed to send message. Please try again later.');
      setLoading(false);
    }
  };

  return { loading, error, success, submitContactForm };
}