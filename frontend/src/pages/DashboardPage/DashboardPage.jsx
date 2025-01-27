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
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const postsData = await postService.index();
        const spotifyStatus = await spotifyService.getSpotifyStatus();
        setPosts(postsData);
        setSpotifyConnected(spotifyStatus.connected);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    }
    fetchData();
  }, []);

  async function handleSubmitPost(evt) {
    evt.preventDefault();
    try {
      const post = await postService.create(newPost);
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        {/* News Feed Box */}
        <div className="dashboard-box">
          <h2>Music News</h2>
          <div className="scrollable-content">
            <NewsFeed />
          </div>
        </div>

        {/* Social Feed Box */}
        <div className="dashboard-box">
          <h2>Social Feed</h2>
          <div className="scrollable-content">
            <form onSubmit={handleSubmitPost} className="post-form">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your music thoughts..."
                required
              />
              <button type="submit">Post</button>
            </form>
            <div className="posts-container">
              {posts.map(post => (
                <div key={post._id} className="post-item">
                  <PostItem post={post} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spotify Box */}
        <div className="dashboard-box">
          <h2>Music Player</h2>
          <div className="scrollable-content">
            {spotifyConnected ? (
              <PlaylistGenerator />
            ) : (
              <div className="spotify-connect">
                <p>Connect with Spotify to create custom playlists</p>
                <SpotifyConnect />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}