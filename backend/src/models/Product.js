const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  stock: { type: Number, default: 99 },
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'EUR' },
  images: { type: [String], default: [] },
  variants: { type: [variantSchema], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
