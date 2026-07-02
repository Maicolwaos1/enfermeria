// Middleware que revisa el resultado de las reglas de express-validator.
// Se pone al final de la cadena de reglas de cada ruta: si alguna falló,
// responde 400 con el primer mensaje (mismo contrato { mensaje } de siempre).
const { validationResult } = require('express-validator');

function validar(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ mensaje: errores.array()[0].msg });
    }
    next();
}

module.exports = validar;
