// Único lugar donde vive la sesión (token, nombre y rol en localStorage).
// Ningún componente debe usar localStorage directamente para la sesión:
// así un cambio de llave o de almacenamiento se hace solo aquí.

const LLAVES = {
  token: 'token',
  nombre: 'nombreEnfermera',
  rol: 'rolEnfermera',
  aviso: 'avisoSesion',
};

// Guarda los datos que devuelve el backend al iniciar sesión.
export function guardarSesion({ token, nombre, rol }) {
  localStorage.setItem(LLAVES.token, token || '');
  localStorage.setItem(LLAVES.nombre, nombre || '');
  localStorage.setItem(LLAVES.rol, rol || 'enfermera');
}

// Devuelve la sesión actual (token null si no hay sesión).
export function obtenerSesion() {
  return {
    token: localStorage.getItem(LLAVES.token),
    nombre: localStorage.getItem(LLAVES.nombre) || '',
    esAdmin: localStorage.getItem(LLAVES.rol) === 'admin',
  };
}

// Borra los datos de la sesión (token, nombre y rol).
export function cerrarSesion() {
  localStorage.removeItem(LLAVES.token);
  localStorage.removeItem(LLAVES.nombre);
  localStorage.removeItem(LLAVES.rol);
}

// Aviso que se muestra una sola vez en el Login (ej. "tu sesión expiró").
export function guardarAvisoSesion(mensaje) {
  localStorage.setItem(LLAVES.aviso, mensaje);
}

// Lee el aviso pendiente y lo borra (para que no se repita).
export function tomarAvisoSesion() {
  const aviso = localStorage.getItem(LLAVES.aviso);
  if (aviso) localStorage.removeItem(LLAVES.aviso);
  return aviso;
}
