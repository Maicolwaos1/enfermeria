import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, TextInput, Button, Text, Alert, Stack } from '@mantine/core';
import { UserRoundSearch } from 'lucide-react';
import { apiJson } from '../lib/api';
import { MAX_DIGITOS_MATRICULA } from '../lib/validaciones';
import { error } from '../lib/avisos';
import Layout from '../components/Layout';

export default function BuscarPaciente() {
  const navigate = useNavigate();

  // Solo guardamos los números; el prefijo "UP" es fijo (ej. UP240231)
  const [matriculaNum, setMatriculaNum] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!matriculaNum) {
      error('Escribe una matrícula');
      return;
    }

    setPaciente(null);
    setNoEncontrado(false);
    setCargando(true);

    try {
      // Reconstruimos la matrícula completa con el prefijo fijo "UP"
      const datos = await apiJson(`/api/pacientes/UP${matriculaNum}`);
      setPaciente(datos);
    } catch (e2) {
      error(e2.message);
      if (e2.status === 404) setNoEncontrado(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout>
      <Paper shadow="md" radius="md" p={40} withBorder w="100%" maw={380}>
        <Title order={3} ta="center" mb="lg">Buscar Paciente</Title>

        <form onSubmit={handleBuscar}>
          <Stack>
            {/* Matrícula: el prefijo "UP" es fijo, solo se escriben los números */}
            <TextInput
              label="Matrícula"
              placeholder="240231"
              inputMode="numeric"
              maxLength={MAX_DIGITOS_MATRICULA}
              leftSection={<Text size="sm" fw={600} c="azul.7">UP</Text>}
              leftSectionWidth={42}
              value={matriculaNum}
              onChange={(e2) => setMatriculaNum(e2.target.value.replace(/\D/g, ''))}
            />

            <Button type="submit" fullWidth loading={cargando}>
              Buscar
            </Button>

            {noEncontrado && (
              <Button
                fullWidth
                color="green"
                variant="light"
                onClick={() => navigate('/pacientes/nuevo')}
              >
                + Registrar paciente nuevo
              </Button>
            )}
          </Stack>
        </form>

        {/* Resultado de la búsqueda */}
        {paciente && (
          <Alert
            mt="lg"
            radius="md"
            color="azul"
            icon={<UserRoundSearch size={18} />}
            title={paciente.nombre}
          >
            <Stack gap="xs" align="flex-start">
              <Text size="sm">Matrícula: {paciente.matricula}</Text>
              <Button size="xs" onClick={() => navigate(`/expediente/${paciente.id}`)}>
                Ver expediente
              </Button>
            </Stack>
          </Alert>
        )}
      </Paper>
    </Layout>
  );
}
