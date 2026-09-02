const express = require('express');
const protect = require('../middleware/authMiddleware');


const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../validators/authValidator');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

router.get('/me', protect, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});
module.exports = router;