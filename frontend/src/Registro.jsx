import React from 'react';
import { Link } from 'react-router-dom';

export default function Registro() {
  return (
    <div className="registro-container">
      <h1>Registro</h1>
      <Link to="/" style={{ color: '#007BFF', textDecoration: 'none' }}>
        ← Volver al Login
      </Link>
    </div>
  );
}