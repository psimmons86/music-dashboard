const Article = require('../models/article');

async function saveArticle(req, res) {
  try {

    console.log('Received article data:', req.body);
    console.log('User from request:', req.user);


    if (!req.user) {
      return res.status(401).json({ error: 'No user found in request' });
    }

    const article = new Article({
      title: req.body.title,
      description: req.body.description || '',
      url: req.body.url,
      urlToImage: req.body.urlToImage || '',
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
      user: req.user._id 
    });

    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error('Save article error:', error);
    res.status(400).json({ 
      error: 'Failed to save article',
      message: error.message,
      user: req.user ? req.user._id : 'No user found'
    });
  }
}

async function getSavedArticles(req, res) {
  try {
    const articles = await Article.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(articles);
  } catch (error) {
    console.error('Get saved articles error:', error);
    res.status(400).json({ error: 'Failed to get saved articles' });
  }
}

async function deleteSavedArticle(req, res) {
  try {
    await Article.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(400).json({ error: 'Failed to delete article' });
  }
}

module.exports = {
  saveArticle,
  getSavedArticles,
  deleteSavedArticle
};