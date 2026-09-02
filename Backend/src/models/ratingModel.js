const pool = require('../config/db');

const getTotalRatingsCount = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM ratings');
  return rows[0].count;
};

// User ki apni ek store ke liye di hui rating dhundhna
const findRating = async (userId, storeId) => {
  const [rows] = await pool.query(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
    [userId, storeId]
  );
  return rows[0];
};

const createRating = async (userId, storeId, rating) => {
  await pool.query(
    'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
    [userId, storeId, rating]
  );
};

const updateRating = async (userId, storeId, rating) => {
  await pool.query(
    'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
    [rating, userId, storeId]
  );
};

const getRatingsForStore = async (storeId) => {
  const [rows] = await pool.query(`
    SELECT u.id AS userId, u.name, u.email, r.rating, r.created_at
    FROM ratings r JOIN users u ON r.user_id = u.id
    WHERE r.store_id = ?
  `, [storeId]);
  return rows;
};

module.exports = {
  getTotalRatingsCount, findRating, createRating, updateRating, getRatingsForStore,
};