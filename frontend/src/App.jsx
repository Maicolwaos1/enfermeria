import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
      {/* Los avisos flotantes los pone <Notifications/> en main.jsx (lib/avisos.js) */}
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
