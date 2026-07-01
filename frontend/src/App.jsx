import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registro from './Registro';
import Dashboard from './Dashboard';
import BuscarPaciente from './BuscarPaciente';
import RegistrarPaciente from './RegistrarPaciente';
import Expediente from './Expediente';
import RutaProtegida from './RutaProtegida';

export default function App() {
  return (
    <BrowserRouter>
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
