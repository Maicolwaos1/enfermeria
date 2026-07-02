// Reglas de validación compartidas por los formularios.
// Deben coincidir con las del backend (backend/validaciones/), que es la
// fuente de verdad: aquí solo se replican para avisar antes de enviar.

// Formato de correo: algo@dominio.com (no cualquier texto)
export const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Un correo vacío se considera "válido" porque el campo es opcional;
// la obligatoriedad la decide cada formulario.
export function esCorreoValido(correo) {
  return correo === '' || REGEX_CORREO.test(correo);
}

// Matrícula institucional: prefijo fijo UP + 4 a 10 dígitos (ej. UP240231)
export const MIN_DIGITOS_MATRICULA = 4;
export const MAX_DIGITOS_MATRICULA = 10;

export function esMatriculaValida(digitos) {
  return new RegExp(`^\\d{${MIN_DIGITOS_MATRICULA},${MAX_DIGITOS_MATRICULA}}$`).test(digitos);
}

// La contraseña de una enfermera debe tener al menos 8 caracteres (igual que el backend)
export const MIN_PASSWORD = 8;
