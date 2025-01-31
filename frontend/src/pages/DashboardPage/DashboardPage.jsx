import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Users, Music, FileText, Crown, Newspaper } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardPage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Services
import * as postService from '../../services/postService';

// Components
import PostForm from '../../components/PostForm/PostForm';
import PostItem from '../../components/PostItem/PostItem';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import WeeklyPlaylist from '../../components/WeeklyPlaylist/WeeklyPlaylist';
import BlogFeed from '../../components/BlogFeed/BlogFeed';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';



// Default layout configuration
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'social', x: 0, y: 0, w: 12, h: 12 },
    { i: 'music', x: 0, y: 12, w: 6, h: 12 },
    { i: 'playlist', x: 6, y: 12, w: 6, h: 8 },
    { i: 'news', x: 6, y: 20, w: 6, h: 12 },
    { i: 'blogs', x: 0, y: 24, w: 12, h: 8 },
  ],
};

export default function DashboardPage({ spotifyStatus, onSpotifyUpdate }) {
  
  // State management
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [layouts, setLayouts] = useState(() => {
    try {
      const savedLayouts = localStorage.getItem('dashboardLayouts');
      return savedLayouts ? JSON.parse(savedLayouts) : DEFAULT_LAYOUTS;
    } catch (err) {
      console.error('Error loading layouts:', err);
      return DEFAULT_LAYOUTS;
    }
  });

  // Drag State

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setError('');
      const postsData = await postService.index();
      setPosts(postsData);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts. Please refresh the page to try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Post management functions
  const handleCreatePost = async (postData) => {
    try {
      setError('');
      const newPost = await postService.create(postData);
      setPosts(currentPosts => [newPost, ...currentPosts]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setError('');
      await postService.deletePost(postId);
      setPosts(currentPosts => currentPosts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  // Layout persistence
  const handleLayoutChange = (layout, layouts) => {
    try {
      setLayouts(layouts);
      localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
    } catch (err) {
      console.error('Error saving layout:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            autoSize={true}
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]}
            draggableHandle=".drag-handle" // Only allow dragging by header
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
          >
            {/* Social Feed Section */}
            <div key="social" className="dashboard-item social-feed">
              <div className="p-6 h-full flex flex-col">
                <div className="drag-handle flex justify-between items-center mb-6">
                  <h2 className="font-sans text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users size={20} />
                    Social Feed
                  </h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = '/blog/create';
                    }}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium pointer-events-auto"
                    disabled={isDragging}
                  >
                    Write Blog Post
                  </button>
                </div>
                <div className="pointer-events-auto flex-1 overflow-hidden">
                  <PostForm onSubmit={handleCreatePost} />
                  <div className="h-full overflow-y-auto pr-2 space-y-4">
                    {posts.map((post) => (
                      <PostItem
                        key={post._id}
                        post={post}
                        onDelete={handleDeletePost}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Music Player Section */}
            <div key="music" className="dashboard-item music-player">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Music size={20} />
                  Music Player
                </h2>
                <div className="flex-1 overflow-y-auto">
                  {spotifyStatus?.connected ? (
                    <PlaylistCard
                      title="Create Daily Mix"
                      actionButtonText="Generate Playlist"
                      loadingText="Creating your mix..."
                      onPlaylistCreated={(playlist) => {
                        console.log('Playlist created:', playlist);
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-6">
                        Connect Spotify to access your music
                      </p>
                      <SpotifyConnect 
                        onSuccess={onSpotifyUpdate}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Playlist Section */}
            <div key="playlist" className="dashboard-item weekly-playlist">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Crown size={20} />
                  Weekly Playlist
                </h2>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2">
                    <WeeklyPlaylist />
                  </div>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div key="news" className="dashboard-item music-news">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Newspaper size={20} />
                  Music News
                </h2>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2">
                    <NewsFeed />
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Feed Section */}
            <div key="blogs" className="dashboard-item blog-feed">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText size={20} />
                  Daily Dispatch
                </h2>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2">
                    <BlogFeed />
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
}