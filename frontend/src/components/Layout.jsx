import { AppShell } from '@mantine/core';
import Navbar from './Navbar';

// Envoltura de las pantallas internas: Navbar fija arriba y el contenido
// centrado debajo. La protección de sesión la hace RutaProtegida (App.jsx).
export default function Layout({ children }) {
  return (
    <AppShell header={{ height: 62 }}>
      <AppShell.Header withBorder={false}>
        <Navbar />
      </AppShell.Header>
      <AppShell.Main className="page-content">{children}</AppShell.Main>
    </AppShell>
  );
}
