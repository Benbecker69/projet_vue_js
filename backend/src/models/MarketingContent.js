const mongoose = require('mongoose');

const marketingContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['feature', 'faq', 'testimonial'],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  body: { type: String, default: '' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('MarketingContent', marketingContentSchema);
