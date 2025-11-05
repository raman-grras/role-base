import './App.css'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import HomePage from './pages/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated()) {
    return <Login />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Access Denied: Insufficient permissions</div>;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
