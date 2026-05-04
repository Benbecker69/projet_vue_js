const { z } = require('zod');
const authService = require('../services/authService');

const registerSchema = z.object({
  name: z.string().min(2, 'Nom trop court').max(80),
  email: z.email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

const loginSchema = z.object({
  email: z.email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const { user, token } = await authService.register(data);
  res.status(201).json({ user, token });
}

async function login(req, res) {
  const data = loginSchema.parse(req.body);
  const { user, token } = await authService.login(data);
  res.json({ user, token });
}

async function me(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

module.exports = { register, login, me };
