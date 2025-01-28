import { useState, useEffect } from 'react';
import { getSpotifyStatus, disconnectSpotify } from '../../services/spotifyService';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkSpotifyStatus() {
      const status = await getSpotifyStatus();
      setSpotifyConnected(status.connected);
    }
    checkSpotifyStatus();
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

  return (
    <div className="profile-page">
      <h1 className="text-2xl mb-4">Profile</h1>
      
      <section className="profile-section">
        <h2>Connected Services</h2>
        <div className="mb-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}
          
          {spotifyConnected ? (
            <div className="flex items-center justify-between">
              <p className="text-green-500">✓ Spotify Connected</p>
              <button
                onClick={handleDisconnect}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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