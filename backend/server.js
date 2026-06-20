// Carga las variables del archivo .env (datos de la BD, puerto, etc.)
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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

// --- Ruta principal de prueba ---
app.get('/', (req, res) => {
    res.send('El servidor está funcionando');
});

// --- Tarea 1: Endpoint para registrar una enfermera ---
// Recibe: nombre, usuario, contraseña, correo
// Guarda los datos en la tabla enfermeras (con la contraseña encriptada)
app.post('/registro', async (req, res) => {
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

        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', nombre: enfermera.nombre });
    });
});

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

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
