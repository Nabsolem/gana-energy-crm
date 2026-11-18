import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { scoringService } from "./scoring.service";
import { updateScoringWeightsSchema } from "./scoring.schema";

export async function getScoringConfiguration(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const weights =
      await scoringService.getActiveWeights();

    res.status(200).json({
      data: weights,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateScoringConfiguration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const weights =
      updateScoringWeightsSchema.parse(req.body);

    const result =
      await scoringService.updateWeights(weights);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}