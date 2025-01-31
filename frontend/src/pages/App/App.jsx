import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { getUser } from '../../services/authService';
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
      setSpotifyStatus({ 
        connected: status.connected, 
        checking: false 
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
    checkSpotifyStatus();
  }, [user]);

  return (
    <main className="App">
      <NavBar 
        user={user} 
        setUser={setUser} 
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route 
          path="/signup" 
          element={
            !user ? <SignUpPage setUser={setUser} /> : <Navigate to="/dashboard" replace />
          } 
        />
        
        <Route 
          path="/login" 
          element={
            !user ? <LogInPage setUser={setUser} /> : <Navigate to="/dashboard" replace />
          }
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <DashboardPage 
                spotifyStatus={spotifyStatus}
                onSpotifyUpdate={checkSpotifyStatus}
              />
            ) : (
              <Navigate to="/login" state={{ from: '/dashboard' }} replace />
            )
          }
        />

        <Route 
          path="/profile" 
          element={
            user ? 
            <ProfilePage user={user} /> : 
            <Navigate to="/login" replace />
          }
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

        {/* Weekly Playlist Admin Route */}
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
            user ? (
              <SpotifyCallback onSuccess={checkSpotifyStatus} />
            ) : (
              <Navigate to="/login" state={{ from: '/spotify/callback' }} replace />
            )
          }
        />

        {/* Catch-all route */}
        <Route 
          path="*" 
          element={
            user ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </main>
  );
}