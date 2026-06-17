# Documentación del Proyecto — Sistema de Enfermería Escolar

Sistema web para la gestión de enfermería escolar (autenticación de enfermeras,
expedientes de pacientes, consultas e inventario de medicamentos).

> Documento técnico de apoyo al [ProyectoIntegrador_II.md](ProyectoIntegrador_II.md),
> que contiene la planeación, requerimientos y sprints.

---

## 1. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express |
| Base de Datos | MySQL (relacional) |
| Frontend | React + Vite + React Router |
| Seguridad | bcrypt (encriptación de contraseñas), CORS, variables de entorno (dotenv) |

---

## 2. Estructura del Proyecto

```
enfermeria/
├── backend/                  # Servidor Node.js + Express
│   ├── server.js             # Endpoints y conexión a MySQL
│   ├── .env                  # Credenciales de la BD (NO se sube a git)
│   ├── .env.example          # Plantilla del .env para el equipo
│   └── package.json
├── frontend/                 # Aplicación React (Vite)
│   └── src/
│       ├── App.jsx           # Rutas de la aplicación
│       ├── api.js            # URL del backend (configuración central)
│       ├── Login.jsx         # Pantalla de inicio de sesión
│       ├── Registro.jsx      # Pantalla de registro de enfermera
│       ├── Dashboard.jsx     # Pantalla principal tras el login
│       └── index.css         # Estilos
├── ProyectoIntegrador_II.md  # Planeación y sprints
└── DOCUMENTACION.md          # Este documento
```

---

## 3. Base de Datos

La base de datos se llama `clinica_db`. Antes de correr el backend hay que crearla
junto con la tabla de enfermeras.

```sql
CREATE DATABASE IF NOT EXISTS clinica_db;
USE clinica_db;

CREATE TABLE IF NOT EXISTS enfermeras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,   -- se guarda encriptada con bcrypt
  correo VARCHAR(100) NOT NULL UNIQUE
);
```

> **¿Ya creaste la tabla con la columna `contraseña` (con ñ)?**
> Renómbrala con: `ALTER TABLE enfermeras CHANGE contraseña password VARCHAR(255) NOT NULL;`

> La configuración de conexión **ya no está en el código**: se lee del archivo
> `backend/.env`. Copia `backend/.env.example` como `backend/.env` y pon ahí el
> usuario y contraseña de tu MySQL. Ese `.env` no se sube a GitHub.

---

## 4. Endpoints del Backend

Servidor base: `http://localhost:3000`

### `POST /registro`
Registra una enfermera nueva. La contraseña se encripta con bcrypt antes de guardarse.

**Body (JSON):**
```json
{
  "nombre": "Ana López",
  "usuario": "alopez",
  "password": "miClave123",
  "correo": "ana@ejemplo.com"
}
```

**Respuestas:**
| Código | Significado |
|--------|-------------|
| 201 | Enfermera registrada exitosamente |
| 400 | Faltan campos / usuario o correo ya registrados |
| 500 | Error del servidor |

### `POST /login`
Verifica las credenciales y devuelve el nombre de la enfermera.

**Body (JSON):**
```json
{
  "usuario": "alopez",
  "password": "miClave123"
}
```

**Respuestas:**
| Código | Significado |
|--------|-------------|
| 200 | Inicio de sesión exitoso (devuelve `nombre`) |
| 400 | Faltan usuario o contraseña |
| 401 | Usuario o contraseña incorrectos |
| 500 | Error del servidor |

---

## 5. Pantallas del Frontend (conexión con el backend)

| Ruta | Pantalla | Conexión |
|------|----------|----------|
| `/` | Login | Llama a `POST /login`; si es correcto guarda el nombre y va a `/dashboard` |
| `/registro` | Registro | Llama a `POST /registro`; al registrar redirige al Login |
| `/dashboard` | Dashboard | Muestra el saludo y el botón "Cerrar sesión" |

**Manejo de sesión:** al iniciar sesión se guarda `nombreEnfermera` en
`localStorage`. El Dashboard lo lee para el saludo; si no existe, redirige al Login.
Al cerrar sesión se borra y se regresa al Login.

La URL del backend está centralizada en [frontend/src/api.js](frontend/src/api.js).

---

## 6. Cómo Levantar el Proyecto (paso a paso)

### Requisitos previos
- Node.js instalado
- MySQL instalado y corriendo

### Paso 1 — Crear la base de datos
Ejecuta el script SQL de la sección 3 en MySQL (TablePlus, DBeaver o la consola de MySQL).

### Paso 2 — Configurar y levantar el backend
```bash
cd backend
npm install          # solo la primera vez
# Copia la plantilla de variables de entorno y edita tus datos de MySQL:
cp .env.example .env   # (en Windows PowerShell: copy .env.example .env)
npm start            # inicia en http://localhost:3000
```
Si la conexión es correcta verás: `Conectado a la base de datos MySQL`.

### Paso 3 — Levantar el frontend
En otra terminal:
```bash
cd frontend
npm install          # solo la primera vez
npm run dev          # inicia en http://localhost:5173
```

### Paso 4 — Probar el flujo
1. Abre `http://localhost:5173` en el navegador.
2. Entra a **Registro de enfermera** y crea una cuenta.
3. Regresa al **Login** e inicia sesión con esa cuenta.
4. Deberías llegar al **Dashboard** con tu nombre y poder **Cerrar sesión**.

---

## 7. Estado del Sprint 2

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Endpoint `POST /registro` | ✅ Hecho |
| 2 | Endpoint `POST /login` | ✅ Hecho |
| 3 | Encriptar contraseñas con bcrypt | ✅ Hecho |
| 4 | Conectar pantalla de Registro al endpoint | ✅ Hecho |
| 5 | Conectar Login al endpoint y redirigir al Dashboard | ✅ Hecho |
| 6 | Pantalla Dashboard con saludo y botón "Cerrar sesión" | ✅ Hecho |
| 7 | Cierre de sesión (borra datos y vuelve al Login) | ✅ Hecho |

---

## 8. Próximos Pasos (Sprint 3)

Búsqueda de pacientes por matrícula y vista de expediente:
1. Crear la tabla `pacientes` en la BD.
2. Endpoint `GET /api/pacientes/:matricula`.
3. Endpoint `GET /api/pacientes/:id/expediente`.
4. Pantallas de búsqueda y de expediente en el frontend, conectadas a esos endpoints.

> Nota: a partir del Sprint 3, la planeación usa el prefijo `/api/` en las rutas.
> Conviene unificar las rutas actuales (`/registro`, `/login`) bajo ese mismo prefijo
> (`/api/registro`, `/api/login`) para mantener consistencia.
