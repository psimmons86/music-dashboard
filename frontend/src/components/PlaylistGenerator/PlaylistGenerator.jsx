import { useState } from 'react';
import * as playlistService from '../../services/playlistService';

export default function PlaylistGenerator() {
  const [formData, setFormData] = useState({
    genre: '',
    mood: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'];
  const moods = ['Happy', 'Chill', 'Energetic'];

  function generatePlaylistName(genre, mood) {
    const date = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
    return `${date} - ${mood} ${genre} Mix`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      if (!formData.genre || !formData.mood) {
        setError('Please select both genre and mood');
        return;
      }

      const playlistData = {
        ...formData,
        name: generatePlaylistName(formData.genre, formData.mood)
      };

      console.log('Creating playlist:', playlistData);
      const response = await playlistService.create(playlistData);
      console.log('Playlist created:', response);
      
      setSuccess(`Playlist "${playlistData.name}" created! Open in Spotify: ${response.url}`);
      setFormData({
        genre: '',
        mood: ''
      });
    } catch (err) {
      console.error('Playlist creation error:', err);
      setError(err.message || 'Failed to create playlist. Please try reconnecting to Spotify.');
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
          <a href={success.split(': ')[1]} target="_blank" rel="noopener noreferrer" 
             className="underline">{success}</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Genre</label>
          <select 
            value={formData.genre}
            onChange={(e) => setFormData({...formData, genre: e.target.value})}
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          >
            <option value="">Select Genre</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Mood</label>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({...formData, mood: e.target.value})}
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          >
            <option value="">Select Mood</option>
            {moods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Creating Playlist...' : 'Generate Playlist'}
        </button>
      </form>
    </div>
  );
}