import { Section, Responses, ProgressBarGroup } from './types';

export const SECTIONS: Section[] = [
  { id: 'demographics', name: 'Demographics', icon: '🏢', estimatedMinutes: 2 },
  { id: 'usage', name: 'AI Usage & Frequency', icon: '📈', estimatedMinutes: 1 },
  { id: 'tools', name: 'AI Tools & Platforms', icon: '🛠️', estimatedMinutes: 2 },
  { id: 'corporate', name: 'Corporate AI Implementation', icon: '💼', estimatedMinutes: 1 },
  { id: 'franchisee', name: 'Franchisee Support & Adoption', icon: '🤝', estimatedMinutes: 2 },
  { id: 'investment', name: 'Investment & Budget', icon: '💰', estimatedMinutes: 1 },
  { id: 'roi', name: 'ROI & Impact Measurement', icon: '📊', estimatedMinutes: 2 },
  { id: 'challenges', name: 'Challenges & Barriers', icon: '⚡', estimatedMinutes: 2 },
  { id: 'data', name: 'Data & Infrastructure', icon: '💾', estimatedMinutes: 1 },
  { id: 'customer', name: 'Customer-Facing AI', icon: '💬', estimatedMinutes: 2 },
  { id: 'future', name: 'Future Plans & Opportunities', icon: '🚀', estimatedMinutes: 2 },
  { id: 'ethics', name: 'Ethics, Compliance & Risk', icon: '📜', estimatedMinutes: 1 },
  { id: 'trends', name: 'Industry Trends & Insights', icon: '🌐', estimatedMinutes: 1 },
  { id: 'satisfaction', name: 'Satisfaction & Comfort', icon: '😊', estimatedMinutes: 1 },
  { id: 'closing', name: 'Report & Follow-up', icon: '📬', estimatedMinutes: 1 },
  { id: 'review', name: 'Review', icon: '✅', estimatedMinutes: 1 },
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
  agntmktFollowUp: '',
};