import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { getUser } from '../../services/authService';
import * as spotifyService from '../../services/spotifyService';
import './App.css';

// Components
import NavBar from '../../components/NavBar/NavBar';
import AdminRoute from '../../components/AdminRoute/AdminRoute';
import SpotifyCallback from '../../components/SpotifyCallback/SpotifyCallback';

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
  const [user, setUser] = useState(getUser());
  const [spotifyStatus, setSpotifyStatus] = useState({ connected: false });

  const checkSpotifyStatus = async () => {
    try {
      if (!user) return;

      const status = await spotifyService.getSpotifyStatus();
      console.log('Spotify status:', status);
      setSpotifyStatus(status);
    } catch (error) {
      console.error('Error checking Spotify status:', error);
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
        spotifyConnected={spotifyStatus.connected} 
      />
      
      <section id="main-section">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route path="/signup" element={
            !user ? <SignUpPage setUser={setUser} /> : <Navigate to="/dashboard" replace />
          } />
          <Route path="/login" element={
            !user ? <LogInPage setUser={setUser} /> : <Navigate to="/dashboard" replace />
          } />

          {/* Protected Routes - require login */}
          <Route path="/dashboard" element={
            user ? (
              <DashboardPage 
                spotifyStatus={spotifyStatus}
                onSpotifyUpdate={checkSpotifyStatus}
              />
            ) : (
              <Navigate to="/login" state={{ from: '/dashboard' }} replace />
            )
          } />

          <Route path="/profile" element={
            user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />
          } />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          
          {/* Admin Only Routes */}
          <Route path="/blog/create" element={
            <AdminRoute>
              <BlogCreatePage />
            </AdminRoute>
          } />
          <Route path="/blog/:id/edit" element={
            <AdminRoute>
              <BlogEditPage />
            </AdminRoute>
          } />

          {/* Spotify Callback Routes - try both paths */}
          <Route 
            path="/api/spotify/callback" 
            element={
              user ? (
                <SpotifyCallback onSuccess={checkSpotifyStatus} />
              ) : (
                <Navigate to="/login" state={{ from: '/api/spotify/callback' }} replace />
              )
            } 
          />
          
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

          {/* Catch-all redirect */}
          <Route path="*" element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </section>
    </main>
  );
}