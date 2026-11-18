# Sistema de scoring

## Objetivo

Priorizar leads utilizando criterios normalizados y pesos configurables.

## Fórmula

```text
score =
    newCustomerScore × newCustomerWeight
  + commercialInterestScore × commercialInterestWeight
  + sourceScore × sourceWeight
  + ageScore × ageWeight
```

Los pesos se expresan como porcentaje y deben sumar 100.

## Cliente nuevo

```text
true  → 100
false → 0
```

## Interés comercial

Valor normalizado entre 0 y 100.

## Origen

Reglas actuales:

```text
REFERRAL → 100
WEB      → 80
CAMPAIGN → 60
OTHER    → 40
otro     → 0
```

## Antigüedad

```text
0-1 días  → 100
2-3 días  → 80
4-7 días  → 60
8-14 días → 40
>14 días  → 20
```

## Prioridad

```text
score >= 75 → HIGH
score >= 40 → MEDIUM
score < 40  → LOW
```

## Seguridad del cálculo

El score no forma parte del payload editable del lead.

Se calcula en backend utilizando:

1. datos persistidos del lead;
2. configuración activa;
3. reglas del Scoring Engine.

## Versionado

Las configuraciones son conceptualmente inmutables.

Modificar pesos genera una nueva versión y la versión anterior permanece disponible como histórico.