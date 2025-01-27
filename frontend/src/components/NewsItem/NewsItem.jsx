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
    <article className="bg-white/50 rounded-lg p-4 mb-4 last:mb-0">
      <h3 className="font-bold text-sm mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.description}</p>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleSaveArticle}
            className="text-purple-600 hover:text-purple-800 px-2 py-1 rounded-md border border-purple-600 hover:border-purple-800"
          >
            Save
          </button>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800"
          >
            Read
          </a>
        </div>
      </div>
    </article>
  );
}