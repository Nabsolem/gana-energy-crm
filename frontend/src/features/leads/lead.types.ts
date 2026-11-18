export type LeadStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "CONTACTED"
  | "CLOSED";

export type LeadPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type ScoreBreakdown = {
  newCustomer: number;
  commercialInterest: number;
  source: number;
  age: number;
};

export type LeadScoring = {
  score: number;
  priority: LeadPriority;
  breakdown: ScoreBreakdown;
};

export type Lead = {
  id: number;
  name: string;
  phone: string;

  status: LeadStatus;

  agentId: number | null;

  isNewCustomer: boolean;
  commercialInterest: number;
  source: string;

  leadDate: string;

  version: number;

  createdAt: string;
  updatedAt: string;

  scoring: LeadScoring;
};

export type LeadsResponse = {
  data: Lead[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};