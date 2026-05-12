const { ZodError } = require('zod');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Données invalides',
        code: 'VALIDATION_ERROR',
        details: err.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      },
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: {
        message: 'Données invalides',
        code: 'VALIDATION_ERROR',
        details: Object.values(err.errors).map(e => ({ field: e.path, message: e.message })),
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'champ';
    return res.status(409).json({
      error: { message: `${field} déjà utilisé`, code: 'DUPLICATE_KEY' },
    });
  }

  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : err.message,
      code: 'INTERNAL_ERROR',
    },
  });
}

module.exports = errorHandler;
