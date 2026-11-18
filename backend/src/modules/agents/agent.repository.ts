import { db } from "../../prisma/db";

export const agentRepository = {
  async findAll() {
    return db.orm.public.Agent.all();
  },

  async findById(id: number) {
    return db.orm.public.Agent
      .where({ id })
      .first();
  },

  async create(data: {
    name: string;
    email: string;
    role?: "AGENT" | "ADMIN";
  }) {
    return db.orm.public.Agent.create({
      name: data.name,
      email: data.email,
      role: data.role ?? "AGENT",
    });
  },
};