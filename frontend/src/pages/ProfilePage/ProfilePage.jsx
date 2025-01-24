import { useState, useEffect } from 'react';
import { getSpotifyStatus } from '../../services/spotifyService';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';

export default function ProfilePage({ user }) {
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    async function checkSpotifyStatus() {
      const status = await getSpotifyStatus();
      setSpotifyConnected(status.connected);
    }
    checkSpotifyStatus();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Profile</h1>
      <div className="mb-4">
        <h2>Connected Services</h2>
        {spotifyConnected ? (
          <p className="text-green-500">Spotify Connected ✓</p>
        ) : (
          <SpotifyConnect />
        )}
      </div>
    </div>
  );
}