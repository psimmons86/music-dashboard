import { useState, useEffect } from 'react';
import { getSpotifyStatus, disconnectSpotify } from '../../services/spotifyService';
import { getProfile, updateProfile, uploadProfilePicture } from '../../services/userService';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: '',
    location: '',
    socialLinks: {
      discogs: '',
      vinylVault: '',
      lastFm: ''
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (profile) {
          setProfileData({
            name: profile.name,
            bio: profile.bio || '',
            location: profile.location || '',
            socialLinks: {
              discogs: profile.socialLinks?.discogs || '',
              vinylVault: profile.socialLinks?.vinylVault || '',
              lastFm: profile.socialLinks?.lastFm || ''
            }
          });
        }

        try {
          const spotifyStatus = await getSpotifyStatus();
          setSpotifyConnected(spotifyStatus.connected);
        } catch (spotifyErr) {
          console.error('Spotify status error:', spotifyErr);
        }
      } catch (err) {
        console.error('Profile loading error:', err);
        setError('Failed to load profile data');
      }
    }
    
    if (user?._id) {
      loadProfile();
    }
  }, [user]);

  async function handleDisconnect() {
    try {
      setError('');
      setSuccess('');
      await disconnectSpotify();
      setSpotifyConnected(false);
      setSuccess('Successfully disconnected from Spotify');
    } catch (err) {
      setError('Failed to disconnect from Spotify');
    }
  }

  async function handleProfileUpdate(evt) {
    evt.preventDefault();
    try {
      setError('');
      setSuccess('');
      await updateProfile(profileData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Update error:', err);
    }
  }

  async function handleImageUpload(evt) {
    const file = evt.target.files[0];
    if (file) {
      try {
        setError('');
        setSuccess('');
        await uploadProfilePicture(file);
        setSuccess('Profile picture updated successfully');
      } catch (err) {
        setError('Failed to upload profile picture');
        console.error('Upload error:', err);
      }
    }
  }

  return (
    <div className="profile-page">
      {error && (
        <div className="error-message">{error}</div>
      )}
      {success && (
        <div className="success-message">{success}</div>
      )}

      <section className="profile-section">
        <h2>Profile Information</h2>
        
        <div className="profile-picture-container">
  <img
    src={profileData.profilePicture || '/default-profile.png'}
    alt=""
    className="profile-picture"
    onError={(e) => {
      console.error('Image failed to load:', e.target.src);
      e.target.src = '/default-profile.png';
    }}
    aria-hidden="true"
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

            <div className="social-links">
              <h3>Social Links</h3>
              <div className="form-group">
                <label>Discogs</label>
                <input
                  type="url"
                  value={profileData.socialLinks.discogs}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    socialLinks: {...profileData.socialLinks, discogs: e.target.value}
                  })}
                />
              </div>

              <div className="form-group">
                <label>Vinyl Vault</label>
                <input
                  type="url"
                  value={profileData.socialLinks.vinylVault}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    socialLinks: {...profileData.socialLinks, vinylVault: e.target.value}
                  })}
                />
              </div>

              <div className="form-group">
                <label>Last.fm</label>
                <input
                  type="url"
                  value={profileData.socialLinks.lastFm}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    socialLinks: {...profileData.socialLinks, lastFm: e.target.value}
                  })}
                />
              </div>
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
            {Object.values(profileData.socialLinks).some(link => link) && (
              <div className="social-links-grid">
                {profileData.socialLinks.discogs && (
                  <a
                    href={profileData.socialLinks.discogs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Discogs
                  </a>
                )}
                {profileData.socialLinks.vinylVault && (
                  <a
                    href={profileData.socialLinks.vinylVault}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Vinyl Vault
                  </a>
                )}
                {profileData.socialLinks.lastFm && (
                  <a
                    href={profileData.socialLinks.lastFm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Last.fm
                  </a>
                )}
              </div>
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
                onClick={handleDisconnect}
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