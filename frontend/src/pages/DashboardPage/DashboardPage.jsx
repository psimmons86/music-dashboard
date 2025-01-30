import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as userService from '../../services/userService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import PostForm from '../../components/PostForm/PostForm';
import { Music, Disc, Users, Trash2 } from 'lucide-react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { getUser } from '../../services/authService';

function PostItem({ post, onDelete }) {
  const currentUser = getUser();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  console.log('Current User:', currentUser);
  console.log('Post User:', post.user);
  console.log('Current User ID:', currentUser?._id);
  console.log('Post User ID:', post.user._id);
  console.log('Do IDs match?:', currentUser?._id === post.user._id);

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      const response = await postService.likePost(post._id);
      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  if (!post || !post.user) {
    return null;
  }

  return (
    <div className="p-4 bg-white/60 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {post.user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 text-sm">
              {post.user.name}
            </h4>
            <time className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {isLiked ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
            <span className="text-xs">{likeCount}</span>
          </button>

          {currentUser && String(currentUser._id) === String(post.user._id) && (
            <button
              onClick={() => onDelete(post._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed">
        {post.content}
      </p>
      {post.currentSong && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 bg-emerald-50 p-2 rounded-lg">
          <Music size={14} />
          <span>Now Playing: {post.currentSong}</span>
        </div>
      )}
    </div>
  );
}

function TopArtistsSection({ artists }) {
  return (
    <div className="bg-white/50 rounded-xl p-4">
      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
        <Users size={14} />
        Your Top Artists
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {artists.slice(0, 4).map((artist) => (
          <div
            key={artist.id}
            className="bg-white/50 p-2 rounded-lg text-xs"
          >
            {artist.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentAlbumsSection({ albums }) {
  return (
    <div className="bg-white/50 rounded-xl p-4">
      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
        <Disc size={14} />
        Recent Albums
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {albums.slice(0, 4).map((album) => (
          <div key={album.id} className="bg-white/50 p-2 rounded-lg">
            {album.imageUrl && (
              <img
                src={album.imageUrl}
                alt={album.name}
                className="w-full aspect-square object-cover rounded-md mb-1"
              />
            )}
            <p className="text-xs truncate">{album.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {album.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserPlaylistsSection({ playlists }) {
  return (
    <div className="bg-white/50 rounded-xl p-4">
      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
        <Music size={14} />
        Your Playlists
      </h3>
      <div className="space-y-2">
        {playlists.slice(0, 3).map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white/50 p-2 rounded-lg flex items-center gap-2"
          >
            {playlist.imageUrl ? (
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="w-8 h-8 object-cover rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            )}
            <div>
              <p className="text-xs font-medium">{playlist.name}</p>
              <p className="text-xs text-gray-500">
                {playlist.trackCount} tracks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSpotifyData();
        await fetchUserData();
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      }
    };
    
    fetchData();
  }, []);

  const fetchSpotifyData = async () => {
    const spotifyStatus = await spotifyService.getSpotifyStatus();
    setSpotifyConnected(spotifyStatus.connected);

    if (spotifyStatus.connected) {
      const [artists, albums, playlists] = await Promise.all([
        spotifyService.getTopArtists(),
        spotifyService.getRecentAlbums(),
        spotifyService.getUserPlaylists(),
      ]);
      
      setTopArtists(artists);
      setRecentAlbums(albums);
      setUserPlaylists(playlists);
    }
  };

  const fetchUserData = async () => {
    const [postsData, profileData] = await Promise.all([
      postService.index(),
      userService.getProfile(),
    ]);
    
    setPosts(postsData);
    setUserProfile(profileData);
    setError('');
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.create({
        content: postData.content,
        currentSong: postData.currentSong,
      });
      
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(current => current.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-[#98e4d3] rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-emerald-900">
            Dashboard
          </h1>
          <Link
            to="/blog/create"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Create Blog
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Social Feed Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#d4e7aa]/70 rounded-2xl p-6 shadow-sm h-[65vh]">
              <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users size={20} />
                Social Feed
              </h2>

              <PostForm onSubmit={handleCreatePost} />

              <div className="overflow-y-auto h-[calc(100%-180px)] pr-2">
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
          </div>

          {/* Spotify Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#f7cba3]/70 rounded-2xl p-6 shadow-sm h-[65vh]">
              <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Disc size={20} />
                Music Player
              </h2>

              <div className="h-[calc(100%-70px)] overflow-hidden">
                {spotifyConnected ? (
                  <div className="h-full overflow-y-auto pr-2 space-y-6">
                    <PlaylistCard
                      title="Music Player"
                      actionButtonText="Generate Daily Mix"
                      loadingText="Generating Daily Mix..."
                    />
                    <TopArtistsSection artists={topArtists} />
                    <RecentAlbumsSection albums={recentAlbums} />
                    <UserPlaylistsSection playlists={userPlaylists} />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-6">
                      Connect Spotify to create playlists
                    </p>
                    <SpotifyConnect />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* News Feed Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#ffb5b5]/70 rounded-2xl p-6 shadow-sm h-[65vh]">
              <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Music size={20} />
                Music News
              </h2>

              <div className="overflow-y-auto h-[calc(100%-70px)] pr-2">
                <NewsFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}