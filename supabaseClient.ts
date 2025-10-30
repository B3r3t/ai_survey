import { createClient } from '@supabase/supabase-js';
import { Responses } from './types';
import { sanitizeResponses } from './lib/sanitize';
import { INITIAL_RESPONSES } from './constants';

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
const toCamelCase = (value: string) =>
    value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

const mapDbRowToResponses = (row: Record<string, unknown>): Partial<Responses> => {
    const camelCased = Object.entries(row).reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[toCamelCase(key)] = value;
        return acc;
    }, {});

    const responses: Partial<Responses> = {};

    (Object.keys(INITIAL_RESPONSES) as (keyof Responses)[]).forEach((key) => {
        const value = camelCased[key as string];
        if (value !== undefined && value !== null) {
            responses[key] = value as Responses[keyof Responses];
        }
    });

    return sanitizeResponses(responses);
};

interface ResponseMetadata {
    userAgent?: string | null;
    isCompleted?: boolean;
    currentSection?: string;
    progressPercentage?: number;
    completedAt?: string | null;
}

const getUserAgent = (fallback?: string | null) => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return navigator.userAgent;
    }
    return fallback ?? null;
};

export const transformResponsesForDB = (
    responses: Responses,
    sessionId: string,
    metadata: ResponseMetadata = {}
) => {
    const sanitized = sanitizeResponses(responses);

    return {
        session_id: sessionId,
        email: sanitized.email,
        company_name: sanitized.companyName,
        industry: sanitized.industry,
        industry_other: sanitized.industryOther || null,
        role: sanitized.role,
        role_other: sanitized.roleOther || null,
        unit_count: sanitized.unitCount,
        annual_revenue: sanitized.annualRevenue,
        personal_ai_usage: sanitized.personalAiUsage,
        org_ai_usage: sanitized.orgAiUsage,
        ai_adoption_date: sanitized.aiAdoptionDate,
        ai_usage_change: sanitized.aiUsageChange,
        ai_tools: sanitized.aiTools,
        ai_tools_industry_specific: sanitized.aiToolsIndustrySpecific || null,
        ai_tools_custom: sanitized.aiToolsCustom || null,
        ai_tools_other: sanitized.aiToolsOther || null,
        primary_ai_tool: sanitized.primaryAiTool || null,
        ai_use_cases: sanitized.aiUseCases,
        ai_use_cases_other: sanitized.aiUseCasesOther || null,
        corporate_ai_use: sanitized.corporateAiUse,
        corporate_ai_use_other: sanitized.corporateAiUseOther || null,
        top_departments_ai: sanitized.topDepartmentsAi,
        franchisee_ai_support: sanitized.franchiseeAiSupport,
        franchisee_support_methods: sanitized.franchiseeSupportMethods,
        franchisee_support_methods_other: sanitized.franchiseeSupportMethodsOther || null,
        franchisee_adoption_rate: sanitized.franchiseeAdoptionRate || null,
        franchisee_ai_learning: sanitized.franchiseeAiLearning,
        franchisee_ai_learning_other: sanitized.franchiseeAiLearningOther || null,
        annual_ai_budget: sanitized.annualAiBudget || null,
        ai_budget_change: sanitized.aiBudgetChange || null,
        ai_budget_source: sanitized.aiBudgetSource,
        ai_budget_source_other: sanitized.aiBudgetSourceOther || null,
        ai_investment_decision_maker: sanitized.aiInvestmentDecisionMaker || null,
        ai_investment_decision_maker_other: sanitized.aiInvestmentDecisionMakerOther || null,
        measured_roi: sanitized.measuredRoi || null,
        measured_improvements: sanitized.measuredImprovements,
        measured_improvements_other: sanitized.measuredImprovementsOther || null,
        time_savings: sanitized.timeSavings || null,
        cost_reduction: sanitized.costReduction || null,
        revenue_impact: sanitized.revenueImpact || null,
        challenges_ranked: sanitized.challengesRanked,
        challenges_other: sanitized.challengesOther || null,
        ai_knowledge_level: sanitized.aiKnowledgeLevel,
        dedicated_ai_expertise: sanitized.dedicatedAiExpertise,
        data_infrastructure_readiness: sanitized.dataInfrastructureReadiness || 0,
        centralized_data_platform: sanitized.centralizedDataPlatform,
        data_sources: sanitized.dataSources,
        data_sources_other: sanitized.dataSourcesOther || null,
        customer_facing_ai: sanitized.customerFacingAi,
        customer_ai_interactions: sanitized.customerAiInteractions,
        customer_ai_interactions_other: sanitized.customerAiInteractionsOther || null,
        customer_ai_disclosure: sanitized.customerAiDisclosure || null,
        customer_feedback: sanitized.customerFeedback || null,
        ai_priorities: sanitized.aiPriorities,
        ai_priorities_other: sanitized.aiPrioritiesOther || null,
        greatest_ai_potential: sanitized.greatestAiPotential,
        increase_ai_investment_2026: sanitized.increaseAiInvestment2026,
        adoption_accelerators: sanitized.adoptionAccelerators,
        adoption_accelerators_other: sanitized.adoptionAcceleratorsOther || null,
        ai_policy: sanitized.aiPolicy,
        ethical_concerns: sanitized.ethicalConcerns,
        ethical_concerns_other: sanitized.ethicalConcernsOther || null,
        job_impact_concern: sanitized.jobImpactConcern || 0,
        ai_for_compliance: sanitized.aiForCompliance || null,
        competitor_comparison: sanitized.competitorComparison,
        exciting_ai_trend: sanitized.excitingAiTrend,
        questions_to_answer: sanitized.questionsToAnswer || null,
        personal_ai_comfort: sanitized.personalAiComfort || 0,
        tool_satisfaction: sanitized.toolSatisfaction || 0,
        desired_ai_capabilities: sanitized.desiredAiCapabilities || null,
        receive_report: sanitized.receiveReport || null,
        allow_follow_up: sanitized.allowFollowUp || null,
        case_study_interest: sanitized.caseStudyInterest || null,
        final_comments: sanitized.finalComments || null,
        enter_drawing: sanitized.enterDrawing || null,
        is_completed: metadata.isCompleted ?? false,
        completed_at: metadata.completedAt ?? null,
        progress_percentage: metadata.progressPercentage ?? 0,
        current_section: metadata.currentSection ?? 'demographics',
        user_agent: getUserAgent(metadata.userAgent),
        updated_at: new Date().toISOString(),
    };
};

// Submit completed survey
export const submitSurveyResponse = async (responses: Responses, sessionId: string) => {
    try {
        const dbData = transformResponsesForDB(responses, sessionId, {
            userAgent: getUserAgent(),
            isCompleted: true,
            currentSection: 'completed',
            progressPercentage: 100,
            completedAt: new Date().toISOString(),
        });

        const { data, error } = await supabase
            .from('survey_responses')
            .upsert([dbData], { onConflict: 'session_id' })
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
        const dbData = transformResponsesForDB(responses, sessionId, {
            userAgent: getUserAgent(),
            isCompleted: false,
            currentSection,
            progressPercentage,
            completedAt: null,
        });

        const { data, error } = await supabase
            .from('survey_responses')
            .upsert([dbData], {
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

export interface SessionLoadData {
    responses: Partial<Responses>;
    currentSection: string;
    progressPercentage: number;
    isCompleted: boolean;
    updatedAt: string | null;
}

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

        if (!data) {
            return { success: true, data: null };
        }

        const responses = mapDbRowToResponses(data);

        const payload: SessionLoadData = {
            responses,
            currentSection: (data.current_section as string) || 'demographics',
            progressPercentage: Number(data.progress_percentage ?? 0),
            isCompleted: Boolean(data.is_completed),
            updatedAt: (data.updated_at as string) ?? null,
        };

        return { success: true, data: payload };
    } catch (error) {
        console.error('Failed to load session:', error);
        return { success: false, error };
    }
};
