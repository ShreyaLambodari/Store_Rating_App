const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(' Database connected successfully');
  } catch (err) {
    console.error(' Database connection failed:', err.message);
  }
  console.log(` Server running on http://localhost:${PORT}`);
});