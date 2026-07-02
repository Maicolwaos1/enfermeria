// Rutas de autenticación: /login (pública) y /registro (solo admin).
const router = require('express').Router();
const { verificarToken, soloAdmin } = require('../middlewares/auth');
const ctrl = require('../controllers/auth.controller');
const validar = require('../middlewares/validar');
const { validarEnfermeraNueva } = require('../validaciones/auth');

// Registrar una enfermera: solo un administrador con sesión válida.
router.post('/registro', verificarToken, soloAdmin, validarEnfermeraNueva, validar, ctrl.registrarEnfermera);

// Iniciar sesión (pública).
router.post('/login', ctrl.login);

module.exports = router;
