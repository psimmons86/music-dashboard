export default function NewsItem({ article, previewMode }) {
  async function handleSaveArticle() {
    try {
      const response = await fetch('/api/articles/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt
        })
      });
      
      if (response.ok) {
        // Show success message or update UI
        console.log('Article saved successfully');
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }

  return (
    <article className="news-item mb-4 p-4 border-b last:border-b-0">
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title}
          className="w-full h-40 object-cover rounded mb-2"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <h3 className="font-bold mb-1">{article.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{article.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          {!previewMode && (
            <button
              onClick={handleSaveArticle}
              className="text-purple-600 hover:text-purple-800 px-2 py-1 rounded-md border border-purple-600 hover:border-purple-800"
            >
              Save
            </button>
          )}
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800"
          >
            Read More
          </a>
        </div>
      </div>
    </article>
  );
}