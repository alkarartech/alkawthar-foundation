import { useState, useEffect } from 'react';

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  isLive: boolean;
  url: string;
};

export default function useYouTubeStreams() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [liveStream, setLiveStream] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        setLoading(true);
        
        // Mock data for YouTube streams
        // In a real implementation, you would use YouTube Data API v3
        const mockVideos: YouTubeVideo[] = [
          {
            id: 'live-stream-1',
            title: 'Friday Prayer - Live Stream',
            description: 'Join us for our weekly Friday prayer service',
            thumbnail: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400&h=225&fit=crop',
            publishedAt: new Date().toISOString(),
            isLive: true,
            url: 'https://www.youtube.com/@AlKawtharIslamicAssociation/live'
          },
          {
            id: 'archived-1',
            title: 'Islamic Studies Class - The Importance of Prayer',
            description: 'A comprehensive discussion on the significance of daily prayers in Islam',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example1'
          },
          {
            id: 'archived-2',
            title: 'Community Iftar Event Highlights',
            description: 'Highlights from our recent community Iftar gathering during Ramadan',
            thumbnail: 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example2'
          },
          {
            id: 'archived-3',
            title: 'Youth Program - Understanding Islamic History',
            description: 'Educational session for young Muslims about Islamic civilization',
            thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example3'
          },
          {
            id: 'archived-4',
            title: 'Special Lecture - The Path to Spiritual Growth',
            description: 'Inspiring lecture on personal development through Islamic teachings',
            thumbnail: 'https://images.unsplash.com/photo-1544531586-fbd96ceaff1c?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example4'
          }
        ];
        
        const liveVideos = mockVideos.filter(video => video.isLive);
        const archivedVideos = mockVideos.filter(video => !video.isLive);
        
        setLiveStream(liveVideos.length > 0 ? liveVideos[0] : null);
        setVideos(archivedVideos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchYouTubeData();
  }, []);

  return { videos, liveStream, loading, error };
}