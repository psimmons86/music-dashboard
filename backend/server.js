const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();

require('dotenv').config();
require('./db');

// Basic middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public routes (no auth required)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));

// Spotify auth routes must be before checkToken middleware
app.use('/api/spotify/connect', require('./routes/spotify'));
app.use('/api/spotify/callback', require('./routes/spotify'));

// Auth middleware for protected routes
app.use('/api', require('./middleware/checkToken'));
app.use('/api', require('./middleware/ensureLoggedIn'));

// Protected routes (auth required)
app.use('/api/blog', require('./routes/blog'));
app.use('/api/spotify', require('./routes/spotify'));  // Protected Spotify routes
app.use('/api/articles', require('./routes/articles'));
app.use('/api/user', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/playlist', require('./routes/playlist'));

// SPA catch-all route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please log in again'
    });
  }
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
  console.log(`Spotify callback URL: ${process.env.SPOTIFY_REDIRECT_URI}`);
});