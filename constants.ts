import { Section, Responses, ProgressBarGroup } from './types';

export const TOTAL_QUESTIONS = 44;
export const ESTIMATED_TIME = '12-14 minutes';

export const SECTIONS: Section[] = [
  { id: 'demographics', name: 'Demographics', icon: '🏢', estimatedMinutes: 2, questionCount: 6 },
  { id: 'usage', name: 'AI Usage', icon: '📈', estimatedMinutes: 1, questionCount: 3 },
  { id: 'tools', name: 'Tools', icon: '🛠️', estimatedMinutes: 2, questionCount: 3 },
  { id: 'corporate', name: 'Corporate AI', icon: '💼', estimatedMinutes: 1, questionCount: 1 },
  { id: 'franchisee', name: 'Franchisee Support', icon: '🤝', estimatedMinutes: 2, questionCount: 4 },
  { id: 'investment', name: 'Investment', icon: '💰', estimatedMinutes: 1, questionCount: 3 },
  { id: 'roi', name: 'ROI', icon: '📊', estimatedMinutes: 2, questionCount: 2 },
  { id: 'challenges', name: 'Challenges', icon: '⚡', estimatedMinutes: 2, questionCount: 2 },
  { id: 'data', name: 'Data Infrastructure', icon: '💾', estimatedMinutes: 1, questionCount: 3 },
  { id: 'customer', name: 'Customer AI', icon: '💬', estimatedMinutes: 2, questionCount: 3 },
  { id: 'future', name: 'Future Plans', icon: '🚀', estimatedMinutes: 2, questionCount: 3 },
  { id: 'ethics', name: 'Ethics & Compliance', icon: '📜', estimatedMinutes: 1, questionCount: 4 },
  { id: 'trends', name: 'Industry Trends', icon: '🌐', estimatedMinutes: 1, questionCount: 2 },
  { id: 'satisfaction', name: 'Satisfaction', icon: '😊', estimatedMinutes: 1, questionCount: 2 },
  { id: 'closing', name: 'Report & Follow-up', icon: '📬', estimatedMinutes: 1, questionCount: 3 },
  { id: 'review', name: 'Review', icon: '✅', estimatedMinutes: 1, questionCount: 0 },
];

export const PROGRESS_BAR_GROUPS: ProgressBarGroup[] = [
  {
    name: 'Foundations',
    icon: '📝',
    sectionIds: ['demographics', 'usage', 'tools'],
  },
  {
    name: 'Implementation',
    icon: '⚙️',
    sectionIds: ['corporate', 'franchisee', 'customer'],
  },
  {
    name: 'Business Impact',
    icon: '📈',
    sectionIds: ['investment', 'roi', 'challenges'],
  },
  {
    name: 'Strategy & Future',
    icon: '🧠',
    sectionIds: ['data', 'future', 'ethics', 'trends'],
  },
  {
    name: 'Finalize',
    icon: '✅',
    sectionIds: ['satisfaction', 'closing', 'review'],
  },
];


export const INITIAL_RESPONSES: Responses = {
  // Section 1
  email: '',
  companyName: '',
  industry: '',
  industryOther: '',
  role: '',
  roleOther: '',
  unitCount: '',
  annualRevenue: '',

  // Section 2
  personalAiUsage: '',
  orgAiUsage: '',
  aiUsageChange: '',

  // Section 3
  aiTools: [],
  aiToolsIndustrySpecific: '',
  aiToolsCustom: '',
  aiToolsOther: '',
  primaryAiTool: '',
  aiUseCases: [],
  aiUseCasesOther: '',

  // Section 4
  corporateAiMatrix: {},

  // Section 5
  franchiseeAiSupport: '',
  franchiseeSupportMethods: [],
  franchiseeSupportMethodsOther: '',
  franchiseeAdoptionRate: '',
  franchiseeAiLearning: [],
  franchiseeAiLearningOther: '',

  // Section 6
  annualAiBudget: '',
  aiBudgetChange: '',
  aiInvestmentDecisionMaker: '',
  aiInvestmentDecisionMakerOther: '',

  // Section 7
  measuredRoi: '',
  measuredImprovements: [],
  measuredImprovementsOther: '',

  // Section 8
  challengesRanked: Array(5).fill(''),
  challengesOther: '',
  dedicatedAiExpertise: '',

  // Section 9
  dataInfrastructureReadiness: 3,
  centralizedDataPlatform: '',
  dataSources: [],
  dataSourcesOther: '',

  // Section 10
  customerFacingAi: '',
  customerAiInteractions: [],
  customerAiInteractionsOther: '',
  customerFeedback: '',

  // Section 11
  greatestAiPotential: '',
  greatestAiPotentialOther: '',
  increaseAiInvestment2026: '',
  adoptionAccelerators: Array(3).fill(''),
  adoptionAcceleratorsOther: '',
  
  // Section 12
  aiPolicy: '',
  ethicalConcerns: [],
  ethicalConcernsOther: '',
  jobImpactConcern: 3,
  aiForCompliance: '',

  // Section 13
  competitorComparison: '',
  excitingAiTrend: '',

  // Section 14
  personalAiComfort: 3,
  desiredAiCapabilities: '',

  // Section 15
  receiveReport: 'yes_full',
  surveyFeedback: '',
  agntmktFollowup: '',
};
