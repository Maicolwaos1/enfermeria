import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './api';

export default function BuscarPaciente() {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si no hay sesión iniciada, regresamos al Login
  useEffect(() => {
    if (!localStorage.getItem('nombreEnfermera')) {
      navigate('/');
    }
  }, [navigate]);

  const handleBuscar = async () => {
    if (!matricula) {
      setMensajeError('Escribe una matrícula');
      setPaciente(null);
      return;
    }

    setMensajeError('');
    setPaciente(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/pacientes/${matricula}`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El backend manda 404 si no encuentra al paciente
        setMensajeError(datos.mensaje || 'Paciente no encontrado');
        return;
      }

      setPaciente(datos);
    } catch (error) {
      setMensajeError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Buscar Paciente</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
        />

        <button
          className="login-button"
          type="button"
          onClick={handleBuscar}
          disabled={cargando}
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>

        {mensajeError && <p className="error-text">{mensajeError}</p>}

        {/* Resultado de la búsqueda */}
        {paciente && (
          <div className="resultado-paciente">
            <p><strong>{paciente.nombre}</strong></p>
            <p>Matrícula: {paciente.matricula}</p>
            <button
              className="login-button"
              type="button"
              onClick={() => navigate(`/expediente/${paciente.id}`)}
            >
              Ver expediente
            </button>
          </div>
        )}

        <button
          className="login-link"
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
