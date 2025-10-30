import { createClient } from '@supabase/supabase-js';
import { Responses } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate a unique session ID for tracking
export const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Transform frontend Responses to database schema
export const transformResponsesForDB = (responses: Responses, sessionId: string) => {
    return {
        session_id: sessionId,
        email: responses.email,
        company_name: responses.companyName,
        industry: responses.industry,
        industry_other: responses.industryOther || null,
        role: responses.role,
        role_other: responses.roleOther || null,
        unit_count: responses.unitCount,
        annual_revenue: responses.annualRevenue,
        personal_ai_usage: responses.personalAiUsage,
        org_ai_usage: responses.orgAiUsage,
        ai_adoption_date: responses.aiAdoptionDate,
        ai_usage_change: responses.aiUsageChange,
        ai_tools: responses.aiTools,
        ai_tools_industry_specific: responses.aiToolsIndustrySpecific || null,
        ai_tools_custom: responses.aiToolsCustom || null,
        ai_tools_other: responses.aiToolsOther || null,
        primary_ai_tool: responses.primaryAiTool || null,
        ai_use_cases: responses.aiUseCases,
        ai_use_cases_other: responses.aiUseCasesOther || null,
        corporate_ai_use: responses.corporateAiUse,
        corporate_ai_use_other: responses.corporateAiUseOther || null,
        top_departments_ai: responses.topDepartmentsAi,
        franchisee_ai_support: responses.franchiseeAiSupport,
        franchisee_support_methods: responses.franchiseeSupportMethods,
        franchisee_support_methods_other: responses.franchiseeSupportMethodsOther || null,
        franchisee_adoption_rate: responses.franchiseeAdoptionRate || null,
        franchisee_ai_learning: responses.franchiseeAiLearning,
        franchisee_ai_learning_other: responses.franchiseeAiLearningOther || null,
        annual_ai_budget: responses.annualAiBudget || null,
        ai_budget_change: responses.aiBudgetChange || null,
        ai_budget_source: responses.aiBudgetSource,
        ai_budget_source_other: responses.aiBudgetSourceOther || null,
        ai_investment_decision_maker: responses.aiInvestmentDecisionMaker || null,
        ai_investment_decision_maker_other: responses.aiInvestmentDecisionMakerOther || null,
        measured_roi: responses.measuredRoi || null,
        measured_improvements: responses.measuredImprovements,
        measured_improvements_other: responses.measuredImprovementsOther || null,
        time_savings: responses.timeSavings || null,
        cost_reduction: responses.costReduction || null,
        revenue_impact: responses.revenueImpact || null,
        challenges_ranked: responses.challengesRanked,
        challenges_other: responses.challengesOther || null,
        ai_knowledge_level: responses.aiKnowledgeLevel,
        dedicated_ai_expertise: responses.dedicatedAiExpertise,
        data_infrastructure_readiness: responses.dataInfrastructureReadiness || 0,
        centralized_data_platform: responses.centralizedDataPlatform,
        data_sources: responses.dataSources,
        data_sources_other: responses.dataSourcesOther || null,
        customer_facing_ai: responses.customerFacingAi,
        customer_ai_interactions: responses.customerAiInteractions,
        customer_ai_interactions_other: responses.customerAiInteractionsOther || null,
        customer_ai_disclosure: responses.customerAiDisclosure || null,
        customer_feedback: responses.customerFeedback || null,
        ai_priorities: responses.aiPriorities,
        ai_priorities_other: responses.aiPrioritiesOther || null,
        greatest_ai_potential: responses.greatestAiPotential,
        increase_ai_investment_2026: responses.increaseAiInvestment2026,
        adoption_accelerators: responses.adoptionAccelerators,
        adoption_accelerators_other: responses.adoptionAcceleratorsOther || null,
        ai_policy: responses.aiPolicy,
        ethical_concerns: responses.ethicalConcerns,
        ethical_concerns_other: responses.ethicalConcernsOther || null,
        job_impact_concern: responses.jobImpactConcern || 0,
        ai_for_compliance: responses.aiForCompliance || null,
        competitor_comparison: responses.competitorComparison,
        exciting_ai_trend: responses.excitingAiTrend,
        questions_to_answer: responses.questionsToAnswer || null,
        personal_ai_comfort: responses.personalAiComfort || 0,
        tool_satisfaction: responses.toolSatisfaction || 0,
        desired_ai_capabilities: responses.desiredAiCapabilities || null,
        receive_report: responses.receiveReport || null,
        allow_follow_up: responses.allowFollowUp || null,
        case_study_interest: responses.caseStudyInterest || null,
        final_comments: responses.finalComments || null,
        enter_drawing: responses.enterDrawing || null,
        is_completed: true,
        completed_at: new Date().toISOString(),
        progress_percentage: 100,
        current_section: 'completed',
        user_agent: navigator.userAgent,
    };
};

// Submit completed survey
export const submitSurveyResponse = async (responses: Responses, sessionId: string) => {
    try {
        const dbData = transformResponsesForDB(responses, sessionId);

        const { data, error } = await supabase
            .from('survey_responses')
            .insert([dbData])
            .select();

        if (error) {
            console.error('Error submitting survey:', error);
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Failed to submit survey:', error);
        return { success: false, error };
    }
};

// Auto-save progress (upsert based on session_id)
export const autoSaveProgress = async (
    responses: Responses,
    sessionId: string,
    currentSection: string,
    progressPercentage: number
) => {
    try {
        const dbData = transformResponsesForDB(responses, sessionId);

        const { data, error } = await supabase
            .from('survey_responses')
            .upsert([{
                ...dbData,
                is_completed: false,
                current_section: currentSection,
                progress_percentage: progressPercentage,
                completed_at: null,
            }], {
                onConflict: 'session_id'
            })
            .select();

        if (error) {
            console.error('Error auto-saving:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Failed to auto-save:', error);
        return { success: false, error };
    }
};

// Load existing session (if user wants to resume)
export const loadSession = async (sessionId: string) => {
    try {
        const { data, error } = await supabase
            .from('survey_responses')
            .select('*')
            .eq('session_id', sessionId)
            .single();

        if (error) {
            console.error('Error loading session:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Failed to load session:', error);
        return { success: false, error };
    }
};
