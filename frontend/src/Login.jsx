import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from './api';

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleAcceder = async () => {
    // Validación de campos vacíos
    if (!usuario || !contrasenia) {
      setMensajeError('Escribe tu usuario y contraseña');
      return;
    }

    setMensajeError('');
    setCargando(true);

    try {
      // Llamada al endpoint POST /login del backend
      const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password: contrasenia }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El backend manda 401 si el usuario o contraseña son incorrectos
        setMensajeError(datos.mensaje || 'Usuario o contraseña incorrectos');
        return;
      }

      // Inicio de sesión correcto: guardamos el nombre y vamos al Dashboard
      localStorage.setItem('nombreEnfermera', datos.nombre || usuario);
      navigate('/dashboard');
    } catch (error) {
      setMensajeError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Usuario"
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

        <button
          className="login-button"
          type="button"
          onClick={handleAcceder}
          disabled={cargando}
        >
          {cargando ? 'Entrando...' : 'Acceder'}
        </button>

        {mensajeError && <p className="error-text">{mensajeError}</p>}

        <Link to="/registro" className="login-link">
          Registro de enfermera
        </Link>
      </div>
    </div>
  );
}
