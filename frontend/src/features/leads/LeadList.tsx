import {
  useEffect,
  useState,
} from "react";

import {
  getLeads,
  getLeadById,
} from "./lead.service";

import type {
  Lead,
  LeadStatus,
} from "./lead.types";

import { LeadFilters } from "./LeadFilters";
import { LeadTable } from "./LeadTable";
import { LeadDetail } from "./LeadDetail";
import { LeadForm } from "./LeadForm";

const PAGE_SIZE = 8;

export function LeadList() {
  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [status, setStatus] =
    useState<LeadStatus | undefined>();

  const [agentId, setAgentId] =
    useState<number | undefined>();

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState<"score" | "name">("score");

  const [page, setPage] =
    useState(1);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const [creating, setCreating] =
    useState(false);

  const [editingLead, setEditingLead] =
    useState<Lead | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadLeads() {
    try {
      setLoading(true);
      setError(null);

      const response = await getLeads({
        status,
        agentId,
      });

      setLeads(response.data);

      return response.data;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error inesperado"
      );

      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeads();
  }, [status, agentId]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    status,
    agentId,
    sortBy,
  ]);

  const filteredLeads = leads
    .filter((lead) => {
      const term = search
        .trim()
        .toLowerCase();

      if (!term) {
        return true;
      }

      return (
        lead.name
          .toLowerCase()
          .includes(term) ||
        lead.phone.includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === "score") {
        return (
          b.scoring.score -
          a.scoring.score
        );
      }

      return a.name.localeCompare(
        b.name,
        "es"
      );
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredLeads.length / PAGE_SIZE
    )
  );

  const visibleLeads =
    filteredLeads.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

  async function handleLeadChanged() {
    if (!selectedLead) {
      return;
    }

    const updated =
      await getLeadById(selectedLead.id);

    setSelectedLead(updated.data);

    await loadLeads();
  }

  async function handleLeadSaved() {
    await loadLeads();

    if (
      editingLead &&
      selectedLead?.id === editingLead.id
    ) {
      const updated =
        await getLeadById(editingLead.id);

      setSelectedLead(updated.data);
    }
  }

  return (
    <>
      <LeadFilters
        status={status}
        agentId={agentId}
        search={search}
        sortBy={sortBy}
        onStatusChange={setStatus}
        onAgentChange={setAgentId}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        onCreate={() =>
          setCreating(true)
        }
      />

      {loading && (
        <div className="state-message">
          Cargando leads...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <LeadTable
            leads={visibleLeads}
            onView={setSelectedLead}
          />

          <div className="pagination">
            <span>
              {filteredLeads.length} leads ·
              Página {page} de {totalPages}
            </span>

            <div>
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {selectedLead && !editingLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() =>
            setSelectedLead(null)
          }
          onChanged={handleLeadChanged}
          onEdit={(lead) =>
            setEditingLead(lead)
          }
        />
      )}

      {creating && (
        <LeadForm
          onClose={() =>
            setCreating(false)
          }
          onSaved={async () => {
            await loadLeads();
          }}
        />
      )}

      {editingLead && (
        <LeadForm
          lead={editingLead}
          onClose={() =>
            setEditingLead(null)
          }
          onSaved={handleLeadSaved}
        />
      )}
    </>
  );
}