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
| Íconos | lucide-react (íconos de línea) |
| Seguridad | bcrypt (contraseñas), **JWT (jsonwebtoken)** para sesiones, roles (enfermera/admin), CORS, variables de entorno (dotenv) |

---

## 2. Estructura del Proyecto

```
enfermeria/
├── backend/                  # Servidor Node.js + Express
│   ├── server.js             # Endpoints, middlewares JWT y conexión a MySQL
│   ├── crearAdmin.js         # Script para crear/promover un admin (bootstrap)
│   ├── .env                  # Credenciales de BD y JWT_SECRET (NO se sube a git)
│   ├── .env.example          # Plantilla del .env para el equipo
│   └── package.json
├── frontend/                 # Aplicación React (Vite)
│   └── src/
│       ├── App.jsx               # Rutas de la aplicación (con RutaProtegida)
│       ├── api.js                # URL del backend + apiFetch (token y manejo de 401)
│       ├── RutaProtegida.jsx     # Guard de rutas (token; opcional solo-admin)
│       ├── Login.jsx             # Pantalla de inicio de sesión
│       ├── Registro.jsx          # Crear nueva enfermera (solo admin)
│       ├── Layout.jsx            # Envoltura visual (Navbar + contenido)
│       ├── Navbar.jsx            # Barra superior + menú de cuenta
│       ├── Dashboard.jsx         # Pantalla de inicio con tarjetas de acción
│       ├── BuscarPaciente.jsx    # Búsqueda de paciente por matrícula
│       ├── RegistrarPaciente.jsx # Alta manual de paciente nuevo
│       ├── Expediente.jsx        # Expediente + edición de alergias
│       └── index.css             # Estilos
├── ProyectoIntegrador_II.md  # Planeación y sprints
└── DOCUMENTACION.md          # Este documento
```

> **Navegación (rediseño post-Sprint 4):** las pantallas internas comparten
> `Layout.jsx`, que dibuja `Navbar.jsx` arriba (enlaces **Inicio / Buscar /
> Registrar** y el menú de cuenta). La protección de sesión la hace `RutaProtegida.jsx`
> a nivel de ruta (ver sección 5). Ya no hay que llegar a "Registrar paciente" solo
> cuando falla una búsqueda: se accede directo desde la barra o las tarjetas del Dashboard.

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
  correo VARCHAR(100) NOT NULL UNIQUE,
  rol ENUM('enfermera','admin') NOT NULL DEFAULT 'enfermera'  -- roles
);

-- Tabla de pacientes (Sprint 3, ampliada en el Sprint 4)
CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  fecha_nacimiento DATE,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  alergias TEXT,                -- Sprint 4
  enfermedades_cronicas TEXT    -- Sprint 4
);
```

> **¿Ya tenías la tabla `pacientes` del Sprint 3?** Agrega las dos columnas nuevas con:
> ```sql
> ALTER TABLE pacientes
>   ADD COLUMN alergias TEXT,
>   ADD COLUMN enfermedades_cronicas TEXT;
> ```

> **¿Ya tenías la tabla `enfermeras` sin la columna `rol`?** Agrégala con:
> ```sql
> ALTER TABLE enfermeras
>   ADD COLUMN rol ENUM('enfermera','admin') NOT NULL DEFAULT 'enfermera';
> ```
> Después crea/promueve tu primer administrador con el script `crearAdmin.js`
> (ver sección 6).

> **¿Ya creaste la tabla con la columna `contraseña` (con ñ)?**
> Renómbrala con: `ALTER TABLE enfermeras CHANGE contraseña password VARCHAR(255) NOT NULL;`

> La configuración de conexión **ya no está en el código**: se lee del archivo
> `backend/.env`. Copia `backend/.env.example` como `backend/.env` y pon ahí el
> usuario y contraseña de tu MySQL. Ese `.env` no se sube a GitHub.

---

## 4. Endpoints del Backend

Servidor base: `http://localhost:3000`

### Autenticación (JWT) — Sprint 9

Salvo `POST /login` (público), **todos los endpoints protegidos exigen un token JWT**
en la cabecera de la petición:

```
Authorization: Bearer <token>
```

- El token se obtiene al iniciar sesión (`POST /login`) y **expira en 8 horas**.
- Si el token falta o es inválido/expiró, el backend responde **401**.
- Los endpoints solo para administradoras responden **403** si el token es de una
  enfermera normal.
- En el frontend esto lo maneja `apiFetch` en [api.js](frontend/src/api.js): agrega el
  token automáticamente y, ante un 401, cierra la sesión y regresa al Login.

| Endpoint | Protección |
|----------|------------|
| `POST /login` | Público |
| `POST /registro` | Token **+ rol admin** |
| `GET/POST/PATCH /api/pacientes/*` | Token (cualquier enfermera) |

### `POST /login`
Verifica las credenciales y devuelve el nombre, el rol y el **token JWT**.

**Body (JSON):**
```json
{
  "usuario": "alopez",
  "password": "miClave123"
}
```

**Respuesta (200):**
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "nombre": "Ana López",
  "rol": "admin",
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

**Respuestas:**
| Código | Significado |
|--------|-------------|
| 200 | Inicio de sesión exitoso (devuelve `nombre`, `rol` y `token`) |
| 400 | Faltan usuario o contraseña |
| 401 | Usuario o contraseña incorrectos |
| 500 | Error del servidor |

### `POST /registro`  *(requiere token de admin)*
Crea una enfermera nueva. La contraseña se encripta con bcrypt antes de guardarse.
Solo una administradora con sesión válida puede llamarlo.

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
| 401 | Falta el token o es inválido |
| 403 | El token no es de una administradora |
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

### `POST /api/pacientes`  *(Sprint 4)*
Registra manualmente un paciente nuevo. `nombre` y `matricula` son obligatorios; el
resto de los campos es opcional (se guarda `NULL` si vienen vacíos).

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "matricula": "UP240001",
  "fecha_nacimiento": "2005-03-14",
  "correo": "juan@ejemplo.com",
  "telefono": "4491234567",
  "alergias": "Penicilina",
  "enfermedades_cronicas": "Asma"
}
```

**Respuestas:**
| Código | Significado |
|--------|-------------|
| 201 | Paciente registrado (devuelve el `id` nuevo) |
| 400 | Faltan nombre/matrícula o la matrícula ya existe |
| 500 | Error del servidor |

### `PATCH /api/pacientes/:id/alergias`  *(Sprint 4)*
Agrega o edita las alergias y enfermedades crónicas de un paciente existente.

**Body (JSON):**
```json
{
  "alergias": "Penicilina, nueces",
  "enfermedades_cronicas": "Asma"
}
```

**Respuestas:**
| Código | Significado |
|--------|-------------|
| 200 | Alergias actualizadas correctamente |
| 404 | Paciente no encontrado |
| 500 | Error del servidor |

---

## 5. Pantallas del Frontend (conexión con el backend)

| Ruta | Pantalla | Acceso | Conexión |
|------|----------|--------|----------|
| `/` | Login | Pública | Llama a `POST /login`; guarda `token`, `nombre` y `rol`, y va a `/dashboard` |
| `/dashboard` | Dashboard | Con sesión | Pantalla de inicio con saludo y **tarjetas de acción** (Buscar paciente, Registrar paciente, Inventario *próximamente*) |
| `/buscar` | Buscar Paciente | Con sesión | Llama a `GET /api/pacientes/:matricula`; muestra el resultado o "No encontrado" (con atajo para registrar uno nuevo) |
| `/pacientes/nuevo` | Registrar Paciente | Con sesión | Llama a `POST /api/pacientes`; al guardar redirige al expediente del paciente nuevo |
| `/expediente/:id` | Expediente | Con sesión | Llama a `GET /api/pacientes/:id/expediente`; muestra datos, alergias resaltadas e historial, y permite **editar alergias** con `PATCH /api/pacientes/:id/alergias` |
| `/registro` | Crear Nueva Enfermera | **Solo admin** | Llama a `POST /registro`; al crearla vuelve al Dashboard (sin cerrar la sesión del admin) |

**Navegación (Navbar + Layout):** las pantallas internas se envuelven en `Layout.jsx`,
que muestra la barra `Navbar.jsx` arriba: marca, enlaces **Inicio / Buscar / Registrar**
(la ruta activa se resalta) y, a la derecha, un **menú de cuenta**.

**Menú de cuenta (esquina superior derecha):** muestra el nombre de la enfermera y un
**badge de rol** (Administrador / Enfermera). Contiene:
- **Cambiar usuario** — cierra la sesión y regresa al Login para entrar con otra cuenta.
- **Crear nueva enfermera** — *solo visible para admin*; abre `/registro`.
- **Cerrar sesión** — cierra la sesión y regresa al Login.

**Roles:** hay dos roles, `enfermera` y `admin`. Solo el admin puede crear enfermeras
(el registro público se quitó). El primer admin se crea con `crearAdmin.js` (sección 6).

**Protección de rutas y sesión (Sprint 9):** al iniciar sesión se guardan `token`,
`nombreEnfermera` y `rolEnfermera` en `localStorage`. El componente `RutaProtegida.jsx`
protege las rutas internas: sin token manda al Login, y con `soloAdmin` exige rol admin.
Todas las peticiones a `/api` y a `/registro` usan `apiFetch`, que agrega el token; si el
backend responde **401** (token expirado/ inválido), se cierra la sesión y se avisa al
usuario en el Login.

La URL del backend y el helper `apiFetch` están en [frontend/src/api.js](frontend/src/api.js).

### Validaciones y UX del formulario de registro de paciente

El formulario `RegistrarPaciente.jsx` incluye validaciones en el cliente para evitar
datos basura antes de enviarlos al backend:

- **Matrícula con prefijo fijo `UP`:** la caja "UP" no es editable y el usuario solo
  escribe los números (el input filtra todo lo que no sea dígito). Al guardar se
  reconstruye como `UP` + números (ej. `UP240231`), consistente con la búsqueda.
- **Correo con formato válido:** se valida contra `algo@dominio.com`. Si el texto no
  es un correo válido, el campo se marca en **rojo** con el mensaje "Formato de correo
  no válido" y no deja guardar. El correo es opcional: si se deja vacío, pasa.
- **Alergias y enfermedades crónicas con Sí/No:** cada una se pregunta con opciones
  **Sí / No** (radios). Con "No" no se muestra ningún campo y se guarda vacío (en el
  expediente aparece "Sin alergias ni enfermedades crónicas registradas"). Con "Sí" se
  revela el cuadro de texto para escribir el detalle; si queda vacío, no deja guardar.

> Estas validaciones son del lado del cliente (UX inmediata). La validación en el
> **servidor** —que rechaza datos inválidos aunque no pasen por el formulario— es la
> tarea del **Sprint 8** (RNF03/RNF01).

### Íconos

La interfaz usa **lucide-react** en lugar de emojis: `Stethoscope` en la marca de la
Navbar, `Search` / `UserPlus` / `Package` en las tarjetas del Dashboard y
`TriangleAlert` en el recuadro de alertas médicas del expediente.

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
# En el .env, además de los datos de MySQL, pon un JWT_SECRET (cadena larga y secreta).
npm start            # inicia en http://localhost:3000
```
Si la conexión es correcta verás: `Conectado a la base de datos MySQL`.

### Paso 3 — Crear el primer administrador
Como el registro por la web es solo para admins, el primer admin se crea desde la
terminal (resuelve el problema del "primer admin"):
```bash
cd backend
npm run crear-admin <usuario> <password> ["Nombre"] [correo]
# Ejemplo:
npm run crear-admin jefa Clave123 "Ana López" ana@escuela.com
```
- Si el usuario ya existe, lo asciende a admin (y actualiza su contraseña).
- Si no existe, lo crea como admin (contraseña encriptada con bcrypt).

### Paso 4 — Levantar el frontend
En otra terminal:
```bash
cd frontend
npm install          # solo la primera vez
npm run dev          # inicia en http://localhost:5173
```

### Paso 5 — Probar el flujo
1. Abre `http://localhost:5173` en el navegador.
2. Inicia sesión con la cuenta de **admin** creada en el Paso 3.
3. Llegas al **Dashboard**. En el **menú de cuenta** (arriba a la derecha) usa
   **Crear nueva enfermera** para dar de alta a otras enfermeras.
4. Prueba buscar/registrar pacientes y ver expedientes.

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

### Sprint 4 — Registrar Pacientes Nuevos y Ver Alergias ✅
| # | Tarea | Estado |
|---|-------|--------|
| 1 | Agregar campos `alergias` y `enfermedades_cronicas` a la tabla `pacientes` | ✅ Hecho |
| 2 | Endpoint `POST /api/pacientes` | ✅ Hecho |
| 3 | Endpoint `PATCH /api/pacientes/:id/alergias` | ✅ Hecho |
| 4 | Formulario de registro manual (`/pacientes/nuevo`) | ✅ Hecho |
| 5 | Conectar formulario al endpoint y redirigir al expediente | ✅ Hecho |
| 6 | Mostrar alergias en recuadro rojo en el expediente | ✅ Hecho |

**Extras (rediseño posterior al Sprint 4):**
- **Barra de navegación (`Navbar` + `Layout`)** en todas las pantallas internas, con
  guard de sesión centralizado y Dashboard de inicio con tarjetas de acción.
- **Editar alergias desde el expediente:** el frontend ya consume el endpoint
  `PATCH /api/pacientes/:id/alergias` (antes existía pero no se usaba).
- **Validaciones del formulario de paciente:** prefijo fijo `UP` en la matrícula,
  correo con formato válido (campo en rojo si no lo es) y alergias/enfermedades
  crónicas con preguntas **Sí/No** que revelan el campo de texto (ver sección 5).
- **Íconos con lucide-react** en lugar de emojis en toda la interfaz.
- **Roles y menú de cuenta:** columna `rol` (enfermera/admin), menú de cuenta en la
  Navbar y creación de enfermeras restringida a admins (registro público eliminado).

### Sprint 9 — Seguridad con JWT ✅ *(adelantado)*
| # | Tarea | Estado |
|---|-------|--------|
| 1 | Instalar `jsonwebtoken` y agregar `JWT_SECRET` al `.env` | ✅ Hecho |
| 2 | Generar y devolver un token JWT al iniciar sesión (id, nombre, rol) | ✅ Hecho |
| 3 | Middleware que verifica el token y protege los endpoints (`/api/*`, `/registro`) | ✅ Hecho |
| 4 | Guardar el token en el frontend y enviarlo en cada petición (`apiFetch`) | ✅ Hecho |
| 5 | Proteger rutas del frontend con `RutaProtegida` (redirige al Login sin token) | ✅ Hecho |
| 6 | Manejar token expirado/inválido: cerrar sesión y avisar al usuario | ✅ Hecho |

> Extra: `POST /registro` además exige **rol admin** (middleware `soloAdmin`), y existe
> el script `crearAdmin.js` para crear el primer administrador.

---

## 8. Próximos Pasos (Sprint 5)

Registrar consultas (entrada, atención, salida) y actualizar el expediente:
1. Crear tabla `consultas` en la BD (id, id_paciente, id_enfermera, hora_entrada,
   hora_salida, diagnóstico, notas, medicamento_recetado).
2. Endpoint `POST /api/consultas` — guardar consulta nueva con hora de entrada automática.
3. Endpoint `PATCH /api/consultas/:id/cerrar` — registrar hora de salida, diagnóstico y notas.
4. Formulario de consulta y lista de consultas en el expediente.

> Nota: el Sprint 3 usa el prefijo `/api/` (como `/api/pacientes`). Las rutas viejas
> (`/registro`, `/login`) siguen sin prefijo. Conviene unificarlas bajo `/api/`
> (`/api/registro`, `/api/login`) en algún momento para mantener consistencia.
