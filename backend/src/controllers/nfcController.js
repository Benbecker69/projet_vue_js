const { z } = require('zod');
const NfcObject = require('../models/NfcObject');
const AppError = require('../utils/AppError');

function generateCode() {
  return 'NFC-' + Math.random().toString(36).slice(2, 10).toUpperCase();
}

const createSchema = z.object({
  label: z.string().min(1).max(80).optional(),
});

async function listNfc(req, res) {
  const items = await NfcObject.find({ owner: req.user._id }).sort('-createdAt');
  res.json({ nfcObjects: items });
}

async function createNfc(req, res) {
  const data = createSchema.parse(req.body);
  let code;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 10) throw new AppError('Impossible de générer un code unique', 500);
  } while (await NfcObject.exists({ code }));

  const nfc = await NfcObject.create({ code, owner: req.user._id, ...data });
  res.status(201).json({ nfcObject: nfc });
}

async function deleteNfc(req, res) {
  const nfc = await NfcObject.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!nfc) throw new AppError('Objet NFC introuvable', 404, 'NFC_NOT_FOUND');
  res.json({ message: 'Objet NFC supprimé' });
}

module.exports = { listNfc, createNfc, deleteNfc };
