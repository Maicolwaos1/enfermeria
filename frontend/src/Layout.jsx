import React from 'react';
import Navbar from './Navbar';

// Envoltura visual de las pantallas internas: pone la Navbar arriba y centra
// el contenido debajo. La protección de sesión la hace RutaProtegida (App.jsx).
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  );
}
