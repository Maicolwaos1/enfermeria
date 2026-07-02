import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiJson } from '../lib/api';
import Layout from '../components/Layout';

// Muestra la fecha de nacimiento como día/mes/año (sin la hora que trae el ISO)
function formatearFecha(valor) {
  if (!valor) return 'No registrada';
  const soloFecha = String(valor).slice(0, 10); // "2006-08-02T05:00:00.000Z" -> "2006-08-02"
  const [anio, mes, dia] = soloFecha.split('-');
  if (!anio || !mes || !dia) return valor;
  return `${dia}/${mes}/${anio}`;
}

export default function Expediente() {
  const { id } = useParams();      // el id del paciente viene en la URL
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(true);

  // Estado de la edición de alergias (Sprint 4, endpoint PATCH)
  const [editando, setEditando] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarExpediente = async () => {
      try {
        const datos = await apiJson(`/api/pacientes/${id}/expediente`);
        setPaciente(datos.paciente);
        setConsultas(datos.consultas || []);
      } catch (error) {
        setMensajeError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarExpediente();
  }, [id]);

  // Abrir el formulario de edición con los valores actuales
  const abrirEdicion = () => {
    setAlergias(paciente.alergias || '');
    setEnfermedadesCronicas(paciente.enfermedades_cronicas || '');
    setEditando(true);
  };

  const guardarAlergias = async () => {
    setGuardando(true);
    try {
      await apiJson(`/api/pacientes/${id}/alergias`, {
        method: 'PATCH',
        body: {
          alergias,
          enfermedades_cronicas: enfermedadesCronicas,
        },
      });

      // Reflejar los cambios en pantalla sin recargar
      setPaciente({
        ...paciente,
        alergias,
        enfermedades_cronicas: enfermedadesCronicas,
      });
      setEditando(false);
      toast.success('Alergias actualizadas');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Layout>
        <div className="card"><p>Cargando expediente...</p></div>
      </Layout>
    );
  }

  if (mensajeError && !paciente) {
    return (
      <Layout>
        <div className="card">
          <p className="error-text">{mensajeError}</p>
          <button className="btn" type="button" onClick={() => navigate('/buscar')}>
            Volver a buscar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-lg">
        <h2 className="card-title">Expediente del Paciente</h2>

        {/* Datos generales */}
        <div className="expediente-datos">
          <p><strong>Nombre:</strong> {paciente.nombre}</p>
          <p><strong>Matrícula:</strong> {paciente.matricula}</p>
          <p><strong>Fecha de nacimiento:</strong> {formatearFecha(paciente.fecha_nacimiento)}</p>
          <p><strong>Correo:</strong> {paciente.correo || 'No registrado'}</p>
          <p><strong>Teléfono:</strong> {paciente.telefono || 'No registrado'}</p>
        </div>

        {/* Alergias y enfermedades crónicas resaltadas en rojo (Sprint 4) */}
        {!editando && (paciente.alergias || paciente.enfermedades_cronicas) && (
          <div className="alerta-medica">
            <p className="alerta-medica-titulo">
              <TriangleAlert size={16} strokeWidth={2.25} />
              Alertas médicas
            </p>
            {paciente.alergias && (
              <p><strong>Alergias:</strong> {paciente.alergias}</p>
            )}
            {paciente.enfermedades_cronicas && (
              <p><strong>Enfermedades crónicas:</strong> {paciente.enfermedades_cronicas}</p>
            )}
          </div>
        )}

        {/* Si no hay alergias registradas y no estamos editando, lo indicamos */}
        {!editando && !paciente.alergias && !paciente.enfermedades_cronicas && (
          <p className="sin-datos">
            Sin alergias ni enfermedades crónicas registradas.
          </p>
        )}

        {/* Formulario de edición de alergias */}
        {editando ? (
          <div className="editar-alergias">
            <label className="campo-label">Alergias</label>
            <textarea
              className="input textarea"
              placeholder="Ej. penicilina, nueces"
              value={alergias}
              onChange={(e) => setAlergias(e.target.value)}
            />
            <label className="campo-label">Enfermedades crónicas</label>
            <textarea
              className="input textarea"
              placeholder="Ej. asma, diabetes"
              value={enfermedadesCronicas}
              onChange={(e) => setEnfermedadesCronicas(e.target.value)}
            />
            <button
              className="btn"
              type="button"
              onClick={guardarAlergias}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            className="btn btn-warning"
            type="button"
            onClick={abrirEdicion}
          >
            Editar alergias
          </button>
        )}

        {/* Historial de consultas */}
        <h3 className="seccion-titulo">Historial de consultas</h3>
        {consultas.length === 0 ? (
          <p className="sin-datos">Aún no hay consultas registradas.</p>
        ) : (
          <ul className="lista-consultas">
            {consultas.map((c) => (
              <li key={c.id}>
                <strong>{c.hora_entrada}</strong> — {c.diagnostico || 'Sin diagnóstico'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
