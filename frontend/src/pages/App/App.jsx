import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import * as spotifyService from '../../services/spotifyService';
import { useAuth } from '../../contexts/AuthContext';
import './App.css';

// Components
import NavBar from '../../components/NavBar/NavBar';
import AdminRoute from '../../components/AdminRoute/AdminRoute';
import SpotifyCallback from '../../components/SpotifyCallback/SpotifyCallback';
import WeeklyPlaylistAdmin from '../../components/WeeklyPlaylistAdmin/WeeklyPlaylistAdmin';

// Pages
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import DashboardPage from '../DashboardPage/DashboardPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import BlogListPage from '../BlogListPage/BlogListPage';
import BlogDetailPage from '../BlogDetailPage/BlogDetailPage';
import BlogCreatePage from '../BlogCreatePage/BlogCreatePage';
import BlogEditPage from '../BlogEditPage/BlogEditPage';

export default function App() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [spotifyStatus, setSpotifyStatus] = useState({ 
    connected: false,
    checking: true 
  });

  const checkSpotifyStatus = async () => {
    try {
      if (!user) {
        setSpotifyStatus({ connected: false, checking: false });
        return;
      }

      const status = await spotifyService.getSpotifyStatus();
      console.log('Spotify status check result:', status);
      
      setSpotifyStatus({ 
        connected: status.connected, 
        checking: false,
        userId: status.userId
      });
    } catch (error) {
      console.error('Error checking Spotify status:', error);
      setSpotifyStatus({ 
        connected: false, 
        checking: false,
        error: error.message 
      });
    }
  };

  useEffect(() => {
    if (user) {
      checkSpotifyStatus();
    }
  }, [user]);

  // Handle auth-required routes
  const requireAuth = (element) => {
    if (!user) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return element;
  };

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        <Route 
          path="/signup" 
          element={
            !user ? <SignUpPage setUser={setUser} /> : <Navigate to="/dashboard" replace />
          } 
        />
        
        <Route 
          path="/login" 
          element={
            !user ? (
              <LogInPage setUser={setUser} />
            ) : (
              <Navigate to={location.state?.from || '/dashboard'} replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            requireAuth(
              <DashboardPage 
                spotifyStatus={spotifyStatus}
                onSpotifyUpdate={checkSpotifyStatus}
              />
            )
          }
        />

        <Route 
          path="/profile" 
          element={requireAuth(<ProfilePage user={user} />)}
        />

        {/* Blog Routes */}
        <Route path="/blog" element={<BlogListPage />} />
        
        <Route 
          path="/blog/create" 
          element={
            <AdminRoute>
              <BlogCreatePage />
            </AdminRoute>
          }
        />
        
        <Route 
          path="/blog/:id/edit" 
          element={
            <AdminRoute>
              <BlogEditPage />
            </AdminRoute>
          }
        />
        
        <Route path="/blog/:id" element={<BlogDetailPage />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/weekly-playlist" 
          element={
            <AdminRoute>
              <WeeklyPlaylistAdmin />
            </AdminRoute>
          }
        />

        {/* Spotify Routes */}
        <Route 
          path="/spotify/callback" 
          element={
            requireAuth(
              <SpotifyCallback 
                onSuccess={checkSpotifyStatus}
                user={user}
              />
            )
          }
        />

        {/* Catch-all Route */}
        <Route 
          path="*" 
          element={
            user ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" state={{ from: location.pathname }} replace />
          } 
        />
      </Routes>
    </main>
  );
}