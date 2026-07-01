// ============================================================
//  Script de arranque: crear o promover una ENFERMERA ADMIN
// ============================================================
// Como el registro por la web es solo para admins, este script resuelve el
// problema del "primer admin": se ejecuta desde la terminal para crear el
// administrador inicial (o promover a admin a una enfermera que ya existe).
//
// Uso:
//   node crearAdmin.js <usuario> <password> [nombre] [correo]
//
// Ejemplos:
//   node crearAdmin.js fabian miClave123          -> promueve a admin (o lo crea)
//   node crearAdmin.js jefa Clave123 "Ana López" ana@escuela.com
//
// Si el usuario ya existe, lo asciende a admin (y actualiza su contraseña).
// Si no existe, lo crea directamente como admin.

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function main() {
  const [usuario, password, nombre, correo] = process.argv.slice(2);

  if (!usuario || !password) {
    console.log('Uso: node crearAdmin.js <usuario> <password> [nombre] [correo]');
    process.exit(1);
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const passwordEncriptado = await bcrypt.hash(password, 10);

    // ¿Ya existe ese usuario?
    const [existentes] = await db.query('SELECT id FROM enfermeras WHERE usuario = ?', [usuario]);

    if (existentes.length > 0) {
      await db.query(
        'UPDATE enfermeras SET rol = "admin", password = ? WHERE usuario = ?',
        [passwordEncriptado, usuario]
      );
      console.log(`Listo: "${usuario}" ahora es ADMIN (contraseña actualizada).`);
    } else {
      await db.query(
        'INSERT INTO enfermeras (nombre, usuario, password, correo, rol) VALUES (?, ?, ?, ?, "admin")',
        [nombre || usuario, usuario, passwordEncriptado, correo || `${usuario}@escuela.com`]
      );
      console.log(`Listo: administrador "${usuario}" creado.`);
    }
  } catch (error) {
    console.log('Error:', error.code === 'ER_DUP_ENTRY' ? 'ese correo ya está en uso' : error.message);
  } finally {
    await db.end();
  }
}

main();
