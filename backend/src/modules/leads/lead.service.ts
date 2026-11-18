import { leadRepository } from "./lead.repository";
import { agentRepository } from "../agents/agent.repository";
import { scoringService } from "../scoring/scoring.service";

import type {
  CreateLeadInput,
  UpdateLeadInput,
  ListLeadsQuery,
} from "./lead.schema";

import {
  NotFoundError,
  ConflictError,
} from "../../shared/errors";

import {
  calculateLeadScore,
} from "../scoring/scoring.engine";

export const leadService = {
  async create(data: CreateLeadInput) {
    return leadRepository.create(data);
  },

async findAll(query: ListLeadsQuery) {
  const filters: {
  status?: "NEW" | "IN_PROGRESS" | "CONTACTED" | "CLOSED";
  agentId?: number;
} = {};

if (query.status !== undefined) {
  filters.status = query.status;
}

if (query.agentId !== undefined) {
  filters.agentId = query.agentId;
}

const leads =
  await leadRepository.findAll(filters);

  const weights =
    await scoringService.getActiveWeights();

  const leadsWithScoring = leads.map((lead) => {
    const scoring = calculateLeadScore(
      {
        isNewCustomer: lead.isNewCustomer,
        commercialInterest: lead.commercialInterest,
        source: lead.source,
        leadDate: lead.leadDate,
      },
      weights
    );

    return {
      ...lead,
      scoring,
    };
  });

  return {
    data: leadsWithScoring,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: leadsWithScoring.length,
      totalPages: Math.ceil(
        leadsWithScoring.length / query.limit
      ),
    },
  };
},

  async findById(id: number) {
  const lead = await leadRepository.findById(id);

  if (!lead) {
    throw new NotFoundError(
      `Lead ${id} not found`
    );
  }

  const scoring = await scoringService.calculate({
    isNewCustomer: lead.isNewCustomer,
    commercialInterest: lead.commercialInterest,
    source: lead.source,
    leadDate: lead.leadDate,
  });

  return {
    ...lead,
    scoring,
  };
},

  async update(id: number, data: UpdateLeadInput) {
    const currentLead = await leadRepository.findById(id);

    if (!currentLead) {
      throw new NotFoundError(`Lead ${id} not found`);
    }

    if (currentLead.version !== data.version) {
      throw new ConflictError(
        "Lead has been modified by another user"
      );
    }

    const { version, ...changes } = data;

    return leadRepository.update(
      id,
      version,
      changes
    );
  },

  async assign(
  leadId: number,
  agentId: number,
  version: number
) {
  const lead = await leadRepository.findById(leadId);

  if (!lead) {
    throw new NotFoundError(`Lead ${leadId} not found`);
  }

  const agent = await agentRepository.findById(agentId);

  if (!agent) {
    throw new NotFoundError(`Agent ${agentId} not found`);
  }

  if (lead.agentId !== null) {
    throw new ConflictError("Lead is already assigned");
  }

  if (lead.version !== version) {
    throw new ConflictError(
      "Lead has been modified by another user"
    );
  }

  return leadRepository.assign(
    leadId,
    agentId,
    version
  );
},

async updateStatus(
  id: number,
  status: "NEW" | "IN_PROGRESS" | "CONTACTED" | "CLOSED",
  version: number
) {
  const lead = await leadRepository.findById(id);

  if (!lead) {
    throw new NotFoundError(`Lead ${id} not found`);
  }

  if (lead.version !== version) {
    throw new ConflictError(
      "Lead has been modified by another user"
    );
  }

  return leadRepository.updateStatus(
    id,
    version,
    status
  );
},

async unassign(
  id: number,
  version: number
) {
  const lead = await leadRepository.findById(id);

  if (!lead) {
    throw new NotFoundError(`Lead ${id} not found`);
  }

  if (lead.agentId === null) {
    throw new ConflictError(
      "Lead is not assigned"
    );
  }

  if (lead.version !== version) {
    throw new ConflictError(
      "Lead has been modified by another user"
    );
  }

  return leadRepository.unassign(
    id,
    lead.agentId,
    version
  );
},



};