import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate(); // <- Añadido para poder redireccionar
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [errorTexto, setErrorTexto] = useState('No existe el usuario');

  const handleAcceder = async () => {
    setMostrarError(false);

    try {
      // Conectar al endpoint /login
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasenia })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar datos en el localStorage para simular sesión
        localStorage.setItem('token', data.token || 'fake-jwt-token');
        localStorage.setItem('usuario_nombre', data.nombre || usuario); 
        
        // Redirigir al Dashboard si las credenciales son correctas
        navigate('/dashboard');
      } else {
        setErrorTexto(data.mensaje || 'Credenciales incorrectas');
        setMostrarError(true);
      }
    } catch (error) {
      setErrorTexto('Error al conectar con el servidor');
      setMostrarError(true);
    }
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

        {mostrarError && <p className="error-text" style={{ color: 'red' }}>{errorTexto}</p>}

        <Link to="/registro" className="login-link">
          Registro de enfermera
        </Link>
      </div>
    </div>
  );
}