// Rutas de pacientes. Se montan en /api/pacientes (server.js) y todas
// pasan antes por verificarToken (el middleware se aplica a todo /api).
const router = require('express').Router();
const ctrl = require('../controllers/pacientes.controller');

// Sprint 3 — buscar por matrícula y ver expediente
router.get('/:matricula', ctrl.buscarPorMatricula);
router.get('/:id/expediente', ctrl.obtenerExpediente);

// Sprint 4 — registrar paciente nuevo y editar alergias
router.post('/', ctrl.registrar);
router.patch('/:id/alergias', ctrl.actualizarAlergias);

module.exports = router;
