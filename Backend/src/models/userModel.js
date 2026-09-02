const pool = require('../config/db');

const createUser = async ({ name, email, password, address, role }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, address, role]
  );
  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

module.exports = { createUser, findUserByEmail, findUserById };