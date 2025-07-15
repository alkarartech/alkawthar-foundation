import { useState, useEffect } from 'react';

export type GoogleCalendarEvent = {
  id: string;
  title: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  description?: string;
  htmlLink: string;
};

export type ProcessedEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  htmlLink: string;
  startDate: Date;
  endDate: Date;
};

const CALENDAR_ID = 'alkawtharfoundationbc@gmail.com';
const API_KEY = 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJBVJJo'; // This would normally be in env vars

export default function useGoogleCalendarEvents() {
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatEventTime = (start: any, end: any) => {
    if (start.date && end.date) {
      return 'All Day';
    }
    
    const startTime = new Date(start.dateTime || start.date);
    const endTime = new Date(end.dateTime || end.date);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatEventDate = (start: any) => {
    const date = new Date(start.dateTime || start.date);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const processEvents = (rawEvents: GoogleCalendarEvent[]): ProcessedEvent[] => {
    return rawEvents.map(event => ({
      id: event.id,
      title: event.title || 'Untitled Event',
      date: formatEventDate(event.start),
      time: formatEventTime(event.start, event.end),
      location: event.location || 'Al Kawthar Foundation',
      description: event.description || 'No description available',
      htmlLink: event.htmlLink,
      startDate: new Date(event.start.dateTime || event.start.date || ''),
      endDate: new Date(event.end.dateTime || event.end.date || '')
    }));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current date and 3 months ahead
        const now = new Date();
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(now.getMonth() + 3);
        
        const timeMin = now.toISOString();
        const timeMax = threeMonthsLater.toISOString();
        
        // Try to fetch from Google Calendar API
        try {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
            `key=${API_KEY}&` +
            `timeMin=${timeMin}&` +
            `timeMax=${timeMax}&` +
            `singleEvents=true&` +
            `orderBy=startTime&` +
            `maxResults=50`
          );
          
          if (response.ok) {
            const data = await response.json();
            const processedEvents = processEvents(data.items || []);
            setEvents(processedEvents);
          } else {
            throw new Error('API request failed');
          }
        } catch (apiError) {
          console.log('Google Calendar API not available, using fallback events');
          
          // Fallback to mock events if API fails
          const mockEvents: ProcessedEvent[] = [
            {
              id: '1',
              title: 'Friday Prayer & Sermon',
              date: '15 Jul',
              time: '1:00 PM - 2:00 PM',
              location: 'Main Prayer Hall',
              description: 'Weekly Friday prayer and sermon led by Imam Abdullah.',
              htmlLink: '#',
              startDate: new Date('2024-07-15T13:00:00'),
              endDate: new Date('2024-07-15T14:00:00')
            },
            {
              id: '2',
              title: 'Islamic Studies Class',
              date: '16 Jul',
              time: '7:00 PM - 8:30 PM',
              location: 'Education Room',
              description: 'Weekly class on Islamic jurisprudence and ethics.',
              htmlLink: '#',
              startDate: new Date('2024-07-16T19:00:00'),
              endDate: new Date('2024-07-16T20:30:00')
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
              endDate: new Date('2024-07-20T22:00:00')
            },
            {
              id: '4',
              title: "Children's Quran Competition",
              date: '23 Jul',
              time: '10:00 AM - 12:00 PM',
              location: 'Education Room',
              description: 'Annual Quran recitation competition for children aged 7-15.',
              htmlLink: '#',
              startDate: new Date('2024-07-23T10:00:00'),
              endDate: new Date('2024-07-23T12:00:00')
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
              endDate: new Date('2024-07-25T09:30:00')
            },
          ];
          
          setEvents(mockEvents);
        }
        
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