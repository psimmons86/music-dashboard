const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Load environment variables
require('dotenv').config();
require('./db');

// Create base public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Basic middleware
app.use(logger('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Public routes (no auth required)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));

// Spotify auth routes (for initial connection)
app.use('/api/spotify/connect', require('./routes/spotify'));
app.use('/api/spotify/callback', require('./routes/spotify'));

// Auth middleware for protected routes
app.use('/api', require('./middleware/checkToken'));
app.use('/api', require('./middleware/ensureLoggedIn'));

// Protected routes (just need to be logged in)
app.use('/api/blog', require('./routes/blog'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/user', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/spotify', require('./routes/spotify'));
app.use('/api/playlist', require('./routes/playlist'));
app.use('/api/weekly-playlist', require('./routes/weeklyPlaylist'));

// SPA catch-all route
app.get('/*', function(req, res) {
  const frontendPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(frontendPath)) {
    res.sendFile(frontendPath);
  } else {
    res.status(404).send('Frontend build not found. Please run npm run build in the frontend directory.');
  }
});

// Global error handling middleware
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
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});