const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { browseStores, submitRating, updatePassword } = require('../controllers/userController');

router.use(protect);

router.get('/stores', authorize('normal_user'), browseStores);
router.post('/ratings', authorize('normal_user'), submitRating);
router.put('/password', updatePassword); // sabhi roles ke liye common

module.exports = router;