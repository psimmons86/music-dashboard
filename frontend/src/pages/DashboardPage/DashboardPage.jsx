import { useState, useEffect } from 'react';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import PlaylistGenerator from '../../components/PlaylistGenerator/PlaylistGenerator';
import PostItem from '../../components/PostItem/PostItem';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './DashboardPage.css';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await postService.index();
      setPosts(posts);
    }
    async function checkSpotifyStatus() {
      const status = await spotifyService.getSpotifyStatus();
      setSpotifyConnected(status.connected);
    }
    fetchPosts();
    checkSpotifyStatus();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2>Music News</h2>
            <NewsFeed />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Spotify Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2>Daily Mix</h2>
            {spotifyConnected ? (
              <PlaylistGenerator />
            ) : (
              <div className="text-center">
                <p>Connect with Spotify to create playlists</p>
                <SpotifyConnect />
              </div>
            )}
          </div>

          {/* Social Feed */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2>Recent Activity</h2>
            {posts.map(post => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}