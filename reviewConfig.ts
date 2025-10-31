import { Responses } from './types';
import {
  Option,
  INDUSTRY_OPTIONS,
  ROLE_OPTIONS,
  UNIT_COUNT_OPTIONS,
  ANNUAL_REVENUE_OPTIONS,
  PERSONAL_AI_USAGE_OPTIONS,
  ORG_AI_USAGE_OPTIONS,
  AI_ADOPTION_DATE_OPTIONS,
  AI_USAGE_CHANGE_OPTIONS,
  AI_TOOL_OPTIONS,
  PRIMARY_AI_TOOL_OPTIONS,
  AI_USE_CASE_OPTIONS,
  CORPORATE_AI_USE_OPTIONS,
  TOP_DEPARTMENTS_AI_OPTIONS,
  FRANCHISEE_AI_SUPPORT_OPTIONS,
  FRANCHISEE_SUPPORT_METHOD_OPTIONS,
  FRANCHISEE_ADOPTION_RATE_OPTIONS,
  FRANCHISEE_AI_LEARNING_OPTIONS,
  ANNUAL_AI_BUDGET_OPTIONS,
  AI_BUDGET_CHANGE_OPTIONS,
  AI_BUDGET_SOURCE_OPTIONS,
  AI_INVESTMENT_DECISION_MAKER_OPTIONS,
  MEASURED_ROI_OPTIONS,
  MEASURED_IMPROVEMENTS_OPTIONS,
  TIME_SAVINGS_OPTIONS,
  COST_REDUCTION_OPTIONS,
  REVENUE_IMPACT_OPTIONS,
  CHALLENGES_OPTIONS,
  AI_KNOWLEDGE_LEVEL_OPTIONS,
  DEDICATED_AI_EXPERTISE_OPTIONS,
  CENTRALIZED_DATA_PLATFORM_OPTIONS,
  DATA_SOURCES_OPTIONS,
  CUSTOMER_FACING_AI_OPTIONS,
  CUSTOMER_AI_INTERACTIONS_OPTIONS,
  CUSTOMER_AI_DISCLOSURE_OPTIONS,
  CUSTOMER_FEEDBACK_OPTIONS,
  AI_PRIORITIES_OPTIONS,
  GREATEST_AI_POTENTIAL_OPTIONS,
  INCREASE_AI_INVESTMENT_OPTIONS,
  ADOPTION_ACCELERATORS_OPTIONS,
  AI_POLICY_OPTIONS,
  ETHICAL_CONCERNS_OPTIONS,
  AI_FOR_COMPLIANCE_OPTIONS,
  COMPETITOR_COMPARISON_OPTIONS,
  RECEIVE_REPORT_OPTIONS,
  AGNTMKT_FOLLOW_UP_OPTIONS,
} from './surveyOptions';

const buildOptionMap = (options: Option[]): Record<string, string> =>
  options.reduce<Record<string, string>>((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

const OPTION_LABELS = {
  industry: buildOptionMap(INDUSTRY_OPTIONS),
  role: buildOptionMap(ROLE_OPTIONS),
  unitCount: buildOptionMap(UNIT_COUNT_OPTIONS),
  annualRevenue: buildOptionMap(ANNUAL_REVENUE_OPTIONS),
  personalAiUsage: buildOptionMap(PERSONAL_AI_USAGE_OPTIONS),
  orgAiUsage: buildOptionMap(ORG_AI_USAGE_OPTIONS),
  aiAdoptionDate: buildOptionMap(AI_ADOPTION_DATE_OPTIONS),
  aiUsageChange: buildOptionMap(AI_USAGE_CHANGE_OPTIONS),
  aiTools: buildOptionMap(AI_TOOL_OPTIONS),
  primaryAiTool: buildOptionMap(PRIMARY_AI_TOOL_OPTIONS),
  aiUseCases: buildOptionMap(AI_USE_CASE_OPTIONS),
  corporateAiUse: buildOptionMap(CORPORATE_AI_USE_OPTIONS),
  topDepartmentsAi: buildOptionMap(TOP_DEPARTMENTS_AI_OPTIONS),
  franchiseeAiSupport: buildOptionMap(FRANCHISEE_AI_SUPPORT_OPTIONS),
  franchiseeSupportMethods: buildOptionMap(FRANCHISEE_SUPPORT_METHOD_OPTIONS),
  franchiseeAdoptionRate: buildOptionMap(FRANCHISEE_ADOPTION_RATE_OPTIONS),
  franchiseeAiLearning: buildOptionMap(FRANCHISEE_AI_LEARNING_OPTIONS),
  annualAiBudget: buildOptionMap(ANNUAL_AI_BUDGET_OPTIONS),
  aiBudgetChange: buildOptionMap(AI_BUDGET_CHANGE_OPTIONS),
  aiBudgetSource: buildOptionMap(AI_BUDGET_SOURCE_OPTIONS),
  aiInvestmentDecisionMaker: buildOptionMap(AI_INVESTMENT_DECISION_MAKER_OPTIONS),
  measuredRoi: buildOptionMap(MEASURED_ROI_OPTIONS),
  measuredImprovements: buildOptionMap(MEASURED_IMPROVEMENTS_OPTIONS),
  timeSavings: buildOptionMap(TIME_SAVINGS_OPTIONS),
  costReduction: buildOptionMap(COST_REDUCTION_OPTIONS),
  revenueImpact: buildOptionMap(REVENUE_IMPACT_OPTIONS),
  challengesRanked: buildOptionMap(CHALLENGES_OPTIONS),
  aiKnowledgeLevel: buildOptionMap(AI_KNOWLEDGE_LEVEL_OPTIONS),
  dedicatedAiExpertise: buildOptionMap(DEDICATED_AI_EXPERTISE_OPTIONS),
  centralizedDataPlatform: buildOptionMap(CENTRALIZED_DATA_PLATFORM_OPTIONS),
  dataSources: buildOptionMap(DATA_SOURCES_OPTIONS),
  customerFacingAi: buildOptionMap(CUSTOMER_FACING_AI_OPTIONS),
  customerAiInteractions: buildOptionMap(CUSTOMER_AI_INTERACTIONS_OPTIONS),
  customerAiDisclosure: buildOptionMap(CUSTOMER_AI_DISCLOSURE_OPTIONS),
  customerFeedback: buildOptionMap(CUSTOMER_FEEDBACK_OPTIONS),
  aiPriorities: buildOptionMap(AI_PRIORITIES_OPTIONS),
  greatestAiPotential: buildOptionMap(GREATEST_AI_POTENTIAL_OPTIONS),
  increaseAiInvestment2026: buildOptionMap(INCREASE_AI_INVESTMENT_OPTIONS),
  adoptionAccelerators: buildOptionMap(ADOPTION_ACCELERATORS_OPTIONS),
  aiPolicy: buildOptionMap(AI_POLICY_OPTIONS),
  ethicalConcerns: buildOptionMap(ETHICAL_CONCERNS_OPTIONS),
  aiForCompliance: buildOptionMap(AI_FOR_COMPLIANCE_OPTIONS),
  competitorComparison: buildOptionMap(COMPETITOR_COMPARISON_OPTIONS),
  receiveReport: buildOptionMap(RECEIVE_REPORT_OPTIONS),
  agntmktFollowUp: buildOptionMap(AGNTMKT_FOLLOW_UP_OPTIONS),
} as const;

type SingleChoiceQuestion = {
  type: 'single';
  field: keyof Responses;
  question: string;
  optionKey: keyof typeof OPTION_LABELS;
  otherField?: keyof Responses;
};

type MultiChoiceQuestion = {
  type: 'multi';
  field: keyof Responses;
  question: string;
  optionKey: keyof typeof OPTION_LABELS;
  otherFields?: Partial<Record<string, keyof Responses>>;
};

type RankingQuestion = {
  type: 'ranking';
  field: keyof Responses;
  question: string;
  optionKey: keyof typeof OPTION_LABELS;
};

type ScaleQuestion = {
  type: 'scale';
  field: keyof Responses;
  question: string;
  max?: number;
};

type TextQuestion = {
  type: 'text' | 'textarea';
  field: keyof Responses;
  question: string;
};

export type ReviewQuestion =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | RankingQuestion
  | ScaleQuestion
  | TextQuestion;

export interface ReviewSectionConfig {
  id: string;
  name: string;
  questions: ReviewQuestion[];
}

const formatSingleChoice = (
  responses: Responses,
  question: SingleChoiceQuestion,
): string => {
  const value = responses[question.field] as string;
  if (!value) {
    return 'Not answered';
  }
  if (value === 'other' && question.otherField) {
    const otherValue = (responses[question.otherField] as string)?.trim();
    return otherValue || 'Other (not specified)';
  }
  return OPTION_LABELS[question.optionKey][value] ?? value;
};

const formatMultiChoice = (
  responses: Responses,
  question: MultiChoiceQuestion,
): string[] | string => {
  const values = responses[question.field] as string[];
  if (!values || values.length === 0) {
    return 'Not answered';
  }
  return values.map((value) => {
    if (question.otherFields && question.otherFields[value]) {
      const otherResponse = (responses[question.otherFields[value]!] as string)?.trim();
      if (otherResponse) {
        return `${OPTION_LABELS[question.optionKey][value] ?? 'Other'}: ${otherResponse}`;
      }
    }
    return OPTION_LABELS[question.optionKey][value] ?? value;
  });
};

const formatRanking = (
  responses: Responses,
  question: RankingQuestion,
): string[] | string => {
  const values = responses[question.field] as string[];
  if (!values || values.every((v) => !v)) {
    return 'Not answered';
  }
  return values
    .map((value, index) =>
      value ? `#${index + 1} ${OPTION_LABELS[question.optionKey][value] ?? value}` : null,
    )
    .filter((entry): entry is string => Boolean(entry));
};

const formatScale = (responses: Responses, question: ScaleQuestion): string => {
  const value = responses[question.field] as number | null | undefined;
  if (value === null || value === undefined) {
    return 'Not answered';
  }
  return `${value} / ${question.max ?? 5}`;
};

const formatText = (responses: Responses, question: TextQuestion): string => {
  const value = responses[question.field] as string;
  return value?.trim() ? value.trim() : 'Not answered';
};

export const formatReviewAnswer = (
  responses: Responses,
  question: ReviewQuestion,
): string | string[] => {
  switch (question.type) {
    case 'single':
      return formatSingleChoice(responses, question);
    case 'multi':
      return formatMultiChoice(responses, question);
    case 'ranking':
      return formatRanking(responses, question);
    case 'scale':
      return formatScale(responses, question);
    case 'text':
    case 'textarea':
      return formatText(responses, question);
    default:
      return 'Not answered';
  }
};

export const REVIEW_SECTIONS: ReviewSectionConfig[] = [
  {
    id: 'demographics',
    name: 'Demographics',
    questions: [
      { type: 'text', field: 'email', question: 'Q1. Email Address' },
      { type: 'text', field: 'companyName', question: 'Q2. Company/Brand Name' },
      { type: 'single', field: 'industry', question: 'Q3. Industry', optionKey: 'industry', otherField: 'industryOther' },
      { type: 'single', field: 'role', question: 'Q4. Role/Title', optionKey: 'role', otherField: 'roleOther' },
      { type: 'single', field: 'unitCount', question: "Q5. Franchise Unit Count", optionKey: 'unitCount' },
      { type: 'single', field: 'annualRevenue', question: "Q6. Annual System-Wide Revenue", optionKey: 'annualRevenue' },
    ],
  },
  {
    id: 'usage',
    name: 'Usage',
    questions: [
      { type: 'single', field: 'personalAiUsage', question: 'Q7. Personal AI Usage Frequency', optionKey: 'personalAiUsage' },
      { type: 'single', field: 'orgAiUsage', question: 'Q8. Organizational AI Usage Frequency', optionKey: 'orgAiUsage' },
      { type: 'single', field: 'aiAdoptionDate', question: 'Q9. AI Adoption Start', optionKey: 'aiAdoptionDate' },
      { type: 'single', field: 'aiUsageChange', question: 'Q10. AI Usage Change in Past 12 Months', optionKey: 'aiUsageChange' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    questions: [
      {
        type: 'multi',
        field: 'aiTools',
        question: 'Q11. AI Tools in Use',
        optionKey: 'aiTools',
        otherFields: {
          'industry-specific_specify': 'aiToolsIndustrySpecific',
          custom_specify: 'aiToolsCustom',
          other_specify: 'aiToolsOther',
        },
      },
      {
        type: 'single',
        field: 'primaryAiTool',
        question: 'Q12. Primary AI Platform',
        optionKey: 'primaryAiTool',
      },
      {
        type: 'multi',
        field: 'aiUseCases',
        question: 'Q13. AI Use Cases',
        optionKey: 'aiUseCases',
        otherFields: {
          other_specify: 'aiUseCasesOther',
        },
      },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate AI',
    questions: [
      {
        type: 'multi',
        field: 'corporateAiUse',
        question: 'Q14. Corporate AI Applications',
        optionKey: 'corporateAiUse',
        otherFields: {
          other_specify: 'corporateAiUseOther',
        },
      },
      {
        type: 'ranking',
        field: 'topDepartmentsAi',
        question: 'Q15. Top Corporate Departments Using AI',
        optionKey: 'topDepartmentsAi',
      },
    ],
  },
  {
    id: 'franchisee',
    name: 'Franchisee AI',
    questions: [
      {
        type: 'single',
        field: 'franchiseeAiSupport',
        question: 'Q16. AI Support for Franchisees',
        optionKey: 'franchiseeAiSupport',
      },
      {
        type: 'multi',
        field: 'franchiseeSupportMethods',
        question: 'Q17. Franchisee AI Support Methods',
        optionKey: 'franchiseeSupportMethods',
        otherFields: {
          other_specify: 'franchiseeSupportMethodsOther',
        },
      },
      {
        type: 'single',
        field: 'franchiseeAdoptionRate',
        question: 'Q18. Franchisee AI Adoption Rate',
        optionKey: 'franchiseeAdoptionRate',
      },
      {
        type: 'multi',
        field: 'franchiseeAiLearning',
        question: 'Q19. Franchisee AI Learning Sources',
        optionKey: 'franchiseeAiLearning',
        otherFields: {
          other_specify: 'franchiseeAiLearningOther',
        },
      },
    ],
  },
  {
    id: 'investment',
    name: 'Investment',
    questions: [
      { type: 'single', field: 'annualAiBudget', question: 'Q20. 2025 AI Budget', optionKey: 'annualAiBudget' },
      { type: 'single', field: 'aiBudgetChange', question: 'Q21. AI Budget Change from 2024', optionKey: 'aiBudgetChange' },
      {
        type: 'multi',
        field: 'aiBudgetSource',
        question: 'Q22. AI Budget Sources',
        optionKey: 'aiBudgetSource',
        otherFields: {
          other_specify: 'aiBudgetSourceOther',
        },
      },
      {
        type: 'single',
        field: 'aiInvestmentDecisionMaker',
        question: 'Q23. Primary AI Investment Decision-Maker',
        optionKey: 'aiInvestmentDecisionMaker',
        otherField: 'aiInvestmentDecisionMakerOther',
      },
    ],
  },
  {
    id: 'roi',
    name: 'ROI',
    questions: [
      {
        type: 'single',
        field: 'measuredRoi',
        question: 'Q24. Measured AI ROI',
        optionKey: 'measuredRoi',
      },
      {
        type: 'multi',
        field: 'measuredImprovements',
        question: 'Q25. Measurable Improvements from AI',
        optionKey: 'measuredImprovements',
        otherFields: {
          other_specify: 'measuredImprovementsOther',
        },
      },
      { type: 'single', field: 'timeSavings', question: 'Q26a. Time Savings Impact', optionKey: 'timeSavings' },
      { type: 'single', field: 'costReduction', question: 'Q26b. Cost Reduction Impact', optionKey: 'costReduction' },
      { type: 'single', field: 'revenueImpact', question: 'Q26c. Revenue Impact', optionKey: 'revenueImpact' },
    ],
  },
  {
    id: 'challenges',
    name: 'Challenges',
    questions: [
      {
        type: 'ranking',
        field: 'challengesRanked',
        question: 'Q27. Biggest AI Implementation Challenges',
        optionKey: 'challengesRanked',
      },
      {
        type: 'single',
        field: 'aiKnowledgeLevel',
        question: "Q28. Organization's AI Knowledge Level",
        optionKey: 'aiKnowledgeLevel',
      },
      {
        type: 'single',
        field: 'dedicatedAiExpertise',
        question: 'Q29. Dedicated AI Expertise',
        optionKey: 'dedicatedAiExpertise',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    questions: [
      {
        type: 'scale',
        field: 'dataInfrastructureReadiness',
        question: 'Q30. Data Infrastructure Readiness (1-5)',
      },
      {
        type: 'single',
        field: 'centralizedDataPlatform',
        question: 'Q31. Centralized Data Platform Usage',
        optionKey: 'centralizedDataPlatform',
      },
      {
        type: 'multi',
        field: 'dataSources',
        question: 'Q32. Data Sources Used for AI',
        optionKey: 'dataSources',
        otherFields: {
          other_specify: 'dataSourcesOther',
        },
      },
    ],
  },
  {
    id: 'customer',
    name: 'Customer AI',
    questions: [
      {
        type: 'single',
        field: 'customerFacingAi',
        question: 'Q33. Customer-Facing AI Usage',
        optionKey: 'customerFacingAi',
      },
      {
        type: 'multi',
        field: 'customerAiInteractions',
        question: 'Q34. Customer AI Interactions',
        optionKey: 'customerAiInteractions',
        otherFields: {
          other_specify: 'customerAiInteractionsOther',
        },
      },
      {
        type: 'single',
        field: 'customerAiDisclosure',
        question: "Q35. Customer Awareness of AI Interactions",
        optionKey: 'customerAiDisclosure',
      },
      {
        type: 'single',
        field: 'customerFeedback',
        question: 'Q36. Customer Feedback on AI',
        optionKey: 'customerFeedback',
      },
    ],
  },
  {
    id: 'future',
    name: 'Future Plans',
    questions: [
      {
        type: 'ranking',
        field: 'aiPriorities',
        question: "Q37. Top AI Priorities for the Next 12 Months",
        optionKey: 'aiPriorities',
      },
      {
        type: 'multi',
        field: 'greatestAiPotential',
        question: 'Q38. Greatest Potential for AI',
        optionKey: 'greatestAiPotential',
      },
      {
        type: 'single',
        field: 'increaseAiInvestment2026',
        question: 'Q39. Likelihood of Increasing AI Investment in 2026',
        optionKey: 'increaseAiInvestment2026',
      },
      {
        type: 'ranking',
        field: 'adoptionAccelerators',
        question: 'Q40. AI Adoption Accelerators',
        optionKey: 'adoptionAccelerators',
      },
    ],
  },
  {
    id: 'ethics',
    name: 'Ethics & Risk',
    questions: [
      {
        type: 'single',
        field: 'aiPolicy',
        question: 'Q41. Formal AI Policies',
        optionKey: 'aiPolicy',
      },
      {
        type: 'multi',
        field: 'ethicalConcerns',
        question: 'Q42. Ethical Concerns About AI',
        optionKey: 'ethicalConcerns',
        otherFields: {
          other_specify: 'ethicalConcernsOther',
        },
      },
      {
        type: 'scale',
        field: 'jobImpactConcern',
        question: "Q43. Concern About AI's Impact on Jobs (1-5)",
      },
      {
        type: 'single',
        field: 'aiForCompliance',
        question: 'Q44. AI for Compliance/Regulatory Monitoring',
        optionKey: 'aiForCompliance',
      },
    ],
  },
  {
    id: 'trends',
    name: 'Trends',
    questions: [
      {
        type: 'single',
        field: 'competitorComparison',
        question: "Q45. AI Adoption Compared to Competitors",
        optionKey: 'competitorComparison',
      },
      { type: 'textarea', field: 'excitingAiTrend', question: "Q46. Exciting AI Trends You're Watching" },
      { type: 'textarea', field: 'questionsToAnswer', question: 'Q47. Key Questions You Are Trying to Answer with AI' },
    ],
  },
  {
    id: 'satisfaction',
    name: 'Satisfaction',
    questions: [
      { type: 'scale', field: 'personalAiComfort', question: 'Q48. Personal Comfort with AI (1-5)' },
      { type: 'scale', field: 'toolSatisfaction', question: 'Q49. Satisfaction with AI Tools (1-5)' },
      { type: 'textarea', field: 'desiredAiCapabilities', question: 'Q50. Desired Capabilities for AI Tools' },
    ],
  },
  {
    id: 'closing',
    name: 'Closing Questions',
    questions: [
      { type: 'single', field: 'receiveReport', question: 'Q51. Receive 2025 Report?', optionKey: 'receiveReport' },
      { type: 'textarea', field: 'surveyFeedback', question: 'Q52. Feedback & Knowledge Gaps' },
      { type: 'single', field: 'agntmktFollowUp', question: 'Q53. Request AGNTMKT Follow-Up', optionKey: 'agntmktFollowUp' },
    ],
  },
];
