const jwt = require('jsonwebtoken');

const PUBLIC_ROUTES = ['/api/auth', '/api/news'];

module.exports = function(req, res, next) {
  if (PUBLIC_ROUTES.some(route => req.path.startsWith(route))) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, process.env.SECRET).user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};