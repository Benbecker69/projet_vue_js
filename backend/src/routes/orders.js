const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth');
const { createOrder } = require('../controllers/orderController');

const router = Router();

router.post('/', requireAuth, createOrder);

module.exports = router;
