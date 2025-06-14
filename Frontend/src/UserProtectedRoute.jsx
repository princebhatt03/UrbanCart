import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  return token ? (
    children
  ) : (
    <Navigate
      to="/userLogin"
      replace
    />
  );
};

export default ProtectedRoute;
