import { Responses } from './types';
import {
  Option,
  INDUSTRY_OPTIONS,
  ROLE_OPTIONS,
  UNIT_COUNT_OPTIONS,
  ANNUAL_REVENUE_OPTIONS,
  PERSONAL_AI_USAGE_OPTIONS,
  ORG_AI_USAGE_OPTIONS,
  AI_USAGE_CHANGE_OPTIONS,
  AI_TOOL_OPTIONS,
  PRIMARY_AI_TOOL_OPTIONS,
  AI_USE_CASE_OPTIONS,
  CORPORATE_DEPARTMENT_ROWS,
  CORPORATE_PURPOSE_OPTIONS,
  FRANCHISEE_AI_SUPPORT_OPTIONS,
  FRANCHISEE_SUPPORT_METHOD_OPTIONS,
  FRANCHISEE_ADOPTION_RATE_OPTIONS,
  FRANCHISEE_AI_LEARNING_OPTIONS,
  ANNUAL_AI_BUDGET_OPTIONS,
  AI_BUDGET_CHANGE_OPTIONS,
  AI_INVESTMENT_DECISION_MAKER_OPTIONS,
  MEASURED_ROI_OPTIONS,
  MEASURED_IMPROVEMENTS_OPTIONS,
  CHALLENGES_OPTIONS,
  DEDICATED_AI_EXPERTISE_OPTIONS,
  CENTRALIZED_DATA_PLATFORM_OPTIONS,
  DATA_SOURCES_OPTIONS,
  CUSTOMER_FACING_AI_OPTIONS,
  CUSTOMER_AI_INTERACTIONS_OPTIONS,
  CUSTOMER_FEEDBACK_OPTIONS,
  GREATEST_AI_POTENTIAL_SINGLE_OPTIONS,
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
  aiUsageChange: buildOptionMap(AI_USAGE_CHANGE_OPTIONS),
  aiTools: buildOptionMap(AI_TOOL_OPTIONS),
  primaryAiTool: buildOptionMap(PRIMARY_AI_TOOL_OPTIONS),
  aiUseCases: buildOptionMap(AI_USE_CASE_OPTIONS),
  corporatePurposes: buildOptionMap(CORPORATE_PURPOSE_OPTIONS),
  franchiseeAiSupport: buildOptionMap(FRANCHISEE_AI_SUPPORT_OPTIONS),
  franchiseeSupportMethods: buildOptionMap(FRANCHISEE_SUPPORT_METHOD_OPTIONS),
  franchiseeAdoptionRate: buildOptionMap(FRANCHISEE_ADOPTION_RATE_OPTIONS),
  franchiseeAiLearning: buildOptionMap(FRANCHISEE_AI_LEARNING_OPTIONS),
  annualAiBudget: buildOptionMap(ANNUAL_AI_BUDGET_OPTIONS),
  aiBudgetChange: buildOptionMap(AI_BUDGET_CHANGE_OPTIONS),
  aiInvestmentDecisionMaker: buildOptionMap(AI_INVESTMENT_DECISION_MAKER_OPTIONS),
  measuredRoi: buildOptionMap(MEASURED_ROI_OPTIONS),
  measuredImprovements: buildOptionMap(MEASURED_IMPROVEMENTS_OPTIONS),
  challengesRanked: buildOptionMap(CHALLENGES_OPTIONS),
  dedicatedAiExpertise: buildOptionMap(DEDICATED_AI_EXPERTISE_OPTIONS),
  centralizedDataPlatform: buildOptionMap(CENTRALIZED_DATA_PLATFORM_OPTIONS),
  dataSources: buildOptionMap(DATA_SOURCES_OPTIONS),
  customerFacingAi: buildOptionMap(CUSTOMER_FACING_AI_OPTIONS),
  customerAiInteractions: buildOptionMap(CUSTOMER_AI_INTERACTIONS_OPTIONS),
  customerFeedback: buildOptionMap(CUSTOMER_FEEDBACK_OPTIONS),
  greatestAiPotential: buildOptionMap(GREATEST_AI_POTENTIAL_SINGLE_OPTIONS),
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

type MatrixQuestion = {
  type: 'matrix';
  field: keyof Responses;
  question: string;
  rowLabels: { id: string; label: string }[];
  optionKey: keyof typeof OPTION_LABELS;
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
  | MatrixQuestion
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

const formatMatrix = (responses: Responses, question: MatrixQuestion): string[] | string => {
  const matrix = responses[question.field] as Record<string, string[]> | undefined;
  if (!matrix || Object.keys(matrix).length === 0) {
    return 'Not answered';
  }

  const rowLabelMap = question.rowLabels.reduce<Record<string, string>>((acc, row) => {
    acc[row.id] = row.label;
    return acc;
  }, {});

  const rows = question.rowLabels.map((row) => {
    const selections = matrix[row.id];
    if (!selections || selections.length === 0) {
      return null;
    }

    const formattedSelections = selections.map(
      (value) => OPTION_LABELS[question.optionKey][value] ?? value,
    ).join(', ');

    return `${rowLabelMap[row.id] ?? row.id}: ${formattedSelections}`;
  }).filter((entry): entry is string => Boolean(entry));

  return rows.length > 0 ? rows : 'Not answered';
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
    case 'matrix':
      return formatMatrix(responses, question);
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
      { type: 'single', field: 'industry', question: 'Q3. What industry is your franchise brand in?', optionKey: 'industry', otherField: 'industryOther' },
      { type: 'single', field: 'role', question: 'Q4. What is your role/title?', optionKey: 'role', otherField: 'roleOther' },
      { type: 'single', field: 'unitCount', question: 'Q5. How many franchise units does your brand have?', optionKey: 'unitCount' },
      { type: 'single', field: 'annualRevenue', question: "Q6. What is your brand's annual system-wide revenue?", optionKey: 'annualRevenue' },
    ],
  },
  {
    id: 'usage',
    name: 'AI Usage & Frequency',
    questions: [
      { type: 'single', field: 'personalAiUsage', question: 'Q7. How often are you personally using AI tools?', optionKey: 'personalAiUsage' },
      { type: 'single', field: 'orgAiUsage', question: 'Q8. How often is your organization using AI tools?', optionKey: 'orgAiUsage' },
      { type: 'single', field: 'aiUsageChange', question: 'Q9. How has your AI usage changed in the past 12 months?', optionKey: 'aiUsageChange' },
    ],
  },
  {
    id: 'tools',
    name: 'AI Tools & Platforms',
    questions: [
      {
        type: 'multi',
        field: 'aiTools',
        question: 'Q10. Which AI tools or platforms is your organization currently using?',
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
        question: 'Q11. What is the primary AI model/platform your organization relies on most?',
        optionKey: 'primaryAiTool',
      },
      {
        type: 'multi',
        field: 'aiUseCases',
        question: 'Q12. For what purposes do you use AI tools?',
        optionKey: 'aiUseCases',
        otherFields: {
          other_specify: 'aiUseCasesOther',
        },
      },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate AI Implementation',
    questions: [
      {
        type: 'matrix',
        field: 'corporateAiMatrix',
        question: 'Q13. Which departments at your corporate office are using AI, and for what purposes?',
        rowLabels: CORPORATE_DEPARTMENT_ROWS,
        optionKey: 'corporatePurposes',
      },
    ],
  },
  {
    id: 'franchisee',
    name: 'Franchisee Support & Adoption',
    questions: [
      {
        type: 'single',
        field: 'franchiseeAiSupport',
        question: 'Q14. Are you currently using AI to support your franchisees?',
        optionKey: 'franchiseeAiSupport',
      },
      {
        type: 'multi',
        field: 'franchiseeSupportMethods',
        question: 'Q15. How are you supporting franchisees with AI?',
        optionKey: 'franchiseeSupportMethods',
        otherFields: {
          other_specify: 'franchiseeSupportMethodsOther',
        },
      },
      {
        type: 'single',
        field: 'franchiseeAdoptionRate',
        question: 'Q16. What percentage of your franchisees are actively using AI tools?',
        optionKey: 'franchiseeAdoptionRate',
      },
      {
        type: 'multi',
        field: 'franchiseeAiLearning',
        question: 'Q17. How do franchisees primarily learn about AI tools?',
        optionKey: 'franchiseeAiLearning',
        otherFields: {
          other_specify: 'franchiseeAiLearningOther',
        },
      },
    ],
  },
  {
    id: 'investment',
    name: 'Investment & Budget',
    questions: [
      { type: 'single', field: 'annualAiBudget', question: "Q18. What is your organization's annual AI investment/budget for 2025?", optionKey: 'annualAiBudget' },
      { type: 'single', field: 'aiBudgetChange', question: 'Q19. How has your AI budget changed from 2024 to 2025?', optionKey: 'aiBudgetChange' },
      {
        type: 'single',
        field: 'aiInvestmentDecisionMaker',
        question: 'Q20. Who has primary responsibility for AI investment decisions?',
        optionKey: 'aiInvestmentDecisionMaker',
      },
    ],
  },
  {
    id: 'roi',
    name: 'ROI & Impact Measurement',
    questions: [
      {
        type: 'single',
        field: 'measuredRoi',
        question: 'Q21. Have you measured ROI or business impact from AI implementation?',
        optionKey: 'measuredRoi',
      },
      {
        type: 'multi',
        field: 'measuredImprovements',
        question: 'Q22. What measurable improvements have you seen from AI adoption?',
        optionKey: 'measuredImprovements',
        otherFields: {
          other_specify: 'measuredImprovementsOther',
        },
      },
    ],
  },
  {
    id: 'challenges',
    name: 'Challenges & Barriers',
    questions: [
      {
        type: 'ranking',
        field: 'challengesRanked',
        question: 'Q23. What are the biggest challenges your organization faces with AI implementation? (Rank top 5)',
        optionKey: 'challengesRanked',
      },
      {
        type: 'single',
        field: 'dedicatedAiExpertise',
        question: 'Q24. Do you have dedicated AI expertise on your team?',
        optionKey: 'dedicatedAiExpertise',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data & Infrastructure',
    questions: [
      { type: 'scale', field: 'dataInfrastructureReadiness', question: "Q25. How would you rate your organization's data infrastructure readiness for AI? (1-5 scale)", max: 5 },
      {
        type: 'single',
        field: 'centralizedDataPlatform',
        question: 'Q26. Do you use a centralized data platform or data warehouse?',
        optionKey: 'centralizedDataPlatform',
      },
      {
        type: 'multi',
        field: 'dataSources',
        question: 'Q27. What data sources are you using for AI?',
        optionKey: 'dataSources',
        otherFields: {
          other_specify: 'dataSourcesOther',
        },
      },
    ],
  },
  {
    id: 'customer',
    name: 'Customer-Facing AI',
    questions: [
      {
        type: 'single',
        field: 'customerFacingAi',
        question: 'Q28. Do you use AI in customer-facing applications?',
        optionKey: 'customerFacingAi',
      },
      {
        type: 'multi',
        field: 'customerAiInteractions',
        question: 'Q29. How do customers interact with AI at your locations?',
        optionKey: 'customerAiInteractions',
        otherFields: {
          other_specify: 'customerAiInteractionsOther',
        },
      },
      {
        type: 'single',
        field: 'customerFeedback',
        question: 'Q30. Have you received feedback from customers about AI interactions?',
        optionKey: 'customerFeedback',
      },
    ],
  },
  {
    id: 'future',
    name: 'Future Plans & Opportunities',
    questions: [
      {
        type: 'single',
        field: 'greatestAiPotential',
        question: 'Q31. Where do you see the greatest potential for AI specifically at your brand?',
        optionKey: 'greatestAiPotential',
        otherField: 'greatestAiPotentialOther',
      },
      {
        type: 'single',
        field: 'increaseAiInvestment2026',
        question: 'Q32. How likely is your organization to increase AI investment in 2026?',
        optionKey: 'increaseAiInvestment2026',
      },
      {
        type: 'ranking',
        field: 'adoptionAccelerators',
        question: 'Q33. What would most accelerate AI adoption in your organization? (Rank top 3)',
        optionKey: 'adoptionAccelerators',
      },
    ],
  },
  {
    id: 'ethics',
    name: 'Ethics, Compliance & Risk',
    questions: [
      {
        type: 'single',
        field: 'aiPolicy',
        question: 'Q34. Does your organization have formal policies governing AI use?',
        optionKey: 'aiPolicy',
      },
      {
        type: 'multi',
        field: 'ethicalConcerns',
        question: 'Q35. What ethical considerations concern you about AI?',
        optionKey: 'ethicalConcerns',
        otherFields: {
          other_specify: 'ethicalConcernsOther',
        },
      },
      { type: 'scale', field: 'jobImpactConcern', question: "Q36. How concerned are you about AI's impact on jobs within your organization? (1-5 scale)", max: 5 },
      {
        type: 'single',
        field: 'aiForCompliance',
        question: 'Q37. Are you using AI for compliance or risk management?',
        optionKey: 'aiForCompliance',
      },
    ],
  },
  {
    id: 'trends',
    name: 'Industry Trends & Insights',
    questions: [
      {
        type: 'single',
        field: 'competitorComparison',
        question: "Q38. How would you describe your organization's approach to AI compared to competitors?",
        optionKey: 'competitorComparison',
      },
      {
        type: 'textarea',
        field: 'excitingAiTrend',
        question: 'Q39. What AI trend are you most excited or concerned about for franchising?',
      },
    ],
  },
  {
    id: 'satisfaction',
    name: 'Satisfaction & Comfort',
    questions: [
      { type: 'scale', field: 'personalAiComfort', question: 'Q40. How comfortable are you personally with using AI tools? (1-5 scale)', max: 5 },
      { type: 'textarea', field: 'desiredAiCapabilities', question: 'Q41. What AI capabilities are you most hoping to see developed for franchising?' },
    ],
  },
  {
    id: 'closing',
    name: 'Report & Follow-up',
    questions: [
      {
        type: 'single',
        field: 'receiveReport',
        question: 'Q42. Would you like to receive a complimentary copy of the 2025 AI in Franchising Report?',
        optionKey: 'receiveReport',
      },
      {
        type: 'textarea',
        field: 'surveyFeedback',
        question: "Q43. Is there anything about AI in franchising you'd like to know more about, or a topic we didn't ask about that we should have included?",
      },
      {
        type: 'single',
        field: 'agntmktFollowUp',
        question: 'Q44. AGNTMKT puts out this report every year completely free because we believe in franchising and the power of sharing ideas. If you\'re not sure where to start with AI, we\'d love an opportunity to meet with you and share our solutions - or check out our website at agntmkt.ai. Would you like us to follow up with you?',
        optionKey: 'agntmktFollowUp',
      },
    ],
  },
];

