module.exports = function(req, res, next) {
  const publicRoutes = ['/api/auth', '/api/news'];
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
  }
  
  next();
};