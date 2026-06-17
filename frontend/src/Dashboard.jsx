import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    // Recuperamos el nombre que se guardó al iniciar sesión
    const nombreGuardado = localStorage.getItem('nombreEnfermera');

    // Si no hay sesión iniciada, regresamos al Login
    if (!nombreGuardado) {
      navigate('/');
      return;
    }

    setNombre(nombreGuardado);
  }, [navigate]);

  const handleCerrarSesion = () => {
    // Borramos los datos de la sesión y regresamos al Login
    localStorage.removeItem('nombreEnfermera');
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bienvenida, {nombre}</h2>
        <p style={{ color: '#555', marginBottom: '20px', textAlign: 'center' }}>
          Has iniciado sesión correctamente.
        </p>

        <button className="login-button" type="button" onClick={handleCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
