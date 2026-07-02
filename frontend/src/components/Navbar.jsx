import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, UnstyledButton, Badge, Burger, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Stethoscope, CircleUser, ChevronDown, UserPlus, RefreshCw, LogOut } from 'lucide-react';
import { obtenerSesion, cerrarSesion } from '../lib/auth';

// Enlaces de navegación (se usan igual en escritorio y en el menú móvil)
const ENLACES = [
  { ruta: '/dashboard', texto: 'Inicio' },
  { ruta: '/buscar', texto: 'Buscar' },
  { ruta: '/pacientes/nuevo', texto: 'Registrar' },
];

// Barra de navegación fija que aparece en todas las pantallas internas
// (Dashboard, Buscar, Registrar, Expediente).
export default function Navbar() {
  const navigate = useNavigate();
  const { nombre, esAdmin } = obtenerSesion();
  // Menú lateral en pantallas chicas (hamburguesa)
  const [menuMovil, { toggle, close }] = useDisclosure(false);

  // Borra la sesión y regresa al Login (sirve para "Cambiar usuario" y "Cerrar sesión")
  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Burger
        opened={menuMovil}
        onClick={toggle}
        hiddenFrom="sm"
        color="white"
        size="sm"
        aria-label="Abrir menú"
      />

      <span className="navbar-brand">
        <Stethoscope size={20} strokeWidth={2} />
        Enfermería Escolar
      </span>

      {/* Enlaces en escritorio (en móvil viven en el Drawer) */}
      <div className="navbar-links">
        {ENLACES.map((e) => (
          <NavLink key={e.ruta} to={e.ruta} className="navbar-link">
            {e.texto}
          </NavLink>
        ))}
      </div>

      {/* Enlaces en móvil: panel lateral que abre la hamburguesa */}
      <Drawer opened={menuMovil} onClose={close} size="70%" title="Menú" hiddenFrom="sm">
        <Stack gap="xs">
          {ENLACES.map((e) => (
            <NavLink key={e.ruta} to={e.ruta} className="navbar-link-movil" onClick={close}>
              {e.texto}
            </NavLink>
          ))}
        </Stack>
      </Drawer>

      {/* Menú de cuenta (esquina superior derecha) */}
      <Menu shadow="md" width={240} position="bottom-end">
        <Menu.Target>
          <UnstyledButton className="cuenta-boton">
            <CircleUser size={20} strokeWidth={2} />
            <span className="cuenta-nombre">{nombre}</span>
            <ChevronDown size={16} strokeWidth={2} />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            {nombre}{' '}
            <Badge size="sm" variant={esAdmin ? 'filled' : 'light'} color={esAdmin ? 'azul' : 'gray'}>
              {esAdmin ? 'Administrador' : 'Enfermera'}
            </Badge>
          </Menu.Label>

          <Menu.Item leftSection={<RefreshCw size={16} strokeWidth={2} />} onClick={salir}>
            Cambiar usuario
          </Menu.Item>

          {esAdmin && (
            <Menu.Item
              leftSection={<UserPlus size={16} strokeWidth={2} />}
              onClick={() => navigate('/registro')}
            >
              Crear nueva enfermera
            </Menu.Item>
          )}

          <Menu.Divider />

          <Menu.Item color="red" leftSection={<LogOut size={16} strokeWidth={2} />} onClick={salir}>
            Cerrar sesión
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </nav>
  );
}
