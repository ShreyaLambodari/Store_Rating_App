const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { getStoresForUser } = require('../models/storeModel');
const { findRating, createRating, updateRating } = require('../models/ratingModel');
const { findUserById } = require('../models/userModel');

// Store list 
const browseStores = async (req, res) => {
  const { name, address } = req.query;
  try {
    let stores = await getStoresForUser(req.user.id);

    if (name) stores = stores.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (address) stores = stores.filter(s => s.address?.toLowerCase().includes(address.toLowerCase()));

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const submitRating = async (req, res) => {
  const { storeId, rating } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }

  try {
    const existing = await findRating(req.user.id, storeId);
    if (existing) {
      await updateRating(req.user.id, storeId, rating);
      return res.json({ message: 'Rating updated' });
    } else {
      await createRating(req.user.id, storeId, rating);
      return res.status(201).json({ message: 'Rating submitted' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Password update (sabhi roles ke liye common logic, yahan rakhte hain)
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must be 8-16 characters with at least one uppercase letter and one special character',
    });
  }

  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { browseStores, submitRating, updatePassword };