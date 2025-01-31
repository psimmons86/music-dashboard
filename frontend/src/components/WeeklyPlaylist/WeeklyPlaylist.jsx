import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Music, Loader2 } from 'lucide-react';
import * as spotifyService from '../../services/spotifyService';

export default function WeeklyPlaylist() {
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateWeeklyPlaylist = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Get week number for consistent weekly playlists
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil(days / 7);

        // Use week number to determine genre and mood
        const genres = ['Rock', 'Pop', 'Electronic', 'Hip Hop', 'Jazz', 'Classical'];
        const moods = ['Happy', 'Chill', 'Energetic', 'Focused'];

        const weeklyGenre = genres[weekNumber % genres.length];
        const weeklyMood = moods[weekNumber % moods.length];

        const recommendations = await spotifyService.getRecommendations(weeklyGenre, weeklyMood);
        setPlaylist(recommendations);
      } catch (error) {
        console.error('Error generating weekly playlist:', error);
        setError(error.message || 'Failed to generate playlist');
      } finally {
        setIsLoading(false);
      }
    };

    generateWeeklyPlaylist();
  }, []);

  return (
    <Card className="w-full bg-white/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Weekly Playlist</h3>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-4 text-center">
            {error}
          </div>
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
          <div className="text-center text-gray-500 p-4">
            No playlist available
          </div>
        )}
      </CardContent>
    </Card>
  );
}