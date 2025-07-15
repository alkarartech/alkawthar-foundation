import { useState, useEffect } from 'react';

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  youtubeId?: string;
  htmlLink?: string;
  startDate?: Date;
  endDate?: Date;
};

export default function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from an API or Google Calendar
        // For now, we'll use mock data
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Friday Prayer & Sermon',
            date: '15 Jul',
            time: '1:00 PM - 2:00 PM',
            location: 'Main Prayer Hall',
            description: 'Weekly Friday prayer and sermon led by Imam Abdullah.',
            htmlLink: '#',
            startDate: new Date('2024-07-15T13:00:00'),
            endDate: new Date('2024-07-15T14:00:00'),
          },
          {
            id: '2',
            title: 'Islamic Studies Class',
            date: '16 Jul',
            time: '7:00 PM - 8:30 PM',
            location: 'Education Room',
            description: 'Weekly class on Islamic jurisprudence and ethics.',
            youtubeId: 'dQw4w9WgXcQ',
            htmlLink: '#',
            startDate: new Date('2024-07-16T19:00:00'),
            endDate: new Date('2024-07-16T20:30:00'),
          },
          {
            id: '3',
            title: 'Community Iftar',
            date: '20 Jul',
            time: '8:00 PM - 10:00 PM',
            location: 'Community Hall',
            description: 'Community iftar dinner during Ramadan. All are welcome to join.',
            htmlLink: '#',
            startDate: new Date('2024-07-20T20:00:00'),
            endDate: new Date('2024-07-20T22:00:00'),
          },
          {
            id: '4',
            title: "Children's Quran Competition",
            date: '23 Jul',
            time: '10:00 AM - 12:00 PM',
            location: 'Education Room',
            description: 'Annual Quran recitation competition for children aged 7-15.',
            youtubeId: 'dQw4w9WgXcQ',
            htmlLink: '#',
            startDate: new Date('2024-07-23T10:00:00'),
            endDate: new Date('2024-07-23T12:00:00'),
          },
          {
            id: '5',
            title: 'Eid Prayer',
            date: '25 Jul',
            time: '8:00 AM - 9:30 AM',
            location: 'Main Prayer Hall',
            description: 'Eid prayer followed by community celebration.',
            htmlLink: '#',
            startDate: new Date('2024-07-25T08:00:00'),
            endDate: new Date('2024-07-25T09:30:00'),
          },
        ];
        
        setEvents(mockEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}