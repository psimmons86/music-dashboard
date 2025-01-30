import { getUser } from '../../services/authService';
import { Music, Trash2 } from 'lucide-react';

export default function PostItem({ post, onDelete }) {
  const currentUser = getUser();

  if (!post || !post.user) {
    return null;
  }

  return (
    <article className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
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

        {currentUser && currentUser._id === post.user._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        {post.content}
      </p>

      {post.currentSong && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-purple-50 p-2 rounded-lg">
          <Music size={16} className="text-purple-500" />
          <span>Now Playing: {post.currentSong}</span>
        </div>
      )}

      {post.user.spotifyId && (
        <div className="mt-2 text-xs text-gray-400">
          via Spotify
        </div>
      )}
    </article>
  );
}