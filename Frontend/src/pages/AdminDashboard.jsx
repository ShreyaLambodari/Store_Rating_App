import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [view, setView] = useState('users'); // 'users' ya 'stores' table dikhane ke liye toggle
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('ASC');

  // Add User form state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });

  // Add Store form state
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Dashboard 
  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data));
  }, []);

  // list fetch
  useEffect(() => {
    fetchList();
  }, [view, sortBy, order]);

  const fetchList = async () => {
    const params = { ...filters, sortBy, order };
    try {
      if (view === 'users') {
        const res = await api.get('/admin/users', { params });
        setUsers(res.data);
      } else {
        const res = await api.get('/admin/stores', { params });
        setStores(res.data);
      }
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchList();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/admin/users', newUser);
      setMessage('User added successfully');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'normal_user' });
      setShowAddUser(false);
      fetchList();
      api.get('/admin/dashboard').then((res) => setStats(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/admin/stores', newStore);
      setMessage('Store added successfully');
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      setShowAddStore(false);
      fetchList();
      api.get('/admin/dashboard').then((res) => setStats(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="stats-cards">
        <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
        <div className="stat-card"><h3>{stats.totalStores}</h3><p>Total Stores</p></div>
        <div className="stat-card"><h3>{stats.totalRatings}</h3><p>Total Ratings</p></div>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setView('users')} style={{ marginRight: '10px' }}>View Users</button>
        <button onClick={() => setView('stores')} style={{ marginRight: '10px' }}>View Stores</button>
        <button onClick={() => setShowAddUser(!showAddUser)} style={{ marginRight: '10px' }}>+ Add User</button>
        <button onClick={() => setShowAddStore(!showAddStore)}>+ Add Store</button>
      </div>

      {showAddUser && (
        <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
          <input placeholder="Name (20-60 chars)" value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
          <input placeholder="Email" type="email" value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <textarea placeholder="Address" value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="normal_user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button type="submit">Create User</button>
        </form>
      )}

      {showAddStore && (
        <form onSubmit={handleAddStore} style={{ marginBottom: '20px' }}>
          <input placeholder="Store Name" value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
          <input placeholder="Store Email" type="email" value={newStore.email}
            onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} required />
          <textarea placeholder="Address" value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
          <input placeholder="Owner User ID (optional)" value={newStore.owner_id}
            onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })} />
          <button type="submit">Create Store</button>
        </form>
      )}

      <form className="filters" onSubmit={handleFilterSubmit}>
        <input placeholder="Filter by Name" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by Email" value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by Address" value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        {view === 'users' && (
          <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        )}
        <button type="submit">Search</button>
      </form>

      {view === 'users' ? (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {sortBy === 'name' && (order === 'ASC' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('email')}>Email {sortBy === 'email' && (order === 'ASC' ? '▲' : '▼')}</th>
              <th>Address</th>
              <th onClick={() => handleSort('role')}>Role {sortBy === 'role' && (order === 'ASC' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {sortBy === 'name' && (order === 'ASC' ? '▲' : '▼')}</th>
              <th>Email</th>
              <th>Address</th>
              <th onClick={() => handleSort('averageRating')}>Rating {sortBy === 'averageRating' && (order === 'ASC' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{Number(s.averageRating).toFixed(1)} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;