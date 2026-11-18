import request from "supertest";
import {
  describe,
  expect,
  it,
} from "vitest";

import { app } from "./app";

describe("API", () => {
  it("GET /health returns 200", async () => {
    const response = await request(app)
      .get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });

  it("rejects API requests without authentication", async () => {
    const response = await request(app)
      .get("/api/leads");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: "UNAUTHORIZED",
      message:
        "Valid x-agent-id header is required",
    });
  });

  it("rejects invalid role", async () => {
    const response = await request(app)
      .get("/api/leads")
      .set("x-agent-id", "1")
      .set("x-role", "INVALID");

    expect(response.status).toBe(401);
  });

  it("prevents AGENT from changing scoring configuration", async () => {
    const response = await request(app)
      .post("/api/scoring/configuration")
      .set("x-agent-id", "1")
      .set("x-role", "AGENT")
      .send({
        newCustomer: 40,
        commercialInterest: 30,
        source: 20,
        age: 10,
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      error: "FORBIDDEN",
      message:
        "Administrator permissions required",
    });
  });
});