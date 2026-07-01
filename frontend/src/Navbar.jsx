import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Stethoscope, CircleUser, ChevronDown, UserPlus, RefreshCw, LogOut } from 'lucide-react';
import { limpiarSesion } from './api';

// Barra de navegación fija que aparece en todas las pantallas internas
// (Dashboard, Buscar, Registrar, Expediente).
export default function Navbar() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem('nombreEnfermera') || '';
  const rol = localStorage.getItem('rolEnfermera') || 'enfermera';
  const esAdmin = rol === 'admin';

  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const alClicFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', alClicFuera);
    return () => document.removeEventListener('mousedown', alClicFuera);
  }, []);

  // Borra la sesión y regresa al Login (sirve para "Cambiar usuario" y "Cerrar sesión")
  const salir = () => {
    limpiarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">
        <Stethoscope size={20} strokeWidth={2} />
        Enfermería Escolar
      </span>

      <div className="navbar-links">
        <NavLink to="/dashboard" className="navbar-link">Inicio</NavLink>
        <NavLink to="/buscar" className="navbar-link">Buscar</NavLink>
        <NavLink to="/pacientes/nuevo" className="navbar-link">Registrar</NavLink>
      </div>

      {/* Menú de cuenta (esquina superior derecha) */}
      <div className="navbar-cuenta" ref={menuRef}>
        <button
          className="cuenta-boton"
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <CircleUser size={20} strokeWidth={2} />
          <span className="cuenta-nombre">{nombre}</span>
          <ChevronDown size={16} strokeWidth={2} />
        </button>

        {menuAbierto && (
          <div className="cuenta-menu">
            <div className="cuenta-menu-header">
              <strong>{nombre}</strong>
              <span className={`cuenta-badge ${esAdmin ? 'badge-admin' : ''}`}>
                {esAdmin ? 'Administrador' : 'Enfermera'}
              </span>
            </div>

            <button className="cuenta-menu-item" type="button" onClick={salir}>
              <RefreshCw size={16} strokeWidth={2} /> Cambiar usuario
            </button>

            {esAdmin && (
              <button
                className="cuenta-menu-item"
                type="button"
                onClick={() => { setMenuAbierto(false); navigate('/registro'); }}
              >
                <UserPlus size={16} strokeWidth={2} /> Crear nueva enfermera
              </button>
            )}

            <button className="cuenta-menu-item cuenta-menu-salir" type="button" onClick={salir}>
              <LogOut size={16} strokeWidth={2} /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
