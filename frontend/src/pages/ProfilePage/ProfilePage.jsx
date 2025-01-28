import { useState, useEffect, useRef } from 'react';
import { getSpotifyStatus, disconnectSpotify } from '../../services/spotifyService';
import * as userService from '../../services/userService';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './ProfilePage.css';

export default function ProfilePage({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: initialUser.name,
    bio: initialUser.bio || '',
    location: initialUser.location || '',
    socialLinks: {
      discogs: initialUser.socialLinks?.discogs || '',
      vinylVault: initialUser.socialLinks?.vinylVault || '',
      lastFm: initialUser.socialLinks?.lastFm || ''
    }
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialUser.profilePicture || '/default-profile.png');

  useEffect(() => {
    async function checkSpotifyStatus() {
      const status = await getSpotifyStatus();
      setSpotifyConnected(status.connected);
    }
    
    async function fetchFullProfile() {
      try {
        const fullProfile = await userService.getProfile();
        setUser(fullProfile);
        setProfileData({
          name: fullProfile.name,
          bio: fullProfile.bio || '',
          location: fullProfile.location || '',
          socialLinks: {
            discogs: fullProfile.socialLinks?.discogs || '',
            vinylVault: fullProfile.socialLinks?.vinylVault || '',
            lastFm: fullProfile.socialLinks?.lastFm || ''
          }
        });
        setPreviewImage(fullProfile.profilePicture || '/default-profile.png');
      } catch (err) {
        console.error('Error fetching full profile:', err);
      }
    }

    checkSpotifyStatus();
    fetchFullProfile();
  }, []);

  async function handleDisconnect() {
    try {
      setError('');
      setMessage('');
      await disconnectSpotify();
      setSpotifyConnected(false);
      setMessage('Successfully disconnected from Spotify');
    } catch (err) {
      setError('Failed to disconnect from Spotify');
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const linkType = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [linkType]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  async function handleProfileUpdate() {
    try {
      setError('');
      setMessage('');
      const updatedUser = await userService.updateProfile(profileData);
      setUser(updatedUser);
      setIsEditing(false);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  }

  function handleProfilePictureChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleProfilePictureUpload() {
    if (profilePictureFile) {
      try {
        const updatedUser = await userService.uploadProfilePicture(profilePictureFile);
        setUser(updatedUser);
        setProfilePictureFile(null);
        setMessage('Profile picture updated successfully');
      } catch (err) {
        setError('Failed to upload profile picture');
      }
    }
  }

  function handleProfilePictureClick() {
    fileInputRef.current.click();
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div 
          className="profile-picture-container"
          onClick={handleProfilePictureClick}
        >
          <img 
            src={previewImage} 
            alt="Profile" 
            className="profile-picture"
          />
          <div className="profile-picture-overlay">
            <span>Change Photo</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        {profilePictureFile && (
          <button 
            onClick={handleProfilePictureUpload}
            className="upload-picture-btn"
          >
            Upload Picture
          </button>
        )}
      </div>

      <div className="profile-content">
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {isEditing ? (
          <form className="profile-edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>

            <div className="social-links">
              <h3>Social Links</h3>
              <div className="form-group">
                <label>Discogs</label>
                <input
                  type="text"
                  name="socialLinks.discogs"
                  value={profileData.socialLinks.discogs}
                  onChange={handleInputChange}
                  placeholder="Discogs profile URL"
                />
              </div>
              <div className="form-group">
                <label>Vinyl Vault</label>
                <input
                  type="text"
                  name="socialLinks.vinylVault"
                  value={profileData.socialLinks.vinylVault}
                  onChange={handleInputChange}
                  placeholder="Vinyl Vault profile URL"
                />
              </div>
              <div className="form-group">
                <label>Last.fm</label>
                <input
                  type="text"
                  name="socialLinks.lastFm"
                  value={profileData.socialLinks.lastFm}
                  onChange={handleInputChange}
                  placeholder="Last.fm profile URL"
                />
              </div>
            </div>

            <div className="profile-actions">
              <button 
                type="button"
                onClick={handleProfileUpdate}
                className="save-btn"
              >
                Save Profile
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-details">
              <h2>{user.name}</h2>
              {user.bio && <p className="bio">{user.bio}</p>}
              {user.location && <p className="location">📍 {user.location}</p>}
            </div>

            <div className="social-links-view">
              <h3>Connect</h3>
              <div className="social-links-grid">
                {user.socialLinks?.discogs && (
                  <a 
                    href={user.socialLinks.discogs} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Discogs
                  </a>
                )}
                {user.socialLinks?.vinylVault && (
                  <a 
                    href={user.socialLinks.vinylVault} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Vinyl Vault
                  </a>
                )}
                {user.socialLinks?.lastFm && (
                  <a 
                    href={user.socialLinks.lastFm} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Last.fm
                  </a>
                )}
              </div>
            </div>

            <div className="spotify-connection">
              <h3>Spotify Connection</h3>
              {spotifyConnected ? (
                <div className="spotify-status connected">
                  <span>✓ Spotify Connected</span>
                  <button
                    onClick={handleDisconnect}
                    className="disconnect-btn"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="spotify-status disconnected">
                  <span>Spotify Not Connected</span>
                  <SpotifyConnect />
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}