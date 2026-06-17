1# Proyecto Integrador II
**Universidad Politécnica de Aguascalientes**
Licenciatura en Ingeniería en Tecnologías de la Información e Innovación Digital
**Materia:** Proyecto Integrador II | **Grupo:** TII05A

## Equipo

| Nombre | Matrícula | Rol |
|--------|-----------|-----|
| Fabian de Jesus de Lira Rodriguez | UP240231 | Backend (Node.js / Express) y Base de Datos (SQL) |
| Nataly Guzmán Romo | UP240436 | Frontend (React / Tailwind) |
| Axel Moises Díaz De Leon | UP240527 | — |
| Miguel Angel Paredes Quezada | UP240666 | — |
| Rodrigo Alejandro Alonso Vega | UP240232 | Frontend (React) |
| Max Anthony Esquivel Haro | UP240752 | — |

---

## Descripción del Proyecto

Sistema web para la gestión de enfermería escolar. Permite a las enfermeras autenticarse, buscar y registrar pacientes (alumnos y personal), llevar expedientes médicos, registrar consultas y administrar el inventario de medicamentos con descuento automático y alertas de stock bajo.

---

## Requerimientos Funcionales

| ID | Descripción |
|----|-------------|
| RF01 | Iniciar y cerrar sesión de enfermería |
| RF02 | Crear usuarios |
| RF03 | Buscar paciente (alumno/personal) por matrícula |
| RF04 | Registrar manualmente a un paciente nuevo |
| RF05 | Ver el expediente y antecedentes del paciente |
| RF06 | Resaltar visualmente alergias y enfermedades crónicas |
| RF07 | Registrar la entrada, atención brindada y salida del paciente |
| RF08 | Buscar, consultar y modificar manualmente el inventario |
| RF09 | Descontar automáticamente del inventario el medicamento recetado |
| RF10 | Mostrar alerta cuando un medicamento tenga poco stock |

## Requerimientos No Funcionales

| ID | Descripción |
|----|-------------|
| RNF01 | El sistema debe ser rápido y no recargar la página |
| RNF02 | El diseño debe adaptarse a pantallas de computadoras y tablets |
| RNF03 | Las contraseñas deben guardarse encriptadas |
| RNF04 | Toda la conexión debe ser segura mediante protocolo HTTPS |
| RNF05 | Usar base de datos relacional para no perder datos entre inventario y consultas |

---

## Historias de Usuario

| ID | Como… | Quiero… | Para… |
|----|-------|---------|-------|
| HU01 | Enfermera | Iniciar y cerrar sesión | Mantener los datos seguros |
| HU02 | Enfermera | Tener un usuario propio | Que las consultas queden registradas a mi nombre |
| HU03 | Enfermera | Buscar por matrícula | Encontrar pacientes rápidamente |
| HU04 | Enfermera | Registrar pacientes nuevos | Atenderlos si no aparecen en el buscador |
| HU05 | Enfermera | Ver el historial médico | Conocer los antecedentes del paciente |
| HU06 | Enfermera | Ver las alergias resaltadas | Evitar darle algo que le haga daño |
| HU07 | Enfermera | Registrar la consulta y hora de salida | Mantener el expediente al día |
| HU08 | Enfermera | Editar el inventario | Registrar cuando lleguen nuevos medicamentos |
| HU09 | Enfermera | Que se descuente lo recetado automáticamente | No tener que hacerlo a mano |
| HU10 | Enfermera | Ver avisos de poco stock | Pedir más material antes de que se acabe |

---

## Roadmap — 8 Sprints

| Sprint | Semana | Objetivo Principal | Responsables |
|--------|--------|--------------------|--------------|
| Sprint 1 | Sem. 1 | Estructura base del proyecto (instalación, carpetas, BD inicial, pantalla de login visual) | Fabián + Nataly |
| Sprint 2 | Sem. 2 | Login funcional con base de datos real y registro de enfermeras | Fabián + Rodrigo |
| Sprint 3 | Sem. 3 | Búsqueda de paciente por matrícula y vista de expediente básico | Fabián + Rodrigo |
| Sprint 4 | Sem. 4 | Registro manual de pacientes nuevos y visualización de alergias | Fabián + Rodrigo |
| Sprint 5 | Sem. 5 | Registrar consultas (entrada, atención, salida) y actualizar expediente | Fabián + Rodrigo |
| Sprint 6 | Sem. 6 | Control de inventario: ver, agregar y editar medicamentos | Fabián + Rodrigo |
| Sprint 7 | Sem. 7 | Descuento automático de medicamentos recetados al guardar consulta | Fabián + Rodrigo |
| Sprint 8 | Sem. 8 | Alertas de stock bajo, pruebas finales y ajustes de diseño | Fabián + Rodrigo |

> Los Story Points representan el esfuerzo estimado de cada tarea en una escala del 1 al 8.

---

## Detalle de Sprints

### Sprint 1 — Cimientos del Proyecto

**Objetivo:** Proyecto instalado y corriendo localmente, servidor básico activo, tabla de enfermeras creada, pantallas de Login y Registro diseñadas (sin conexión a datos).

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Crear estructura de carpetas `/backend` y `/frontend`. Instalar Node.js, Express, React y Tailwind. | Fabián | Base del proyecto | 3 |
| 2 | Crear servidor básico de Node.js que responda en el navegador. | Fabián | RNF01 | 3 |
| 3 | Crear BD y tabla de enfermeras (id, nombre, usuario, contraseña, correo). | Fabián | RF02 / RNF05 | 3 |
| 4 | Diseñar pantalla de Login en React (solo visual). | Nataly | HU01 / RF01 | 5 |
| 5 | Diseñar pantalla de Registro en React (solo visual). | Nataly | HU02 / RF02 | 5 |
| 6 | Agregar validaciones visuales de campos vacíos. | Nataly | HU01 / RNF01 | 3 |

**Resumen:** Fabián 9 pts · Nataly 13 pts · **Total 22 pts**

---

### Sprint 2 — Login y Registro Funcional

**Objetivo:** Una enfermera puede crear su cuenta e iniciar sesión. Los datos se guardan de forma segura en la BD.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Endpoint `POST /api/registro` — guarda datos de enfermera en la BD. | Fabián | HU02 / RF02 | 5 |
| 2 | Endpoint `POST /api/login` — verifica credenciales y devuelve respuesta. | Fabián | HU01 / RF01 | 5 |
| 3 | Encriptar contraseñas con bcrypt al registrar. | Fabián | RNF03 | 3 |
| 4 | Conectar pantalla de Registro al endpoint. | Rodrigo | HU02 / RF02 | 5 |
| 5 | Conectar pantalla de Login al endpoint; redirigir al Dashboard si es correcto. | Rodrigo | HU01 / RF01 | 5 |
| 6 | Crear pantalla Dashboard básica con saludo y botón "Cerrar sesión". | Rodrigo | HU01 / RF01 | 3 |
| 7 | Implementar cierre de sesión (borra datos y regresa al Login). | Rodrigo | HU01 / RF01 | 2 |

**Resumen:** Fabián 13 pts · Rodrigo 15 pts · **Total 28 pts**

---

### Sprint 3 — Buscar Paciente y Ver Expediente

**Objetivo:** La enfermera puede buscar a un paciente por matrícula y ver su expediente con historial de consultas.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Crear tabla de pacientes en la BD (id, nombre, matrícula, fecha de nacimiento, correo, teléfono). | Fabián | RF03 / RNF05 | 3 |
| 2 | Endpoint `GET /api/pacientes/:matricula` — busca paciente por matrícula. | Fabián | HU03 / RF03 | 4 |
| 3 | Endpoint `GET /api/pacientes/:id/expediente` — regresa datos e historial del paciente. | Fabián | HU05 / RF05 | 4 |
| 4 | Diseñar pantalla de búsqueda (barra + botón "Buscar"). | Rodrigo | HU03 / RF03 | 4 |
| 5 | Conectar barra de búsqueda al endpoint; mostrar resultado o "No encontrado". | Rodrigo | HU03 / RF03 | 4 |
| 6 | Diseñar pantalla de expediente (datos generales + lista de consultas). | Rodrigo | HU05 / RF05 | 5 |

**Resumen:** Fabián 11 pts · Rodrigo 13 pts · **Total 24 pts**

---

### Sprint 4 — Registrar Pacientes Nuevos y Ver Alergias

**Objetivo:** Registro manual de pacientes que no aparecen en el sistema y visualización de alergias resaltadas en rojo.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Agregar campos de alergias y enfermedades crónicas a la tabla de pacientes. | Fabián | HU06 / RF06 | 3 |
| 2 | Endpoint `POST /api/pacientes` — guarda paciente nuevo. | Fabián | HU04 / RF04 | 4 |
| 3 | Endpoint `PATCH /api/pacientes/:id/alergias` — agrega/edita alergias. | Fabián | HU06 / RF06 | 3 |
| 4 | Diseñar formulario de registro manual (nombre, matrícula, fecha de nacimiento, correo, teléfono, alergias). | Rodrigo | HU04 / RF04 | 5 |
| 5 | Conectar formulario al endpoint; redirigir al expediente al guardar. | Rodrigo | HU04 / RF04 | 4 |
| 6 | Mostrar alergias en recuadro rojo resaltado en la pantalla de expediente. | Rodrigo | HU06 / RF06 | 4 |

**Resumen:** Fabián 10 pts · Rodrigo 13 pts · **Total 23 pts**

---

### Sprint 5 — Registrar Consultas

**Objetivo:** La enfermera puede abrir una consulta, registrar la atención brindada y marcar la hora de salida. Queda guardado en el expediente.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Crear tabla de consultas en la BD (id, id_paciente, id_enfermera, hora_entrada, hora_salida, diagnóstico, notas, medicamento_recetado). | Fabián | HU07 / RF07 | 4 |
| 2 | Endpoint `POST /api/consultas` — guarda consulta nueva con hora de entrada automática. | Fabián | HU07 / RF07 | 4 |
| 3 | Endpoint `PATCH /api/consultas/:id/cerrar` — registra hora de salida, diagnóstico y notas. | Fabián | HU07 / RF07 | 3 |
| 4 | Diseñar formulario de consulta (diagnóstico, notas, medicamento, hora de entrada automática). | Rodrigo | HU07 / RF07 | 5 |
| 5 | Conectar formulario al endpoint; al guardar, redirigir al expediente actualizado. | Rodrigo | HU07 / RF07 | 4 |
| 6 | Mostrar lista de consultas en el expediente con fecha, diagnóstico y nombre de la enfermera. | Rodrigo | HU05 / RF05 | 4 |

**Resumen:** Fabián 11 pts · Rodrigo 13 pts · **Total 24 pts**

---

### Sprint 6 — Inventario de Medicamentos

**Objetivo:** La enfermera puede ver el inventario completo, agregar medicamentos nuevos y actualizar cantidades.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Crear tabla de medicamentos en la BD (id, nombre, cantidad, unidad, cantidad_minima). | Fabián | HU08 / RF08 | 3 |
| 2 | Endpoint `GET /api/medicamentos` — obtiene lista completa del inventario. | Fabián | HU08 / RF08 | 3 |
| 3 | Endpoint `POST /api/medicamentos` — agrega medicamento nuevo. | Fabián | HU08 / RF08 | 3 |
| 4 | Endpoint `PATCH /api/medicamentos/:id` — actualiza cantidad de medicamento existente. | Fabián | HU08 / RF08 | 3 |
| 5 | Diseñar pantalla de inventario (tabla con nombre, cantidad, unidad y botón "Agregar"). | Rodrigo | HU08 / RF08 | 5 |
| 6 | Conectar pantalla al endpoint; mostrar lista real y permitir agregar/editar. | Rodrigo | HU08 / RF08 | 5 |

**Resumen:** Fabián 12 pts · Rodrigo 10 pts · **Total 22 pts**

---

### Sprint 7 — Descuento Automático al Recetar

**Objetivo:** Al guardar una consulta con medicamento recetado, la cantidad se descuenta automáticamente del inventario.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Modificar endpoint de guardar consulta para descontar medicamento del inventario. | Fabián | HU09 / RF09 | 5 |
| 2 | Validar en el servidor que haya suficiente stock; si no, rechazar con error. | Fabián | HU09 / RF09 | 4 |
| 3 | Agregar selector (dropdown) de medicamentos disponibles con cantidad actual en el formulario de consulta. | Rodrigo | HU09 / RF09 | 5 |
| 4 | Mostrar unidades disponibles al seleccionar medicamento; naranja si hay poco stock. | Rodrigo | HU09 / RF09 | 4 |
| 5 | Al guardar la consulta, mostrar confirmación de descuento exitoso. | Rodrigo | HU09 / RF09 | 3 |

**Resumen:** Fabián 9 pts · Rodrigo 12 pts · **Total 21 pts**

---

### Sprint 8 — Alertas de Stock Bajo y Pruebas Finales

**Objetivo:** Alertas visuales de stock bajo, revisión general del sistema y prueba del flujo completo.

| # | Tarea | Responsable | RF/HU | Pts |
|---|-------|-------------|-------|-----|
| 1 | Endpoint `GET /api/medicamentos/alertas` — regresa medicamentos bajo su cantidad_minima. | Fabián | HU10 / RF10 | 3 |
| 2 | Revisar todos los endpoints (respuestas correctas, sin errores). | Fabián | RNF01 / RNF04 | 4 |
| 3 | **Validación de datos en el servidor:** verificar formato de correo (que sea un correo real, no "dada" ni "1"), campos obligatorios y longitud mínima de contraseña; rechazar datos inválidos con un mensaje de error claro. | Fabián | RNF03 / RNF01 | 4 |
| 4 | **Validación visual en los formularios:** marcar en rojo el campo incorrecto y mostrar el mensaje de error del servidor (ej. "Correo no válido") sin recargar la página. | Rodrigo | RNF01 / HU01 | 3 |
| 5 | En el Dashboard, agregar sección de alertas con medicamentos en rojo. | Rodrigo | HU10 / RF10 | 5 |
| 6 | Mostrar banner/ícono de alerta en la barra de navegación cuando haya stock bajo. | Rodrigo | HU10 / RF10 | 4 |
| 7 | Revisar diseño responsivo en computadora y tablet. | Rodrigo | RNF02 | 3 |
| 8 | Prueba completa del flujo: login → buscar paciente → consulta → inventario → alertas. | Fabián + Rodrigo | Todos los RF/HU | 3 |

**Resumen:** Fabián 11 pts · Rodrigo 15 pts · **Total 26 pts**

---

## Resumen Global de Story Points

| Sprint | Total de Pts |
|--------|-------------|
| Sprint 1 | 22 |
| Sprint 2 | 28 |
| Sprint 3 | 24 |
| Sprint 4 | 23 |
| Sprint 5 | 24 |
| Sprint 6 | 22 |
| Sprint 7 | 21 |
| Sprint 8 | 26 |
| **Total** | **190** |

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express |
| Frontend | React + Tailwind CSS |
| Base de Datos | SQL (relacional) |
| Seguridad | bcrypt (contraseñas), HTTPS |
| Herramientas BD | TablePlus / DBeaver |
