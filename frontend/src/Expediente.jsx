import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './api';

export default function Expediente() {
  const { id } = useParams();      // el id del paciente viene en la URL
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Si no hay sesión iniciada, regresamos al Login
    if (!localStorage.getItem('nombreEnfermera')) {
      navigate('/');
      return;
    }

    const cargarExpediente = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/pacientes/${id}/expediente`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setMensajeError(datos.mensaje || 'No se pudo cargar el expediente');
          return;
        }

        setPaciente(datos.paciente);
        setConsultas(datos.consultas || []);
      } catch (error) {
        setMensajeError('No se pudo conectar con el servidor');
      } finally {
        setCargando(false);
      }
    };

    cargarExpediente();
  }, [id, navigate]);

  if (cargando) {
    return (
      <div className="login-container">
        <div className="login-card"><p>Cargando expediente...</p></div>
      </div>
    );
  }

  if (mensajeError) {
    return (
      <div className="login-container">
        <div className="login-card">
          <p className="error-text">{mensajeError}</p>
          <button className="login-button" type="button" onClick={() => navigate('/buscar')}>
            Volver a buscar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '500px' }}>
        <h2 className="login-title">Expediente del Paciente</h2>

        {/* Datos generales */}
        <div className="expediente-datos">
          <p><strong>Nombre:</strong> {paciente.nombre}</p>
          <p><strong>Matrícula:</strong> {paciente.matricula}</p>
          <p><strong>Fecha de nacimiento:</strong> {paciente.fecha_nacimiento || 'No registrada'}</p>
          <p><strong>Correo:</strong> {paciente.correo || 'No registrado'}</p>
          <p><strong>Teléfono:</strong> {paciente.telefono || 'No registrado'}</p>
        </div>

        {/* Historial de consultas */}
        <h3 style={{ marginTop: '20px', alignSelf: 'flex-start' }}>Historial de consultas</h3>
        {consultas.length === 0 ? (
          <p style={{ color: '#777' }}>Aún no hay consultas registradas.</p>
        ) : (
          <ul className="lista-consultas">
            {consultas.map((c) => (
              <li key={c.id}>
                <strong>{c.hora_entrada}</strong> — {c.diagnostico || 'Sin diagnóstico'}
              </li>
            ))}
          </ul>
        )}

        <button className="login-button" type="button" onClick={() => navigate('/buscar')}>
          ← Volver a buscar
        </button>
      </div>
    </div>
  );
}
