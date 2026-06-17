import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from './api';

export default function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistrar = async () => {
    // Validación de campos vacíos
    if (!nombre || !usuario || !correo || !contrasenia) {
      setMensajeError('Todos los campos son obligatorios');
      setMensajeExito('');
      return;
    }

    setMensajeError('');
    setMensajeExito('');
    setCargando(true);

    try {
      // Llamada al endpoint POST /registro del backend
      const respuesta = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario, correo, password: contrasenia }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El backend manda 400 si el usuario/correo ya existen o faltan datos
        setMensajeError(datos.mensaje || 'No se pudo registrar');
        return;
      }

      // Registro correcto: avisamos y regresamos al Login después de un momento
      setMensajeExito('Enfermera registrada. Redirigiendo al login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMensajeError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Registro de Enfermera</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="login-input"
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          className="login-input"
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
          onClick={handleRegistrar}
          disabled={cargando}
        >
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>

        {mensajeError && <p className="error-text">{mensajeError}</p>}
        {mensajeExito && <p className="success-text">{mensajeExito}</p>}

        <Link to="/" className="login-link">
          ← Volver al Login
        </Link>
      </div>
    </div>
  );
}
