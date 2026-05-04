const MarketingContent = require('../models/MarketingContent');
const AppError = require('../utils/AppError');

const VALID_TYPES = ['feature', 'faq', 'testimonial'];

async function listByType(req, res) {
  const { type } = req.params;
  if (!VALID_TYPES.includes(type)) throw new AppError('Type invalide', 400, 'INVALID_TYPE');
  const items = await MarketingContent.find({ type }).sort('order');
  res.json({ items });
}

module.exports = { listByType };
