import { useState, useEffect } from 'react';
import api from '../api/axios';

function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/store-owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) {
    return <div className="container"><p className="error">{error}</p></div>;
  }

  if (!data) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <h2>My Store: {data.store.name}</h2>
      <p>Address: {data.store.address}</p>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>{Number(data.averageRating).toFixed(1)} ⭐</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-card">
          <h3>{data.raters.length}</h3>
          <p>Total Ratings</p>
        </div>
      </div>

      <h3>Users Who Rated Your Store</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map((r) => (
            <tr key={r.userId}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating} ⭐</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StoreOwnerDashboard;