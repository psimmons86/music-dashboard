export default function PostItem({ post }) {
  return (
    <article className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
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
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </article>
  );
}