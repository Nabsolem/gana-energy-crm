import { db } from "../../prisma/db";

export const scoringRepository = {
  async findActiveConfiguration() {
    return db.orm.public.ScoringConfiguration
      .where({
        active: true,
      })
      .first();
  },

  async findCriteria(configurationId: number) {
    return db.orm.public.ScoringCriterion
      .where({
        configurationId,
      })
      .all();
  },

  async createConfiguration(version: number) {
    return db.orm.public.ScoringConfiguration.create({
      version,
      active: true,
    });
  },

  async createCriterion(
    configurationId: number,
    name: string,
    weight: number
  ) {
    return db.orm.public.ScoringCriterion.create({
      configurationId,
      name,
      weight,
    });
  },

  async deactivateConfiguration(id: number) {
    return db.orm.public.ScoringConfiguration
      .where({
        id,
        active: true,
      })
      .update({
        active: false,
      });
  },

  async findAllConfigurations() {
    return db.orm.public.ScoringConfiguration.all();
  },
};