import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from './api';
import Layout from './Layout';

export default function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const [cargando, setCargando] = useState(false);

  // Formato de correo válido (no cualquier texto)
  const correoValido = correo === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const handleRegistrar = async () => {
    // Validación de campos vacíos
    if (!nombre || !usuario || !correo || !contrasenia) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (!correoValido) {
      toast.error('Escribe un correo válido (ej. nombre@gmail.com)');
      return;
    }

    setCargando(true);

    try {
      // Llamada al endpoint POST /registro del backend (requiere token de admin)
      const respuesta = await apiFetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario, correo, password: contrasenia }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El backend manda 400 si el usuario/correo ya existen o faltan datos
        toast.error(datos.mensaje || 'No se pudo registrar');
        return;
      }

      // Enfermera creada: avisamos y regresamos al Dashboard (el admin sigue con sesión)
      toast.success('Enfermera creada correctamente');
      navigate('/dashboard');
    } catch (error) {
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout>
      <div className="login-card">
        <h2 className="login-title">Crear Nueva Enfermera</h2>

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
          className={`login-input ${!correoValido ? 'input-error' : ''}`}
          type="email"
          placeholder="Correo (ej. nombre@gmail.com)"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        {!correoValido && (
          <p className="campo-error">Formato de correo no válido</p>
        )}

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
          {cargando ? 'Creando...' : 'Crear enfermera'}
        </button>
      </div>
    </Layout>
  );
}
