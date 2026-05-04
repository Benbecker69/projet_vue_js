const User = require('../models/User');
const NfcObject = require('../models/NfcObject');
const AppError = require('../utils/AppError');

async function getPublicProfile(req, res) {
  const user = await User.findOne({ 'profile.publicSlug': req.params.slug });
  if (!user) throw new AppError('Profil introuvable', 404, 'PROFILE_NOT_FOUND');

  res.json({
    name: user.name,
    bio: user.profile.bio,
    avatar: user.profile.avatar,
    theme: user.profile.theme,
    links: user.profile.links,
    publicSlug: user.profile.publicSlug,
  });
}

async function scanNfc(req, res) {
  const nfc = await NfcObject.findOne({ code: req.params.code.toUpperCase() })
    .populate('owner', 'profile.publicSlug');

  if (!nfc || !nfc.isActive) throw new AppError('Bracelet NFC introuvable ou inactif', 404, 'NFC_NOT_FOUND');

  await NfcObject.findByIdAndUpdate(nfc._id, { $inc: { scanCount: 1 } });

  res.json({ slug: nfc.owner.profile.publicSlug });
}

module.exports = { getPublicProfile, scanNfc };
