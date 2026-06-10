import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  
  const [mostrarError, setMostrarError] = useState(false);

  const handleAcceder = () => {
    setMostrarError(true); 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Usuario o Correo"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
        />

        <button className="login-button" type="button" onClick={handleAcceder}>
          Acceder
        </button>

        {mostrarError && <p className="error-text">No existe el usuario</p>}

        <Link to="/registro" className="login-link">
          Registro de enfermera
        </Link>
      </div>
    </div>
  );
}