// Pool de conexiones a MySQL (versión con promesas para usar async/await).
// Un "pool" maneja varias peticiones a la vez y se reconecta solo si se cae.
// Todo el backend importa la conexión desde este único archivo.
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool;
