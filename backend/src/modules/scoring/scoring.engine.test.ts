import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateLeadScore,
} from "./scoring.engine";

const defaultWeights = {
  newCustomer: 40,
  commercialInterest: 30,
  source: 20,
  age: 10,
};

describe("Scoring Engine", () => {
  it("calculates lead score correctly", () => {
    const result = calculateLeadScore(
      {
        isNewCustomer: true,
        commercialInterest: 95,
        source: "WEB",
        leadDate: new Date("2026-11-16"),
      },
      defaultWeights,
      new Date("2026-11-17")
    );

    expect(result.score).toBe(94.5);
    expect(result.priority).toBe("HIGH");

    expect(result.breakdown).toEqual({
      newCustomer: 100,
      commercialInterest: 95,
      source: 80,
      age: 100,
    });
  });

  it("rejects weights that do not sum 100", () => {
    expect(() =>
      calculateLeadScore(
        {
          isNewCustomer: true,
          commercialInterest: 50,
          source: "WEB",
          leadDate: new Date(),
        },
        {
          newCustomer: 50,
          commercialInterest: 30,
          source: 20,
          age: 20,
        }
      )
    ).toThrow(
      "Scoring weights must sum exactly 100"
    );
  });

  it("assigns HIGH priority for scores >= 75", () => {
    const result = calculateLeadScore(
      {
        isNewCustomer: true,
        commercialInterest: 100,
        source: "REFERRAL",
        leadDate: new Date("2026-11-17"),
      },
      defaultWeights,
      new Date("2026-11-17")
    );

    expect(result.score).toBe(100);
    expect(result.priority).toBe("HIGH");
  });
it("assigns MEDIUM priority for scores between 40 and 74.99", () => {
  const result = calculateLeadScore(
    {
      isNewCustomer: false,
      commercialInterest: 80,
      source: "WEB",
      leadDate: new Date("2026-11-16"),
    },
    defaultWeights,
    new Date("2026-11-17")
  );

  expect(result.score).toBe(50);
  expect(result.priority).toBe("MEDIUM");
});

  it("assigns LOW priority for scores below 40", () => {
    const result = calculateLeadScore(
      {
        isNewCustomer: false,
        commercialInterest: 0,
        source: "OTHER",
        leadDate: new Date("2026-10-01"),
      },
      defaultWeights,
      new Date("2026-11-17")
    );

    expect(result.priority).toBe("LOW");
  });

  it("scores unknown sources as zero", () => {
    const result = calculateLeadScore(
      {
        isNewCustomer: false,
        commercialInterest: 0,
        source: "UNKNOWN",
        leadDate: new Date("2026-10-01"),
      },
      defaultWeights,
      new Date("2026-11-17")
    );

    expect(
      result.breakdown.source
    ).toBe(0);
  });

  it("clamps commercial interest to 100", () => {
    const result = calculateLeadScore(
      {
        isNewCustomer: false,
        commercialInterest: 150,
        source: "OTHER",
        leadDate: new Date("2026-10-01"),
      },
      defaultWeights,
      new Date("2026-11-17")
    );

    expect(
      result.breakdown.commercialInterest
    ).toBe(100);
  });

  it("clamps commercial interest to zero", () => {
    const result = calculateLeadScore(
      {
        isNewCustomer: false,
        commercialInterest: -50,
        source: "OTHER",
        leadDate: new Date("2026-10-01"),
      },
      defaultWeights,
      new Date("2026-11-17")
    );

    expect(
      result.breakdown.commercialInterest
    ).toBe(0);
  });
});