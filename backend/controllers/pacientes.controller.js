// Controlador de pacientes: búsqueda, expediente, registro y alergias.
const db = require('../db');

// GET /api/pacientes/:matricula — Buscar un paciente por su matrícula.
async function buscarPorMatricula(req, res, next) {
    const { matricula } = req.params;

    try {
        const [resultados] = await db.query(
            'SELECT * FROM pacientes WHERE matricula = ?',
            [matricula]
        );

        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        res.status(200).json(resultados[0]);
    } catch (error) {
        next(error);
    }
}

// GET /api/pacientes/:id/expediente — Datos del paciente + historial de consultas.
async function obtenerExpediente(req, res, next) {
    const { id } = req.params;

    try {
        const [pacientes] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);

        if (pacientes.length === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        const paciente = pacientes[0];

        // Historial de consultas. La tabla "consultas" se crea hasta el Sprint 5:
        // si todavía no existe devolvemos historial vacío, pero cualquier OTRO
        // error sí se reporta (para no mostrar un expediente vacío por un bug).
        let consultas = [];
        try {
            const [filas] = await db.query(
                'SELECT * FROM consultas WHERE id_paciente = ? ORDER BY hora_entrada DESC',
                [id]
            );
            consultas = filas;
        } catch (errorConsultas) {
            if (errorConsultas.code !== 'ER_NO_SUCH_TABLE') {
                throw errorConsultas;
            }
        }

        res.status(200).json({ paciente, consultas });
    } catch (error) {
        next(error);
    }
}

// POST /api/pacientes — Registrar un paciente nuevo manualmente.
// Recibe: nombre, matricula, fecha_nacimiento, correo, telefono,
//         alergias, enfermedades_cronicas.
async function registrar(req, res, next) {
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

    try {
        const [resultado] = await db.query(sql, valores);

        // Devolvemos el id nuevo para que el frontend pueda ir al expediente
        res.status(201).json({
            mensaje: 'Paciente registrado exitosamente',
            id: resultado.insertId,
        });
    } catch (error) {
        // Si la matrícula ya existe, MySQL manda este error especial
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'Ya existe un paciente con esa matrícula' });
        }
        next(error);
    }
}

// PATCH /api/pacientes/:id/alergias — Agregar o editar alergias y/o
// enfermedades crónicas. Solo actualiza los campos que vengan en el body:
// omitir un campo lo deja intacto (un PATCH nunca debe borrar por omisión).
async function actualizarAlergias(req, res, next) {
    const { id } = req.params;
    const { alergias, enfermedades_cronicas } = req.body;

    const campos = [];
    const valores = [];

    if (alergias !== undefined) {
        campos.push('alergias = ?');
        valores.push(alergias || null);
    }
    if (enfermedades_cronicas !== undefined) {
        campos.push('enfermedades_cronicas = ?');
        valores.push(enfermedades_cronicas || null);
    }

    if (campos.length === 0) {
        return res.status(400).json({ mensaje: 'No se envió ningún campo para actualizar' });
    }

    valores.push(id);

    try {
        const [resultado] = await db.query(
            `UPDATE pacientes SET ${campos.join(', ')} WHERE id = ?`,
            valores
        );

        // Si no se actualizó ninguna fila, el paciente no existe
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        res.status(200).json({ mensaje: 'Alergias actualizadas correctamente' });
    } catch (error) {
        next(error);
    }
}

module.exports = { buscarPorMatricula, obtenerExpediente, registrar, actualizarAlergias };
