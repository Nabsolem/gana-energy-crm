import {
  useState,
  type FormEvent,
} from "react";

import type { Lead } from "./lead.types";

import {
  createLead,
  updateLead,
  type LeadFormData,
} from "./lead.service";

type Props = {
  lead?: Lead;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export function LeadForm({
  lead,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(
    lead?.name ?? ""
  );

  const [phone, setPhone] = useState(
    lead?.phone ?? ""
  );

  const [
    isNewCustomer,
    setIsNewCustomer,
  ] = useState(
    lead?.isNewCustomer ?? true
  );

  const [
    commercialInterest,
    setCommercialInterest,
  ] = useState(
    lead?.commercialInterest ?? 50
  );

  const [source, setSource] = useState(
    lead?.source ?? "WEB"
  );

  const [leadDate, setLeadDate] =
    useState(
      lead
        ? lead.leadDate.slice(0, 10)
        : new Date()
            .toISOString()
            .slice(0, 10)
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const data: LeadFormData = {
        name,
        phone,
        isNewCustomer,
        commercialInterest,
        source,
        leadDate,
      };

      if (lead) {
        await updateLead(
          lead.id,
          lead.version,
          data
        );
      } else {
        await createLead(data);
      }

      await onSaved();
      onClose();
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
              {lead
                ? `Lead #${lead.id}`
                : "Nuevo lead"}
            </span>

            <h2>
              {lead
                ? "Editar lead"
                : "Crear lead"}
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

        <form
          className="lead-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="detail-error">
              {error}
            </div>
          )}

          <label>
            Nombre
            <input
              value={name}
              required
              maxLength={100}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </label>

          <label>
            Teléfono
            <input
              value={phone}
              required
              onChange={(event) =>
                setPhone(event.target.value)
              }
            />
          </label>

          <label>
            Origen
            <select
              value={source}
              onChange={(event) =>
                setSource(event.target.value)
              }
            >
              <option value="WEB">
                Web
              </option>

              <option value="REFERRAL">
                Referido
              </option>

              <option value="CAMPAIGN">
                Campaña
              </option>

              <option value="OTHER">
                Otro
              </option>
            </select>
          </label>

          <label>
            Interés comercial
            <div className="range-field">
              <input
                type="range"
                min="0"
                max="100"
                value={commercialInterest}
                onChange={(event) =>
                  setCommercialInterest(
                    Number(
                      event.target.value
                    )
                  )
                }
              />

              <strong>
                {commercialInterest}
              </strong>
            </div>
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={isNewCustomer}
              onChange={(event) =>
                setIsNewCustomer(
                  event.target.checked
                )
              }
            />

            Cliente nuevo
          </label>

          <label>
            Fecha del lead
            <input
              type="date"
              value={leadDate}
              required
              onChange={(event) =>
                setLeadDate(
                  event.target.value
                )
              }
            />
          </label>

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
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : lead
                  ? "Guardar cambios"
                  : "Crear lead"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}