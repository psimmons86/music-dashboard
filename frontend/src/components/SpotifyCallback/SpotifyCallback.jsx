import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import * as spotifyService from '../../services/spotifyService';
import { Loader2 } from 'lucide-react';

export default function SpotifyCallback({ onSuccess }) {
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login', { 
        state: { from: '/spotify/callback' + location.search }
      });
      return;
    }

    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        console.log('Processing Spotify callback...', { code, state });

        // Exchange code for tokens
        await spotifyService.handleSpotifyCallback(code, state);
        
        // Call success callback if provided
        if (onSuccess) {
          await onSuccess();
        }
        
        navigate('/dashboard', { 
          state: { message: 'Successfully connected to Spotify!' }
        });
      } catch (error) {
        console.error('Spotify callback error:', error);
        setError(error.message || 'Failed to connect to Spotify');
        
        setTimeout(() => {
          navigate('/dashboard', {
            state: { error: 'Failed to connect to Spotify' }
          });
        }, 3000);
      }
    };

    handleCallback();
  }, [location.search, navigate, onSuccess, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error ? 'Connection Failed' : 'Connecting to Spotify...'}
          </h2>
          
          {error ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            </div>
          )}
          
          <p className="text-gray-600 mt-4">
            {error 
              ? 'Redirecting you back to dashboard...'
              : 'Please wait while we complete the connection...'}
          </p>
        </div>
      </div>
    </div>
  );
}