import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as weeklyPlaylistService from '../../services/weeklyPlaylistService';

export default function WeeklyPlaylistAdmin() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const spotifyPlaylistId = playlistUrl.split('/').pop().split('?')[0];
      const embedUrl = `https://open.spotify.com/embed/playlist/${spotifyPlaylistId}`;
      
      await weeklyPlaylistService.updateWeeklyPlaylist({
        spotifyPlaylistId,
        embedUrl,
        title,
        description
      });
      
      // Reset form
      setPlaylistUrl('');
      setTitle('');
      setDescription('');
      
      // Optionally redirect or show success message
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update playlist:', error);
      setError(error.message || 'Failed to update playlist');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Update Weekly Playlist</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Spotify Playlist URL
          </label>
          <input
            type="text"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://open.spotify.com/playlist/..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Update Weekly Playlist
        </button>
      </form>
    </div>
  );
}

export { WeeklyPlaylistAdmin };