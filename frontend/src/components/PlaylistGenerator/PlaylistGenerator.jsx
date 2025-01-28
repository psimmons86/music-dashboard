// In PlaylistGenerator.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as playlistService from '../../services/playlistService';
import * as spotifyService from '../../services/spotifyService';

export default function PlaylistGenerator() {
  const [formData, setFormData] = useState({
    mood: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const navigate = useNavigate();
  const moods = ['Happy', 'Sad'];

  useEffect(() => {
    const fetchTopArtists = async () => {
      setLoadingArtists(true);
      try {
        const response = await spotifyService.getTopArtists();
        console.log('Top Artists:', response);
      } catch (error) {
        console.error('Error fetching top artists:', error);
        if (error.message?.includes('Insufficient client scope')) {
          handleReconnect();
        }
      } finally {
        setLoadingArtists(false);
      }
    };

    fetchTopArtists();
  }, []);

  const handleReconnect = async () => {
    setIsConnecting(true);
    try {
      const response = await spotifyService.connectSpotify();
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error) {
      console.error('Error reconnecting:', error);
      setError('Failed to reconnect to Spotify');
    } finally {
      setIsConnecting(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      if (!formData.mood) {
        setError('Please select a mood');
        return;
      }

      const playlistData = {
        mood: formData.mood
      };

      const response = await playlistService.create(playlistData);

      if (response?.url) {
        setSuccess(`Playlist created! Open in Spotify: ${response.url}`);
        setFormData({
          mood: ''
        });
      } else {
        throw new Error('No playlist URL returned');
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      
      if (err.message?.includes('Insufficient client scope') || 
          err.message?.includes('reconnect') || 
          err.status === 403) {
        setError('Please reconnect your Spotify account to grant necessary permissions');
        const shouldReconnect = window.confirm('Your Spotify connection needs to be renewed. Would you like to reconnect now?');
        if (shouldReconnect) {
          await handleReconnect();
        } else {
          navigate('/profile');
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
      <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Mood</label>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
            className="w-full p-2 border rounded"
            required
            disabled={loading || loadingArtists || isConnecting}
          >
            <option value="">Select Mood</option>
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={loading || loadingArtists || isConnecting}
        >
          {loading ? 'Creating Playlist...' : 
           loadingArtists ? 'Loading Artists...' :
           isConnecting ? 'Connecting to Spotify...' : 
           'Create Playlist'}
        </button>
      </form>
    </div>
  );
}