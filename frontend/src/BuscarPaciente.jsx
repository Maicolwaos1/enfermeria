import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from './api';
import Layout from './Layout';

export default function BuscarPaciente() {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

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
      const respuesta = await apiFetch(`/api/pacientes/${matricula}`);
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
    <Layout>
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

        {mensajeError && (
          <>
            <p className="error-text">{mensajeError}</p>
            <button
              className="login-button"
              type="button"
              onClick={() => navigate('/pacientes/nuevo')}
              style={{ backgroundColor: '#1a8f3c' }}
            >
              + Registrar paciente nuevo
            </button>
          </>
        )}

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
      </div>
    </Layout>
  );
}
