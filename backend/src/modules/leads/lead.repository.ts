import { db } from "../../prisma/db";
import type {
  CreateLeadInput,
  UpdateLeadInput,
} from "./lead.schema";

export const leadRepository = {
  async create(data: CreateLeadInput) {
    return db.orm.public.Lead.create({
      name: data.name,
      phone: data.phone,
      isNewCustomer: data.isNewCustomer,
      commercialInterest: data.commercialInterest,
      source: data.source,
      leadDate: data.leadDate,
    });
  },

async findAll(filters: {
  status?: "NEW" | "IN_PROGRESS" | "CONTACTED" | "CLOSED";
  agentId?: number;
}) {
  if (
    filters.status !== undefined &&
    filters.agentId !== undefined
  ) {
    return db.orm.public.Lead
      .where({
        status: filters.status,
        agentId: filters.agentId,
      })
      .all();
  }

  if (filters.status !== undefined) {
    return db.orm.public.Lead
      .where({
        status: filters.status,
      })
      .all();
  }

  if (filters.agentId !== undefined) {
    return db.orm.public.Lead
      .where({
        agentId: filters.agentId,
      })
      .all();
  }

  return db.orm.public.Lead.all();
},

async findById(id: number) {
  return db.orm.public.Lead
    .where({ id })
    .first();
},

async update(
  id: number,
  version: number,
  data: Omit<UpdateLeadInput, "version">
) {
  return db.orm.public.Lead
    .where({
      id,
      version,
    })
    .update({
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.phone !== undefined && {
        phone: data.phone,
      }),

      ...(data.isNewCustomer !== undefined && {
        isNewCustomer: data.isNewCustomer,
      }),

      ...(data.commercialInterest !== undefined && {
        commercialInterest: data.commercialInterest,
      }),

      ...(data.source !== undefined && {
        source: data.source,
      }),

      ...(data.leadDate !== undefined && {
        leadDate: data.leadDate,
      }),

      version: version + 1,
    });
},

async assign(
  leadId: number,
  agentId: number,
  version: number
) {
  return db.orm.public.Lead
    .where({
      id: leadId,
      agentId: null,
      version,
    })
    .update({
      agentId,
      version: version + 1,
    });
},

async updateStatus(
  id: number,
  version: number,
  status: "NEW" | "IN_PROGRESS" | "CONTACTED" | "CLOSED"
) {
  return db.orm.public.Lead
    .where({
      id,
      version,
    })
    .update({
      status,
      version: version + 1,
    });
},

async unassign(
  id: number,
  agentId: number,
  version: number
) {
  return db.orm.public.Lead
    .where({
      id,
      agentId,
      version,
    })
    .update({
      agentId: null,
      version: version + 1,
    });
},

};



