// Capa única de comunicación con el backend.
// Todos los componentes llaman a apiJson() y reciben directamente los datos,
// o atrapan un ApiError con el mensaje listo para mostrar en un toast.
import { obtenerSesion, cerrarSesion, guardarAvisoSesion } from './auth';

// Dirección donde corre el servidor del backend (Express).
// En desarrollo se usa localhost; para desplegar se define VITE_API_URL
// en un archivo .env del frontend, sin tocar el código.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Error con el mensaje del backend y el código HTTP (0 = sin conexión).
export class ApiError extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.status = status;
  }
}

// Hace la petición, agrega el token si hay sesión, parsea el JSON y
// lanza ApiError si algo salió mal. Uso:
//   const datos = await apiJson('/api/pacientes', { method: 'POST', body: {...} });
export async function apiJson(path, opciones = {}) {
  const { token } = obtenerSesion();

  const headers = { ...(opciones.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (opciones.body !== undefined) headers['Content-Type'] = 'application/json';

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${path}`, {
      ...opciones,
      headers,
      body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  // 401 CON token = la sesión expiró: cerramos sesión y mandamos al Login.
  // (El 401 del login con contraseña incorrecta no entra aquí: ahí no hay token.)
  if (respuesta.status === 401 && token) {
    cerrarSesion();
    guardarAvisoSesion('Tu sesión expiró. Inicia sesión de nuevo.');
    window.location.href = '/';
    throw new ApiError('Sesión expirada', 401);
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new ApiError(datos.mensaje || 'Ocurrió un error inesperado', respuesta.status);
  }

  return datos;
}
