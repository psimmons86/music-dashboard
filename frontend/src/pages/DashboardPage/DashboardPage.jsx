import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Users, Music, FileText, Crown, Newspaper } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardPage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Components
import PostForm from '../../components/PostForm/PostForm';
import PostItem from '../../components/PostItem/PostItem';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import WeeklyPlaylist from '../../components/WeeklyPlaylist/WeeklyPlaylist';
import BlogFeed from '../../components/BlogFeed/BlogFeed';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';

// Services
import * as postService from '../../services/postService';

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

  const handleLayoutChange = (layout, layouts) => {
    try {
      setLayouts(layouts);
      localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
    } catch (err) {
      console.error('Error saving layout:', err);
    }
  };

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
            draggableHandle=".drag-handle"
          >
            {/* Social Feed Section */}
            <div key="social" className="dashboard-item social-feed">
              <div className="drag-handle">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    <h2 className="font-sans text-xl font-semibold text-gray-800">Social Feed</h2>
                  </div>
                  <Link
                    to="/blog/create"
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Write Blog Post
                  </Link>
                </div>
              </div>
              <div className="dashboard-content-area">
                <PostForm onSubmit={handleCreatePost} />
                <div className="space-y-4">
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

            {/* Music Player Section */}
            <div key="music" className="dashboard-item music-player">
              <div className="drag-handle">
                <div className="flex items-center gap-2">
                  <Music size={20} />
                  <h2 className="font-sans text-xl font-semibold text-gray-800">Music Player</h2>
                </div>
              </div>
              <div className="dashboard-content-area">
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
                    <SpotifyConnect onSuccess={onSpotifyUpdate} />
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Playlist Section */}
            <div key="playlist" className="dashboard-item">
              <div className="drag-handle">
                <div className="flex items-center gap-2">
                  <Crown size={20} />
                  <h2 className="font-sans text-xl font-semibold text-gray-800">Weekly Playlist</h2>
                </div>
              </div>
              <div className="dashboard-content-area">
                <WeeklyPlaylist />
              </div>
            </div>

            {/* News Section */}
            <div key="news" className="dashboard-item music-news">
              <div className="drag-handle">
                <div className="flex items-center gap-2">
                  <Newspaper size={20} />
                  <h2 className="font-sans text-xl font-semibold text-gray-800">Music News</h2>
                </div>
              </div>
              <div className="dashboard-content-area">
                <NewsFeed />
              </div>
            </div>

            {/* Blog Feed Section */}
            <div key="blogs" className="dashboard-item blog-feed">
              <div className="drag-handle">
                <div className="flex items-center gap-2">
                  <FileText size={20} />
                  <h2 className="font-sans text-xl font-semibold text-gray-800">Daily Dispatch</h2>
                </div>
              </div>
              <div className="dashboard-content-area">
                <BlogFeed />
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
}