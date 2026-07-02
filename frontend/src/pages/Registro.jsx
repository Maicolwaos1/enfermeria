import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { apiJson } from '../lib/api';
import { REGEX_CORREO, MIN_PASSWORD } from '../lib/validaciones';
import { exito, error } from '../lib/avisos';
import Layout from '../components/Layout';

export default function Registro() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  // Mismas reglas que el backend (backend/validaciones/auth.js);
  // los errores salen inline debajo de cada campo
  const form = useForm({
    initialValues: { nombre: '', usuario: '', correo: '', password: '' },
    validate: {
      nombre: (v) => (v.trim().length >= 2 ? null : 'Escribe el nombre completo'),
      usuario: (v) =>
        /^[a-zA-Z0-9._-]{3,30}$/.test(v.trim())
          ? null
          : 'De 3 a 30 caracteres (letras, números, punto o guion)',
      correo: (v) => (REGEX_CORREO.test(v) ? null : 'Formato de correo no válido'),
      password: (v) =>
        v.length >= MIN_PASSWORD
          ? null
          : `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`,
    },
  });

  const handleRegistrar = async ({ nombre, usuario, correo, password }) => {
    setCargando(true);
    try {
      // Endpoint POST /registro del backend (requiere token de admin)
      await apiJson('/registro', {
        method: 'POST',
        body: { nombre, usuario: usuario.trim(), correo, password },
      });

      // Enfermera creada: avisamos y regresamos al Dashboard (el admin sigue con sesión)
      exito('Enfermera creada correctamente');
      navigate('/dashboard');
    } catch (e) {
      error(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout>
      <Paper shadow="md" radius="md" p={40} withBorder w="100%" maw={380}>
        <Title order={3} ta="center" mb="lg">Crear Nueva Enfermera</Title>

        <form onSubmit={form.onSubmit(handleRegistrar)}>
          <Stack>
            <TextInput
              label="Nombre completo"
              placeholder="Ej. Ana López"
              {...form.getInputProps('nombre')}
            />
            <TextInput
              label="Usuario"
              placeholder="Ej. ana.lopez"
              {...form.getInputProps('usuario')}
            />
            <TextInput
              label="Correo"
              placeholder="nombre@gmail.com"
              type="email"
              {...form.getInputProps('correo')}
            />
            <PasswordInput
              label="Contraseña"
              description={`Mínimo ${MIN_PASSWORD} caracteres`}
              placeholder="Contraseña"
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth mt="sm" loading={cargando}>
              Crear enfermera
            </Button>
          </Stack>
        </form>
      </Paper>
    </Layout>
  );
}
