import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', esError: false });

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', esError: false });

    try {
      // Conectar al endpoint /registro
      const response = await fetch('http://localhost:5000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario, contrasenia })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: '¡Registro exitoso! Redirigiendo...', esError: false });
        setTimeout(() => navigate('/'), 2000); // Redirige al login tras 2 segundos
      } else {
        setMensaje({ texto: data.mensaje || 'Error al registrar.', esError: true });
      }
    } catch (error) {
      setMensaje({ texto: 'Error de conexión con el servidor.', esError: true });
    }
  };

  return (
    <div className="registro-container" style={{ padding: '20px' }}>
      <h1>Registro de enfermera</h1>
      
      <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          type="text" placeholder="Nombre completo" value={nombre} 
          onChange={(e) => setNombre(e.target.value)} required 
        />
        <input 
          type="text" placeholder="Usuario o Correo" value={usuario} 
          onChange={(e) => setUsuario(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Contraseña" value={contrasenia} 
          onChange={(e) => setContrasenia(e.target.value)} required 
        />
        <button type="submit">Registrarse</button>
      </form>

      {mensaje.texto && (
        <p style={{ color: mensaje.esError ? 'red' : 'green', marginTop: '10px' }}>
          {mensaje.texto}
        </p>
      )}

      <br />
      <Link to="/" style={{ color: '#007BFF', textDecoration: 'none' }}>
        ← Volver al Login
      </Link>
    </div>
  );
}