const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
