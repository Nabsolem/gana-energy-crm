import type {
  Lead,
  LeadStatus,
  LeadPriority,
} from "./lead.types";

type Props = {
  leads: Lead[];
  onView: (lead: Lead) => void;
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

export function LeadTable({
  leads,
  onView,
}: Props) {

  return (
    <div className="table-container">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Agente</th>
            <th>Score</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <strong>{lead.name}</strong>
              </td>

              <td>{lead.phone}</td>

              <td>
                <span className="status">
                  {statusLabels[lead.status]}
                </span>
              </td>

              <td>
                {lead.agentId
                  ? `Agente ${lead.agentId
                    .toString()
                    .padStart(2, "0")}`
                  : "—"}
              </td>

              <td>
                <div className="score">
                  <strong>
                    {lead.scoring.score}
                  </strong>

                  <span
                    className={`priority priority-${lead.scoring.priority.toLowerCase()}`}
                  >
                    {priorityLabels[
                      lead.scoring.priority
                    ]}
                  </span>
                </div>
              </td>

              <td>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => onView(lead)}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}