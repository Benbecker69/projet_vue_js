const Product = require('../models/Product');
const AppError = require('../utils/AppError');

async function listProducts(req, res) {
  const products = await Product.find({ isActive: true }).sort('name');
  res.json({ products });
}

async function getProduct(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) throw new AppError('Produit introuvable', 404, 'PRODUCT_NOT_FOUND');
  res.json({ product });
}

module.exports = { listProducts, getProduct };
