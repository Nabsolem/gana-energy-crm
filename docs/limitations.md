# Limitaciones conocidas

## Autenticación

La autenticación mediante `x-agent-id` y `x-role` es exclusivamente una simulación para la prueba técnica.

Producción requeriría un proveedor de identidad real y tokens firmados.

## Paginación y búsqueda

Los filtros por estado y agente se realizan en PostgreSQL.

En el MVP, la búsqueda por nombre/teléfono, paginación visual y ordenación por score se realizan sobre los datos recuperados por el frontend.

Esto es suficiente para el conjunto de prueba, pero no es apropiado para decenas de miles de registros.

La evolución prevista sería:

- búsqueda textual en PostgreSQL;
- paginación server-side mediante limit/offset o cursor;
- count independiente;
- índices adaptados a los patrones reales de consulta.

## Ordenación por scoring

El score es un valor derivado de:

- datos del lead;
- configuración activa;
- reglas de negocio.

No se persiste como campo editable para evitar inconsistencias y manipulación.

Para ordenar grandes volúmenes por score podrían estudiarse:

- expresión SQL calculada;
- vista;
- materialized view;
- proyección derivada recalculable.

La decisión dependería del volumen y frecuencia de cambios de configuración.

## Configuración de scoring

La activación de una nueva versión debe envolverse en una transacción antes de considerar el mecanismo apto para producción.

## Despliegue

El alcance actual está orientado a ejecución local.

No se incluye infraestructura de producción, CI/CD, TLS, observabilidad centralizada ni gestión externa de secretos.

## Testing

La suite cubre lógica crítica del scoring y comportamiento HTTP básico.

Una evolución incluiría:

- tests de integración con base de datos aislada;
- pruebas automatizadas de optimistic locking;
- pruebas de carrera sobre asignación;
- pruebas end-to-end del frontend.