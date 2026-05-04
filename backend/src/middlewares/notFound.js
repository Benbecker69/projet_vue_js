function notFound(req, res) {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.originalUrl} introuvable`, code: 'NOT_FOUND' },
  });
}

module.exports = notFound;
