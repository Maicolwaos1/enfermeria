// Reglas de validación para los endpoints de pacientes.
// El backend es la fuente de verdad: aunque el frontend también valide,
// aquí se rechaza cualquier dato mal formado que llegue por otro medio.
const { body, param } = require('express-validator');

// Matrícula institucional: prefijo UP + 4 a 10 dígitos (ej. UP240231).
// El frontend usa este mismo formato (prefijo fijo + solo números).
const REGEX_MATRICULA = /^UP\d{4,10}$/;

const validarPacienteNuevo = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('matricula')
        .trim()
        .matches(REGEX_MATRICULA)
        .withMessage('La matrícula debe ser UP seguido de 4 a 10 dígitos (ej. UP240231)'),
    body('fecha_nacimiento')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('La fecha de nacimiento debe tener formato AAAA-MM-DD'),
    body('correo')
        .optional({ values: 'falsy' })
        .trim()
        .isEmail()
        .withMessage('El correo no tiene un formato válido')
        .isLength({ max: 100 })
        .withMessage('El correo no puede pasar de 100 caracteres'),
    body('telefono')
        .optional({ values: 'falsy' })
        .trim()
        .matches(/^\d{10}$/)
        .withMessage('El teléfono debe tener exactamente 10 dígitos'),
    body('alergias')
        .optional({ values: 'falsy' })
        .isLength({ max: 500 })
        .withMessage('Las alergias no pueden pasar de 500 caracteres'),
    body('enfermedades_cronicas')
        .optional({ values: 'falsy' })
        .isLength({ max: 500 })
        .withMessage('Las enfermedades crónicas no pueden pasar de 500 caracteres'),
];

const validarAlergias = [
    body('alergias')
        .optional({ values: 'falsy' })
        .isLength({ max: 500 })
        .withMessage('Las alergias no pueden pasar de 500 caracteres'),
    body('enfermedades_cronicas')
        .optional({ values: 'falsy' })
        .isLength({ max: 500 })
        .withMessage('Las enfermedades crónicas no pueden pasar de 500 caracteres'),
];

// El id del paciente en la URL debe ser un entero positivo.
const validarIdPaciente = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El id del paciente no es válido'),
];

module.exports = {
    REGEX_MATRICULA,
    validarPacienteNuevo,
    validarAlergias,
    validarIdPaciente,
};
