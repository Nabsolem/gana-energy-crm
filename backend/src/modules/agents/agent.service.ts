import { agentRepository } from "./agent.repository";

export const agentService = {
  async findAll() {
    return agentRepository.findAll();
  },
};