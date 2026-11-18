import { Router } from "express";
import { getAgents } from "./agent.controller";

export const agentRouter = Router();

agentRouter.get("/", getAgents);