
import { useState, useEffect } from 'react';
import { getFavorites, setFavorites } from '../services/userService';

export default function FavoritesForm() {
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [favoriteMoods, setFavoriteMoods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const { favoriteGenres, favoriteMoods } = await getFavorites();
        setFavoriteGenres(favoriteGenres);
        setFavoriteMoods(favoriteMoods);
      } catch (err) {
        setError('Failed to fetch favorites');
      }
    }
    fetchFavorites();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await setFavorites({ favoriteGenres, favoriteMoods });
      setError('');
    } catch (err) {
      setError('Failed to save favorites');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Favorite Genres</label>
        <input
          type="text"
          value={favoriteGenres.join(', ')}
          onChange={(e) => setFavoriteGenres(e.target.value.split(',').map(g => g.trim()))}
        />
      </div>
      <div>
        <label>Favorite Moods</label>
        <input
          type="text"
          value={favoriteMoods.join(', ')}
          onChange={(e) => setFavoriteMoods(e.target.value.split(',').map(m => m.trim()))}
        />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Save Favorites</button>
    </form>
  );
}