import { useState, useEffect } from 'react';
import { 
  getProfile, 
  updateProfile, 
  uploadProfilePicture, 
  getFavorites, 
  setFavorites 
} from '../../services/userService';
import { 
  getSpotifyStatus, 
  disconnectSpotify 
} from '../../services/spotifyService';
import SpotifyConnect from "../../components/SpotifyConnect/SpotifyConnect";
import './ProfilePage.css';

const GENRES = [
  'Rock', 'Hip Hop', 'Electronic', 'Pop', 
  'Jazz', 'Classical', 'R&B', 'Country', 
  'Metal', 'Folk', 'Blues'
];

const MOODS = [
  'Happy', 'Chill', 'Energetic', 
  'Melancholic', 'Romantic', 'Focused'
];

export default function ProfilePage({ user }) {
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    socialLinks: {
      discogs: { url: '', verified: false },
      vinylVault: { url: '', verified: false },
      lastFm: { url: '', verified: false }
    },
    preferences: {
      privacyLevel: 'public',
      emailNotifications: true
    }
  });
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [favoriteMoods, setFavoriteMoods] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [profileResponse, favoritesResponse, spotifyStatus] = await Promise.all([
          getProfile(),
          getFavorites(),
          getSpotifyStatus()
        ]);

        setProfileData({
          name: profileResponse.name,
          bio: profileResponse.bio || '',
          location: profileResponse.location || '',
          socialLinks: profileResponse.socialLinks || {
            discogs: { url: '', verified: false },
            vinylVault: { url: '', verified: false },
            lastFm: { url: '', verified: false }
          },
          preferences: profileResponse.preferences || {
            privacyLevel: 'public',
            emailNotifications: true
          }
        });

        setFavoriteGenres(favoritesResponse.favoriteGenres || []);
        setFavoriteMoods(favoritesResponse.favoriteMoods || []);
        setSpotifyConnected(spotifyStatus.connected);
      } catch (err) {
        setError('Failed to load profile data');
      }
    }

    loadProfileData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile({
        ...profileData,
        favoriteGenres,
        favoriteMoods
      });
      
      setProfileData(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadProfilePicture(file);
        setSuccess('Profile picture updated');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to upload profile picture');
      }
    }
  };

  const handleDisconnectSpotify = async () => {
    try {
      await disconnectSpotify();
      setSpotifyConnected(false);
      setSuccess('Spotify disconnected');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to disconnect Spotify');
    }
  };

  const toggleGenre = (genre) => {
    setFavoriteGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre].slice(0, 5)
    );
  };

  const toggleMood = (mood) => {
    setFavoriteMoods(prev => 
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood].slice(0, 3)
    );
  };

  return (
    <div className="profile-page">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="profile-section">
        <h2>Profile Information</h2>
        
        <div className="profile-picture-container">
          <img
            src={profileData.profilePicture || '/default-profile.png'}
            alt=""
            className="profile-picture"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-picture-input"
          />
          <label
            htmlFor="profile-picture-input"
            className="profile-picture-overlay"
          >
            Change Picture
          </label>
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="profile-edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              />
            </div>

            <div className="music-preferences">
              <h3>Favorite Genres (Max 5)</h3>
              <div className="genre-grid">
                {GENRES.map(genre => (
                  <label key={genre} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={favoriteGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                    />
                    {genre}
                  </label>
                ))}
              </div>

              <h3>Favorite Moods (Max 3)</h3>
              <div className="mood-grid">
                {MOODS.map(mood => (
                  <label key={mood} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={favoriteMoods.includes(mood)}
                      onChange={() => toggleMood(mood)}
                    />
                    {mood}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Privacy Level</label>
              <select
                value={profileData.preferences.privacyLevel}
                onChange={(e) => setProfileData({
                  ...profileData, 
                  preferences: {
                    ...profileData.preferences, 
                    privacyLevel: e.target.value
                  }
                })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={profileData.preferences.emailNotifications}
                  onChange={(e) => setProfileData({
                    ...profileData, 
                    preferences: {
                      ...profileData.preferences, 
                      emailNotifications: e.target.checked
                    }
                  })}
                />
                Receive Email Notifications
              </label>
            </div>

            <div className="profile-actions">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-preview">
            <button
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              Edit Profile
            </button>
            <h3>{profileData.name}</h3>
            {profileData.location && (
              <p className="location">📍 {profileData.location}</p>
            )}
            {profileData.bio && (
              <p className="bio">{profileData.bio}</p>
            )}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2>Connected Services</h2>
        <div className="spotify-connection">
          {spotifyConnected ? (
            <div className="spotify-status connected">
              <span>✓ Spotify Connected</span>
              <button
                onClick={handleDisconnectSpotify}
                className="disconnect-btn"
              >
                Disconnect Spotify
              </button>
            </div>
          ) : (
            <SpotifyConnect />
          )}
        </div>
      </section>
    </div>
  );
}