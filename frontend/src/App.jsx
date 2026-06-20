import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registro from './Registro';
import Dashboard from './Dashboard';
import BuscarPaciente from './BuscarPaciente';
import Expediente from './Expediente';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buscar" element={<BuscarPaciente />} />
        <Route path="/expediente/:id" element={<Expediente />} />
      </Routes>
    </BrowserRouter>
  );
}
