const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();

require('dotenv').config();

require('./db');

app.use(logger('dev'));
app.use(cors()); 
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));

app.use('/api', require('./middleware/checkToken'));
app.use('/api', require('./middleware/ensureLoggedIn'));
app.use('/api/spotify', require('./routes/spotify'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/user', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/playlist', require('./routes/playlist'));
app.use('/api/blog', require('./routes/blog'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});