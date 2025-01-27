import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { getUser, getToken } from '../../services/authService';
import './App.css';
import HomePage from '../HomePage/HomePage';
import DashboardPage from '../DashboardPage/DashboardPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`/api/spotify/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          throw new Error('Failed to connect Spotify account');
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
      </div>
    </div>
  );
}

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
            <Route path="/profile" element={<ProfilePage user={user} />} />
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