import {
  useEffect,
  useState,
} from "react";

import {
  getScoringConfiguration,
  updateScoringConfiguration,
  type ScoringWeights,
} from "./scoring.service";

type Props = {
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export function ScoringAdmin({
  onClose,
  onSaved,
}: Props) {
  const [weights, setWeights] =
    useState<ScoringWeights | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getScoringConfiguration();

        setWeights(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error inesperado"
        );
      }
    }

    void load();
  }, []);

  if (!weights) {
    return (
      <div className="detail-overlay">
        <aside className="detail-panel">
          {error ?? "Cargando configuración..."}
        </aside>
      </div>
    );
  }

  const total =
    weights.newCustomer +
    weights.commercialInterest +
    weights.source +
    weights.age;

  function changeWeight(
    field: keyof ScoringWeights,
    value: number
  ) {
    setSuccess(false);

    setWeights((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  async function handleSave() {
  if (!weights) {
    return;
  }

  if (total !== 100) {
      setError(
        "La suma de los pesos debe ser exactamente 100 %"
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await updateScoringConfiguration(
        weights
      );

      setSuccess(true);

      await onSaved();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error inesperado"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="detail-overlay">
      <aside className="detail-panel">
        <div className="detail-header">
          <div>
            <span className="detail-label">
              Administración
            </span>

            <h2>
              Configuración de scoring
            </h2>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="admin-description">
          Modifica el peso relativo de cada
          criterio. Cada guardado genera una
          nueva versión de la configuración.
        </p>

        {error && (
          <div className="detail-error">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            Nueva configuración activada.
            Los scores han sido recalculados.
          </div>
        )}

        <div className="weight-list">
          <WeightField
            label="Cliente nuevo"
            description="Importancia de que el lead sea un cliente nuevo."
            value={weights.newCustomer}
            onChange={(value) =>
              changeWeight(
                "newCustomer",
                value
              )
            }
          />

          <WeightField
            label="Interés comercial"
            description="Nivel de interés comercial del lead."
            value={
              weights.commercialInterest
            }
            onChange={(value) =>
              changeWeight(
                "commercialInterest",
                value
              )
            }
          />

          <WeightField
            label="Origen"
            description="Valoración del canal de procedencia."
            value={weights.source}
            onChange={(value) =>
              changeWeight("source", value)
            }
          />

          <WeightField
            label="Antigüedad"
            description="Prioridad según la fecha de entrada."
            value={weights.age}
            onChange={(value) =>
              changeWeight("age", value)
            }
          />
        </div>

        <div
          className={`weight-total ${
            total === 100
              ? "weight-total-valid"
              : "weight-total-invalid"
          }`}
        >
          <span>Total</span>

          <strong>{total} %</strong>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
            disabled={
              saving ||
              total !== 100
            }
          >
            {saving
              ? "Guardando..."
              : "Guardar nueva versión"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function WeightField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="weight-field">
      <div>
        <strong>{label}</strong>
        <span>{description}</span>
      </div>

      <div className="weight-input">
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(event) =>
            onChange(
              Math.max(
                0,
                Math.min(
                  100,
                  Number(event.target.value)
                )
              )
            )
          }
        />

        <span>%</span>
      </div>
    </div>
  );
}