import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import BuscarPaciente from './pages/BuscarPaciente';
import RegistrarPaciente from './pages/RegistrarPaciente';
import Expediente from './pages/Expediente';
import RutaProtegida from './components/RutaProtegida';

export default function App() {
  return (
    <BrowserRouter>
      {/* Notificaciones tipo toast, disponibles en toda la app */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '15px' },
          success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rutas internas: requieren sesión (token) */}
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/buscar" element={<RutaProtegida><BuscarPaciente /></RutaProtegida>} />
        <Route path="/pacientes/nuevo" element={<RutaProtegida><RegistrarPaciente /></RutaProtegida>} />
        <Route path="/expediente/:id" element={<RutaProtegida><Expediente /></RutaProtegida>} />

        {/* Solo administradoras */}
        <Route path="/registro" element={<RutaProtegida soloAdmin><Registro /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}
