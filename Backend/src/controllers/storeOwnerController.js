const pool = require('../config/db');
const { getRatingsForStore } = require('../models/ratingModel');

const getMyStoreDashboard = async (req, res) => {
  try {
    
    const [storeRows] = await pool.query('SELECT * FROM stores WHERE owner_id = ?', [req.user.id]);

    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const store = storeRows[0];
    const ratings = await getRatingsForStore(store.id);

    const [[{ averageRating }]] = await pool.query(`
      SELECT COALESCE(AVG(rating), 0) AS averageRating FROM ratings WHERE store_id = ?
    `, [store.id]);

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      raters: ratings, 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMyStoreDashboard };