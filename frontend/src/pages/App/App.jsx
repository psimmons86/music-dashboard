import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { getUser, getToken } from '../../services/authService';
import './App.css';
import HomePage from '../HomePage/HomePage';
import DashboardPage from '../DashboardPage/DashboardPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';

// Spotify Callback Component
function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          console.error('Spotify auth error:', error);
          navigate('/dashboard');
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          navigate('/dashboard');
          return;
        }

        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`/api/spotify/callback?code=${code}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to connect Spotify');
        }

        await response.json();
        navigate('/dashboard');
      } catch (error) {
        console.error('Spotify callback error:', error);
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl mb-4">Connecting to Spotify...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/auth/spotify/callback" element={<SpotifyCallback />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="/auth/spotify/callback" element={<SpotifyCallback />} />
          </Routes>
        )}
      </section>
    </main>
  );
}