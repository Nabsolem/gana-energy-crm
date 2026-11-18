# Gana Energía CRM

Aplicación Fullstack para la gestión y priorización de leads comerciales.

El sistema permite crear y gestionar leads, asignarlos a agentes, controlar su estado comercial y calcular dinámicamente su prioridad mediante un sistema configurable de scoring ponderado.

El proyecto se ha desarrollado priorizando simplicidad, mantenibilidad, consistencia de datos y separación de responsabilidades.

---

## Stack tecnológico

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM 8
- Zod
- PostgreSQL
- Vitest
- Supertest

### Frontend

- React
- TypeScript
- Vite
- Fetch API

### Infraestructura

- Docker Compose
- PostgreSQL
- Git

---

## Arquitectura

El backend sigue una arquitectura modular por capas:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Prisma
     │
     ▼
PostgreSQL
```

La lógica de scoring se encuentra aislada en un motor independiente:

```text
Lead
 +
ScoringConfiguration
        │
        ▼
 Scoring Engine
        │
        ├── Score
        ├── Priority
        └── Breakdown
```

La estructura principal es:

```text
gana-energy-crm/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── agents/
│   │   │   ├── leads/
│   │   │   └── scoring/
│   │   ├── prisma/
│   │   ├── shared/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── migrations/
│   └── tests/
│
├── frontend/
│   └── src/
│       └── features/
│           ├── leads/
│           └── scoring/
│
├── docs/
├── docker-compose.yml
└── README.md
```

---

## Funcionalidades

### Gestión de leads

La aplicación permite:

- Crear leads.
- Consultar el listado de leads.
- Consultar el detalle de un lead.
- Editar leads.
- Buscar por nombre o teléfono.
- Filtrar por estado.
- Filtrar por agente.
- Ordenar por nombre o puntuación.
- Cambiar el estado comercial.
- Asignar un lead al agente actual.
- Desasignar un lead.

Estados soportados:

- `NEW`
- `IN_PROGRESS`
- `CONTACTED`
- `CLOSED`

---

## Scoring

Cada lead obtiene dinámicamente:

- puntuación de 0 a 100;
- prioridad;
- desglose de los criterios utilizados.

Los criterios actuales son:

- Cliente nuevo.
- Interés comercial.
- Origen.
- Antigüedad.

Configuración inicial:

| Criterio | Peso |
|---|---:|
| Cliente nuevo | 40 % |
| Interés comercial | 30 % |
| Origen | 20 % |
| Antigüedad | 10 % |

La suma de los pesos debe ser exactamente 100 %.

La prioridad se obtiene mediante:

| Score | Prioridad |
|---|---|
| >= 75 | HIGH |
| >= 40 y < 75 | MEDIUM |
| < 40 | LOW |

El score nunca es aceptado desde el navegador.

Siempre se calcula en backend utilizando los datos persistidos y la configuración activa.

---

## Configuración versionada del scoring

Los administradores pueden modificar los pesos.

Una configuración existente nunca se modifica.

Cada cambio crea una nueva versión:

```text
v1
40 / 30 / 20 / 10
active = false

v2
10 / 20 / 60 / 10
active = true
```

Los leads no almacenan una puntuación editable.

Al consultar un lead, el score se calcula utilizando la configuración activa.

Esto permite que un cambio de configuración se refleje inmediatamente sin modificar los datos del lead.

---

## Concurrencia

### Optimistic locking

Los leads disponen de un campo:

```text
version
```

Cada modificación debe enviar la versión conocida por el cliente.

Ejemplo:

```text
Base de datos
version = 3

Usuario A
PUT version = 3
→ actualización correcta
→ version = 4

Usuario B
PUT version = 3
→ 409 Conflict
```

Esto evita sobrescribir silenciosamente cambios realizados por otro usuario.

### Asignación concurrente

La asignación incluye en la condición de actualización:

```text
id
agentId = null
version
```

Por tanto, si dos agentes intentan asignarse simultáneamente el mismo lead, únicamente una operación puede realizar la transición desde un lead libre.

---

## Autenticación

La prueba utiliza autenticación simulada mediante headers:

```text
x-agent-id
x-role
```

Ejemplo:

```text
x-agent-id: 1
x-role: AGENT
```

Roles disponibles:

```text
AGENT
ADMIN
```

La identidad utilizada para operaciones como "Asignarme" se obtiene del middleware del backend y no de un `agentId` arbitrario enviado en el body.

La modificación de la configuración de scoring requiere rol `ADMIN`.

Esta autenticación es exclusivamente una simulación para la prueba técnica y no constituye un sistema válido para producción.

---

# Instalación

## Requisitos

- Node.js
- npm
- Docker Desktop
- Git

---

## 1. Clonar el repositorio

```bash
git clone <repository-url>
cd gana-energy-crm
```

---

## 2. Variables de entorno

Crear:

```text
backend/.env
```

a partir de:

```text
backend/.env.example
```

Ejemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gana_energy_crm?schema=public"
PORT=3001
```

El archivo `.env` no debe versionarse.

---

## 3. Levantar PostgreSQL

Desde la raíz:

```bash
docker compose up -d
```

---

## 4. Instalar backend

```bash
cd backend
npm install
```

---

## 5. Generar contrato Prisma

```bash
npm run contract:emit
```

---

## 6. Aplicar migraciones

```bash
npx prisma db migrate
```

Comprobar estado:

```bash
npx prisma migration status
```

---

## 7. Generar datos de prueba

```bash
npm run seed
```

El seed es reproducible y genera agentes, un administrador y leads con diferentes estados, orígenes e intereses comerciales.

---

## 8. Ejecutar backend

```bash
npm run dev
```

API:

```text
http://localhost:3001
```

Health check:

```text
GET /health
```

---

## 9. Instalar frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite mostrará la URL local, normalmente:

```text
http://localhost:5173
```

Durante desarrollo Vite utiliza un proxy para enviar `/api` al backend en el puerto `3001`.

---

# Tests

Backend:

```bash
cd backend
npm test -- --run
```

Actualmente se prueban, entre otros:

- cálculo del scoring;
- validación de pesos;
- prioridades HIGH, MEDIUM y LOW;
- normalización de criterios;
- health check;
- autenticación requerida;
- roles inválidos;
- autorización de administrador.

---

# Build

## Backend

```bash
cd backend
npm run build
```

El build:

1. regenera el contrato Prisma;
2. compila TypeScript.

## Frontend

```bash
cd frontend
npm run build
```

---

# Decisiones técnicas principales

### Monolito modular

Se utiliza un único backend modular.

No se han incorporado microservicios porque el alcance actual no justifica su coste operacional.

### PostgreSQL como fuente de verdad

La integridad y relaciones principales se mantienen en PostgreSQL.

### Scoring en backend

El frontend nunca controla la puntuación final.

### Optimistic locking

Se utiliza versionado para detectar modificaciones concurrentes.

### Configuración de scoring inmutable

Cada modificación genera una nueva versión en lugar de sobrescribir configuraciones anteriores.

### Sin Redis ni RabbitMQ

No existen actualmente necesidades de cache distribuida ni procesamiento asíncrono que justifiquen estas dependencias.

---

# Documentación adicional

Consultar:

```text
docs/architecture.md
docs/data-model.md
docs/scoring.md
docs/concurrency.md
docs/limitations.md
```

---

# Estado del proyecto

La aplicación implementa el flujo Fullstack principal requerido para la prueba:

```text
React
  ↓
Express
  ↓
Services
  ↓
Repositories
  ↓
Prisma
  ↓
PostgreSQL
```

incluyendo gestión de leads, asignación, estados, scoring configurable, control de concurrencia, roles simulados, datos reproducibles y pruebas automatizadas.