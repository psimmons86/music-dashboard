import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as spotifyService from '../../services/spotifyService';
import { Loader2 } from 'lucide-react';

export default function SpotifyConnect() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await spotifyService.connectSpotify();
      if (response?.url) {
        console.log('Redirecting to Spotify auth URL:', response.url);
        window.location.href = response.url;
      } else {
        throw new Error('No Spotify authorization URL received');
      }
    } catch (err) {
      console.error('Spotify connection error:', err);
      setError(err.message || 'Failed to connect to Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {error && (
        <div className="w-full text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          'Connect with Spotify'
        )}
      </button>
    </div>
  );
}