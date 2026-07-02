// Controlador de autenticación: registro de enfermeras e inicio de sesión.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

// POST /registro — Registrar una enfermera (solo admin).
// Recibe: nombre, usuario, password, correo.
// Los formatos ya vienen validados por validaciones/auth.js en la ruta.
async function registrarEnfermera(req, res, next) {
    const { nombre, usuario, password, correo } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla.
        // El número 10 es el "nivel de seguridad" — 10 es el estándar.
        const passwordEncriptado = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO enfermeras (nombre, usuario, password, correo) VALUES (?, ?, ?, ?)',
            [nombre, usuario, passwordEncriptado, correo]
        );

        res.status(201).json({ mensaje: 'Enfermera registrada exitosamente' });
    } catch (error) {
        // Si el usuario o correo ya existen, MySQL manda un error especial
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'El usuario o correo ya están registrados' });
        }
        next(error); // cualquier otro error lo atrapa el manejador central
    }
}

// POST /login — Iniciar sesión.
// Verifica usuario y contraseña, y devuelve un token JWT que expira en 8 horas.
async function login(req, res, next) {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }

    try {
        const [resultados] = await db.query(
            'SELECT id, nombre, rol, password FROM enfermeras WHERE usuario = ?',
            [usuario]
        );

        // Si no encontró ninguna enfermera con ese usuario
        if (resultados.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        const enfermera = resultados[0];

        // Comparar la contraseña que escribió el usuario con la encriptada en la BD
        const passwordCorrecto = await bcrypt.compare(password, enfermera.password);

        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: enfermera.id, nombre: enfermera.nombre, rol: enfermera.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            nombre: enfermera.nombre,
            rol: enfermera.rol, // 'enfermera' o 'admin'
            token,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { registrarEnfermera, login };
