import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as playlistService from '../../services/playlistService';
import * as spotifyService from '../../services/spotifyService';

export default function PlaylistGenerator(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSpotifyConnection = async () => {
      try {
        const status = await spotifyService.getSpotifyStatus();
        if (!status.connected) {
          setError('Please connect your Spotify account');
          navigate('/profile');
        }
      } catch (err) {
        console.error('Error checking Spotify connection:', err);
        setError('Unable to verify Spotify connection');
      }
    };
    checkSpotifyConnection();
  }, [navigate]);

  const handleReconnect = async () => {
    try {
      await spotifyService.disconnectSpotify();
      const response = await spotifyService.connectSpotify();
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err) {
      console.error('Error reconnecting:', err);
      setError('Failed to reconnect to Spotify');
      navigate('/profile');
    }
  };

  async function handleCreatePlaylist() {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const response = await playlistService.create();
      if (response?.url) {
        setSuccess(`Playlist created! Open in Spotify: ${response.url}`);
        setPlaylist(response);
        props.onPlaylistCreated(response);
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      if (err.message?.includes('Insufficient client scope') || err.message?.includes('reconnect')) {
        setError('Please reconnect your Spotify account to grant necessary permissions');
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
      <h2 className="text-2xl font-bold mb-4">Daily Mix Generator</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <a href={success.split(': ')[1]} target="_blank" rel="noopener noreferrer" className="underline">
            {success}
          </a>
        </div>
      )}
      <button
        onClick={handleCreatePlaylist}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Creating Playlist...' : 'Create Daily Mix'}
      </button>
      {playlist && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated Playlist</h3>
          <a href={playlist.url} target="_blank" rel="noopener noreferrer" className="block mb-2 underline">
            {playlist.name}
          </a>
          <p className="text-gray-600">{playlist.trackCount} tracks</p>
        </div>
      )}
    </div>
  );
}