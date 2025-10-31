import { createClient } from '@supabase/supabase-js';
import { Responses } from './types';
import { sanitizeResponses, cleanArray } from './lib/sanitize';
import { INITIAL_RESPONSES } from './constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const surveyVersion = import.meta.env.VITE_SURVEY_VERSION ?? null;

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
    surveyVersion?: string | null;
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
): Record<string, unknown> => {
    const sanitized = sanitizeResponses(responses);

    const corporateMatrixEntries = Object.entries(sanitized.corporateAiMatrix ?? {}).reduce<Record<string, string[]>>((acc, [dept, selections]) => {
        if (Array.isArray(selections) && selections.length > 0) {
            acc[dept] = selections;
        }
        return acc;
    }, {});

    const dbPayload: Record<string, unknown> = {
        session_id: sessionId,
        survey_version: metadata.surveyVersion ?? surveyVersion ?? '2025',
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
        ai_usage_change: sanitized.aiUsageChange,
        ai_tools: cleanArray(sanitized.aiTools || []),
        ai_tools_industry_specific: sanitized.aiToolsIndustrySpecific || null,
        ai_tools_custom: sanitized.aiToolsCustom || null,
        ai_tools_other: sanitized.aiToolsOther || null,
        primary_ai_tool: sanitized.primaryAiTool || null,
        ai_use_cases: cleanArray(sanitized.aiUseCases || []),
        ai_use_cases_other: sanitized.aiUseCasesOther || null,
        corporate_ai_matrix: Object.keys(corporateMatrixEntries).length > 0 ? corporateMatrixEntries : null,
        franchisee_ai_support: sanitized.franchiseeAiSupport,
        franchisee_support_methods: cleanArray(sanitized.franchiseeSupportMethods || []),
        franchisee_support_methods_other: sanitized.franchiseeSupportMethodsOther || null,
        franchisee_adoption_rate: sanitized.franchiseeAdoptionRate || null,
        franchisee_ai_learning: cleanArray(sanitized.franchiseeAiLearning || []),
        franchisee_ai_learning_other: sanitized.franchiseeAiLearningOther || null,
        annual_ai_budget: sanitized.annualAiBudget || null,
        ai_budget_change: sanitized.aiBudgetChange || null,
        ai_investment_decision_maker: sanitized.aiInvestmentDecisionMaker || null,
        ai_investment_decision_maker_other: sanitized.aiInvestmentDecisionMakerOther || null,
        measured_roi: sanitized.measuredRoi || null,
        measured_improvements: cleanArray(sanitized.measuredImprovements || []),
        measured_improvements_other: sanitized.measuredImprovementsOther || null,
        challenges_ranked: cleanArray(sanitized.challengesRanked || []),
        challenges_other: sanitized.challengesOther || null,
        dedicated_ai_expertise: sanitized.dedicatedAiExpertise,
        data_infrastructure_readiness: sanitized.dataInfrastructureReadiness || 0,
        centralized_data_platform: sanitized.centralizedDataPlatform,
        data_sources: cleanArray(sanitized.dataSources || []),
        data_sources_other: sanitized.dataSourcesOther || null,
        customer_facing_ai: sanitized.customerFacingAi,
        customer_ai_interactions: cleanArray(sanitized.customerAiInteractions || []),
        customer_ai_interactions_other: sanitized.customerAiInteractionsOther || null,
        customer_feedback: sanitized.customerFeedback || null,
        greatest_ai_potential: sanitized.greatestAiPotential || null,
        greatest_ai_potential_other: sanitized.greatestAiPotentialOther || null,
        increase_ai_investment_2026: sanitized.increaseAiInvestment2026,
        adoption_accelerators: cleanArray(sanitized.adoptionAccelerators || []),
        adoption_accelerators_other: sanitized.adoptionAcceleratorsOther || null,
        ai_policy: sanitized.aiPolicy,
        ethical_concerns: cleanArray(sanitized.ethicalConcerns || []),
        ethical_concerns_other: sanitized.ethicalConcernsOther || null,
        job_impact_concern: sanitized.jobImpactConcern || 0,
        ai_for_compliance: sanitized.aiForCompliance || null,
        competitor_comparison: sanitized.competitorComparison,
        exciting_ai_trend: sanitized.excitingAiTrend,
        personal_ai_comfort: sanitized.personalAiComfort || 0,
        desired_ai_capabilities: sanitized.desiredAiCapabilities || null,
        receive_report: sanitized.receiveReport || null,
        survey_feedback: sanitized.surveyFeedback || null,
        agntmkt_follow_up: sanitized.agntmktFollowUp || null,
        is_completed: metadata.isCompleted ?? false,
        completed_at: metadata.completedAt ?? null,
        progress_percentage: metadata.progressPercentage ?? 0,
        current_section: metadata.currentSection ?? 'demographics',
        user_agent: getUserAgent(metadata.userAgent),
        updated_at: new Date().toISOString(),
    };
    return dbPayload;
};

type DbPayload = ReturnType<typeof transformResponsesForDB>;

const upsertSurveyResponses = async (payload: DbPayload) => {
    const baseResult = await supabase
        .from('survey_responses')
        .upsert([payload], { onConflict: 'session_id' })
        .select();

    if (baseResult.error?.code === '42703' && 'survey_version' in payload) {
        console.warn(
            'Supabase survey_responses table is missing survey_version column. Retrying without it.'
        );
        const { survey_version: _surveyVersion, ...fallbackPayload } = payload;
        return supabase
            .from('survey_responses')
            .upsert([fallbackPayload as Record<string, unknown>], { onConflict: 'session_id' })
            .select();
    }

    return baseResult;
};

// Submit completed survey
export const submitSurveyResponse = async (responses: Responses, sessionId: string) => {
    try {
        const sanitizedResponses = sanitizeResponses(responses);
        const mergedResponses = { ...INITIAL_RESPONSES, ...sanitizedResponses } as Responses;

        const dbData = transformResponsesForDB(mergedResponses, sessionId, {
            userAgent: getUserAgent(),
            isCompleted: true,
            currentSection: 'completed',
            progressPercentage: 100,
            completedAt: new Date().toISOString(),
            surveyVersion,
        });

        const { data, error } = await upsertSurveyResponses(dbData);

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
        const sanitizedResponses = sanitizeResponses(responses);
        const mergedResponses = { ...INITIAL_RESPONSES, ...sanitizedResponses } as Responses;

        const dbData = transformResponsesForDB(mergedResponses, sessionId, {
            userAgent: getUserAgent(),
            isCompleted: false,
            currentSection,
            progressPercentage,
            completedAt: null,
            surveyVersion,
        });

        const { data, error } = await upsertSurveyResponses(dbData);

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
