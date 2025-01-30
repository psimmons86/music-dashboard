import { useState } from 'react';
import { getUser } from '../../services/authService';
import { likePost } from '../../services/postService';
import { Heart, Trash2, Music } from 'lucide-react';


export default function PostItem({ post, onDelete }) {
  const currentUser = getUser();
  const [isLiked, setIsLiked] = useState(
    post.likes && currentUser ? post.likes.includes(currentUser._id) : false
  );
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);

  async function handleLike() {
    if (!currentUser) return;
    
    try {
      const response = await likePost(post._id);
      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (err) {
      console.error('Error liking post:', err);
    }
    console.log('Post data:', post)
console.log('Likes:', post.likes)
console.log('Current user:', currentUser)
  }

  if (!post || !post.user) {
    return null;
  }

  return (
    <article className="bg-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {post.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              {post.user.name}
            </h4>
            <time className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-500 hover:bg-gray-50'
            } transition-all`}
          >
            <Heart 
              size={16} 
              className={isLiked ? 'fill-current' : 'stroke-current'} 
            />
            <span className="text-sm">{likeCount}</span>
          </button>

          {currentUser && currentUser._id === post.user._id && (
            <button
              onClick={() => onDelete(post._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-gray-700 leading-relaxed">
          {post.content}
        </p>

        {post.currentSong && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 p-2 rounded-lg">
            <Music size={16} className="text-emerald-500" />
            <span>Now Playing: {post.currentSong}</span>
          </div>
        )}

        {post.user.spotifyId && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <img 
              src="/spotify-icon.png" 
              alt="Spotify" 
              className="w-3 h-3" 
            />
            via Spotify
          </div>
        )}
      </div>
    </article>
  );
}

