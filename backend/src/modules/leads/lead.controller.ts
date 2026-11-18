import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createLeadSchema,
  updateLeadSchema,
  assignLeadSchema,
  leadIdSchema,
  updateLeadStatusSchema,
  listLeadsQuerySchema,
} from "./lead.schema";

import { leadService } from "./lead.service";

export async function createLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createLeadSchema.parse(req.body);

    const lead = await leadService.create(data);

    res.status(201).json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeads(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listLeadsQuerySchema.parse(req.query);

    const result =
      await leadService.findAll(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = leadIdSchema.parse(req.params.id);

    const lead = await leadService.findById(id);

    res.status(200).json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = leadIdSchema.parse(req.params.id);
    const data = updateLeadSchema.parse(req.body);

    const lead = await leadService.update(id, data);

    res.status(200).json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
  
}

export async function assignLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = leadIdSchema.parse(req.params.id);
    const data = assignLeadSchema.parse(req.body);

    if (!req.user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    const lead = await leadService.assign(
      id,
      req.user.id,
      data.version
    );

    res.status(200).json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function unassignLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = leadIdSchema.parse(req.params.id);

    const version = Number(req.body.version);

    if (
      !Number.isInteger(version) ||
      version <= 0
    ) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Valid version is required",
      });
    }

    const lead = await leadService.unassign(
      id,
      version
    );

    res.status(200).json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = leadIdSchema.parse(req.params.id);

    const data =
      updateLeadStatusSchema.parse(req.body);

    const lead = await leadService.updateStatus(
      id,
      data.status,
      data.version
    );

    res.status(200).json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}