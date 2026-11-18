import type {
  Request,
  Response,
  NextFunction,
} from "express";

export type AuthenticatedUser = {
  id: number;
  role: "AGENT" | "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function mockAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const agentIdHeader = req.header("x-agent-id");
  const roleHeader = req.header("x-role");

  const id = Number(agentIdHeader);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Valid x-agent-id header is required",
    });
  }

  if (
    roleHeader !== "AGENT" &&
    roleHeader !== "ADMIN"
  ) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Valid x-role header is required",
    });
  }

  req.user = {
    id,
    role: roleHeader,
  };

  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      error: "FORBIDDEN",
      message: "Administrator permissions required",
    });
  }

  next();
}