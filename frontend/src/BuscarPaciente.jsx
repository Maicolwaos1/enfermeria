import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from './api';
import Layout from './Layout';

export default function BuscarPaciente() {
  const navigate = useNavigate();

  // Solo guardamos los números; el prefijo "UP" es fijo (ej. UP240231)
  const [matriculaNum, setMatriculaNum] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async () => {
    if (!matriculaNum) {
      toast.error('Escribe una matrícula');
      return;
    }

    setPaciente(null);
    setNoEncontrado(false);
    setCargando(true);

    // Reconstruimos la matrícula completa con el prefijo fijo "UP"
    const matricula = `UP${matriculaNum}`;

    try {
      const respuesta = await apiFetch(`/api/pacientes/${matricula}`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El backend manda 404 si no encuentra al paciente
        toast.error(datos.mensaje || 'Paciente no encontrado');
        setNoEncontrado(true);
        return;
      }

      setPaciente(datos);
    } catch (error) {
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout>
      <div className="login-card">
        <h2 className="login-title">Buscar Paciente</h2>

        {/* Matrícula: el prefijo "UP" es fijo, solo se escriben los números */}
        <div className="input-group">
          <span className="input-prefix">UP</span>
          <input
            className="login-input input-con-prefijo"
            type="text"
            inputMode="numeric"
            placeholder="240231"
            value={matriculaNum}
            onChange={(e) => setMatriculaNum(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
        </div>

        <button
          className="login-button"
          type="button"
          onClick={handleBuscar}
          disabled={cargando}
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>

        {noEncontrado && (
          <button
            className="login-button"
            type="button"
            onClick={() => navigate('/pacientes/nuevo')}
            style={{ backgroundColor: '#1a8f3c' }}
          >
            + Registrar paciente nuevo
          </button>
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
