import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { agentService } from "./agent.service";

export async function getAgents(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const agents = await agentService.findAll();

    res.status(200).json({
      data: agents,
    });
  } catch (error) {
    next(error);
  }
}