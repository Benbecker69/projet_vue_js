const { z } = require('zod');
const User = require('../models/User');
const NfcObject = require('../models/NfcObject');
const AppError = require('../utils/AppError');

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url('URL invalide').optional().or(z.literal('')),
  theme: z.enum(['dark', 'light', 'neon']).optional(),
  publicSlug: z.string().min(3).max(40).regex(/^[a-z0-9-]+$/, 'Slug invalide (lettres, chiffres, tirets)').optional(),
}).strict();

const linkSchema = z.object({
  label: z.string().min(1).max(50),
  url: z.string().url('URL invalide'),
  icon: z.string().optional(),
});

async function getProfile(req, res) {
  const user = req.user.toPublicJSON();
  const nfcObjects = await NfcObject.find({ owner: req.user._id }).sort('-createdAt');
  res.json({ user, nfcObjects });
}

async function updateProfile(req, res) {
  const data = updateProfileSchema.parse(req.body);

  if (data.publicSlug) {
    const taken = await User.findOne({ 'profile.publicSlug': data.publicSlug, _id: { $ne: req.user._id } });
    if (taken) throw new AppError('Ce slug est déjà utilisé', 409, 'SLUG_TAKEN');
  }

  const updates = {};
  for (const [k, v] of Object.entries(data)) {
    updates[`profile.${k}`] = v;
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
  res.json({ user: user.toPublicJSON() });
}

async function addLink(req, res) {
  const data = linkSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { 'profile.links': data } },
    { new: true }
  );
  res.status(201).json({ links: user.profile.links });
}

async function updateLink(req, res) {
  const data = linkSchema.partial().parse(req.body);
  const user = await User.findOneAndUpdate(
    { _id: req.user._id, 'profile.links._id': req.params.linkId },
    { $set: Object.fromEntries(Object.entries(data).map(([k, v]) => [`profile.links.$.${k}`, v])) },
    { new: true }
  );
  if (!user) throw new AppError('Lien introuvable', 404, 'LINK_NOT_FOUND');
  res.json({ links: user.profile.links });
}

async function deleteLink(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { 'profile.links': { _id: req.params.linkId } } },
    { new: true }
  );
  res.json({ links: user.profile.links });
}

module.exports = { getProfile, updateProfile, addLink, updateLink, deleteLink };
