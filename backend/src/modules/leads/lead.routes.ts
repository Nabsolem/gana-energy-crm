import { Router } from "express";

import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  assignLead,
  unassignLead,
} from "./lead.controller";

export const leadRouter = Router();

leadRouter.get("/", getLeads);
leadRouter.get("/:id", getLeadById);

leadRouter.post("/", createLead);

leadRouter.put("/:id", updateLead);

leadRouter.patch(
  "/:id/status",
  updateLeadStatus
);

leadRouter.post(
  "/:id/assign",
  assignLead
);

leadRouter.delete(
  "/:id/assign",
  unassignLead
);