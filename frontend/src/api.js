// Dirección donde corre el servidor del backend (Express).
// Si algún día se cambia el puerto o se sube a un servidor, solo se edita aquí.
export const API_URL = 'http://localhost:3000';

// Devuelve el token JWT guardado al iniciar sesión (o null si no hay).
export function getToken() {
  return localStorage.getItem('token');
}

// Borra los datos de la sesión (token, nombre y rol).
export function limpiarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('nombreEnfermera');
  localStorage.removeItem('rolEnfermera');
}

// fetch "con sesión": agrega la cabecera Authorization con el token.
// Si el backend responde 401 (token inválido o expirado), cierra la sesión
// y manda al Login avisando al usuario.
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (respuesta.status === 401) {
    limpiarSesion();
    localStorage.setItem('avisoSesion', 'Tu sesión expiró. Inicia sesión de nuevo.');
    window.location.href = '/';
    throw new Error('Sesión expirada');
  }

  return respuesta;
}
