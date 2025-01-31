import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Music, Loader2 } from 'lucide-react';
import * as weeklyPlaylistService from '../../services/weeklyPlaylistService';

export default function WeeklyPlaylist() {
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        setIsLoading(true);
        const data = await weeklyPlaylistService.getCurrentPlaylist();
        setPlaylist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlaylist();
  }, []);

  return (
    <Card className="w-full bg-white/60">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">
            {playlist?.title || 'Weekly Editorial Playlist'}
          </h3>
        </div>
        {playlist?.description && (
          <p className="text-sm text-gray-600">{playlist.description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : playlist?.embedUrl ? (
          <div className="aspect-square w-full">
            <iframe
              src={playlist.embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            No playlist selected for this week
          </div>
        )}
      </CardContent>
    </Card>
  );
}