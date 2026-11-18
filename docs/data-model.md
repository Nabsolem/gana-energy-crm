# Modelo de datos

## Agent

Representa un usuario comercial o administrador.

Campos principales:

- id
- name
- email
- role
- createdAt
- updatedAt

Roles:

- AGENT
- ADMIN

Relación:

```text
Agent 1 ───── N Lead
```

## Lead

Representa una oportunidad comercial.

Campos principales:

- id
- name
- phone
- status
- agentId
- isNewCustomer
- commercialInterest
- source
- leadDate
- version
- createdAt
- updatedAt

`version` se utiliza para optimistic locking.

Índices relevantes:

- status
- agentId
- name
- phone

## ScoringConfiguration

Representa una versión de los pesos del scoring.

Campos:

- id
- version
- active
- createdAt

`version` es único.

## ScoringCriterion

Representa un criterio perteneciente a una configuración.

Campos:

- id
- configurationId
- name
- weight

Existe unicidad sobre:

```text
configurationId + name
```

Relación:

```text
ScoringConfiguration 1 ───── N ScoringCriterion
```

Los criterios se eliminan en cascada si se elimina su configuración.