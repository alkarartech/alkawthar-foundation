import { useState, useEffect } from 'react';

export type PrayerTime = {
  name: string;
  adhan: string;
  iqamah: string;
};

export default function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockPrayerTimes: PrayerTime[] = [
          { name: 'Fajr', adhan: '5:30 AM', iqamah: '5:45 AM' },
          { name: 'Dhuhr', adhan: '1:15 PM', iqamah: '1:30 PM' },
          { name: 'Asr', adhan: '4:45 PM', iqamah: '5:00 PM' },
          { name: 'Maghrib', adhan: '7:30 PM', iqamah: '7:40 PM' },
          { name: 'Isha', adhan: '9:15 PM', iqamah: '9:30 PM' },
        ];
        
        setPrayerTimes(mockPrayerTimes);
        
        // Determine next prayer
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Simple logic to determine next prayer based on current time
        // In a real app, this would be more sophisticated
        let nextIndex = 0;
        if (currentHour >= 5 && (currentHour < 13 || (currentHour === 13 && currentMinute < 15))) {
          nextIndex = 1; // Dhuhr
        } else if (currentHour >= 13 && (currentHour < 16 || (currentHour === 16 && currentMinute < 45))) {
          nextIndex = 2; // Asr
        } else if (currentHour >= 16 && (currentHour < 19 || (currentHour === 19 && currentMinute < 30))) {
          nextIndex = 3; // Maghrib
        } else if (currentHour >= 19 && (currentHour < 21 || (currentHour === 21 && currentMinute < 15))) {
          nextIndex = 4; // Isha
        }
        
        setNextPrayerIndex(nextIndex);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  return { prayerTimes, loading, error, nextPrayerIndex };
}