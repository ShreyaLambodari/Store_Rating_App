import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // login page pe navbar nahi dikhana

  return (
    <div className="navbar">
      <div>
        {user.role === 'ADMIN' && <Link to="/admin">Dashboard</Link>}
        {user.role === 'NORMAL_USER' && <Link to="/stores">Stores</Link>}
        {user.role === 'STORE_OWNER' && <Link to="/store-owner">My Store</Link>}
        <Link to="/update-password">Change Password</Link>
      </div>
      <div>
        <span style={{ marginRight: '15px' }}>Hi, {user.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;