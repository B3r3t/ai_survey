import { createClient } from '@supabase/supabase-js';
import { Responses } from './types';
import { sanitizeResponses, cleanArray } from './lib/sanitize';
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
    startedAt?: string | null;
    timeSpentSeconds?: number | null;
    ipAddress?: string | null;
    referrerUrl?: string | null;
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
        data_infrastructure_readiness: sanitized.dataInfrastructureReadiness ?? null,
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
        job_impact_concern: sanitized.jobImpactConcern ?? null,
        ai_for_compliance: sanitized.aiForCompliance || null,
        competitor_comparison: sanitized.competitorComparison,
        exciting_ai_trend: sanitized.excitingAiTrend,
        personal_ai_comfort: sanitized.personalAiComfort ?? null,
        desired_ai_capabilities: sanitized.desiredAiCapabilities || null,
        receive_report: sanitized.receiveReport || null,
        survey_feedback: sanitized.surveyFeedback || null,
        agntmkt_followup: sanitized.agntmktFollowup || null,
        is_completed: metadata.isCompleted ?? false,
        completed_at: metadata.completedAt ?? null,
        progress_percentage: metadata.progressPercentage ?? 0,
        current_section: metadata.currentSection ?? 'demographics',
        user_agent: getUserAgent(metadata.userAgent),
        updated_at: new Date().toISOString(),
    };

    if (metadata.startedAt !== undefined) {
        dbPayload.started_at = metadata.startedAt;
    }

    if (metadata.timeSpentSeconds !== undefined) {
        dbPayload.time_spent_seconds = metadata.timeSpentSeconds;
    }

    if (metadata.ipAddress !== undefined) {
        dbPayload.ip_address = metadata.ipAddress;
    }

    if (metadata.referrerUrl !== undefined) {
        dbPayload.referrer_url = metadata.referrerUrl;
    }

    return dbPayload;
};

type DbPayload = ReturnType<typeof transformResponsesForDB>;

const upsertSurveyResponses = async (payload: DbPayload) => {
    return supabase
        .from('survey_responses')
        .upsert([payload], { onConflict: 'session_id' })
        .select();
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
        const dbData = transformResponsesForDB(responses, sessionId, {
            userAgent: getUserAgent(),
            isCompleted: false,
            currentSection,
            progressPercentage,
            completedAt: null,
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
    startedAt: string | null;
    completedAt: string | null;
    timeSpentSeconds: number | null;
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
            startedAt: (data.started_at as string) ?? null,
            completedAt: (data.completed_at as string) ?? null,
            timeSpentSeconds:
                data.time_spent_seconds !== undefined && data.time_spent_seconds !== null
                    ? Number(data.time_spent_seconds)
                    : null,
        };

        return { success: true, data: payload };
    } catch (error) {
        console.error('Failed to load session:', error);
        return { success: false, error };
    }
};
