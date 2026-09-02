import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/signup', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? errors[0].msg : err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name (20-60 characters)" value={form.name}
          onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} required />
        <textarea name="address" placeholder="Address" value={form.address}
          onChange={handleChange} maxLength={400} />
        <input name="password" type="password" placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
          value={form.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;