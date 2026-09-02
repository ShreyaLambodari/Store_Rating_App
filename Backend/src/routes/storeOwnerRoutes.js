const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { getMyStoreDashboard } = require('../controllers/storeOwnerController');

router.use(protect, authorize('STORE_OWNER'));

router.get('/dashboard', getMyStoreDashboard);

module.exports = router;