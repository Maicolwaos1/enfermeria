import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from './api';
import Layout from './Layout';

export default function RegistrarPaciente() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  // Solo guardamos los números; el prefijo "UP" es fijo (ej. UP240231)
  const [matriculaNum, setMatriculaNum] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  // ¿Tiene alergias / enfermedades crónicas? Solo si es "Sí" se muestra el texto
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [tieneCronicas, setTieneCronicas] = useState(false);
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');

  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Formato de correo válido: algo@dominio.com (no cualquier texto)
  const correoValido = correo === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const handleRegistrar = async () => {
    // Nombre y matrícula son obligatorios; el resto es opcional
    if (!nombre || !matriculaNum) {
      setMensajeError('El nombre y la matrícula son obligatorios');
      return;
    }

    // El correo es opcional, pero si lo escriben debe tener formato válido
    if (!correoValido) {
      setMensajeError('Escribe un correo válido (ej. nombre@gmail.com)');
      return;
    }

    // Si marcaron "Sí" pero no escribieron nada, pedimos el detalle
    if (tieneAlergias && !alergias.trim()) {
      setMensajeError('Especifica las alergias o marca "No"');
      return;
    }
    if (tieneCronicas && !enfermedadesCronicas.trim()) {
      setMensajeError('Especifica las enfermedades crónicas o marca "No"');
      return;
    }

    setMensajeError('');
    setCargando(true);

    // Reconstruimos la matrícula completa con el prefijo fijo "UP"
    const matricula = `UP${matriculaNum}`;

    try {
      const respuesta = await apiFetch('/api/pacientes', {
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
    <Layout>
      <div className="login-card">
        <h2 className="login-title">Registrar Paciente</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        {/* Matrícula: el prefijo "UP" es fijo, solo se rellenan los números */}
        <div className="input-group">
          <span className="input-prefix">UP</span>
          <input
            className="login-input input-con-prefijo"
            type="text"
            inputMode="numeric"
            placeholder="240231"
            value={matriculaNum}
            onChange={(e) => setMatriculaNum(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <input
          className="login-input"
          type="date"
          placeholder="Fecha de nacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
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
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        {/* ¿Tiene alergias? Solo si es "Sí" se muestra el campo de texto */}
        <div className="pregunta-grupo">
          <span className="campo-label">¿Tiene alergias?</span>
          <div className="opciones-siNo">
            <label className="opcion-radio">
              <input
                type="radio"
                name="alergias"
                checked={tieneAlergias === true}
                onChange={() => setTieneAlergias(true)}
              />
              Sí
            </label>
            <label className="opcion-radio">
              <input
                type="radio"
                name="alergias"
                checked={tieneAlergias === false}
                onChange={() => { setTieneAlergias(false); setAlergias(''); }}
              />
              No
            </label>
          </div>
        </div>
        {tieneAlergias && (
          <textarea
            className="login-input"
            style={{ height: '70px', paddingTop: '10px', resize: 'vertical' }}
            placeholder="¿Cuáles? (ej. penicilina, nueces)"
            value={alergias}
            onChange={(e) => setAlergias(e.target.value)}
          />
        )}

        {/* ¿Tiene enfermedades crónicas? Mismo comportamiento */}
        <div className="pregunta-grupo">
          <span className="campo-label">¿Tiene enfermedades crónicas?</span>
          <div className="opciones-siNo">
            <label className="opcion-radio">
              <input
                type="radio"
                name="cronicas"
                checked={tieneCronicas === true}
                onChange={() => setTieneCronicas(true)}
              />
              Sí
            </label>
            <label className="opcion-radio">
              <input
                type="radio"
                name="cronicas"
                checked={tieneCronicas === false}
                onChange={() => { setTieneCronicas(false); setEnfermedadesCronicas(''); }}
              />
              No
            </label>
          </div>
        </div>
        {tieneCronicas && (
          <textarea
            className="login-input"
            style={{ height: '70px', paddingTop: '10px', resize: 'vertical' }}
            placeholder="¿Cuáles? (ej. asma, diabetes)"
            value={enfermedadesCronicas}
            onChange={(e) => setEnfermedadesCronicas(e.target.value)}
          />
        )}

        <button
          className="login-button"
          type="button"
          onClick={handleRegistrar}
          disabled={cargando}
        >
          {cargando ? 'Guardando...' : 'Registrar paciente'}
        </button>

        {mensajeError && <p className="error-text">{mensajeError}</p>}
      </div>
    </Layout>
  );
}
