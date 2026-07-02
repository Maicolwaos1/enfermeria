import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, TextInput, Textarea, Button, Stack, Radio, Group, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { apiJson } from '../lib/api';
import { REGEX_CORREO, esMatriculaValida, MAX_DIGITOS_MATRICULA } from '../lib/validaciones';
import { exito, error } from '../lib/avisos';
import Layout from '../components/Layout';

// Convierte el valor del DatePicker a 'AAAA-MM-DD' (o '' si está vacío)
function fechaParaBackend(valor) {
  if (!valor) return '';
  if (typeof valor === 'string') return valor.slice(0, 10);
  const anio = valor.getFullYear();
  const mes = String(valor.getMonth() + 1).padStart(2, '0');
  const dia = String(valor.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export default function RegistrarPaciente() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  // Mismas reglas que el backend (backend/validaciones/pacientes.js);
  // los errores salen inline debajo de cada campo
  const form = useForm({
    initialValues: {
      nombre: '',
      matriculaNum: '', // solo los números; el prefijo "UP" es fijo
      fechaNacimiento: null,
      correo: '',
      telefono: '',
      tieneAlergias: 'no',
      alergias: '',
      tieneCronicas: 'no',
      enfermedadesCronicas: '',
    },
    validate: {
      nombre: (v) => (v.trim().length >= 2 ? null : 'Escribe el nombre completo'),
      matriculaNum: (v) =>
        esMatriculaValida(v) ? null : 'La matrícula debe tener de 4 a 10 dígitos',
      correo: (v) =>
        v === '' || REGEX_CORREO.test(v) ? null : 'Formato de correo no válido',
      telefono: (v) =>
        v === '' || /^\d{10}$/.test(v) ? null : 'El teléfono debe tener 10 dígitos',
      alergias: (v, valores) =>
        valores.tieneAlergias === 'si' && !v.trim()
          ? 'Especifica las alergias o marca "No"'
          : null,
      enfermedadesCronicas: (v, valores) =>
        valores.tieneCronicas === 'si' && !v.trim()
          ? 'Especifica las enfermedades crónicas o marca "No"'
          : null,
    },
  });

  const handleRegistrar = async (valores) => {
    setCargando(true);
    try {
      const datos = await apiJson('/api/pacientes', {
        method: 'POST',
        body: {
          nombre: valores.nombre,
          matricula: `UP${valores.matriculaNum}`,
          fecha_nacimiento: fechaParaBackend(valores.fechaNacimiento),
          correo: valores.correo,
          telefono: valores.telefono,
          // Si la respuesta fue "No", se manda vacío aunque haya texto viejo
          alergias: valores.tieneAlergias === 'si' ? valores.alergias : '',
          enfermedades_cronicas: valores.tieneCronicas === 'si' ? valores.enfermedadesCronicas : '',
        },
      });

      // Al guardar, vamos directo al expediente del paciente nuevo
      exito('Paciente registrado correctamente');
      navigate(`/expediente/${datos.id}`);
    } catch (e) {
      error(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout>
      <Paper shadow="md" radius="md" p={40} withBorder w="100%" maw={420}>
        <Title order={3} ta="center" mb="lg">Registrar Paciente</Title>

        <form onSubmit={form.onSubmit(handleRegistrar)}>
          <Stack>
            <TextInput
              label="Nombre completo"
              placeholder="Ej. Juan Pérez García"
              {...form.getInputProps('nombre')}
            />

            {/* Matrícula: el prefijo "UP" es fijo, solo se escriben los números */}
            <TextInput
              label="Matrícula"
              placeholder="240231"
              inputMode="numeric"
              maxLength={MAX_DIGITOS_MATRICULA}
              leftSection={<Text size="sm" fw={600} c="azul.7">UP</Text>}
              leftSectionWidth={42}
              {...form.getInputProps('matriculaNum')}
              onChange={(e) =>
                form.setFieldValue('matriculaNum', e.target.value.replace(/\D/g, ''))
              }
            />

            {/* Calendario en español; se abre en vista de década para llegar
                rápido al año de nacimiento */}
            <DatePickerInput
              label="Fecha de nacimiento (opcional)"
              placeholder="Selecciona la fecha"
              locale="es"
              clearable
              defaultLevel="decade"
              maxDate={new Date()}
              {...form.getInputProps('fechaNacimiento')}
            />

            <TextInput
              label="Correo (opcional)"
              placeholder="nombre@gmail.com"
              type="email"
              {...form.getInputProps('correo')}
            />

            <TextInput
              label="Teléfono (opcional)"
              placeholder="10 dígitos"
              inputMode="numeric"
              maxLength={10}
              {...form.getInputProps('telefono')}
              onChange={(e) =>
                form.setFieldValue('telefono', e.target.value.replace(/\D/g, ''))
              }
            />

            {/* ¿Tiene alergias? Solo si es "Sí" se muestra el campo de texto */}
            <Radio.Group label="¿Tiene alergias?" {...form.getInputProps('tieneAlergias')}>
              <Group mt={6}>
                <Radio value="si" label="Sí" />
                <Radio value="no" label="No" />
              </Group>
            </Radio.Group>
            {form.values.tieneAlergias === 'si' && (
              <Textarea
                autosize
                minRows={2}
                placeholder="¿Cuáles? (ej. penicilina, nueces)"
                {...form.getInputProps('alergias')}
              />
            )}

            {/* ¿Tiene enfermedades crónicas? Mismo comportamiento */}
            <Radio.Group label="¿Tiene enfermedades crónicas?" {...form.getInputProps('tieneCronicas')}>
              <Group mt={6}>
                <Radio value="si" label="Sí" />
                <Radio value="no" label="No" />
              </Group>
            </Radio.Group>
            {form.values.tieneCronicas === 'si' && (
              <Textarea
                autosize
                minRows={2}
                placeholder="¿Cuáles? (ej. asma, diabetes)"
                {...form.getInputProps('enfermedadesCronicas')}
              />
            )}

            <Button type="submit" fullWidth mt="sm" loading={cargando}>
              Registrar paciente
            </Button>
          </Stack>
        </form>
      </Paper>
    </Layout>
  );
}
