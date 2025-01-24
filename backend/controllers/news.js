const axios = require('axios');


async function getNews(req, res) {
  const genre = req.query.genre;
  const url = `https://newsapi.org/v2/everything?q=music ${genre}&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    if (response.data && response.data.articles) {
      res.json(response.data.articles);
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('News API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch news' });
  }
}

module.exports = { getNews };