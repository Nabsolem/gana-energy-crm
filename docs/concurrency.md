# Concurrencia y consistencia

## Edición concurrente

Los leads incluyen un campo `version`.

Cada actualización exige la versión conocida por el cliente.

La actualización utiliza tanto `id` como `version`.

Una actualización correcta incrementa la versión.

Si otra petición utiliza una versión anterior se devuelve:

```text
409 Conflict
```

Esto implementa optimistic locking.

## Asignación concurrente

La asignación de un lead requiere que:

```text
agentId IS NULL
```

y que la versión coincida.

La condición forma parte de la operación de actualización, evitando utilizar únicamente una secuencia:

```text
SELECT
→ comprobar
→ UPDATE
```

como mecanismo de protección.

## Cambio de scoring

Las consultas calculan el scoring utilizando la configuración activa.

Por tanto, un cambio de pesos se refleja en consultas posteriores sin modificar los leads.

## Atomicidad pendiente

Actualmente la creación de una nueva configuración realiza varias operaciones:

1. desactivar configuración vigente;
2. crear nueva configuración;
3. crear sus criterios.

Para producción estas operaciones deben ejecutarse dentro de una única transacción PostgreSQL.

De este modo:

```text
BEGIN
  deactivate previous
  create configuration
  create criteria
COMMIT
```

y cualquier fallo parcial produciría:

```text
ROLLBACK
```

manteniendo válida la configuración anterior.
