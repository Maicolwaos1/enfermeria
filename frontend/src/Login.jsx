import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from './api';

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si llegamos aquí porque la sesión expiró, mostramos el aviso una vez
  useEffect(() => {
    const aviso = localStorage.getItem('avisoSesion');
    if (aviso) {
      toast(aviso, { icon: '⏳' });
      localStorage.removeItem('avisoSesion');
    }
  }, []);

  const handleAcceder = async () => {
    // Validación de campos vacíos
    if (!usuario || !contrasenia) {
      toast.error('Escribe tu usuario y contraseña');
      return;
    }

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
        toast.error(datos.mensaje || 'Usuario o contraseña incorrectos');
        return;
      }

      // Inicio de sesión correcto: guardamos el token, el nombre y el rol
      localStorage.setItem('token', datos.token || '');
      localStorage.setItem('nombreEnfermera', datos.nombre || usuario);
      localStorage.setItem('rolEnfermera', datos.rol || 'enfermera');
      toast.success(`Bienvenida, ${datos.nombre || usuario}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('No se pudo conectar con el servidor');
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
          onKeyDown={(e) => e.key === 'Enter' && handleAcceder()}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAcceder()}
        />

        <button
          className="login-button"
          type="button"
          onClick={handleAcceder}
          disabled={cargando}
        >
          {cargando ? 'Entrando...' : 'Acceder'}
        </button>
      </div>
    </div>
  );
}
