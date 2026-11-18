
import type {
  LeadsResponse,
  LeadStatus,
  Lead
} from "./lead.types";

const DEFAULT_HEADERS = {
  "x-agent-id": "1",
  "x-role": "AGENT",
};

export type LeadFilters = {
  status?: LeadStatus;
  agentId?: number;
};

export async function getLeadById(
  id: number
): Promise<{ data: Lead }> {
  const response = await fetch(`/api/leads/${id}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el lead");
  }

  return response.json();
}

export async function getLeads(
  filters: LeadFilters = {}
): Promise<LeadsResponse> {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.agentId) {
    params.set(
      "agentId",
      filters.agentId.toString()
    );
  }

  const query = params.toString();

  const response = await fetch(
    `/api/leads${query ? `?${query}` : ""}`,
    {
      headers: DEFAULT_HEADERS,
    }
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron cargar los leads"
    );
  }

  return response.json();
}
export async function assignLead(
  id: number,
  version: number
): Promise<{ data: Lead }> {
  const response = await fetch(`/api/leads/${id}/assign`, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
    }),
  });

  if (response.status === 409) {
    throw new Error(
      "El lead ya ha sido modificado o asignado por otro usuario"
    );
  }

  if (!response.ok) {
    throw new Error("No se pudo asignar el lead");
  }

  return response.json();
}

export async function unassignLead(
  id: number,
  version: number
): Promise<{ data: Lead }> {
  const response = await fetch(`/api/leads/${id}/assign`, {
    method: "DELETE",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
    }),
  });

  if (response.status === 409) {
    throw new Error(
      "El lead ya ha sido modificado por otro usuario"
    );
  }

  if (!response.ok) {
    throw new Error("No se pudo desasignar el lead");
  }

  return response.json();
}

export async function updateLeadStatus(
  id: number,
  status: LeadStatus,
  version: number
): Promise<{ data: Lead }> {
  const response = await fetch(
    `/api/leads/${id}/status`,
    {
      method: "PATCH",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        version,
      }),
    }
  );

  if (response.status === 409) {
    throw new Error(
      "El lead ha sido modificado por otro usuario"
    );
  }

  if (!response.ok) {
    throw new Error(
      "No se pudo cambiar el estado"
    );
  }

  return response.json();
}

export type LeadFormData = {
  name: string;
  phone: string;
  isNewCustomer: boolean;
  commercialInterest: number;
  source: string;
  leadDate: string;
};

export async function createLead(
  data: LeadFormData
): Promise<{ data: Lead }> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el lead");
  }

  return response.json();
}

export async function updateLead(
  id: number,
  version: number,
  data: LeadFormData
): Promise<{ data: Lead }> {
  const response = await fetch(`/api/leads/${id}`, {
    method: "PUT",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      version,
    }),
  });

  if (response.status === 409) {
    throw new Error(
      "El lead ha sido modificado por otro usuario"
    );
  }

  if (!response.ok) {
    throw new Error("No se pudo actualizar el lead");
  }

  return response.json();
}