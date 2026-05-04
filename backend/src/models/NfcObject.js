const mongoose = require('mongoose');

const nfcObjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  label: { type: String, default: 'Mon bracelet', trim: true },
  isActive: { type: Boolean, default: true },
  scanCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('NfcObject', nfcObjectSchema);
