import { useState } from 'react';
import { getUser } from '../../services/authService';
import { Music, Heart, Trash2, Loader2 } from 'lucide-react';
import * as postService from '../../services/postService';

export default function PostItem({ post, onDelete }) {
  const currentUser = getUser();
  const [isLiked, setIsLiked] = useState(
    post.likes && currentUser ? post.likes.includes(currentUser._id) : false
  );
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setIsDeleting(true);
      await onDelete(post._id);
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!post || !post.user) return null;

  return (
    <div className="bg-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            {post.user.profilePicture ? (
              <img
                src={post.user.profilePicture}
                alt={post.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-medium">
                {post.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              {post.user.name}
            </h4>
            <time className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Heart 
              size={16} 
              className={isLiked ? 'fill-current' : ''} 
            />
            <span className="text-sm">{likeCount}</span>
          </button>

          {currentUser && currentUser._id === post.user._id && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
              title="Delete post"
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