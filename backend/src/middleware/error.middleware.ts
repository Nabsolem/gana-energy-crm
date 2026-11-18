import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: error.issues,
    });
  }

  if (
    error instanceof Error &&
    "statusCode" in error
  ) {
    return res.status(
      (error as Error & { statusCode: number }).statusCode
    ).json({
      error: error.name,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Unexpected server error",
  });
}