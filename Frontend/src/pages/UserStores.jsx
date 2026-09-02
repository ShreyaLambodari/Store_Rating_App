import { useState, useEffect } from 'react';
import api from '../api/axios';

function UserStores() {
  const [stores, setStores] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get('/user/stores', {
        params: { name: nameFilter, address: addressFilter },
      });
      setStores(res.data);
    } catch (err) {
      setError('Failed to load stores');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, rating) => {
    setError('');
    setMessage('');
    try {
      await api.post('/user/ratings', { storeId, rating });
      setMessage('Rating submitted!');
      fetchStores(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div className="container">
      <h2>Browse Stores</h2>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form className="filters" onSubmit={handleSearch}>
        <input placeholder="Search by Name" value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)} />
        <input placeholder="Search by Address" value={addressFilter}
          onChange={(e) => setAddressFilter(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Rate this Store</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{Number(store.overallRating).toFixed(1)} ⭐</td>
              <td>{store.userRating ? `${store.userRating} ⭐` : 'Not rated yet'}</td>
              <td>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= store.userRating ? 'filled' : ''}
                      onClick={() => handleRate(store.id, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserStores;