import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiJson } from './lib/api';
import { esCorreoValido, esMatriculaValida, MAX_DIGITOS_MATRICULA } from './lib/validaciones';
import Layout from './Layout';

export default function RegistrarPaciente() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  // Solo guardamos los números; el prefijo "UP" es fijo (ej. UP240231)
  const [matriculaNum, setMatriculaNum] = useState('');
  // Fecha de nacimiento con tres desplegables (más intuitivo que el calendario)
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  // ¿Tiene alergias / enfermedades crónicas? Solo si es "Sí" se muestra el texto
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [tieneCronicas, setTieneCronicas] = useState(false);
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');

  const [cargando, setCargando] = useState(false);

  const correoValido = esCorreoValido(correo);

  // Opciones para los desplegables de la fecha de nacimiento
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: anioActual - 1919 }, (_, i) => anioActual - i);
  // Días válidos según el mes y año elegidos (para no ofrecer 31 en febrero, etc.)
  const diasEnMes = mes && anio ? new Date(Number(anio), Number(mes), 0).getDate() : 31;
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1);

  const handleRegistrar = async () => {
    // Nombre y matrícula son obligatorios; el resto es opcional
    if (!nombre || !matriculaNum) {
      toast.error('El nombre y la matrícula son obligatorios');
      return;
    }

    // Misma regla que el backend: UP + 4 a 10 dígitos
    if (!esMatriculaValida(matriculaNum)) {
      toast.error('La matrícula debe tener de 4 a 10 dígitos');
      return;
    }

    // El correo es opcional, pero si lo escriben debe tener formato válido
    if (!correoValido) {
      toast.error('Escribe un correo válido (ej. nombre@gmail.com)');
      return;
    }

    // Si marcaron "Sí" pero no escribieron nada, pedimos el detalle
    if (tieneAlergias && !alergias.trim()) {
      toast.error('Especifica las alergias o marca "No"');
      return;
    }
    if (tieneCronicas && !enfermedadesCronicas.trim()) {
      toast.error('Especifica las enfermedades crónicas o marca "No"');
      return;
    }

    // La fecha es opcional, pero si empezaron a llenarla debe estar completa
    if ((dia || mes || anio) && !(dia && mes && anio)) {
      toast.error('Completa la fecha de nacimiento (día, mes y año)');
      return;
    }

    setCargando(true);

    // Reconstruimos la matrícula completa con el prefijo fijo "UP"
    const matricula = `UP${matriculaNum}`;

    // Armamos la fecha en formato YYYY-MM-DD que espera el backend
    const fechaNacimiento = dia && mes && anio
      ? `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      : '';

    try {
      const datos = await apiJson('/api/pacientes', {
        method: 'POST',
        body: {
          nombre,
          matricula,
          fecha_nacimiento: fechaNacimiento,
          correo,
          telefono,
          alergias,
          enfermedades_cronicas: enfermedadesCronicas,
        },
      });

      // Al guardar, vamos directo al expediente del paciente nuevo
      toast.success('Paciente registrado correctamente');
      navigate(`/expediente/${datos.id}`);
    } catch (error) {
      toast.error(error.message);
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
            maxLength={MAX_DIGITOS_MATRICULA}
            placeholder="240231"
            value={matriculaNum}
            onChange={(e) => setMatriculaNum(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        {/* Fecha de nacimiento con desplegables: más rápido que el calendario */}
        <span className="campo-label">Fecha de nacimiento</span>
        <div className="fecha-grupo">
          <select
            className="login-input"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          >
            <option value="">Día</option>
            {dias.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            className="login-input"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Mes</option>
            {meses.map((nombreMes, i) => (
              <option key={nombreMes} value={i + 1}>{nombreMes}</option>
            ))}
          </select>
          <select
            className="login-input"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
          >
            <option value="">Año</option>
            {anios.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

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
          placeholder="Teléfono (10 dígitos)"
          maxLength={10}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
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
      </div>
    </Layout>
  );
}
