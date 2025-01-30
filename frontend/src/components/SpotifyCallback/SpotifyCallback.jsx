import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getUser } from '../../services/authService';
import * as spotifyService from '../../services/spotifyService';

export default function SpotifyCallback({ onSuccess }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if user is logged in
        const user = getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Get the authorization code from URL params
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received from Spotify');
        }

        // Handle the callback
        await spotifyService.handleSpotifyCallback(code);
        
        // Call success callback if provided
        if (onSuccess) {
          await onSuccess();
        }
        
        // Redirect to dashboard with success message
        navigate('/dashboard', {
          state: { message: 'Successfully connected to Spotify!' }
        });

      } catch (error) {
        console.error('Spotify callback error:', error);
        setError(error.message || 'Failed to connect to Spotify');
        
        // Redirect to dashboard with error message after a delay
        setTimeout(() => {
          navigate('/dashboard', {
            state: { error: error.message || 'Failed to connect to Spotify' }
          });
        }, 3000);
      }
    };

    handleCallback();
  }, [location.search, navigate, onSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error ? 'Connection Failed' : 'Connecting to Spotify...'}
          </h2>
          
          {error ? (
            <div className="text-red-600 mb-4">{error}</div>
          ) : (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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