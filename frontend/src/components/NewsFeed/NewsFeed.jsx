// components/NewsFeed/NewsFeed.jsx
import { useState, useEffect } from 'react';
import * as newsService from '../../services/newsService';
import NewsItem from '../NewsItem/NewsItem';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [genre, setGenre] = useState('');
  const genres = ['Rock', 'Hip Hop',  'Electronic', 'Pop','Punk', 'Indie', 'Alternative', 'Country', 'Folk', 'Blues', 'R&B', 'Reggae', 'Metal',  'World', 'Latin', 'K-Pop', 'Other','Jazz', 'Classical', 'All'];

  useEffect(() => {
    fetchNews();
  }, [genre]);

  async function fetchNews() {
    const articles = await newsService.getNews(genre);
    setNews(articles);
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map(article => (
          <NewsItem key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}