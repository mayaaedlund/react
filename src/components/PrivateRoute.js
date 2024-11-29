import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = sessionStorage.getItem('token'); // Kontrollera token i sessionStorage

  return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
