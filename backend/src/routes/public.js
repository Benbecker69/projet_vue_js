const { Router } = require('express');
const { getPublicProfile, scanNfc } = require('../controllers/publicController');

const router = Router();

router.get('/profile/:slug', getPublicProfile);
router.post('/nfc/:code/scan', scanNfc);

module.exports = router;
