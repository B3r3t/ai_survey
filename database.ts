import { supabase } from './supabaseClient';
import { Responses } from './types';

// Generate or retrieve session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('survey_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('survey_session_id', sessionId);
  }
  return sessionId;
};

// Map camelCase responses to snake_case database columns
const mapResponsesToDatabase = (responses: Responses, currentSection: string, progressPercentage: number) => {
  return {
    session_id: getSessionId(),
    current_section: currentSection,
    progress_percentage: progressPercentage,

    // Demographics (Section 1)
    email: responses.email || null,
    company_name: responses.companyName || null,
    industry: responses.industry || null,
    industry_other: responses.industryOther || null,
    role: responses.role || null,
    role_other: responses.roleOther || null,
    unit_count: responses.unitCount || null,
    annual_revenue: responses.annualRevenue || null,

    // Usage (Section 2)
    personal_ai_usage: responses.personalAiUsage || null,
    org_ai_usage: responses.orgAiUsage || null,
    ai_adoption_date: responses.aiAdoptionDate || null,
    ai_usage_change: responses.aiUsageChange || null,

    // Tools (Section 3)
    ai_tools: responses.aiTools || [],
    ai_tools_industry_specific: responses.aiToolsIndustrySpecific || null,
    ai_tools_custom: responses.aiToolsCustom || null,
    ai_tools_other: responses.aiToolsOther || null,
    primary_ai_tool: responses.primaryAiTool || null,
    ai_use_cases: responses.aiUseCases || [],
    ai_use_cases_other: responses.aiUseCasesOther || null,

    // Corporate (Section 4)
    corporate_ai_use: responses.corporateAiUse || [],
    corporate_ai_use_other: responses.corporateAiUseOther || null,
    top_departments_ai: responses.topDepartmentsAi || [],

    // Franchisee (Section 5)
    franchisee_ai_support: responses.franchiseeAiSupport || null,
    franchisee_support_methods: responses.franchiseeSupportMethods || [],
    franchisee_support_methods_other: responses.franchiseeSupportMethodsOther || null,
    franchisee_adoption_rate: responses.franchiseeAdoptionRate || null,
    franchisee_ai_learning: responses.franchiseeAiLearning || [],
    franchisee_ai_learning_other: responses.franchiseeAiLearningOther || null,

    // Investment (Section 6)
    annual_ai_budget: responses.annualAiBudget || null,
    ai_budget_change: responses.aiBudgetChange || null,
    ai_budget_source: responses.aiBudgetSource || [],
    ai_budget_source_other: responses.aiBudgetSourceOther || null,
    ai_investment_decision_maker: responses.aiInvestmentDecisionMaker || null,
    ai_investment_decision_maker_other: responses.aiInvestmentDecisionMakerOther || null,

    // ROI (Section 7)
    measured_roi: responses.measuredRoi || null,
    measured_improvements: responses.measuredImprovements || [],
    measured_improvements_other: responses.measuredImprovementsOther || null,
    time_savings: responses.timeSavings || null,
    cost_reduction: responses.costReduction || null,
    revenue_impact: responses.revenueImpact || null,

    // Challenges (Section 8)
    challenges_ranked: responses.challengesRanked || [],
    challenges_other: responses.challengesOther || null,
    ai_knowledge_level: responses.aiKnowledgeLevel || null,
    dedicated_ai_expertise: responses.dedicatedAiExpertise || null,

    // Data (Section 9)
    data_infrastructure_readiness: responses.dataInfrastructureReadiness || 3,
    centralized_data_platform: responses.centralizedDataPlatform || null,
    data_sources: responses.dataSources || [],
    data_sources_other: responses.dataSourcesOther || null,

    // Customer (Section 10)
    customer_facing_ai: responses.customerFacingAi || null,
    customer_ai_interactions: responses.customerAiInteractions || [],
    customer_ai_interactions_other: responses.customerAiInteractionsOther || null,
    customer_ai_disclosure: responses.customerAiDisclosure || null,
    customer_feedback: responses.customerFeedback || null,

    // Future (Section 11)
    ai_priorities: responses.aiPriorities || [],
    ai_priorities_other: responses.aiPrioritiesOther || null,
    greatest_ai_potential: responses.greatestAiPotential || [],
    increase_ai_investment_2026: responses.increaseAiInvestment2026 || null,
    adoption_accelerators: responses.adoptionAccelerators || [],
    adoption_accelerators_other: responses.adoptionAcceleratorsOther || null,

    // Ethics (Section 12)
    ai_policy: responses.aiPolicy || null,
    ethical_concerns: responses.ethicalConcerns || [],
    ethical_concerns_other: responses.ethicalConcernsOther || null,
    job_impact_concern: responses.jobImpactConcern || 3,
    ai_for_compliance: responses.aiForCompliance || null,

    // Trends (Section 13)
    competitor_comparison: responses.competitorComparison || null,
    exciting_ai_trend: responses.excitingAiTrend || null,
    questions_to_answer: responses.questionsToAnswer || null,

    // Satisfaction (Section 14)
    personal_ai_comfort: responses.personalAiComfort || 3,
    tool_satisfaction: responses.toolSatisfaction || 3,
    desired_ai_capabilities: responses.desiredAiCapabilities || null,

    // Review/Final (Section 15)
    receive_report: responses.receiveReport || null,
    allow_follow_up: responses.allowFollowUp || null,
    case_study_interest: responses.caseStudyInterest || null,
    final_comments: responses.finalComments || null,
    enter_drawing: responses.enterDrawing || null,
  };
};

// Auto-save survey progress
export const autoSaveSurvey = async (
  responses: Responses,
  currentSection: string,
  progressPercentage: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = mapResponsesToDatabase(responses, currentSection, progressPercentage);

    // Check if record exists for this session
    const { data: existing } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('session_id', getSessionId())
      .single();

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('survey_responses')
        .update(data)
        .eq('session_id', getSessionId());

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('survey_responses')
        .insert([data]);

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Auto-save error:', error);
    return { success: false, error: error.message };
  }
};

// Submit completed survey
export const submitSurvey = async (
  responses: Responses
): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = {
      ...mapResponsesToDatabase(responses, 'completed', 100),
      is_completed: true,
      completed_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('survey_responses')
      .update(data)
      .eq('session_id', getSessionId());

    if (error) throw error;

    // Clear session after successful submit
    sessionStorage.removeItem('survey_session_id');

    return { success: true };
  } catch (error: any) {
    console.error('Submit error:', error);
    return { success: false, error: error.message };
  }
};

// Load saved survey progress
export const loadSavedSurvey = async (): Promise<{ responses?: Responses; currentSection?: number; error?: string }> => {
  try {
    const sessionId = sessionStorage.getItem('survey_session_id');
    if (!sessionId) return {};

    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_completed', false)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    if (!data) return {};

    // Map database columns back to camelCase responses
    const responses: Partial<Responses> = {
      email: data.email || '',
      companyName: data.company_name || '',
      industry: data.industry || '',
      industryOther: data.industry_other || '',
      role: data.role || '',
      roleOther: data.role_other || '',
      unitCount: data.unit_count || '',
      annualRevenue: data.annual_revenue || '',

      personalAiUsage: data.personal_ai_usage || '',
      orgAiUsage: data.org_ai_usage || '',
      aiAdoptionDate: data.ai_adoption_date || '',
      aiUsageChange: data.ai_usage_change || '',

      aiTools: data.ai_tools || [],
      aiToolsIndustrySpecific: data.ai_tools_industry_specific || '',
      aiToolsCustom: data.ai_tools_custom || '',
      aiToolsOther: data.ai_tools_other || '',
      primaryAiTool: data.primary_ai_tool || '',
      aiUseCases: data.ai_use_cases || [],
      aiUseCasesOther: data.ai_use_cases_other || '',

      corporateAiUse: data.corporate_ai_use || [],
      corporateAiUseOther: data.corporate_ai_use_other || '',
      topDepartmentsAi: data.top_departments_ai || [],

      franchiseeAiSupport: data.franchisee_ai_support || '',
      franchiseeSupportMethods: data.franchisee_support_methods || [],
      franchiseeSupportMethodsOther: data.franchisee_support_methods_other || '',
      franchiseeAdoptionRate: data.franchisee_adoption_rate || '',
      franchiseeAiLearning: data.franchisee_ai_learning || [],
      franchiseeAiLearningOther: data.franchisee_ai_learning_other || '',

      annualAiBudget: data.annual_ai_budget || '',
      aiBudgetChange: data.ai_budget_change || '',
      aiBudgetSource: data.ai_budget_source || [],
      aiBudgetSourceOther: data.ai_budget_source_other || '',
      aiInvestmentDecisionMaker: data.ai_investment_decision_maker || '',
      aiInvestmentDecisionMakerOther: data.ai_investment_decision_maker_other || '',

      measuredRoi: data.measured_roi || '',
      measuredImprovements: data.measured_improvements || [],
      measuredImprovementsOther: data.measured_improvements_other || '',
      timeSavings: data.time_savings || '',
      costReduction: data.cost_reduction || '',
      revenueImpact: data.revenue_impact || '',

      challengesRanked: data.challenges_ranked || Array(5).fill(''),
      challengesOther: data.challenges_other || '',
      aiKnowledgeLevel: data.ai_knowledge_level || '',
      dedicatedAiExpertise: data.dedicated_ai_expertise || '',

      dataInfrastructureReadiness: data.data_infrastructure_readiness || 3,
      centralizedDataPlatform: data.centralized_data_platform || '',
      dataSources: data.data_sources || [],
      dataSourcesOther: data.data_sources_other || '',

      customerFacingAi: data.customer_facing_ai || '',
      customerAiInteractions: data.customer_ai_interactions || [],
      customerAiInteractionsOther: data.customer_ai_interactions_other || '',
      customerAiDisclosure: data.customer_ai_disclosure || '',
      customerFeedback: data.customer_feedback || '',

      aiPriorities: data.ai_priorities || Array(3).fill(''),
      aiPrioritiesOther: data.ai_priorities_other || '',
      greatestAiPotential: data.greatest_ai_potential || [],
      increaseAiInvestment2026: data.increase_ai_investment_2026 || '',
      adoptionAccelerators: data.adoption_accelerators || Array(3).fill(''),
      adoptionAcceleratorsOther: data.adoption_accelerators_other || '',

      aiPolicy: data.ai_policy || '',
      ethicalConcerns: data.ethical_concerns || [],
      ethicalConcernsOther: data.ethical_concerns_other || '',
      jobImpactConcern: data.job_impact_concern || 3,
      aiForCompliance: data.ai_for_compliance || '',

      competitorComparison: data.competitor_comparison || '',
      excitingAiTrend: data.exciting_ai_trend || '',
      questionsToAnswer: data.questions_to_answer || '',

      personalAiComfort: data.personal_ai_comfort || 3,
      toolSatisfaction: data.tool_satisfaction || 3,
      desiredAiCapabilities: data.desired_ai_capabilities || '',

      receiveReport: data.receive_report || 'yes_full',
      allowFollowUp: data.allow_follow_up || 'no',
      caseStudyInterest: data.case_study_interest || 'no',
      finalComments: data.final_comments || '',
      enterDrawing: data.enter_drawing || 'yes',
    };

    return {
      responses: responses as Responses,
      // Map section name to index if available
      currentSection: 0 // You could enhance this to map data.current_section to section index
    };
  } catch (error: any) {
    console.error('Load error:', error);
    return { error: error.message };
  }
};
