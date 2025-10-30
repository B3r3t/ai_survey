import { Section, Responses, ProgressBarGroup } from './types';

export const SECTIONS: Section[] = [
  { id: 'demographics', name: 'Demographics', icon: '🏢', estimatedMinutes: 2 },
  { id: 'usage', name: 'Usage', icon: '📈', estimatedMinutes: 1 },
  { id: 'tools', name: 'Tools', icon: '🛠️', estimatedMinutes: 2 },
  { id: 'corporate', name: 'Corporate AI', icon: '💼', estimatedMinutes: 1 },
  { id: 'franchisee', name: 'Franchisee AI', icon: '🤝', estimatedMinutes: 2 },
  { id: 'investment', name: 'Investment', icon: '💰', estimatedMinutes: 1 },
  { id: 'roi', name: 'ROI', icon: '📊', estimatedMinutes: 2 },
  { id: 'challenges', name: 'Challenges', icon: '⚡', estimatedMinutes: 2 },
  { id: 'data', name: 'Data', icon: '💾', estimatedMinutes: 1 },
  { id: 'customer', name: 'Customer AI', icon: '💬', estimatedMinutes: 2 },
  { id: 'future', name: 'Future Plans', icon: '🚀', estimatedMinutes: 2 },
  { id: 'ethics', name: 'Ethics & Risk', icon: '📜', estimatedMinutes: 1 },
  { id: 'trends', name: 'Trends', icon: '🌐', estimatedMinutes: 1 },
  { id: 'satisfaction', name: 'Satisfaction', icon: '😊', estimatedMinutes: 1 },
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
    sectionIds: ['satisfaction', 'review'],
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
  aiAdoptionDate: '',
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
  corporateAiUse: [],
  corporateAiUseOther: '',
  topDepartmentsAi: [],

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
  aiBudgetSource: [],
  aiBudgetSourceOther: '',
  aiInvestmentDecisionMaker: '',
  aiInvestmentDecisionMakerOther: '',

  // Section 7
  measuredRoi: '',
  measuredImprovements: [],
  measuredImprovementsOther: '',
  timeSavings: '',
  costReduction: '',
  revenueImpact: '',

  // Section 8
  challengesRanked: Array(5).fill(''),
  challengesOther: '',
  aiKnowledgeLevel: '',
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
  customerAiDisclosure: '',
  customerFeedback: '',
  
  // Section 11
  aiPriorities: Array(3).fill(''),
  aiPrioritiesOther: '',
  greatestAiPotential: [],
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
  questionsToAnswer: '',

  // Section 14
  personalAiComfort: 3,
  toolSatisfaction: 3,
  desiredAiCapabilities: '',

  // Section 15
  receiveReport: 'yes_full',
  allowFollowUp: 'no',
  caseStudyInterest: 'no',
  finalComments: '',
  enterDrawing: 'yes',
};