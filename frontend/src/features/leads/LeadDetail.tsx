import { useState } from "react";

import type {
    Lead,
    LeadPriority,
    LeadStatus,
} from "./lead.types";

import {
    assignLead,
    unassignLead,
    updateLeadStatus,
} from "./lead.service";

type Props = {
    lead: Lead;
    onClose: () => void;
    onChanged: () => Promise<void>;
    onEdit: (lead: Lead) => void;
};

const statusLabels: Record<LeadStatus, string> = {
    NEW: "Nuevo",
    IN_PROGRESS: "En gestión",
    CONTACTED: "Contactado",
    CLOSED: "Cerrado",
};

const priorityLabels: Record<LeadPriority, string> = {
    HIGH: "Alta",
    MEDIUM: "Media",
    LOW: "Baja",
};

export function LeadDetail({
    lead,
    onClose,
    onChanged,
    onEdit,
}: Props) {
    const [status, setStatus] =
        useState<LeadStatus>(lead.status);

    const [working, setWorking] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleAssignment() {
        try {
            setWorking(true);
            setError(null);

            if (lead.agentId === null) {
                await assignLead(
                    lead.id,
                    lead.version
                );
            } else {
                await unassignLead(
                    lead.id,
                    lead.version
                );
            }

            await onChanged();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error inesperado"
            );
        } finally {
            setWorking(false);
        }
    }

    async function handleStatusChange() {
        try {
            setWorking(true);
            setError(null);

            await updateLeadStatus(
                lead.id,
                status,
                lead.version
            );

            await onChanged();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error inesperado"
            );
        } finally {
            setWorking(false);
        }
    }

    return (
        <div className="detail-overlay">
            <aside className="detail-panel">
                <div className="detail-header">
                    <div>
                        <span className="detail-label">
                            Lead #{lead.id}
                        </span>

                        <h2>{lead.name}</h2>
                    </div>

                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <section className="detail-section">
                    <h3>Información</h3>

                    <div className="detail-grid">
                        <div>
                            <span>Teléfono</span>
                            <strong>{lead.phone}</strong>
                        </div>

                        <div>
                            <span>Estado</span>
                            <strong>
                                {statusLabels[lead.status]}
                            </strong>
                        </div>

                        <div>
                            <span>Agente</span>
                            <strong>
                                {lead.agentId
                                    ? `Agente ${lead.agentId
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "Sin asignar"}
                            </strong>
                        </div>

                        <div>
                            <span>Origen</span>
                            <strong>{lead.source}</strong>
                        </div>

                        <div>
                            <span>Cliente nuevo</span>
                            <strong>
                                {lead.isNewCustomer ? "Sí" : "No"}
                            </strong>
                        </div>

                        <div>
                            <span>Interés comercial</span>
                            <strong>
                                {lead.commercialInterest}/100
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="detail-section">
                    <h3>Scoring</h3>

                    <div className="score-summary">
                        <div className="score-number">
                            {lead.scoring.score}
                        </div>

                        <div>
                            <span
                                className={`priority priority-${lead.scoring.priority.toLowerCase()}`}
                            >
                                Prioridad{" "}
                                {priorityLabels[
                                    lead.scoring.priority
                                ]}
                            </span>
                        </div>
                    </div>

                    <div className="breakdown">
                        <ScoreRow
                            label="Cliente nuevo"
                            value={
                                lead.scoring.breakdown.newCustomer
                            }
                        />

                        <ScoreRow
                            label="Interés comercial"
                            value={
                                lead.scoring.breakdown
                                    .commercialInterest
                            }
                        />

                        <ScoreRow
                            label="Origen"
                            value={
                                lead.scoring.breakdown.source
                            }
                        />

                        <ScoreRow
                            label="Antigüedad"
                            value={
                                lead.scoring.breakdown.age
                            }
                        />
                    </div>
                </section>

                <section className="detail-section">
                    <h3>Acciones</h3>

                    {error && (
                        <div className="detail-error">
                            {error}
                        </div>
                    )}

                    <div className="status-action">
                        <select
                            value={status}
                            disabled={working}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as LeadStatus
                                )
                            }
                        >
                            <option value="NEW">
                                Nuevo
                            </option>

                            <option value="IN_PROGRESS">
                                En gestión
                            </option>

                            <option value="CONTACTED">
                                Contactado
                            </option>

                            <option value="CLOSED">
                                Cerrado
                            </option>
                        </select>

                        <button
                            type="button"
                            className="secondary-button"
                            disabled={
                                working ||
                                status === lead.status
                            }
                            onClick={handleStatusChange}
                        >
                            Guardar estado
                        </button>
                    </div>

                    <div className="detail-actions">
                        <button
                            type="button"
                            className="primary-button"
                            disabled={working}
                            onClick={handleAssignment}
                        >
                            {working
                                ? "Procesando..."
                                : lead.agentId === null
                                    ? "Asignarme"
                                    : "Desasignar"}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            disabled={working}
                            onClick={() => onEdit(lead)}
                        >
                            Editar
                        </button>
                    </div>
                </section>
            </aside>
        </div>
    );
}

function ScoreRow({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="score-row">
            <div>
                <span>{label}</span>
                <strong>{value}/100</strong>
            </div>

            <div className="score-bar">
                <div
                    className="score-bar-value"
                    style={{
                        width: `${value}%`,
                    }}
                />
            </div>
        </div>
    );
}