const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

async function verifyToken(req) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) return null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  return user || null;
}

async function requireAuth(req, res, next) {
  try {
    const user = await verifyToken(req);
    if (!user) throw new AppError('Non authentifié', 401, 'UNAUTHORIZED');
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Token invalide ou expiré', 401, 'INVALID_TOKEN'));
    }
    next(err);
  }
}

async function optionalAuth(req, res, next) {
  try {
    req.user = await verifyToken(req);
    next();
  } catch {
    req.user = null;
    next();
  }
}

module.exports = { requireAuth, optionalAuth };
