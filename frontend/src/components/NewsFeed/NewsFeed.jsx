import { useState, useEffect } from 'react';
import * as newsService from '../../services/newsService';
import NewsItem from '../NewsItem/NewsItem';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [genre, setGenre] = useState('');
  const genres = ['Rock', 'Hip Hop', 'Electronic', 'Pop','Punk', 'Indie', 'Alternative', 'Country', 'Folk', 'Blues', 'R&B', 'Reggae', 'Metal', 'World', 'Latin', 'K-Pop', 'Other', 'Jazz', 'Classical', 'All'];

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
    <div className="news-container">
      <div className="news-filter">
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="news-grid">
        {news.map(article => (
          <NewsItem key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}