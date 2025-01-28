import { useState, useEffect } from 'react';
import * as newsService from '../../services/newsService';
import NewsItem from '../NewsItem/NewsItem';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [genre, setGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'];

  useEffect(() => {
    fetchNews();
  }, [genre]);

  async function fetchNews() {
    try {
      setIsLoading(true);
      const articles = await newsService.getNews(genre);
      setNews(articles);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 rounded-lg shadow-sm">
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow cursor-pointer"
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {news.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full py-8">
              No articles found. Try a different genre.
            </p>
          ) : (
            news.map((article, index) => (
              <NewsItem 
                key={`${article.url}-${index}`} 
                article={article} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}