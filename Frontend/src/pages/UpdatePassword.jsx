import { useState } from 'react';
import api from '../api/axios';

function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await api.put('/user/password', { currentPassword, newPassword });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Change Password</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Current Password" value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)} required />
        <input type="password" placeholder="New Password (8-16 chars, 1 uppercase, 1 special char)"
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default UpdatePassword;