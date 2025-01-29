import { useState, useEffect } from 'react';
import * as playlistService from '../../services/playlistService';

export default function SpotifyPlayer() {
  const [playlistEmbedUrl, setPlaylistEmbedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreatePlaylist() {
    try {
      setLoading(true);
      setError('');
      const response = await playlistService.create();
      
      if (response?.embedUrl) {
        setPlaylistEmbedUrl(response.embedUrl);
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError(err.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="spotify-player-container h-full flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {playlistEmbedUrl ? (
        <iframe
          src={playlistEmbedUrl}
          width="100%"
          height="380"
          frameBorder="0"
          allowFullScreen=""
          allow="encrypted-media"
          title="Spotify Playlist"
          className="flex-grow"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={handleCreatePlaylist}
            disabled={loading}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating Playlist...' : 'Generate Daily Mix'}
          </button>
        </div>
      )}
    </div>
  );
}