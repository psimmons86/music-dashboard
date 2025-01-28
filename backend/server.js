
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();

require('dotenv').config();
require('./db');


app.use(logger('dev'));
app.use(cors()); 
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public Routes
app.use('/api/auth', require('./routes/auth'));

// Auth Middleware
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

// Catch-all route
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app is running on port ${port}`);
});