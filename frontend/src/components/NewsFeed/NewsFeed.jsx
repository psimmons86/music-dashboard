import { useState, useEffect } from 'react';
import * as newsService from '../../services/newsService';
import NewsItem from '../NewsItem/NewsItem';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, [genre]);

  async function fetchNews() {
    try {
      const articles = await newsService.getNews(genre);
      setNews(articles);
      setError('');
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again.');
    }
  }

  return (
    <div className="news-feed-container">
      <div className="genre-select sticky top-0 bg-white z-10 mb-4">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="">All Genres</option>
          {['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="news-items">
        {news.map((article) => (
          <NewsItem key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}