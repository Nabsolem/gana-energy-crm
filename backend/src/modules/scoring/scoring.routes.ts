import { Router } from "express";

import {
  getScoringConfiguration,
  updateScoringConfiguration,
} from "./scoring.controller";

import {
  requireAdmin,
} from "../../middleware/auth.middleware";

export const scoringRouter = Router();

scoringRouter.get(
  "/configuration",
  getScoringConfiguration
);

scoringRouter.post(
  "/configuration",
  requireAdmin,
  updateScoringConfiguration
);