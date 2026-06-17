import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Recuperar el nombre guardado en el localStorage (por defecto 'Enfermera')
  const nombreEnfermera = localStorage.getItem('usuario_nombre') || 'Enfermera';

  const handleLogout = () => {
    // Punto 7: Borrar los datos de la sesión
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    
    // Regresar al Login
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Punto 6: Saludo con el nombre y botón de cerrar sesión */}
      <h2>¡Hola, {nombreEnfermera}! 👋</h2>
      <p>Bienvenida a tu panel de control básico.</p>
      
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}