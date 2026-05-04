const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

function generateSlug(name) {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email déjà utilisé', 409, 'EMAIL_TAKEN');

  const slug = generateSlug(name);
  const user = await User.create({
    name,
    email,
    passwordHash: password,
    profile: { publicSlug: slug },
  });

  const token = signToken(user);
  return { user: user.toPublicJSON(), token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');

  const valid = await user.comparePassword(password);
  if (!valid) throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');

  const token = signToken(user);
  return { user: user.toPublicJSON(), token };
}

module.exports = { register, login, signToken };
