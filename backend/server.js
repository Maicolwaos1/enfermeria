// Carga las variables del archivo .env (datos de la BD, puerto, etc.)
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Secreto para firmar/verificar los tokens JWT (viene del .env)
const JWT_SECRET = process.env.JWT_SECRET;

// Permite que el frontend (React/Vite) pueda llamar a estos endpoints
app.use(cors());

// Esto le dice a Express que entienda JSON en las peticiones
app.use(express.json());

// --- Conexión a la base de datos ---
// Usamos un "pool" en lugar de una sola conexión: maneja varias peticiones
// a la vez y se reconecta solo si la conexión se cae.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Probamos la conexión una vez al arrancar (solo para avisar en consola)
db.getConnection((error, conexion) => {
    if (error) {
        console.log('Error al conectar a la base de datos:', error.message);
    } else {
        console.log('Conectado a la base de datos MySQL');
        conexion.release(); // devolvemos la conexión al pool
    }
});

// ============================================================
//  SPRINT 9 — Seguridad con JWT (middlewares)
// ============================================================

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

// --- Ruta principal de prueba ---
app.get('/', (req, res) => {
    res.send('El servidor está funcionando');
});

// --- Tarea 1: Endpoint para registrar una enfermera ---
// Recibe: nombre, usuario, contraseña, correo
// Guarda los datos en la tabla enfermeras (con la contraseña encriptada)
// Protegido: solo un administrador con sesión válida puede crear enfermeras.
app.post('/registro', verificarToken, soloAdmin, async (req, res) => {
    const { nombre, usuario, password, correo } = req.body;

    // Verificar que vengan todos los datos
    if (!nombre || !usuario || !password || !correo) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // Encriptar la contraseña antes de guardarla (Tarea 3: bcrypt)
        // El número 10 es el "nivel de seguridad" — 10 es el estándar
        const passwordEncriptado = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO enfermeras (nombre, usuario, password, correo) VALUES (?, ?, ?, ?)';

        db.query(sql, [nombre, usuario, passwordEncriptado, correo], (error) => {
            if (error) {
                // Si el usuario o correo ya existen, MySQL manda un error especial
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ mensaje: 'El usuario o correo ya están registrados' });
                }
                return res.status(500).json({ mensaje: 'Error al registrar la enfermera' });
            }

            res.status(201).json({ mensaje: 'Enfermera registrada exitosamente' });
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// --- Tarea 2: Endpoint para iniciar sesión ---
// Recibe: usuario y contraseña
// Verifica que existan en la BD y que la contraseña sea correcta
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }

    const sql = 'SELECT * FROM enfermeras WHERE usuario = ?';

    db.query(sql, [usuario], async (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

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

        // Generamos el token JWT con los datos de la enfermera. Expira en 8 horas.
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
    });
});

// ============================================================
//  Todas las rutas que empiezan con /api requieren token válido
//  (pacientes y, más adelante, consultas e inventario).
// ============================================================
app.use('/api', verificarToken);

// ============================================================
//  SPRINT 3 — Buscar paciente y ver expediente
// ============================================================

// --- Tarea 2: Buscar un paciente por su matrícula ---
// GET /api/pacientes/:matricula
app.get('/api/pacientes/:matricula', (req, res) => {
    const { matricula } = req.params;

    const sql = 'SELECT * FROM pacientes WHERE matricula = ?';

    db.query(sql, [matricula], (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        // Si no se encontró ningún paciente con esa matrícula
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        res.status(200).json(resultados[0]);
    });
});

// --- Tarea 3: Ver el expediente de un paciente (datos + historial) ---
// GET /api/pacientes/:id/expediente
app.get('/api/pacientes/:id/expediente', (req, res) => {
    const { id } = req.params;

    const sqlPaciente = 'SELECT * FROM pacientes WHERE id = ?';

    db.query(sqlPaciente, [id], (error, pacientes) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (pacientes.length === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        const paciente = pacientes[0];

        // Historial de consultas. La tabla "consultas" se crea hasta el Sprint 5,
        // así que por ahora regresamos una lista vacía si todavía no existe.
        const sqlConsultas =
            'SELECT * FROM consultas WHERE id_paciente = ? ORDER BY hora_entrada DESC';

        db.query(sqlConsultas, [id], (errorConsultas, consultas) => {
            // Si la tabla aún no existe (Sprint 5), devolvemos historial vacío
            if (errorConsultas) {
                return res.status(200).json({ paciente, consultas: [] });
            }

            res.status(200).json({ paciente, consultas });
        });
    });
});

// ============================================================
//  SPRINT 4 — Registrar pacientes nuevos y ver alergias
// ============================================================

// --- Tarea 2: Registrar un paciente nuevo manualmente ---
// POST /api/pacientes
// Recibe: nombre, matricula, fecha_nacimiento, correo, telefono,
//         alergias, enfermedades_cronicas
app.post('/api/pacientes', (req, res) => {
    const {
        nombre,
        matricula,
        fecha_nacimiento,
        correo,
        telefono,
        alergias,
        enfermedades_cronicas,
    } = req.body;

    // Nombre y matrícula son obligatorios; el resto puede quedar vacío
    if (!nombre || !matricula) {
        return res.status(400).json({ mensaje: 'El nombre y la matrícula son obligatorios' });
    }

    const sql = `
        INSERT INTO pacientes
            (nombre, matricula, fecha_nacimiento, correo, telefono, alergias, enfermedades_cronicas)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Convertimos los campos vacíos a NULL para no guardar cadenas en blanco
    const valores = [
        nombre,
        matricula,
        fecha_nacimiento || null,
        correo || null,
        telefono || null,
        alergias || null,
        enfermedades_cronicas || null,
    ];

    db.query(sql, valores, (error, resultado) => {
        if (error) {
            // Si la matrícula ya existe, MySQL manda este error especial
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ mensaje: 'Ya existe un paciente con esa matrícula' });
            }
            return res.status(500).json({ mensaje: 'Error al registrar el paciente' });
        }

        // Devolvemos el id nuevo para que el frontend pueda ir al expediente
        res.status(201).json({
            mensaje: 'Paciente registrado exitosamente',
            id: resultado.insertId,
        });
    });
});

// --- Tarea 3: Agregar o editar las alergias de un paciente ---
// PATCH /api/pacientes/:id/alergias
// Recibe: alergias y (opcionalmente) enfermedades_cronicas
app.patch('/api/pacientes/:id/alergias', (req, res) => {
    const { id } = req.params;
    const { alergias, enfermedades_cronicas } = req.body;

    const sql = 'UPDATE pacientes SET alergias = ?, enfermedades_cronicas = ? WHERE id = ?';

    db.query(sql, [alergias || null, enfermedades_cronicas || null, id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al actualizar las alergias' });
        }

        // Si no se actualizó ninguna fila, el paciente no existe
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        res.status(200).json({ mensaje: 'Alergias actualizadas correctamente' });
    });
});

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
