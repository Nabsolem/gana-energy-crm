export type ScoringWeights = {
  newCustomer: number;
  commercialInterest: number;
  source: number;
  age: number;
};

export type LeadScoringData = {
  isNewCustomer: boolean;
  commercialInterest: number;
  source: string;
  leadDate: Date;
};

export type ScoreBreakdown = {
  newCustomer: number;
  commercialInterest: number;
  source: number;
  age: number;
};

export type ScoreResult = {
  score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  breakdown: ScoreBreakdown;
};

function scoreNewCustomer(
  isNewCustomer: boolean
): number {
  return isNewCustomer ? 100 : 0;
}

function scoreCommercialInterest(
  commercialInterest: number
): number {
  return Math.max(
    0,
    Math.min(100, commercialInterest)
  );
}

function scoreSource(source: string): number {
  const normalizedSource = source
    .trim()
    .toUpperCase();

  const scores: Record<string, number> = {
    REFERRAL: 100,
    WEB: 80,
    CAMPAIGN: 60,
    OTHER: 40,
  };

  return scores[normalizedSource] ?? 0;
}

function scoreAge(
  leadDate: Date,
  now = new Date()
): number {
  const milliseconds =
    now.getTime() - leadDate.getTime();

  const days = Math.max(
    0,
    Math.floor(
      milliseconds / (1000 * 60 * 60 * 24)
    )
  );

  if (days <= 1) return 100;
  if (days <= 3) return 80;
  if (days <= 7) return 60;
  if (days <= 14) return 40;

  return 20;
}

function getPriority(
  score: number
): "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 75) {
    return "HIGH";
  }

  if (score >= 40) {
    return "MEDIUM";
  }

  return "LOW";
}

export function calculateLeadScore(
  lead: LeadScoringData,
  weights: ScoringWeights,
  now = new Date()
): ScoreResult {
  const totalWeight =
    weights.newCustomer +
    weights.commercialInterest +
    weights.source +
    weights.age;

  if (totalWeight !== 100) {
    throw new Error(
      "Scoring weights must sum exactly 100"
    );
  }

  const breakdown: ScoreBreakdown = {
    newCustomer: scoreNewCustomer(
      lead.isNewCustomer
    ),

    commercialInterest:
      scoreCommercialInterest(
        lead.commercialInterest
      ),

    source: scoreSource(lead.source),

    age: scoreAge(
      lead.leadDate,
      now
    ),
  };

  const score =
    breakdown.newCustomer *
      (weights.newCustomer / 100) +

    breakdown.commercialInterest *
      (weights.commercialInterest / 100) +

    breakdown.source *
      (weights.source / 100) +

    breakdown.age *
      (weights.age / 100);

  const roundedScore =
    Math.round(score * 100) / 100;

  return {
    score: roundedScore,
    priority: getPriority(roundedScore),
    breakdown,
  };
}