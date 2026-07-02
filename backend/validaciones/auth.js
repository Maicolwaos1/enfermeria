// Reglas de validación para el registro de enfermeras.
const { body } = require('express-validator');

const validarEnfermeraNueva = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('usuario')
        .trim()
        .matches(/^[a-zA-Z0-9._-]{3,30}$/)
        .withMessage('El usuario debe tener de 3 a 30 caracteres (letras, números, punto, guion)'),
    body('password')
        .isLength({ min: 8, max: 72 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('correo')
        .trim()
        .isEmail()
        .withMessage('El correo no tiene un formato válido')
        .isLength({ max: 100 })
        .withMessage('El correo no puede pasar de 100 caracteres'),
];

module.exports = { validarEnfermeraNueva };
