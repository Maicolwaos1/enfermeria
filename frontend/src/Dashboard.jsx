import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Package } from 'lucide-react';
import Layout from './Layout';

export default function Dashboard() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem('nombreEnfermera') || '';

  return (
    <Layout>
      <h1 className="page-title">Bienvenida, {nombre}</h1>
      <p className="page-subtitle">¿Qué deseas hacer hoy?</p>

      <div className="dashboard-cards">
        <button className="dash-card" type="button" onClick={() => navigate('/buscar')}>
          <span className="dash-card-icon"><Search size={34} strokeWidth={1.75} /></span>
          <span className="dash-card-titulo">Buscar paciente</span>
          <span className="dash-card-desc">Encuentra un expediente por matrícula.</span>
        </button>

        <button className="dash-card" type="button" onClick={() => navigate('/pacientes/nuevo')}>
          <span className="dash-card-icon"><UserPlus size={34} strokeWidth={1.75} /></span>
          <span className="dash-card-titulo">Registrar paciente</span>
          <span className="dash-card-desc">Da de alta a un alumno o personal nuevo.</span>
        </button>

        {/* Funciones que llegan en sprints posteriores (se dejan visibles pero deshabilitadas) */}
        <div className="dash-card dash-card-disabled" aria-disabled="true">
          <span className="dash-card-icon"><Package size={34} strokeWidth={1.75} /></span>
          <span className="dash-card-titulo">Inventario</span>
          <span className="dash-card-desc">Próximamente (Sprint 6).</span>
        </div>
      </div>
    </Layout>
  );
}
