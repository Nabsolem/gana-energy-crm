import type {
  LeadStatus,
} from "./lead.types";

type Props = {
  status?: LeadStatus;
  agentId?: number;

  search: string;
  sortBy: "score" | "name";

  onStatusChange: (
    status?: LeadStatus
  ) => void;

  onAgentChange: (
    agentId?: number
  ) => void;

  onSearchChange: (
    search: string
  ) => void;

  onSortChange: (
    sort: "score" | "name"
  ) => void;

  onCreate: () => void;
};

export function LeadFilters({
  status,
  agentId,
  search,
  sortBy,
  onStatusChange,
  onAgentChange,
  onSearchChange,
  onSortChange,
  onCreate,
}: Props) {
  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Buscar nombre o teléfono"
        value={search}
        onChange={(event) =>
          onSearchChange(
            event.target.value
          )
        }
      />

      <select
        value={status ?? ""}
        onChange={(event) => {
          const value =
            event.target.value;

          onStatusChange(
            value
              ? (value as LeadStatus)
              : undefined
          );
        }}
      >
        <option value="">
          Estado: todos
        </option>

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

      <select
        value={agentId ?? ""}
        onChange={(event) => {
          const value =
            event.target.value;

          onAgentChange(
            value
              ? Number(value)
              : undefined
          );
        }}
      >
        <option value="">
          Agente: todos
        </option>

        <option value="1">
          Agente 01
        </option>

        <option value="2">
          Agente 02
        </option>
      </select>

      <select
        value={sortBy}
        onChange={(event) =>
          onSortChange(
            event.target.value as
              | "score"
              | "name"
          )
        }
      >
        <option value="score">
          Ordenar por score
        </option>

        <option value="name">
          Ordenar por nombre
        </option>
      </select>

      <button
        type="button"
        className="primary-button"
        onClick={onCreate}
      >
        + Nuevo
      </button>
    </div>
  );
}