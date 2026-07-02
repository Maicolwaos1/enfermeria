import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiJson } from './lib/api';
import { guardarSesion, tomarAvisoSesion } from './lib/auth';

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si llegamos aquí porque la sesión expiró, mostramos el aviso una vez
  useEffect(() => {
    const aviso = tomarAvisoSesion();
    if (aviso) toast(aviso, { icon: '⏳' });
  }, []);

  const handleAcceder = async () => {
    // Validación de campos vacíos
    if (!usuario || !contrasenia) {
      toast.error('Escribe tu usuario y contraseña');
      return;
    }

    setCargando(true);

    try {
      const datos = await apiJson('/login', {
        method: 'POST',
        body: { usuario, password: contrasenia },
      });

      // Inicio de sesión correcto: guardamos el token, el nombre y el rol
      guardarSesion(datos);
      toast.success(`Bienvenida, ${datos.nombre || usuario}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
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
