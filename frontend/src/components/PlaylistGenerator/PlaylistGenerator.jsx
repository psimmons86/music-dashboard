import { useState } from 'react';
import * as playlistService from '../../services/playlistService';

export default function PlaylistGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    mood: ''
  });
  const [error, setError] = useState('');

  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'];
  const moods = ['Happy', 'Chill', 'Energetic'];

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      if (!formData.name || !formData.genre || !formData.mood) {
        setError('Please fill in all fields');
        return;
      }
      await playlistService.create(formData);
      // Reset form after successful creation
      setFormData({
        name: '',
        genre: '',
        mood: ''
      });
    } catch (err) {
      setError('Failed to create playlist. Please make sure you are connected to Spotify.');
      console.error('Error:', err);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Playlist Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Genre</label>
          <select 
            value={formData.genre}
            onChange={(e) => setFormData({...formData, genre: e.target.value})}
            className="w-full p-2 border rounded"
            required
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
          >
            <option value="">Select Mood</option>
            {moods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Generate Playlist
        </button>
      </form>
    </div>
  );
}