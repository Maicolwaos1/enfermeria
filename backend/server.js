const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Esto le dice a Express que entienda JSON en las peticiones
app.use(express.json());

// --- Conexión a la base de datos ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Cambia esto si tu usuario de MySQL es diferente
    password: '',        // Pon aquí tu contraseña de MySQL
    database: 'clinica_db'
});

db.connect((error) => {
    if (error) {
        console.log('Error al conectar a la base de datos:', error.message);
    } else {
        console.log('Conectado a la base de datos MySQL');
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
    const { nombre, usuario, contraseña, correo } = req.body;

    // Verificar que vengan todos los datos
    if (!nombre || !usuario || !contraseña || !correo) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // Encriptar la contraseña antes de guardarla (Tarea 3: bcrypt)
        // El número 10 es el "nivel de seguridad" — 10 es el estándar
        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

        const sql = 'INSERT INTO enfermeras (nombre, usuario, contraseña, correo) VALUES (?, ?, ?, ?)';

        db.query(sql, [nombre, usuario, contraseñaEncriptada, correo], (error) => {
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
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
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
        const contraseñaCorrecta = await bcrypt.compare(contraseña, enfermera.contraseña);

        if (!contraseñaCorrecta) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', nombre: enfermera.nombre });
    });
});

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
