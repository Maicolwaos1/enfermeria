import { useNavigate } from 'react-router-dom';
import { Title, Text, SimpleGrid, Card, ThemeIcon, Stack } from '@mantine/core';
import { Search, UserPlus, Package } from 'lucide-react';
import { obtenerSesion } from '../lib/auth';
import Layout from '../components/Layout';

// Tarjeta de acción del tablero (clicable salvo que esté deshabilitada)
function TarjetaAccion({ icono, titulo, descripcion, onClick, deshabilitada = false }) {
  return (
    <Card
      withBorder
      radius="lg"
      padding="xl"
      className={deshabilitada ? 'dash-card-off' : 'dash-card-on'}
      onClick={deshabilitada ? undefined : onClick}
      aria-disabled={deshabilitada}
    >
      <Stack align="center" gap="sm">
        <ThemeIcon size={60} radius="xl" variant="light" color={deshabilitada ? 'gray' : 'azul'}>
          {icono}
        </ThemeIcon>
        <Text fw={600} size="lg" ta="center">{titulo}</Text>
        <Text size="sm" c="dimmed" ta="center">{descripcion}</Text>
      </Stack>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { nombre } = obtenerSesion();

  return (
    <Layout>
      <Title order={2} ta="center" mb={4}>Bienvenida, {nombre}</Title>
      <Text c="dimmed" ta="center" mb="xl">¿Qué deseas hacer hoy?</Text>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg" w="100%" maw={800}>
        <TarjetaAccion
          icono={<Search size={30} strokeWidth={1.75} />}
          titulo="Buscar paciente"
          descripcion="Encuentra un expediente por matrícula."
          onClick={() => navigate('/buscar')}
        />
        <TarjetaAccion
          icono={<UserPlus size={30} strokeWidth={1.75} />}
          titulo="Registrar paciente"
          descripcion="Da de alta a un alumno o personal nuevo."
          onClick={() => navigate('/pacientes/nuevo')}
        />
        {/* Funciones que llegan en sprints posteriores (visibles pero deshabilitadas) */}
        <TarjetaAccion
          icono={<Package size={30} strokeWidth={1.75} />}
          titulo="Inventario"
          descripcion="Próximamente (Sprint 6)."
          deshabilitada
        />
      </SimpleGrid>
    </Layout>
  );
}
