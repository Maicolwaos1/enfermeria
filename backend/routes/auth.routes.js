// Rutas de autenticación: /login (pública) y /registro (solo admin).
const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { verificarToken, soloAdmin } = require('../middlewares/auth');
const ctrl = require('../controllers/auth.controller');
const validar = require('../middlewares/validar');
const { validarEnfermeraNueva } = require('../validaciones/auth');

// Freno contra fuerza bruta: máximo 10 intentos de login por IP cada 15 min.
const limiteLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { mensaje: 'Demasiados intentos de inicio de sesión. Espera 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Registrar una enfermera: solo un administrador con sesión válida.
router.post('/registro', verificarToken, soloAdmin, validarEnfermeraNueva, validar, ctrl.registrarEnfermera);

// Iniciar sesión (pública, con límite de intentos).
router.post('/login', limiteLogin, ctrl.login);

module.exports = router;
