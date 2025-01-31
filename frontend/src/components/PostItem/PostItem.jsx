import { useState, useEffect } from 'react';
import { Heart, Trash2, Loader2, Music } from 'lucide-react';
import * as postService from '../../services/postService';

export default function PostItem({ post, onDelete }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get token and user data
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (post?.likes && userData) {
      setLikeCount(post.likes.length);
      setIsLiked(post.likes.includes(userData._id));
    }
  }, [post?.likes, userData]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check for token first
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to like posts');
      return;
    }

    try {
      const response = await postService.likePost(post._id);
      
      if (response) {
        setIsLiked(response.isLiked);
        setLikeCount(response.likeCount);
      }
    } catch (err) {
      console.error('Like error:', err);
      setError('Failed to update like');
    }
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete posts');
      return;
    }

    if (userData?._id !== post.user._id) {
      setError('You can only delete your own posts');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await postService.deletePost(post._id);
      onDelete(post._id);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete post');
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!post?.user) return null;

  return (
    <div className="relative bg-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {post.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{post.user.name}</h4>
            <time className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLikeClick}
            className={`relative z-10 flex items-center gap-1 px-3 py-1 rounded-full transition-colors 
              ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Heart 
              size={16} 
              className={isLiked ? 'fill-current' : ''} 
            />
            <span className="text-sm">{likeCount}</span>
          </button>

          {userData?._id === post.user._id && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="relative z-10 text-gray-400 hover:text-red-500 transition-colors p-2 
                rounded-full hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {post.currentSong && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 p-2 rounded-lg">
          <Music size={16} className="text-emerald-500" />
          <span>Now Playing: {post.currentSong}</span>
        </div>
      )}
    </div>
  );
}