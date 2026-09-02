
const getStoresForUser = async (userId) => {
  const [rows] = await pool.query(`
    SELECT s.id, s.name, s.email, s.address,
           COALESCE(AVG(r.rating), 0) AS overallRating,
           (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) AS userRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `, [userId]);
  return rows;
};