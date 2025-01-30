import { useState } from 'react';
import * as spotifyService from '../../services/spotifyService';

export default function SpotifyConnect() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await spotifyService.connectSpotify();
      
      if (response?.url) {
        // Log for debugging
        console.log('Redirecting to:', response.url);
        
        // Use window.location.assign for more reliable redirect
        window.location.assign(response.url);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message || 'Failed to connect to Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}
      
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          'Connect with Spotify'
        )}
      </button>
    </div>
  );
}