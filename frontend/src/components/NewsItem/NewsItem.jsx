export default function NewsItem({ article }) {
  return (
    <article className="news-item">
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title} 
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <div className="content">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
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
      </div>
    </article>
  );
}