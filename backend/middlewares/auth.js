// Middlewares de seguridad con JWT.
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Verifica que la petición traiga un token válido en la cabecera:
//   Authorization: Bearer <token>
// Si es válido, guarda los datos de la enfermera en req.enfermera y continúa.
function verificarToken(req, res, next) {
    const cabecera = req.headers['authorization'];

    if (!cabecera || !cabecera.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'No autorizado: falta el token' });
    }

    const token = cabecera.split(' ')[1];

    try {
        const datos = jwt.verify(token, JWT_SECRET);
        req.enfermera = datos; // { id, nombre, rol }
        next();
    } catch (error) {
        // Token inválido o expirado
        return res.status(401).json({ mensaje: 'Sesión expirada o token inválido' });
    }
}

// Deja pasar solo si la enfermera del token es administradora.
// Se usa después de verificarToken.
function soloAdmin(req, res, next) {
    if (req.enfermera && req.enfermera.rol === 'admin') {
        return next();
    }
    return res.status(403).json({ mensaje: 'Solo un administrador puede hacer esto' });
}

module.exports = { verificarToken, soloAdmin };
