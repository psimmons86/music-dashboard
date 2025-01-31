import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { handleSpotifyCallback } from '../../services/spotifyService';

const SpotifyCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthorization = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code) {
        setError('No authorization code received');
        setLoading(false);
        return;
      }

      try {
        const response = await handleSpotifyCallback(code, state);
        if (response && response.access_token) {
          navigate('/');
        } else {
          setError('Failed to authenticate with Spotify');
        }
      } catch (err) {
        console.error('Error handling Spotify callback:', err);
        setError('An error occurred while connecting to Spotify');
      } finally {
        setLoading(false);
      }
    };

    handleAuthorization();
  }, [navigate]);

  if (loading) {
    return <div>Connecting to Spotify...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default SpotifyCallback;