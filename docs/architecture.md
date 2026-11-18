# Arquitectura

## Objetivo

La arquitectura busca separar responsabilidades sin introducir complejidad innecesaria.

Se utiliza un monolito modular dividido por funcionalidades.

## Backend

Cada módulo sigue:

```text
Routes
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

### Controller

Responsable de HTTP:

- parámetros;
- body;
- status codes;
- respuesta.

No contiene lógica de negocio relevante.

### Service

Contiene reglas de negocio:

- conflictos;
- asignaciones;
- versionado;
- comprobaciones de existencia;
- scoring.

### Repository

Aísla el acceso a Prisma y PostgreSQL.

### Middleware

Responsable de aspectos transversales:

- autenticación simulada;
- autorización;
- errores.

## Módulos

### Leads

Gestión del ciclo de vida del lead.

### Agents

Consulta y gestión de agentes.

### Scoring

Motor de puntuación y configuración versionada.

## Frontend

Organizado por features:

```text
features/
├── leads/
└── scoring/
```

Las llamadas HTTP se centralizan en servicios.

Los componentes no acceden directamente a PostgreSQL ni conocen Prisma.

## Motivo para no usar microservicios

El dominio y volumen de la prueba no justifican:

- despliegues independientes;
- comunicación distribuida;
- observabilidad distribuida;
- consistencia entre servicios.

Un monolito modular ofrece menor complejidad y mantiene límites claros entre dominios.