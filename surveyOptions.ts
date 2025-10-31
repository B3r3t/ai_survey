export interface Option {
  value: string;
  label: string;
  isExclusive?: boolean;
}

export const INDUSTRY_OPTIONS: Option[] = [
  { value: 'qsr', label: 'Food & Beverage - Quick Service Restaurant (QSR)' },
  { value: 'fast_casual', label: 'Food & Beverage - Fast Casual' },
  { value: 'full_service_restaurant', label: 'Food & Beverage - Full Service Restaurant' },
  { value: 'coffee_cafe', label: 'Food & Beverage - Coffee/Cafe' },
  { value: 'food_other', label: 'Food & Beverage - Other' },
  { value: 'health_fitness', label: 'Health & Fitness' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'home_services', label: 'Home Services' },
  { value: 'business_services', label: 'Business Services' },
  { value: 'education', label: 'Education & Tutoring' },
  { value: 'senior_care', label: 'Senior Care' },
  { value: 'child_care', label: 'Child Care' },
  { value: 'pet_services', label: 'Pet Services' },
  { value: 'retail', label: 'Retail' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality/Lodging' },
];

export const ROLE_OPTIONS: Option[] = [
  { value: 'ceo', label: 'CEO/President' },
  { value: 'coo', label: 'COO/VP of Operations' },
  { value: 'cfo', label: 'CFO/VP of Finance' },
  { value: 'cmo', label: 'CMO/VP of Marketing' },
  { value: 'cto', label: 'CTO/VP of Technology/IT' },
  { value: 'franchise_dev', label: 'Director of Franchise Development' },
  { value: 'ops_director', label: 'Director of Operations' },
  { value: 'marketing_director', label: 'Director of Marketing' },
  { value: 'franchise_support', label: 'Franchise Support Manager' },
  { value: 'tech_manager', label: 'Technology Manager' },
];

export const UNIT_COUNT_OPTIONS: Option[] = [
  { value: '1-10', label: '1-10 units' },
  { value: '11-25', label: '11-25 units' },
  { value: '26-50', label: '26-50 units' },
  { value: '51-100', label: '51-100 units' },
  { value: '101-250', label: '101-250 units' },
  { value: '251-500', label: '251-500 units' },
  { value: '501-1000', label: '501-1,000 units' },
  { value: '1000+', label: '1,000+ units' },
];

export const ANNUAL_REVENUE_OPTIONS: Option[] = [
  { value: '<5m', label: 'Under $5 million' },
  { value: '5-25m', label: '$5-$25 million' },
  { value: '25-50m', label: '$25-$50 million' },
  { value: '50-100m', label: '$50-$100 million' },
  { value: '100-500m', label: '$100-$500 million' },
  { value: '500m-1b', label: '$500 million - $1 billion' },
  { value: '>1b', label: 'Over $1 billion' },
  { value: 'prefer_not_to_answer', label: 'Prefer not to answer' },
];

export const PERSONAL_AI_USAGE_OPTIONS: Option[] = [
  { value: 'multiple_daily', label: 'Multiple times per day' },
  { value: 'daily', label: 'Once per day' },
  { value: 'weekly', label: 'Several times per week' },
  { value: 'biweekly', label: 'Once per week' },
  { value: 'monthly', label: 'A few times per month' },
  { value: 'rarely', label: 'Rarely (less than monthly)' },
  { value: 'never', label: 'Never' },
];

export const ORG_AI_USAGE_OPTIONS: Option[] = [
  { value: 'daily', label: 'Daily - integrated into regular workflows' },
  { value: 'weekly', label: 'Weekly - regular but not daily use' },
  { value: 'monthly', label: 'Monthly - occasional use' },
  { value: 'quarterly', label: 'Quarterly - very limited use' },
  { value: 'not_using', label: 'Not currently using AI' },
  { value: 'dont_know', label: "Don't know" },
];

export const AI_ADOPTION_DATE_OPTIONS: Option[] = [
  { value: '<2020', label: 'Before 2020' },
  { value: '2020-2021', label: '2020-2021' },
  { value: '2022', label: '2022' },
  { value: '2023', label: '2023' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: 'not_started', label: "Haven't started yet" },
  { value: 'dont_know', label: "Don't know" },
];

export const AI_USAGE_CHANGE_OPTIONS: Option[] = [
  { value: 'increased_sig', label: 'Increased significantly' },
  { value: 'increased_mod', label: 'Increased moderately' },
  { value: 'same', label: 'Stayed about the same' },
  { value: 'decreased', label: 'Decreased' },
  { value: 'just_started', label: 'We just started using AI in the past year' },
  { value: 'n/a', label: 'Not applicable - not using AI' },
];

export const AI_TOOL_OPTIONS: Option[] = [
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'gemini', label: 'Gemini / Bard (Google)' },
  { value: 'copilot', label: 'Microsoft Copilot' },
  { value: 'perplexity', label: 'Perplexity' },
  { value: 'grok', label: 'Grok (xAI)' },
  { value: 'meta', label: 'Meta AI / Llama' },
  { value: 'jasper', label: 'Jasper' },
  { value: 'copyai', label: 'Copy.ai' },
  { value: 'notion', label: 'Notion AI' },
  { value: 'canva', label: 'Canva AI' },
  { value: 'midjourney', label: 'Midjourney' },
  { value: 'dalle', label: 'DALL-E / ChatGPT Image Generation' },
  { value: 'firefly', label: 'Adobe Firefly' },
  { value: 'grammarly', label: 'Grammarly (AI features)' },
  { value: 'hubspot', label: 'HubSpot AI tools' },
  { value: 'salesforce', label: 'Salesforce Einstein' },
  { value: 'industry-specific_specify', label: 'Industry-specific AI platform (please specify)' },
  { value: 'custom_specify', label: 'Custom/proprietary AI solution' },
  { value: 'other_specify', label: 'Other (please specify)' },
  { value: 'not_using_ai', label: 'Not currently using AI tools', isExclusive: true },
];

export const PRIMARY_AI_TOOL_OPTIONS: Option[] = [
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'gemini', label: 'Gemini / Bard (Google)' },
  { value: 'copilot', label: 'Microsoft Copilot' },
  { value: 'perplexity', label: 'Perplexity' },
  { value: 'grok', label: 'Grok (xAI)' },
  { value: 'meta', label: 'Meta AI / Llama' },
];

export const AI_USE_CASE_OPTIONS: Option[] = [
  { value: 'marketing_copy', label: 'Content & Marketing: Writing marketing copy' },
  { value: 'social_media', label: 'Content & Marketing: Social media content creation' },
  { value: 'email_campaigns', label: 'Content & Marketing: Email campaigns' },
  { value: 'data_analysis', label: 'Operations & Analysis: Data analysis / reporting' },
  { value: 'process_automation', label: 'Operations & Analysis: Process automation' },
  { value: 'customer_chatbots', label: 'Customer Service: Customer service chatbots' },
  { value: 'employee_training', label: 'Training & Development: Employee training content' },
  { value: 'financial_modeling', label: 'Finance & Legal: Financial modeling' },
  { value: 'code_generation', label: 'Technology & Development: Code generation / debugging' },
  { value: 'recruitment', label: 'Other: Recruitment / HR' },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const CORPORATE_AI_USE_OPTIONS: Option[] = [
  { value: 'marketing', label: 'Marketing & brand management' },
  { value: 'content_creation', label: 'Content creation' },
  { value: 'franchise_dev', label: 'Franchise development / sales' },
  { value: 'ops_optimization', label: 'Operations optimization' },
  { value: 'training', label: 'Training & education' },
  { value: 'data_analysis', label: 'Data analysis & reporting' },
  { value: 'customer_service', label: 'Customer service support' },
  { value: 'finance', label: 'Financial planning & analysis' },
  { value: 'tech_dev', label: 'Technology development' },
  { value: 'hr', label: 'Human resources / recruitment' },
  { value: 'legal', label: 'Legal & compliance' },
  { value: 'supply_chain', label: 'Supply chain management' },
  { value: 'real_estate', label: 'Real estate / site selection' },
  { value: 'not_using_corp', label: 'Not using AI at corporate level', isExclusive: true },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const TOP_DEPARTMENTS_AI_OPTIONS: Option[] = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
  { value: 'tech_it', label: 'Technology/IT' },
  { value: 'finance', label: 'Finance' },
  { value: 'franchise_dev', label: 'Franchise Development' },
  { value: 'training', label: 'Training & Education' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'executive', label: 'Executive Leadership' },
  { value: 'product_dev', label: 'Product Development' },
  { value: 'other', label: 'Other' },
];

export const FRANCHISEE_AI_SUPPORT_OPTIONS: Option[] = [
  { value: 'yes_extensively', label: 'Yes, extensively' },
  { value: 'yes_moderately', label: 'Yes, moderately' },
  { value: 'yes_in_limited_ways', label: 'Yes, in limited ways' },
  { value: 'no_plan_6mo', label: 'No, but planning to within 6 months' },
  { value: 'no_plan_12mo', label: 'No, but planning to within 12 months' },
  { value: 'no_plans', label: 'No, and no current plans' },
  { value: 'dont_know', label: "Don't know" },
];

export const FRANCHISEE_SUPPORT_METHOD_OPTIONS: Option[] = [
  { value: 'provide_tools', label: 'Providing access to AI tools' },
  { value: 'provide_content', label: 'Creating AI-generated marketing content' },
  { value: 'training', label: 'Training on AI usage' },
  { value: 'insights', label: 'AI-powered operational insights' },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const FRANCHISEE_ADOPTION_RATE_OPTIONS: Option[] = [
  { value: '0', label: '0% - None' },
  { value: '1-10', label: '1-10%' },
  { value: '11-25', label: '11-25%' },
  { value: '26-50', label: '26-50%' },
  { value: '51-75', label: '51-75%' },
  { value: '76-90', label: '76-90%' },
  { value: '91-100', label: '91-100%' },
  { value: 'dont_know', label: "Don't know" },
];

export const FRANCHISEE_AI_LEARNING_OPTIONS: Option[] = [
  { value: 'corp_training', label: 'Corporate training programs' },
  { value: 'conferences', label: 'Franchisee conferences / conventions' },
  { value: 'peer', label: 'Peer franchisee recommendations' },
  { value: 'independent', label: 'Independent exploration' },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const ANNUAL_AI_BUDGET_OPTIONS: Option[] = [
  { value: '0', label: '$0 (using only free tools)' },
  { value: '1-5k', label: '$1 - $5,000' },
  { value: '5-25k', label: '$5,001 - $25,000' },
  { value: '25-50k', label: '$25,001 - $50,000' },
  { value: '50-100k', label: '$50,001 - $100,000' },
  { value: '100-250k', label: '$100,001 - $250,000' },
  { value: '250-500k', label: '$250,001 - $500,000' },
  { value: '500-1m', label: '$500,001 - $1,000,000' },
  { value: '>1m', label: 'Over $1,000,000' },
  { value: 'dont_know', label: "Don't know" },
  { value: 'prefer_not_to_answer', label: 'Prefer not to answer' },
];

export const AI_BUDGET_CHANGE_OPTIONS: Option[] = [
  { value: 'increase_50+', label: 'Increased by 50%+' },
  { value: 'increase_25-50', label: 'Increased by 25-50%' },
  { value: 'increase_10-25', label: 'Increased by 10-25%' },
  { value: 'increase_1-10', label: 'Increased by 1-10%' },
  { value: 'same', label: 'Stayed about the same' },
  { value: 'decreased', label: 'Decreased' },
  { value: 'no_budget_2024', label: "We didn't have an AI budget in 2024" },
  { value: 'dont_know', label: "Don't know" },
];

export const AI_BUDGET_SOURCE_OPTIONS: Option[] = [
  { value: 'tech_it', label: 'Technology/IT budget' },
  { value: 'marketing', label: 'Marketing budget' },
  { value: 'operations', label: 'Operations budget' },
  { value: 'innovation', label: 'Innovation/R&D budget' },
  { value: 'dedicated_ai', label: 'Dedicated AI budget line item' },
  { value: 'individual_dept', label: 'Individual department budgets' },
  { value: 'no_formal', label: 'No formal budget allocation' },
  { value: 'dont_know', label: "Don't know" },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const AI_INVESTMENT_DECISION_MAKER_OPTIONS: Option[] = [
  { value: 'ceo', label: 'CEO/President' },
  { value: 'cto', label: 'CTO/VP Technology' },
  { value: 'coo', label: 'COO/VP Operations' },
  { value: 'cmo', label: 'CMO/VP Marketing' },
  { value: 'cfo', label: 'CFO/VP Finance' },
  { value: 'committee', label: 'Cross-functional committee' },
  { value: 'dept_heads', label: 'Individual department heads' },
  { value: 'dont_know', label: "Don't know" },
];

export const MEASURED_ROI_OPTIONS: Option[] = [
  { value: 'yes_sig_pos', label: "Yes, we've measured significant positive ROI" },
  { value: 'yes_mod_pos', label: "Yes, we've measured moderate positive ROI" },
  { value: 'yes_min', label: 'Yes, but ROI has been minimal so far' },
  { value: 'no_plan_to', label: 'No, but we plan to measure it' },
  { value: 'no_plans', label: 'No, and no plans to measure it' },
  { value: 'too_early', label: 'Too early to measure' },
  { value: 'n/a', label: 'Not applicable - not using AI' },
];

export const MEASURED_IMPROVEMENTS_OPTIONS: Option[] = [
  { value: 'time_savings', label: 'Time savings / efficiency gains' },
  { value: 'cost_reduction', label: 'Cost reduction' },
  { value: 'revenue_increase', label: 'Revenue increase' },
  { value: 'customer_satisfaction', label: 'Improved customer satisfaction scores' },
  { value: 'no_improvements', label: 'No measurable improvements yet', isExclusive: true },
  { value: 'havent_measured', label: "Haven't measured", isExclusive: true },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const TIME_SAVINGS_OPTIONS: Option[] = [
  { value: 'n/a', label: "Not applicable / Haven't measured" },
  { value: 'no_imp', label: 'No improvement' },
  { value: '1-10', label: '1-10% improvement' },
  { value: '11-25', label: '11-25% improvement' },
  { value: '26-50', label: '26-50% improvement' },
  { value: '51-75', label: '51-75% improvement' },
  { value: '>75', label: 'Over 75% improvement' },
];

export const COST_REDUCTION_OPTIONS: Option[] = [
  { value: 'n/a', label: "Not applicable / Haven't measured" },
  { value: 'no_red', label: 'No reduction' },
  { value: '1-10', label: '1-10% reduction' },
  { value: '11-25', label: '11-25% reduction' },
  { value: '26-50', label: '26-50% reduction' },
  { value: '>50', label: 'Over 50% reduction' },
];

export const REVENUE_IMPACT_OPTIONS: Option[] = [
  { value: 'n/a', label: "Not applicable / Haven't measured" },
  { value: 'no_imp', label: 'No impact' },
  { value: '1-5', label: '1-5% increase' },
  { value: '6-10', label: '6-10% increase' },
  { value: '11-20', label: '11-20% increase' },
  { value: '>20', label: 'Over 20% increase' },
];

export const CHALLENGES_OPTIONS: Option[] = [
  { value: 'privacy', label: 'Data privacy and security concerns' },
  { value: 'knowledge', label: 'Lack of understanding / knowledge' },
  { value: 'training', label: 'Insufficient training' },
  { value: 'cost', label: 'High implementation costs' },
  { value: 'integration', label: 'Integration with existing systems' },
  { value: 'consistency', label: 'Lack of consistency across franchise locations' },
  { value: 'franchisee_resistance', label: 'Resistance from franchisees' },
  { value: 'staff_resistance', label: 'Resistance from staff' },
  { value: 'too_many_tools', label: 'Overwhelming number of AI tool options' },
  { value: 'measuring_roi', label: 'Difficulty measuring ROI' },
  { value: 'job_displacement', label: 'Concerns about job displacement' },
  { value: 'data_quality', label: 'Data quality / availability issues' },
  { value: 'no_challenges', label: 'No significant challenges' },
];

export const AI_KNOWLEDGE_LEVEL_OPTIONS: Option[] = [
  { value: 'expert', label: 'Expert - We have deep AI expertise internally' },
  { value: 'advanced', label: 'Advanced - Strong understanding and active implementation' },
  { value: 'intermediate', label: 'Intermediate - Good understanding, early implementation' },
  { value: 'beginner', label: 'Beginner - Learning but limited implementation' },
  { value: 'novice', label: 'Novice - Just starting to explore AI' },
  { value: 'no_knowledge', label: 'No knowledge - Not yet engaged with AI' },
];

export const DEDICATED_AI_EXPERTISE_OPTIONS: Option[] = [
  { value: 'yes_full_time', label: 'Yes, full-time dedicated AI specialist(s)' },
  { value: 'yes_tech_team', label: 'Yes, technology team members with AI expertise' },
  { value: 'no_consultants', label: 'No, but we use external consultants' },
  { value: 'no_self_teaching', label: "No, but we're self-teaching" },
  { value: 'no_plans', label: "No, and we don't have plans to add expertise" },
  { value: 'dont_know', label: "Don't know" },
];

export const CENTRALIZED_DATA_PLATFORM_OPTIONS: Option[] = [
  { value: 'yes_implemented', label: 'Yes, fully implemented and operational' },
  { value: 'yes_implementing', label: 'Yes, currently being implemented' },
  { value: 'no_planning', label: 'No, but planning to implement within 12 months' },
  { value: 'no_plans', label: 'No, and no current plans' },
  { value: 'dont_know', label: "Don't know" },
];

export const DATA_SOURCES_OPTIONS: Option[] = [
  { value: 'pos', label: 'POS (Point of Sale) data' },
  { value: 'crm', label: 'Customer relationship management (CRM)' },
  { value: 'marketing_automation', label: 'Marketing automation platforms' },
  { value: 'financial', label: 'Financial systems' },
  { value: 'inventory', label: 'Inventory management systems' },
  { value: 'hris', label: 'Employee data / HRIS' },
  { value: 'analytics', label: 'Website / app analytics' },
  { value: 'social_media', label: 'Social media data' },
  { value: 'feedback', label: 'Customer feedback / surveys' },
  { value: 'third_party', label: 'Third-party market data' },
  { value: 'operational', label: 'Operational systems' },
  { value: 'supply_chain', label: 'Supply chain data' },
  { value: 'not_using', label: 'Not using data for AI', isExclusive: true },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const CUSTOMER_FACING_AI_OPTIONS: Option[] = [
  { value: 'yes_extensively', label: 'Yes, extensively' },
  { value: 'yes_moderately', label: 'Yes, moderately' },
  { value: 'yes_in_limited_ways', label: 'Yes, in limited ways' },
  { value: 'no_planning', label: 'No, but planning to' },
  { value: 'no_plans', label: 'No, and no plans to' },
  { value: 'dont_know', label: "Don't know" },
];

export const CUSTOMER_AI_INTERACTIONS_OPTIONS: Option[] = [
  { value: 'website_chatbot', label: 'Chatbots on website' },
  { value: 'app_chatbot', label: 'Chatbots in mobile app' },
  { value: 'voice_ordering', label: 'AI-powered voice ordering' },
  { value: 'phone_answering', label: 'AI phone answering systems' },
  { value: 'recommendations', label: 'Personalized recommendations' },
  { value: 'email_responses', label: 'AI-generated email responses' },
  { value: 'kiosks', label: 'Self-service kiosks with AI' },
  { value: 'virtual_assistants', label: 'Virtual assistants' },
  { value: 'predictive_text', label: 'Predictive text / search' },
  { value: 'no_customer_facing', label: "We don't have customer-facing AI", isExclusive: true },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const CUSTOMER_AI_DISCLOSURE_OPTIONS: Option[] = [
  { value: 'always', label: 'Always clearly disclosed' },
  { value: 'sometimes', label: 'Sometimes disclosed' },
  { value: 'rarely', label: 'Rarely disclosed' },
  { value: 'never', label: 'Never disclosed' },
  { value: 'n/a', label: 'Not applicable' },
  { value: 'dont_know', label: "Don't know" },
];

export const CUSTOMER_FEEDBACK_OPTIONS: Option[] = [
  { value: 'positive', label: 'Yes, mostly positive' },
  { value: 'mixed', label: 'Yes, mixed feedback' },
  { value: 'negative', label: 'Yes, mostly negative' },
  { value: 'no_feedback', label: "No, haven't received specific feedback" },
  { value: 'not_tracked', label: "We don't track this" },
  { value: 'n/a', label: 'Not applicable' },
];

export const AI_PRIORITIES_OPTIONS: Option[] = [
  { value: 'ops_efficiency', label: 'Operational efficiency / cost reduction' },
  { value: 'customer_experience', label: 'Customer experience enhancement' },
  { value: 'marketing_automation', label: 'Marketing personalization & automation' },
  { value: 'data_analysis', label: 'Data analysis & business intelligence' },
  { value: 'franchisee_support', label: 'Franchisee training & support' },
  { value: 'no_priorities', label: 'No specific AI priorities' },
];

export const GREATEST_AI_POTENTIAL_OPTIONS: Option[] = [
  { value: 'ops_efficiency', label: 'Operational efficiency / cost reduction' },
  { value: 'customer_experience', label: 'Customer experience enhancement' },
  { value: 'marketing_automation', label: 'Marketing personalization & automation' },
  { value: 'data_analysis', label: 'Data analysis & business intelligence' },
  { value: 'franchisee_support', label: 'Franchisee training & support' },
  { value: 'site_selection', label: 'Site selection / territory planning' },
  { value: 'dynamic_pricing', label: 'Dynamic pricing' },
  { value: 'voice_ai', label: 'Voice AI / conversational interfaces' },
];

export const INCREASE_AI_INVESTMENT_OPTIONS: Option[] = [
  { value: 'very_likely', label: 'Very likely - planning significant increase' },
  { value: 'somewhat_likely', label: 'Somewhat likely - planning moderate increase' },
  { value: 'neutral', label: 'Neutral - may stay the same or increase slightly' },
  { value: 'unlikely', label: 'Unlikely - will probably maintain current level' },
  { value: 'very_unlikely', label: 'Very unlikely - may decrease investment' },
  { value: 'dont_know', label: "Don't know" },
];

export const ADOPTION_ACCELERATORS_OPTIONS: Option[] = [
  { value: 'lower_cost', label: 'Lower costs / better ROI' },
  { value: 'better_training', label: 'Better training / education' },
  { value: 'more_proof', label: 'More proof of effectiveness' },
  { value: 'easier_integration', label: 'Easier integration with existing systems' },
  { value: 'reduced_privacy_risk', label: 'Reduced data privacy / security concerns' },
  { value: 'industry_solutions', label: 'Industry-specific AI solutions' },
  { value: 'buy_in_franchisees', label: 'Buy-in from franchisees' },
  { value: 'buy_in_leadership', label: 'Buy-in from leadership' },
];

export const AI_POLICY_OPTIONS: Option[] = [
  { value: 'yes_comprehensive', label: 'Yes, comprehensive policies in place' },
  { value: 'yes_basic', label: 'Yes, basic policies in place' },
  { value: 'in_development', label: 'In development' },
  { value: 'no_planning', label: 'No, but planning to develop' },
  { value: 'no_plans', label: 'No, and no plans to develop' },
  { value: 'dont_know', label: "Don't know" },
];

export const ETHICAL_CONCERNS_OPTIONS: Option[] = [
  { value: 'bias', label: 'Bias in AI decision-making' },
  { value: 'privacy', label: 'Data privacy violations' },
  { value: 'job_displacement', label: 'Job displacement' },
  { value: 'transparency', label: 'Lack of transparency (black box problem)' },
  { value: 'over_reliance', label: 'Over-reliance on AI' },
  { value: 'misinformation', label: 'Misinformation / "hallucinations"' },
  { value: 'no_concerns', label: 'No significant concerns', isExclusive: true },
  { value: 'other_specify', label: 'Other (please specify)' },
];

export const AI_FOR_COMPLIANCE_OPTIONS: Option[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no_planning', label: 'No, but planning to' },
  { value: 'no_plans', label: 'No, and no current plans' },
  { value: 'dont_know', label: "Don't know" },
];

export const COMPETITOR_COMPARISON_OPTIONS: Option[] = [
  { value: 'ahead', label: 'Ahead of the curve' },
  { value: 'on_par', label: 'On par with competitors' },
  { value: 'behind', label: 'Behind the curve' },
  { value: 'dont_know', label: "Don't know" },
];

export const RECEIVE_REPORT_OPTIONS: Option[] = [
  { value: 'yes_full', label: 'Yes, send me the full report' },
  { value: 'yes_summary', label: 'Yes, send me the executive summary' },
  { value: 'no', label: 'No, thank you' },
];

export const AGNTMKT_FOLLOW_UP_OPTIONS: Option[] = [
  { value: 'contact_me', label: 'Yes, please contact me to discuss AI solutions' },
  { value: 'send_info', label: 'Yes, just send me information about your services' },
  { value: 'check_website', label: "No, but I'll check out your website" },
  { value: 'not_interested', label: 'No, not interested at this time' },
];
