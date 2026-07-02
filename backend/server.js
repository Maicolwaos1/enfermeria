// Punto de arranque del servidor: configura Express, monta las rutas
// y define el manejador central de errores. La lógica de cada endpoint
// vive en controllers/ y las reglas de acceso en middlewares/.

// Carga las variables del archivo .env (datos de la BD, puerto, etc.)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./db');
const { verificarToken } = require('./middlewares/auth');
const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');

// Si faltan variables críticas del .env es mejor no arrancar: sin JWT_SECRET
// los tokens no se pueden firmar/verificar y todo fallaría a media petición.
const VARIABLES_REQUERIDAS = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
const faltantes = VARIABLES_REQUERIDAS.filter((v) => !process.env[v]);
if (faltantes.length > 0) {
    console.error(`Faltan variables en el .env: ${faltantes.join(', ')}. El servidor no puede arrancar.`);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Solo el frontend autorizado puede llamar a estos endpoints (datos médicos).
// En desarrollo es el server de Vite; en producción se define FRONTEND_URL.
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Esto le dice a Express que entienda JSON en las peticiones
app.use(express.json());

// Probamos la conexión una vez al arrancar (solo para avisar en consola)
db.getConnection()
    .then((conexion) => {
        console.log('Conectado a la base de datos MySQL');
        conexion.release(); // devolvemos la conexión al pool
    })
    .catch((error) => {
        console.log('Error al conectar a la base de datos:', error.message);
    });

// --- Ruta principal de prueba ---
app.get('/', (req, res) => {
    res.send('El servidor está funcionando');
});

// --- Autenticación: /login y /registro ---
app.use('/', authRoutes);

// ============================================================
//  Todas las rutas que empiezan con /api requieren token válido
//  (pacientes y, más adelante, consultas e inventario).
// ============================================================
app.use('/api', verificarToken);
app.use('/api/pacientes', pacientesRoutes);

// --- Manejador central de errores ---
// Cualquier error que un controlador pase con next(error) (o que lance
// un handler async) termina aquí: se registra completo en la consola
// y al cliente solo se le responde un mensaje genérico.
app.use((error, req, res, next) => {
    // JSON malformado en el body: es culpa del cliente, no del servidor
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ mensaje: 'El cuerpo de la petición no es JSON válido' });
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
});

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
