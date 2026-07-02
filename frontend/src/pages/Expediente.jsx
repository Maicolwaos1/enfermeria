import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Title, Text, Alert, Textarea, Button, Stack, Group, Divider, Loader, Center,
} from '@mantine/core';
import { TriangleAlert } from 'lucide-react';
import { apiJson } from '../lib/api';
import { exito, error } from '../lib/avisos';
import Layout from '../components/Layout';

// Muestra la fecha de nacimiento como día/mes/año (sin la hora que trae el ISO)
function formatearFecha(valor) {
  if (!valor) return 'No registrada';
  const soloFecha = String(valor).slice(0, 10); // "2006-08-02T05:00:00.000Z" -> "2006-08-02"
  const [anio, mes, dia] = soloFecha.split('-');
  if (!anio || !mes || !dia) return valor;
  return `${dia}/${mes}/${anio}`;
}

// Renglón etiqueta + valor de los datos generales
function Dato({ etiqueta, valor }) {
  return (
    <Group gap={8} wrap="nowrap" align="baseline">
      <Text size="sm" fw={600} w={150} style={{ flexShrink: 0 }}>{etiqueta}</Text>
      <Text size="sm">{valor}</Text>
    </Group>
  );
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
      } catch (e) {
        setMensajeError(e.message);
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
      exito('Alergias actualizadas');
    } catch (e) {
      error(e.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Layout>
        <Center mt="xl"><Loader /></Center>
      </Layout>
    );
  }

  if (mensajeError && !paciente) {
    return (
      <Layout>
        <Paper shadow="md" radius="md" p={40} withBorder w="100%" maw={380}>
          <Stack>
            <Text c="red" fw={600} ta="center">{mensajeError}</Text>
            <Button fullWidth onClick={() => navigate('/buscar')}>
              Volver a buscar
            </Button>
          </Stack>
        </Paper>
      </Layout>
    );
  }

  return (
    <Layout>
      <Paper shadow="md" radius="md" p={40} withBorder w="100%" maw={520}>
        <Title order={3} ta="center" mb="lg">Expediente del Paciente</Title>

        {/* Datos generales */}
        <Stack gap={6}>
          <Dato etiqueta="Nombre:" valor={paciente.nombre} />
          <Dato etiqueta="Matrícula:" valor={paciente.matricula} />
          <Dato etiqueta="Fecha de nacimiento:" valor={formatearFecha(paciente.fecha_nacimiento)} />
          <Dato etiqueta="Correo:" valor={paciente.correo || 'No registrado'} />
          <Dato etiqueta="Teléfono:" valor={paciente.telefono || 'No registrado'} />
        </Stack>

        {/* Alergias y enfermedades crónicas resaltadas en rojo (Sprint 4) */}
        {!editando && (paciente.alergias || paciente.enfermedades_cronicas) && (
          <Alert
            mt="lg"
            radius="md"
            color="red"
            variant="light"
            icon={<TriangleAlert size={18} strokeWidth={2.25} />}
            title="ALERTAS MÉDICAS"
          >
            <Stack gap={4}>
              {paciente.alergias && (
                <Text size="sm"><strong>Alergias:</strong> {paciente.alergias}</Text>
              )}
              {paciente.enfermedades_cronicas && (
                <Text size="sm">
                  <strong>Enfermedades crónicas:</strong> {paciente.enfermedades_cronicas}
                </Text>
              )}
            </Stack>
          </Alert>
        )}

        {/* Si no hay alergias registradas y no estamos editando, lo indicamos */}
        {!editando && !paciente.alergias && !paciente.enfermedades_cronicas && (
          <Text size="sm" c="dimmed" mt="md">
            Sin alergias ni enfermedades crónicas registradas.
          </Text>
        )}

        {/* Formulario de edición de alergias */}
        {editando ? (
          <Stack mt="md">
            <Textarea
              label="Alergias"
              autosize
              minRows={2}
              placeholder="Ej. penicilina, nueces"
              value={alergias}
              onChange={(e) => setAlergias(e.target.value)}
            />
            <Textarea
              label="Enfermedades crónicas"
              autosize
              minRows={2}
              placeholder="Ej. asma, diabetes"
              value={enfermedadesCronicas}
              onChange={(e) => setEnfermedadesCronicas(e.target.value)}
            />
            <Group grow>
              <Button color="gray" variant="light" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
              <Button loading={guardando} onClick={guardarAlergias}>
                Guardar
              </Button>
            </Group>
          </Stack>
        ) : (
          <Button fullWidth mt="md" color="orange" variant="light" onClick={abrirEdicion}>
            Editar alergias
          </Button>
        )}

        {/* Historial de consultas */}
        <Divider my="lg" />
        <Title order={5} mb="xs">Historial de consultas</Title>
        {consultas.length === 0 ? (
          <Text size="sm" c="dimmed">Aún no hay consultas registradas.</Text>
        ) : (
          <Stack gap="xs">
            {consultas.map((c) => (
              <Paper key={c.id} withBorder radius="md" p="sm">
                <Text size="sm" fw={600}>{formatearFecha(c.hora_entrada)}</Text>
                <Text size="sm">{c.diagnostico || 'Sin diagnóstico'}</Text>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Layout>
  );
}
