import { useState } from 'react';

export type BookingFormData = {
  eventType: string;
  date: string;
  time: string;
  attendees: string;
  requirements: string;
  name: string;
  email: string;
  phone: string;
};

export default function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const submitBooking = async (formData: BookingFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setBookingId(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would submit to a backend
      console.log('Booking submitted:', formData);
      
      // Generate a random booking ID
      const generatedId = 'BK' + Math.floor(100000 + Math.random() * 900000);
      setBookingId(generatedId);
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError('Failed to submit booking request. Please try again later.');
      setLoading(false);
    }
  };

  return { loading, error, success, bookingId, submitBooking };
}