import { Navigate } from 'react-router-dom';
import { obtenerSesion } from '../lib/auth';

// Protege las rutas internas: si no hay token, manda al Login.
// Con soloAdmin=true, además exige que la enfermera sea administradora.
export default function RutaProtegida({ soloAdmin = false, children }) {
  const { token, esAdmin } = obtenerSesion();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
