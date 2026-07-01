import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './api';

export default function RegistrarPaciente() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [alergias, setAlergias] = useState('');
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');

  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si no hay sesión iniciada, regresamos al Login
  useEffect(() => {
    if (!localStorage.getItem('nombreEnfermera')) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegistrar = async () => {
    // Nombre y matrícula son obligatorios; el resto es opcional
    if (!nombre || !matricula) {
      setMensajeError('El nombre y la matrícula son obligatorios');
      return;
    }

    setMensajeError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/pacientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          matricula,
          fecha_nacimiento: fechaNacimiento,
          correo,
          telefono,
          alergias,
          enfermedades_cronicas: enfermedadesCronicas,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El backend manda 400 si la matrícula ya existe o faltan datos
        setMensajeError(datos.mensaje || 'No se pudo registrar el paciente');
        return;
      }

      // Al guardar, vamos directo al expediente del paciente nuevo
      navigate(`/expediente/${datos.id}`);
    } catch (error) {
      setMensajeError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Registrar Paciente</h2>

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
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />

        <input
          className="login-input"
          type="date"
          placeholder="Fecha de nacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />

        <input
          className="login-input"
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          className="login-input"
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <textarea
          className="login-input"
          style={{ height: '70px', paddingTop: '10px', resize: 'vertical' }}
          placeholder="Alergias (ej. penicilina, nueces)"
          value={alergias}
          onChange={(e) => setAlergias(e.target.value)}
        />

        <textarea
          className="login-input"
          style={{ height: '70px', paddingTop: '10px', resize: 'vertical' }}
          placeholder="Enfermedades crónicas (ej. asma, diabetes)"
          value={enfermedadesCronicas}
          onChange={(e) => setEnfermedadesCronicas(e.target.value)}
        />

        <button
          className="login-button"
          type="button"
          onClick={handleRegistrar}
          disabled={cargando}
        >
          {cargando ? 'Guardando...' : 'Registrar paciente'}
        </button>

        {mensajeError && <p className="error-text">{mensajeError}</p>}

        <button
          className="login-link"
          type="button"
          onClick={() => navigate('/buscar')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Volver a buscar
        </button>
      </div>
    </div>
  );
}
