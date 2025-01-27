import { useState, useEffect } from 'react';
import * as newsService from '../../services/newsService';
import NewsItem from '../NewsItem/NewsItem';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [genre, setGenre] = useState('');
  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical'];

  useEffect(() => {
    fetchNews();
  }, [genre]);

  async function fetchNews() {
    try {
      const articles = await newsService.getNews(genre);
      setNews(articles);
    } catch (error) {
      console.error(error);
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
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="news-items">
        {news.map((article, index) => (
          <NewsItem 
            key={`${article.url}-${index}`} 
            article={article} 
          />
        ))}
      </div>
    </div>
  );
}