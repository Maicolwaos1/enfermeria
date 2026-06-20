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

-- Tabla de pacientes (Sprint 3)
CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  fecha_nacimiento DATE,
  correo VARCHAR(100),
  telefono VARCHAR(20)
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

### `GET /api/pacientes/:matricula`  *(Sprint 3)*
Busca un paciente por su matrícula.

**Respuestas:**
| Código | Significado |
|--------|-------------|
| 200 | Devuelve los datos del paciente |
| 404 | Paciente no encontrado |
| 500 | Error del servidor |

### `GET /api/pacientes/:id/expediente`  *(Sprint 3)*
Devuelve los datos del paciente y su historial de consultas.

**Respuesta (200):**
```json
{
  "paciente": { "id": 1, "nombre": "Juan Pérez", "matricula": "UP240001", "...": "..." },
  "consultas": []
}
```
> El arreglo `consultas` viene vacío hasta el Sprint 5, cuando se cree la tabla de consultas.

---

## 5. Pantallas del Frontend (conexión con el backend)

| Ruta | Pantalla | Conexión |
|------|----------|----------|
| `/` | Login | Llama a `POST /login`; si es correcto guarda el nombre y va a `/dashboard` |
| `/registro` | Registro | Llama a `POST /registro`; al registrar redirige al Login |
| `/dashboard` | Dashboard | Saludo, botón "Buscar paciente" y "Cerrar sesión" |
| `/buscar` | Buscar Paciente | Llama a `GET /api/pacientes/:matricula`; muestra el resultado o "No encontrado" |
| `/expediente/:id` | Expediente | Llama a `GET /api/pacientes/:id/expediente`; muestra datos e historial |

**Flujo:** Login → Dashboard → "Buscar paciente" → resultado → "Ver expediente".

**Manejo de sesión:** al iniciar sesión se guarda `nombreEnfermera` en
`localStorage`. Las pantallas internas lo leen; si no existe, redirigen al Login.
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

## 7. Estado de los Sprints

### Sprint 2 — Login y Registro ✅
| # | Tarea | Estado |
|---|-------|--------|
| 1 | Endpoint `POST /registro` | ✅ Hecho |
| 2 | Endpoint `POST /login` | ✅ Hecho |
| 3 | Encriptar contraseñas con bcrypt | ✅ Hecho |
| 4 | Conectar pantalla de Registro al endpoint | ✅ Hecho |
| 5 | Conectar Login al endpoint y redirigir al Dashboard | ✅ Hecho |
| 6 | Pantalla Dashboard con saludo y botón "Cerrar sesión" | ✅ Hecho |
| 7 | Cierre de sesión (borra datos y vuelve al Login) | ✅ Hecho |

### Sprint 3 — Buscar Paciente y Ver Expediente ✅
| # | Tarea | Estado |
|---|-------|--------|
| 1 | Crear tabla `pacientes` en la BD | ✅ Hecho |
| 2 | Endpoint `GET /api/pacientes/:matricula` | ✅ Hecho |
| 3 | Endpoint `GET /api/pacientes/:id/expediente` | ✅ Hecho |
| 4 | Pantalla de búsqueda | ✅ Hecho |
| 5 | Conectar búsqueda al endpoint (resultado / "No encontrado") | ✅ Hecho |
| 6 | Pantalla de expediente (datos + historial) | ✅ Hecho |

---

## 8. Próximos Pasos (Sprint 4)

Registro manual de pacientes nuevos y visualización de alergias:
1. Agregar campos de alergias y enfermedades crónicas a la tabla `pacientes`.
2. Endpoint `POST /api/pacientes` — guardar paciente nuevo.
3. Endpoint `PATCH /api/pacientes/:id/alergias` — agregar/editar alergias.
4. Formulario de registro manual y resaltado de alergias en rojo en el expediente.

> Nota: el Sprint 3 usa el prefijo `/api/` (como `/api/pacientes`). Las rutas viejas
> (`/registro`, `/login`) siguen sin prefijo. Conviene unificarlas bajo `/api/`
> (`/api/registro`, `/api/login`) en algún momento para mantener consistencia.
