import { useState, useEffect } from 'react';
import { getSpotifyStatus } from '../../services/spotifyService';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import * as userService from '../../services/userService';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [favoriteMoods, setFavoriteMoods] = useState([]);
  const [error, setError] = useState('');

  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'];
  const moods = ['Happy', 'Chill', 'Energetic'];

  useEffect(() => {
    async function checkSpotifyStatus() {
      const status = await getSpotifyStatus();
      setSpotifyConnected(status.connected);
    }
    async function loadFavorites() {
      try {
        const favorites = await userService.getFavorites();
        setFavoriteGenres(favorites.favoriteGenres || []);
        setFavoriteMoods(favorites.favoriteMoods || []);
      } catch (err) {
        setError('Failed to load preferences');
      }
    }
    checkSpotifyStatus();
    loadFavorites();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await userService.setFavorites({ favoriteGenres, favoriteMoods });
      setError('');
    } catch (err) {
      setError('Failed to save preferences');
    }
  }

  return (
    <div className="profile-page">
      <h1 className="text-2xl mb-4">Profile</h1>
      
      <section className="profile-section">
        <h2>Connected Services</h2>
        <div className="mb-4">
          {spotifyConnected ? (
            <p className="text-green-500">✓ Spotify Connected</p>
          ) : (
            <SpotifyConnect />
          )}
        </div>
      </section>

      <section className="profile-section">
        <h2>Music Preferences</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Favorite Genres</label>
            <div className="genre-grid">
              {genres.map(genre => (
                <label key={genre} className="genre-item">
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
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label>Preferred Moods</label>
            <div className="mood-grid">
              {moods.map(mood => (
                <label key={mood} className="mood-item">
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
                  />
                  <span>{mood}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="save-button">
            Save Preferences
          </button>
        </form>
      </section>
    </div>
  );
}