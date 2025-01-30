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
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public Routes - NO auth required
app.use('/api/auth', require('./routes/auth'));

// All routes after this require authentication
app.use(require('./middleware/checkToken'));
app.use(require('./middleware/ensureLoggedIn'));

// Protected Routes
app.use('/api/spotify', require('./routes/spotify'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/news', require('./routes/news'));
app.use('/api/user', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/playlist', require('./routes/playlist'));
app.use('/api/blog', require('./routes/blog'));

// Catch-all route for SPA
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});