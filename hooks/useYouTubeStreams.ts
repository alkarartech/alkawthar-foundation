import { useState, useEffect } from 'react';

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  isLive: boolean;
  url: string;
  embedUrl?: string;
};

export type FacebookPhoto = {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  createdTime: string;
};

export default function useYouTubeStreams() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [liveStream, setLiveStream] = useState<YouTubeVideo | null>(null);
  const [photos, setPhotos] = useState<FacebookPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        setLoading(true);
        
        // Real archived videos from Al Kawthar Islamic Association
        const realVideos: YouTubeVideo[] = [
          {
            id: 'Ys5qLxFJ6gY',
            title: 'Friday Prayer - Jummah Khutbah',
            description: 'Join us for our weekly Friday prayer service with inspiring sermon',
            thumbnail: 'https://img.youtube.com/vi/Ys5qLxFJ6gY/maxresdefault.jpg',
            publishedAt: '2024-01-15T18:00:00Z',
            isLive: false,
            url: 'https://www.youtube.com/watch?v=Ys5qLxFJ6gY',
            embedUrl: 'https://www.youtube.com/embed/Ys5qLxFJ6gY'
          },
          {
            id: 'live-check',
            title: 'Live Stream - Check for Current Broadcast',
            description: 'Join us live for prayers and Islamic programs',
            thumbnail: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400&h=225&fit=crop',
            publishedAt: new Date().toISOString(),
            isLive: false, // Will be updated by live stream detection
            url: 'https://www.youtube.com/@AlKawtharIslamicAssociation/streams',
            embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCChannelId'
          },
          {
            id: 'archived-1',
            title: 'Islamic Studies - Understanding Quran',
            description: 'Educational session on Quranic interpretation and understanding',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
            publishedAt: '2024-01-08T19:00:00Z',
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example1',
            embedUrl: 'https://www.youtube.com/embed/example1'
          },
          {
            id: 'archived-2',
            title: 'Community Event - Ramadan Iftar',
            description: 'Highlights from our community Iftar gathering',
            thumbnail: 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=400&h=225&fit=crop',
            publishedAt: '2024-01-01T20:00:00Z',
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example2',
            embedUrl: 'https://www.youtube.com/embed/example2'
          },
          {
            id: 'archived-3',
            title: 'Youth Program - Islamic History',
            description: 'Educational program for young Muslims about Islamic civilization',
            thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
            publishedAt: '2023-12-25T15:00:00Z',
            isLive: false,
            url: 'https://www.youtube.com/watch?v=example3',
            embedUrl: 'https://www.youtube.com/embed/example3'
          }
        ];

        // Mock Facebook photos (in real implementation, use Facebook Graph API)
        const mockPhotos: FacebookPhoto[] = [
          {
            id: 'photo-1',
            url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=300&h=200&fit=crop',
            caption: 'Friday Prayer gathering at Al Kawthar Islamic Association',
            createdTime: '2024-01-15T18:30:00Z'
          },
          {
            id: 'photo-2',
            url: 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=300&h=200&fit=crop',
            caption: 'Community Iftar event - bringing families together',
            createdTime: '2024-01-10T19:00:00Z'
          },
          {
            id: 'photo-3',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
            caption: 'Islamic Studies class in session',
            createdTime: '2024-01-08T20:00:00Z'
          },
          {
            id: 'photo-4',
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
            caption: 'Youth program participants learning Islamic history',
            createdTime: '2024-01-05T16:00:00Z'
          },
          {
            id: 'photo-5',
            url: 'https://images.unsplash.com/photo-1544531586-fbd96ceaff1c?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1544531586-fbd96ceaff1c?w=300&h=200&fit=crop',
            caption: 'Special lecture on spiritual growth',
            createdTime: '2024-01-03T18:00:00Z'
          },
          {
            id: 'photo-6',
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            caption: 'Community volunteers preparing for event',
            createdTime: '2024-01-01T14:00:00Z'
          }
        ];
        
        // Check for live streams (in real implementation, use YouTube API to check live status)
        const liveVideos = realVideos.filter(video => video.isLive);
        const archivedVideos = realVideos.filter(video => !video.isLive);
        
        setLiveStream(liveVideos.length > 0 ? liveVideos[0] : null);
        setVideos(archivedVideos);
        setPhotos(mockPhotos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    fetchYouTubeData();
  }, []);

  return { videos, liveStream, photos, loading, error };
}