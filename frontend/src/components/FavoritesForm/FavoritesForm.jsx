import { useState, useEffect } from 'react';
import * as userService from '../../services/userService';

export default function FavoritesForm() {
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [favoriteMoods, setFavoriteMoods] = useState([]);
  const [error, setError] = useState('');

  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'];
  const moods = ['Happy', 'Chill', 'Energetic'];

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await userService.getFavorites();
        setFavoriteGenres(response.favoriteGenres || []);
        setFavoriteMoods(response.favoriteMoods || []);
      } catch (error) {
        setError('Failed to fetch favorites');
      }
    }
    fetchFavorites();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await userService.setFavorites({ favoriteGenres, favoriteMoods });
      setError('');
    } catch (err) {
      setError('Failed to save favorites');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      
      <div>
        <label className="block mb-2">Favorite Genres</label>
        <div className="grid grid-cols-2 gap-2">
          {genres.map(genre => (
            <label key={genre} className="flex items-center">
              <input
                type="checkbox"
                checked={favoriteGenres.includes(genre)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFavoriteGenres([...favoriteGenres, genre]);
                  } else {
                    setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
                  }
                }}
                className="mr-2"
              />
              {genre}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Favorite Moods</label>
        <div className="grid grid-cols-2 gap-2">
          {moods.map(mood => (
            <label key={mood} className="flex items-center">
              <input
                type="checkbox"
                checked={favoriteMoods.includes(mood)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFavoriteMoods([...favoriteMoods, mood]);
                  } else {
                    setFavoriteMoods(favoriteMoods.filter(m => m !== mood));
                  }
                }}
                className="mr-2"
              />
              {mood}
            </label>
          ))}
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
      >
        Save Preferences
      </button>
    </form>
  );
}