import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/SignUp';
import UserStores from './pages/UserStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Normal User */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute roles={['normal_user']}>
                <UserStores />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Store Owner */}
          <Route
            path="/store-owner"
            element={
              <ProtectedRoute roles={['store_owner']}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Unknown URL */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;