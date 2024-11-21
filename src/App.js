import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import RoleSelection from './pages/RoleSelection';
import { resetAuth, setRole } from './store/authSlice';
import Loader from './loader';
import Layout from './layout';
import Profile from './pages/profile';
import Doctors from './pages/doctors';
import Staff from './pages/staff';

const AppRoutes = () => {
  const roles = useSelector((state) => state.auth.roles);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const authState = useSelector((state) => state.auth);
  const { status } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if localStorage is cleared
    const handleStorageChange = () => {
      if (!localStorage.getItem('user') || !localStorage.getItem('userRole')) {
        // If user or role is not found in localStorage, reset the state
        dispatch(resetAuth());
      }else{
        let role=localStorage.getItem('userRole');
        if(role && (roles.find(r=>r===role))){
          dispatch(setRole(role));
        }
      }
    };

    // Listen for storage changes (clear or manual changes)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch,roles]);
  // Redirect to Role Selection if no role is selected
  const ProtectedRoute = ({ children }) => {
    if (!role) return <Navigate to="/user-role" />; // Redirect to role selection if no role
    if (!user) return <Navigate to="/login" />; // Redirect to login if no user
    return children;
  };

  // Prevent access to Login/Signup without a role
  const ProtectedRoleRoute = ({ children }) => {
    return role ? children : <Navigate to="/user-role" />;
  };

  return (<> {status==='loading' && <Loader />}
    <Router>
      <Routes>
        <Route path="/user-role" element={<RoleSelection />} />
        
        {/* Public Routes with Role Check */}
        <Route path="/login" element={<ProtectedRoleRoute><Login /></ProtectedRoleRoute>} />
        <Route path="/signup" element={<ProtectedRoleRoute><Signup /></ProtectedRoleRoute>} />
        <Route path="/forgot-password" element={<ProtectedRoleRoute><ForgotPassword /></ProtectedRoleRoute>} />
        <Route path="/reset-password" element={<ProtectedRoleRoute><ResetPassword /></ProtectedRoleRoute>} />

        {/* Protected Route for Authenticated Users */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><Layout><Doctors /></Layout></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Layout><Staff /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
    </>
  );
};

export default AppRoutes;
