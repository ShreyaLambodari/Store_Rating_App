const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { createUser, findUserById } = require('../models/userModel');
const { createStore, getAllStoresWithRating } = require('../models/storeModel');
const { getTotalRatingsCount } = require('../models/ratingModel');

// Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [[{ userCount }]] = await pool.query('SELECT COUNT(*) AS userCount FROM users');
    const [[{ storeCount }]] = await pool.query('SELECT COUNT(*) AS storeCount FROM stores');
    const ratingCount = await getTotalRatingsCount();

    res.json({ totalUsers: userCount, totalStores: storeCount, totalRatings: ratingCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// admin adds a new user
const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!['admin', 'normal_user', 'store_owner'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, password: hashedPassword, address, role });
    res.status(201).json({ message: 'User created', userId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// admin adds a new store
const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const storeId = await createStore({ name, email, address, owner_id });
    res.status(201).json({ message: 'Store created', storeId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List users 
const listUsers = async (req, res) => {
  const { name, email, address, role, sortBy = 'id', order = 'ASC' } = req.query;

  const allowedSortFields = ['name', 'email', 'address', 'role', 'id'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
  const params = [];

  if (name) { query += ' AND name LIKE ?'; params.push(`%${name}%`); }
  if (email) { query += ' AND email LIKE ?'; params.push(`%${email}%`); }
  if (address) { query += ' AND address LIKE ?'; params.push(`%${address}%`); }
  if (role) { query += ' AND role = ?'; params.push(role); }

  query += ` ORDER BY ${sortField} ${sortOrder}`;

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List stores with 
const listStores = async (req, res) => {
  const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
  const allowedSortFields = ['name', 'email', 'address', 'averageRating'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    let stores = await getAllStoresWithRating();

    if (name) stores = stores.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (email) stores = stores.filter(s => s.email.toLowerCase().includes(email.toLowerCase()));
    if (address) stores = stores.filter(s => s.address?.toLowerCase().includes(address.toLowerCase()));

    stores.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'ASC' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//get user details
const getUserDetails = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'store_owner') {
      const [rows] = await pool.query(`
        SELECT COALESCE(AVG(r.rating), 0) AS averageRating
        FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = ?
      `, [user.id]);
      user.averageRating = rows[0].averageRating;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDashboardStats, addUser, addStore, listUsers, listStores, getUserDetails };