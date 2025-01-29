// DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as articleService from '../../services/articleService';
import * as userService from '../../services/userService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyPlayer from '../../components/SpotifyPlayer/SpotifyPlayer';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './DashboardPage.css';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const spotifyStatus = await spotifyService.getSpotifyStatus();
        setSpotifyConnected(spotifyStatus.connected);

        const [postsData, articlesData, profileData] = await Promise.all([
          postService.index(),
          articleService.getSavedArticles(),
          userService.getProfile()
        ]);

        setPosts(postsData);
        setSavedArticles(articlesData);
        setUserProfile(profileData);
        setError('');
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data. Please try again.');
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

  async function handleDeleteArticle(articleId) {
    try {
      await articleService.deleteSavedArticle(articleId);
      setSavedArticles((prevArticles) => prevArticles.filter((article) => article._id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#98e4d3] p-6">
      <nav className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Dashboard</h1>
  <Link 
    to="/blog/create"
    className="bg-[#d4e7aa] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#c3d69b] transition-colors"
  >
    Create Blog
  </Link>
</nav>
      
      <div className="grid grid-cols-12 gap-6 max-w-screen-2xl mx-auto">

        {/* Left Column - Social Feed */}
<div className="col-span-4">
  <div className="bg-[#d4e7aa]/70 rounded-2xl p-6 h-[75vh] relative"> {/* Added relative positioning */}
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Social Feed</h2>

    <form onSubmit={handleSubmitPost} className="mb-6">
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Share your music thoughts..."
        className="w-full p-3 border rounded-lg bg-white/60 focus:ring-2 focus:ring-[#98e4d3] mb-2"
        rows="4"
      />
      <button
        type="submit"
        className="w-full bg-[#98e4d3]/80 text-white py-2 rounded-lg hover:bg-[#98e4d3] transition-colors"
      >
        Post
      </button>
    </form>

    {/* Updated scrollable container with absolute positioning */}
    <div className="absolute inset-x-6 bottom-6 top-[180px] overflow-y-auto">
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="p-4 bg-white/60 rounded-lg w-full">
            <p className="text-gray-700 leading-relaxed line-clamp-[12]">
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

        {/* Middle Column - Spotify Section */}
  
<div className="col-span-4">
  <div className="bg-[#f7cba3]/70 rounded-2xl p-6 h-[75vh]">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Music Player</h2>
    {spotifyConnected ? (
      <SpotifyPlayer />
    ) : (
      <div className="text-center">
        <p className="text-gray-600 mb-6">Connect Spotify to create playlists</p>
        <SpotifyConnect />
      </div>
    )}
  </div>
</div>

        {/* Right Column - Profile and News */}
        <div className="col-span-4 space-y-6">
          {/* Profile Box */}
          {userProfile && (
            <div className="bg-[#ffb5b5]/70 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                  <img
                    src={userProfile.profilePicture || '/default-profile.png'}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{userProfile.name}</h3>
                  {userProfile.location && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <span>📍</span> {userProfile.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* News Feed Box */}
          <div className="bg-[#ffb5b5]/70 rounded-2xl p-6 h-[calc(75vh-7.5rem)]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Music News</h2>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100%-3rem)]">
              <NewsFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}