import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, Paper, Title, TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { apiJson } from '../lib/api';
import { guardarSesion, tomarAvisoSesion } from '../lib/auth';
import { exito, error, aviso } from '../lib/avisos';

export default function Login() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const form = useForm({
    initialValues: { usuario: '', password: '' },
    validate: {
      usuario: (v) => (v.trim() ? null : 'Escribe tu usuario'),
      password: (v) => (v ? null : 'Escribe tu contraseña'),
    },
  });

  // Si llegamos aquí porque la sesión expiró, mostramos el aviso una vez
  useEffect(() => {
    const pendiente = tomarAvisoSesion();
    if (pendiente) aviso(pendiente);
  }, []);

  const handleAcceder = async ({ usuario, password }) => {
    setCargando(true);
    try {
      const datos = await apiJson('/login', {
        method: 'POST',
        body: { usuario, password },
      });

      // Inicio de sesión correcto: guardamos el token, el nombre y el rol
      guardarSesion(datos);
      exito(`Bienvenida, ${datos.nombre || usuario}`);
      navigate('/dashboard');
    } catch (e) {
      error(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Center className="login-container">
      <Paper shadow="md" radius="md" p={40} withBorder w="100%" maw={380}>
        <Title order={3} ta="center" mb="lg">Iniciar Sesión</Title>

        {/* form real: el Enter envía desde cualquier campo */}
        <form onSubmit={form.onSubmit(handleAcceder)}>
          <Stack>
            <TextInput
              label="Usuario"
              placeholder="Tu usuario"
              {...form.getInputProps('usuario')}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth mt="sm" loading={cargando}>
              Acceder
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
