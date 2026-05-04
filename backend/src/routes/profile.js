const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth');
const { getProfile, updateProfile, addLink, updateLink, deleteLink } = require('../controllers/profileController');
const { listNfc, createNfc, deleteNfc } = require('../controllers/nfcController');
const { listOrders, getOrder } = require('../controllers/orderController');

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

router.get('/links', (req, res) => res.json({ links: req.user.profile.links }));
router.post('/links', addLink);
router.put('/links/:linkId', updateLink);
router.delete('/links/:linkId', deleteLink);

router.get('/nfc', listNfc);
router.post('/nfc', createNfc);
router.delete('/nfc/:id', deleteNfc);

router.get('/orders', listOrders);
router.get('/orders/:id', getOrder);

module.exports = router;
