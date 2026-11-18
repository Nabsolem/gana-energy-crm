import "dotenv/config";

import { app } from "./app";
import { scoringService } from "./modules/scoring/scoring.service";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await scoringService.ensureInitialConfiguration();

  app.listen(PORT, () => {
    console.log(
      `API running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});