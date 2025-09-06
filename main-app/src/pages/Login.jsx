// Assignment/main-app/src/pages/Login.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    // Navigation will be handled by the redirect above
    // since isAuthenticated() will return true after login
  };

  return (
    <AuthForm onSuccess={handleLoginSuccess} />
  );
};

export default Login;
