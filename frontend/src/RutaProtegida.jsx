import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './api';

// Protege las rutas internas: si no hay token, manda al Login.
// Con soloAdmin=true, además exige que la enfermera sea administradora.
export default function RutaProtegida({ soloAdmin = false, children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (soloAdmin && localStorage.getItem('rolEnfermera') !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
