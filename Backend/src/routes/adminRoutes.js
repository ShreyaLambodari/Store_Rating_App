const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const {
  getDashboardStats, addUser, addStore, listUsers, listStores, getUserDetails,
} = require('../controllers/adminController');

router.use(protect, authorize('admin')); 

router.get('/dashboard', getDashboardStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', listUsers);
router.get('/stores', listStores);
router.get('/users/:id', getUserDetails);

module.exports = router;