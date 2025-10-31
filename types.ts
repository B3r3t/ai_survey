export interface Section {
  id: string;
  name: string;
  icon: string;
  estimatedMinutes: number;
}

export interface ProgressBarGroup {
  name: string;
  icon: string;
  sectionIds: string[];
}

export interface Responses {
  // Section 1
  email: string;
  companyName: string;
  industry: string;
  industryOther: string;
  role: string;
  roleOther: string;
  unitCount: string;
  annualRevenue: string;

  // Section 2
  personalAiUsage: string;
  orgAiUsage: string;
  aiUsageChange: string;

  // Section 3
  aiTools: string[];
  aiToolsIndustrySpecific: string;
  aiToolsCustom: string;
  aiToolsOther: string;
  primaryAiTool: string;
  aiUseCases: string[];
  aiUseCasesOther: string;

  // Section 4
  corporateAiMatrix: Record<string, string[]>;

  // Section 5
  franchiseeAiSupport: string;
  franchiseeSupportMethods: string[];
  franchiseeSupportMethodsOther: string;
  franchiseeAdoptionRate: string;
  franchiseeAiLearning: string[];
  franchiseeAiLearningOther: string;
  
  // Section 6
  annualAiBudget: string;
  aiBudgetChange: string;
  aiInvestmentDecisionMaker: string;
  aiInvestmentDecisionMakerOther: string;

  // Section 7
  measuredRoi: string;
  measuredImprovements: string[];
  measuredImprovementsOther: string;

  // Section 8
  challengesRanked: string[];
  challengesOther: string;
  dedicatedAiExpertise: string;

  // Section 9
  dataInfrastructureReadiness: number;
  centralizedDataPlatform: string;
  dataSources: string[];
  dataSourcesOther: string;

  // Section 10
  customerFacingAi: string;
  customerAiInteractions: string[];
  customerAiInteractionsOther: string;
  customerFeedback: string;

  // Section 11
  greatestAiPotential: string;
  greatestAiPotentialOther: string;
  increaseAiInvestment2026: string;
  adoptionAccelerators: string[];
  adoptionAcceleratorsOther: string;

  // Section 12
  aiPolicy: string;
  ethicalConcerns: string[];
  ethicalConcernsOther: string;
  jobImpactConcern: number;
  aiForCompliance: string;

  // Section 13
  competitorComparison: string;
  excitingAiTrend: string;

  // Section 14
  personalAiComfort: number;
  desiredAiCapabilities: string;

  // Section 15
  receiveReport: string;
  surveyFeedback: string;
  agntmktFollowUp: string;
}

export type Errors = {
  [K in keyof Responses]?: string | null;
};

export enum SurveyStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}