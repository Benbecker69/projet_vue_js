const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  icon: { type: String, default: 'link' },
}, { _id: true });

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '', maxlength: 500 },
  avatar: { type: String, default: '' },
  theme: { type: String, enum: ['dark', 'light', 'neon'], default: 'dark' },
  publicSlug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/,
  },
  links: { type: [linkSchema], default: [] },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Email invalide'],
  },
  passwordHash: { type: String, required: true, select: false },
  name: {
    type: String,
    required: [true, 'Nom requis'],
    trim: true,
    minlength: [2, 'Nom trop court'],
    maxlength: [80, 'Nom trop long'],
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: { type: profileSchema, default: () => ({}) },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    profile: this.profile,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
