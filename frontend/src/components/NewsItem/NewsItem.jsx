import * as articleService from '../../services/articleService';

export default function NewsItem({ article }) {
  async function handleSaveArticle() {
    try {
      await articleService.saveArticle({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt
      });
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }

  return (
    <article className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {article.urlToImage && (
        <div className="aspect-video mb-3 overflow-hidden rounded-lg">
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
        {article.title}
      </h3>
      <p className="text-gray-600 mb-3 line-clamp-2">
        {article.description}
      </p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-3">
          <button
            onClick={handleSaveArticle}
            className="text-purple-600 hover:text-purple-700 px-3 py-1 rounded-md border border-purple-600 hover:border-purple-700 transition-colors"
          >
            Save
          </button>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 px-3 py-1 rounded-md border border-purple-600 hover:border-purple-700 transition-colors"
          >
            Read
          </a>
        </div>
      </div>
    </article>
  );
}