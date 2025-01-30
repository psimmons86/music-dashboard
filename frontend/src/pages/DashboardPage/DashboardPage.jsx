// src/pages/DashboardPage/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as articleService from '../../services/articleService';
import * as userService from '../../services/userService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyPlayer from '../../components/SpotifyPlayer/SpotifyPlayer';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import PostForm from '../../components/PostForm/PostForm';
import './DashboardPage.css';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
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

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.create({
        content: postData.content,
        currentSong: postData.currentSong
      });
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

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
          <div className="bg-[#d4e7aa]/70 rounded-2xl p-6 h-[75vh] relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Social Feed</h2>

            <PostForm onSubmit={handleCreatePost} />

            {/* Posts List */}
            <div className="absolute inset-x-6 bottom-6 top-[180px] overflow-y-auto">
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="p-4 bg-white/60 rounded-lg w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {post.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{post.user.name}</h4>
                        <time className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.currentSong && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-50/80 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="21" cy="16" r="3" />
                        </svg>
                        <span>Currently listening to: {post.currentSong}</span>
                      </div>
                    )}
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