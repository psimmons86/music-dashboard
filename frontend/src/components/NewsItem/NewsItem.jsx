export default function NewsItem({ article }) {
  return (
    <article className="border rounded p-4 shadow hover:shadow-lg transition-shadow">
      <h3 className="font-bold text-xl mb-2 line-clamp-2">{article.title}</h3>
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title} 
          className="w-full h-48 object-cover mb-2 rounded"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <p className="text-gray-600 mb-2 line-clamp-3">{article.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Read More
        </a>
      </div>
    </article>
  );
 }