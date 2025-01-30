import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as playlistService from '../../services/playlistService';
import * as spotifyService from '../../services/spotifyService';

export default function PlaylistGenerator(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [genre, setGenre] = useState('pop');
  const [mood, setMood] = useState('happy');
  const navigate = useNavigate();

  // Available options
  const genres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical'];
  const moods = ['Happy', 'Chill', 'Energetic', 'Sad', 'Focused'];

  // Create playlist based on mood and genre
  async function handleCreatePlaylist() {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Get recommendations based on mood and genre
      const tracks = await spotifyService.getRecommendations(genre, mood);
      
      // Create playlist with recommended tracks
      const response = await playlistService.create(tracks);
      if (response?.url) {
        setSuccess(`Playlist created! Open in Spotify: ${response.url}`);
        setPlaylist(response);
        props.onPlaylistCreated?.(response);
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      if (err.message?.includes('reconnect')) {
        setError('Please reconnect your Spotify account');
        const shouldReconnect = window.confirm('Your Spotify connection needs to be renewed. Would you like to reconnect now?');
        if (shouldReconnect) {
          await handleReconnect();
        }
        return;
      }
      setError(err.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Playlist Generator</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <a 
            href={success.split(': ')[1]} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline"
          >
            {success}
          </a>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          >
            {genres.map(g => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          >
            {moods.map(m => (
              <option key={m} value={m.toLowerCase()}>{m}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreatePlaylist}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Creating Playlist...' : 'Create Playlist'}
        </button>
      </div>

      {playlist && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Playlist</h3>
          <a 
            href={playlist.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block mb-2 text-purple-600 hover:underline"
          >
            {playlist.name}
          </a>
          <p className="text-gray-600">{playlist.trackCount} tracks</p>
          
          {playlist.embedUrl && (
            <iframe
              src={playlist.embedUrl}
              width="100%"
              height="380"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              title="Spotify Playlist"
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  );
}