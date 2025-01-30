const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  let token = req.get('Authorization') || req.query.token;
  
  if (token) {
    token = token.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};