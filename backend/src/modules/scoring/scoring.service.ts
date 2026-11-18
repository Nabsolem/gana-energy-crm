import { scoringRepository } from "./scoring.repository";

import {
  calculateLeadScore,
  type LeadScoringData,
  type ScoringWeights,
} from "./scoring.engine";

import type {
  UpdateScoringWeightsInput,
} from "./scoring.schema";

const DEFAULT_WEIGHTS: ScoringWeights = {
  newCustomer: 40,
  commercialInterest: 30,
  source: 20,
  age: 10,
};

export const scoringService = {
  async ensureInitialConfiguration() {
    const existing =
      await scoringRepository.findActiveConfiguration();

    if (existing) {
      return existing;
    }

    const configuration =
      await scoringRepository.createConfiguration(1);

    await scoringRepository.createCriterion(
      configuration.id,
      "newCustomer",
      DEFAULT_WEIGHTS.newCustomer
    );

    await scoringRepository.createCriterion(
      configuration.id,
      "commercialInterest",
      DEFAULT_WEIGHTS.commercialInterest
    );

    await scoringRepository.createCriterion(
      configuration.id,
      "source",
      DEFAULT_WEIGHTS.source
    );

    await scoringRepository.createCriterion(
      configuration.id,
      "age",
      DEFAULT_WEIGHTS.age
    );

    return configuration;
  },

  async getActiveWeights(): Promise<ScoringWeights> {
    const configuration =
      await scoringRepository.findActiveConfiguration();

    if (!configuration) {
      throw new Error(
        "No active scoring configuration found"
      );
    }

    const criteria =
      await scoringRepository.findCriteria(
        configuration.id
      );

    const weights: Partial<ScoringWeights> = {};

    for (const criterion of criteria) {
      switch (criterion.name) {
        case "newCustomer":
          weights.newCustomer = criterion.weight;
          break;

        case "commercialInterest":
          weights.commercialInterest = criterion.weight;
          break;

        case "source":
          weights.source = criterion.weight;
          break;

        case "age":
          weights.age = criterion.weight;
          break;
      }
    }

    if (
      weights.newCustomer === undefined ||
      weights.commercialInterest === undefined ||
      weights.source === undefined ||
      weights.age === undefined
    ) {
      throw new Error(
        "Active scoring configuration is incomplete"
      );
    }

    return weights as ScoringWeights;
  },

  async calculate(lead: LeadScoringData) {
    const weights = await this.getActiveWeights();

    return calculateLeadScore(
      lead,
      weights
    );
  },

  async updateWeights(
    weights: UpdateScoringWeightsInput
  ) {
    const current =
      await scoringRepository.findActiveConfiguration();

    if (!current) {
      throw new Error(
        "No active scoring configuration found"
      );
    }

    const configurations =
      await scoringRepository.findAllConfigurations();

    const nextVersion =
      Math.max(
        ...configurations.map(
          (configuration) => configuration.version
        )
      ) + 1;

    await scoringRepository.deactivateConfiguration(
      current.id
    );

    const configuration =
      await scoringRepository.createConfiguration(
        nextVersion
      );

    await scoringRepository.createCriterion(
      configuration.id,
      "newCustomer",
      weights.newCustomer
    );

    await scoringRepository.createCriterion(
      configuration.id,
      "commercialInterest",
      weights.commercialInterest
    );

    await scoringRepository.createCriterion(
      configuration.id,
      "source",
      weights.source
    );

    await scoringRepository.createCriterion(
      configuration.id,
      "age",
      weights.age
    );

    return {
      configuration,
      weights,
    };
  },
};
