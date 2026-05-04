const { Router } = require('express');
const { listByType } = require('../controllers/marketingController');

const router = Router();

router.get('/:type', listByType);

module.exports = router;
