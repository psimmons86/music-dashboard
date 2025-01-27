const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  let token = req.get('Authorization') || req.query.token;
  
  if (token) {
    token = token.replace('Bearer ', '');
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({error: 'Invalid token'});
      }
      req.user = decoded.user;
      next();
    });
  } else {
    return res.status(401).json({error: 'No token provided'});
  }
};