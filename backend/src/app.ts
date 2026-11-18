import express from "express";

import { leadRouter } from "./modules/leads/lead.routes";
import { agentRouter } from "./modules/agents/agent.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { scoringRouter } from "./modules/scoring/scoring.routes";
import { mockAuthMiddleware } from "./middleware/auth.middleware";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// A partir de aquí las APIs requieren identidad
app.use("/api", mockAuthMiddleware);

app.use("/api/leads", leadRouter);
app.use("/api/agents", agentRouter);
app.use("/api/scoring", scoringRouter);

app.use(errorMiddleware);
// Siempre el último middleware
