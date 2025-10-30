import React, { useState, useEffect, useCallback, useId } from 'react';
import { SECTIONS, INITIAL_RESPONSES, PROGRESS_BAR_GROUPS } from './constants';
import { Responses, Errors, SurveyStatus, Section } from './types';
import ProgressBar from './components/ProgressBar';
import CompletionScreen from './components/WelcomeScreen';
import Chatbot from './components/Chatbot';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Edit2, Clock, ChevronsUpDown, MessageCircle } from 'lucide-react';
import { submitSurveyResponse, autoSaveProgress, generateSessionId } from './supabaseClient';

// --- Reusable Input Components ---

const TextInput: React.FC<{label: string, value: string, onChange: (v: string) => void, required?: boolean, error?: string | null, placeholder?: string, type?: string, description?: string}> = 
  ({ label, value, onChange, required, error, placeholder, type = 'text', description }) => {
    const id = useId();
    return (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-dark-bg mb-2">
            {label}
            {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors text-brand-dark-bg placeholder:text-brand-gray-steel ${ error ? 'border-red-500' : 'border-brand-gray-smoke hover:border-brand-gray-steel'}`}
            aria-invalid={!!error}
        />
        {description && !error && <p className="text-xs text-brand-gray-graphite mt-1">{description}</p>}
        {error && <p className="text-sm text-red-500 mt-1.5 flex items-center"><AlertCircle className="w-4 h-4 mr-1.5" />{error}</p>}
    </div>
)};

const TextAreaInput: React.FC<{label: string, value: string, onChange: (v: string) => void, required?: boolean, error?: string | null, placeholder?: string, description?: string, rows?: number}> = 
  ({ label, value, onChange, required, error, placeholder, description, rows = 4 }) => {
    const id = useId();
    return (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-dark-bg mb-2">
            {label}
            {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors text-brand-dark-bg placeholder:text-brand-gray-steel ${ error ? 'border-red-500' : 'border-brand-gray-smoke hover:border-brand-gray-steel'}`}
            aria-invalid={!!error}
        />
        {description && !error && <p className="text-xs text-brand-gray-graphite mt-1">{description}</p>}
        {error && <p className="text-sm text-red-500 mt-1.5 flex items-center"><AlertCircle className="w-4 h-4 mr-1.5" />{error}</p>}
    </div>
)};


const SelectInput: React.FC<{label: string, value: string, onChange: (v: string) => void, options: {value: string, label: string}[], required?: boolean, error?: string | null }> = 
  ({ label, value, onChange, options, required, error }) => {
    const id = useId();
    return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-dark-bg mb-2">
        {label}
        {required && <span className="text-brand-orange ml-1">*</span>}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors appearance-none ${ error ? 'border-red-500' : 'border-brand-gray-smoke hover:border-brand-gray-steel'} ${value ? 'text-brand-dark-bg' : 'text-brand-gray-graphite'}`}
        >
          <option value="">Select an option...</option>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronsUpDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-graphite pointer-events-none" />
      </div>
       {error && <p className="text-sm text-red-500 mt-1.5 flex items-center"><AlertCircle className="w-4 h-4 mr-1.5" />{error}</p>}
    </div>
)};

const RadioGroupInput: React.FC<{
  label: string, 
  options: {value: string, label: string}[],
  value: string,
  onChange: (v: string) => void,
  required?: boolean,
  error?: string | null,
  otherValue?: string,
  onOtherChange?: (v: string) => void,
  otherLabel?: string,
}> = ({ label, options, value, onChange, required, error, otherValue, onOtherChange, otherLabel="Other (please specify)" }) => {
  const name = useId();
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark-bg mb-3">{label}{required && <span className="text-brand-orange ml-1">*</span>}</label>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${value === option.value ? 'bg-white border-brand-orange ring-1 ring-brand-orange' : 'bg-white border-brand-gray-smoke hover:border-brand-gray-steel'}`}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={(e) => onChange(e.target.value)} className="w-4 h-4 text-brand-orange border-brand-gray-steel focus:ring-brand-orange focus:ring-offset-0" />
            <span className="ml-3 text-brand-dark-bg">{option.label}</span>
          </label>
        ))}
        {onOtherChange && (
          <div className={`p-3 border rounded-lg transition-all ${value === 'other' ? 'bg-white border-brand-orange ring-1 ring-brand-orange' : 'bg-white border-brand-gray-smoke hover:border-brand-gray-steel'}`}>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name={name} value="other" checked={value === 'other'} onChange={(e) => onChange(e.target.value)} className="w-4 h-4 text-brand-orange border-brand-gray-steel focus:ring-brand-orange focus:ring-offset-0" />
              <span className="ml-3 text-brand-dark-bg">{otherLabel}</span>
            </label>
            {value === 'other' && (
              <input type="text" value={otherValue} onChange={(e) => onOtherChange(e.target.value)} placeholder="Please specify" className="mt-2 w-full px-3 py-2 text-sm bg-white border-brand-gray-smoke rounded-md focus:ring-brand-orange focus:border-brand-orange" />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
    </div>
  )
};

const CheckboxGroupInput: React.FC<{
  label: string, 
  options: {value: string, label: string, isExclusive?: boolean}[],
  value: string[],
  onChange: (v: string, isExclusive?: boolean) => void,
  required?: boolean,
  error?: string | null,
  description?: string,
  otherValues: { [key: string]: string },
  onOtherChange: (key: string, v: string) => void,
  max?: number
}> = ({ label, options, value, onChange, required, error, description, otherValues, onOtherChange, max }) => {
  const isMaxed = max ? value.filter(v => !options.find(o => o.value === v)?.isExclusive).length >= max : false;
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark-bg mb-1">{label}{required && <span className="text-brand-orange ml-1">*</span>}</label>
      {description && <p className="text-sm text-brand-gray-graphite mb-3">{description}</p>}
      <div className="space-y-2">
        {options.map(option => {
          const isSelected = value.includes(option.value);
          const isDisabled = (isMaxed && !isSelected && !option.isExclusive) || (value.some(v => options.find(o => o.value === v)?.isExclusive) && !isSelected);
          return(
            <div key={option.value}>
            <label className={`flex items-center p-3 border rounded-lg transition-all ${isSelected ? 'bg-brand-orange/10 border-brand-orange ring-1 ring-brand-orange' : 'bg-white border-brand-gray-smoke'} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-brand-gray-steel cursor-pointer'}`}>
              <input type="checkbox" checked={isSelected} onChange={() => onChange(option.value, option.isExclusive)} disabled={isDisabled} className="w-4 h-4 text-brand-orange border-brand-gray-steel rounded focus:ring-brand-orange focus:ring-offset-0" />
              <span className="ml-3 text-brand-dark-bg">{option.label}</span>
            </label>
            {option.value.includes('specify') && isSelected && onOtherChange && (
               <input type="text" value={otherValues[option.value] || ''} onChange={(e) => onOtherChange(option.value, e.target.value)} placeholder="Please specify" className="mt-2 w-full px-3 py-2 text-sm bg-white border-brand-gray-smoke rounded-md focus:ring-brand-orange focus:border-brand-orange" />
            )}
            </div>
          )
        })}
      </div>
      {max && <p className="text-sm text-brand-gray-graphite mt-2">{value.filter(v => !options.find(o => o.value === v)?.isExclusive).length} of {max} selected</p>}
      {error && <p className="text-sm text-red-500 mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
    </div>
  )
};

const ScaleInput: React.FC<{label: string, value: number, onChange: (v: number) => void, required?: boolean, min?: number, max?: number, minLabel?: string, maxLabel?: string, description?: string}> = 
({ label, value, onChange, required, min = 1, max = 5, minLabel="Not at all", maxLabel="Very", description }) => (
  <div>
    <label className="block text-sm font-medium text-brand-dark-bg mb-3">{label}{required && <span className="text-brand-orange ml-1">*</span>}</label>
    { description && <p className='text-sm text-brand-gray-graphite -mt-2 mb-3'>{description}</p> }
    <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="w-full h-2 bg-brand-gray-smoke rounded-lg appearance-none cursor-pointer accent-brand-orange" />
    <div className="flex justify-between text-sm text-brand-gray-graphite mt-2">
      <span>{minLabel}</span>
      <span className="font-semibold text-brand-orange text-lg">{value} / {max}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
);

const RankingInput: React.FC<{
  label: string, 
  options: {value: string, label: string}[],
  value: string[],
  onChange: (v: string[]) => void,
  maxRank: number,
  required?: boolean,
  error?: string | null,
}> = ({ label, options, onChange, maxRank, required, error, value = [] }) => {
  const handleSelect = (rankIndex: number, selectedValue: string) => {
    const newValue = [...value];
    // Clear the old position of the selected value if it exists
    const oldIndex = newValue.indexOf(selectedValue);
    if(oldIndex > -1) {
        newValue[oldIndex] = '';
    }
    newValue[rankIndex] = selectedValue;
    onChange(newValue);
  };

  const isOptionDisabled = (optionValue: string, currentRankIndex: number) => {
    if (!optionValue) return false;
    return value.some((v, i) => v === optionValue && i !== currentRankIndex);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark-bg mb-3">{label}{required && <span className="text-brand-orange ml-1">*</span>}</label>
      <div className="space-y-3">
        {Array.from({ length: maxRank }).map((_, rankIndex) => (
          <div key={rankIndex} className="flex items-center gap-3">
            <span className="font-bold text-brand-orange w-10 text-center">#{rankIndex + 1}</span>
            <div className="relative flex-1">
              <select 
                value={value[rankIndex] || ''}
                onChange={(e) => handleSelect(rankIndex, e.target.value)}
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors appearance-none border-brand-gray-smoke hover:border-brand-gray-steel ${value[rankIndex] ? 'text-brand-dark-bg' : 'text-brand-gray-graphite'}`}
              >
                <option value="">Select an option...</option>
                {options.map(opt => (
                  <option 
                    key={opt.value} 
                    value={opt.value}
                    disabled={isOptionDisabled(opt.value, rankIndex)}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-graphite pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
    </div>
  );
};


// --- Section Components ---

interface SectionProps {
  responses: Responses;
  updateResponse: (field: keyof Responses, value: any) => void;
  toggleArrayItem: (field: keyof Responses, value: string, isExclusive?: boolean) => void;
  errors: Errors;
  jumpToSection?: (index: number) => void;
}

const renderSectionComponent = (sectionIndex: number, props: SectionProps) => {
    const section = SECTIONS[sectionIndex];
    const isAiUsed = props.responses.orgAiUsage !== 'not_using';
    const areFranchiseesSupported = ['yes_extensively', 'yes_moderately', 'yes_in_limited_ways'].includes(props.responses.franchiseeAiSupport);
    const hasCustomerFacingAi = ['yes_extensively', 'yes_moderately', 'yes_in_limited_ways'].includes(props.responses.customerFacingAi);

    const SectionContent = () => {
        switch(section.id) {
            case 'demographics': return (
                <>
                  <TextInput label="Q1. Email Address" value={props.responses.email} onChange={v => props.updateResponse('email', v)} required error={props.errors.email} placeholder="your@email.com" type="email" description="Will not be shared publicly." />
                  <TextInput label="Q2. Company/Brand Name" value={props.responses.companyName} onChange={v => props.updateResponse('companyName', v)} required error={props.errors.companyName} placeholder="Your franchise brand" />
                  <RadioGroupInput label="Q3. What industry is your franchise brand in?" required error={props.errors.industry} value={props.responses.industry} onChange={v => props.updateResponse('industry', v)} options={[ {value:'qsr', label:'Food & Beverage - Quick Service Restaurant (QSR)'}, {value:'fast_casual', label:'Food & Beverage - Fast Casual'}, {value:'full_service_restaurant', label:'Food & Beverage - Full Service Restaurant'}, {value:'coffee_cafe', label:'Food & Beverage - Coffee/Cafe'}, {value:'food_other', label:'Food & Beverage - Other'}, {value:'health_fitness', label:'Health & Fitness'}, {value:'beauty', label:'Beauty & Personal Care'}, {value:'home_services', label:'Home Services'}, {value:'business_services', label:'Business Services'}, {value:'education', label:'Education & Tutoring'}, {value:'senior_care', label:'Senior Care'}, {value:'child_care', label:'Child Care'}, {value:'pet_services', label:'Pet Services'}, {value:'retail', label:'Retail'}, {value:'automotive', label:'Automotive'}, {value:'real_estate', label:'Real Estate'}, {value:'hospitality', label:'Hospitality/Lodging'}, ]} otherValue={props.responses.industryOther} onOtherChange={v => props.updateResponse('industryOther', v)} />
                  <RadioGroupInput label="Q4. What is your role/title?" required error={props.errors.role} value={props.responses.role} onChange={v => props.updateResponse('role', v)} options={[ {value:'ceo', label:'CEO/President'}, {value:'coo', label:'COO/VP of Operations'}, {value:'cfo', label:'CFO/VP of Finance'}, {value:'cmo', label:'CMO/VP of Marketing'}, {value:'cto', label:'CTO/VP of Technology/IT'}, {value:'franchise_dev', label:'Director of Franchise Development'}, {value:'ops_director', label:'Director of Operations'}, {value:'marketing_director', label:'Director of Marketing'}, {value:'franchise_support', label:'Franchise Support Manager'}, {value:'tech_manager', label:'Technology Manager'} ]} otherValue={props.responses.roleOther} onOtherChange={v => props.updateResponse('roleOther', v)} />
                  <SelectInput label="Q5. How many franchise units does your brand have?" required error={props.errors.unitCount} value={props.responses.unitCount} onChange={v => props.updateResponse('unitCount', v)} options={[ {value:'1-10', label:'1-10 units'}, {value:'11-25', label:'11-25 units'}, {value:'26-50', label:'26-50 units'}, {value:'51-100', label:'51-100 units'}, {value:'101-250', label:'101-250 units'}, {value:'251-500', label:'251-500 units'}, {value:'501-1000', label:'501-1,000 units'}, {value:'1000+', label:'1,000+ units'}, ]} />
                  <SelectInput label="Q6. What is your brand's annual system-wide revenue?" value={props.responses.annualRevenue} onChange={v => props.updateResponse('annualRevenue', v)} options={[ {value:'<5m', label:'Under $5 million'}, {value:'5-25m', label:'$5-$25 million'}, {value:'25-50m', label:'$25-$50 million'}, {value:'50-100m', label:'$50-$100 million'}, {value:'100-500m', label:'$100-$500 million'}, {value:'500m-1b', label:'$500 million - $1 billion'}, {value:'>1b', label:'Over $1 billion'}, {value:'prefer_not_to_answer', label:'Prefer not to answer'} ]} />
                </>
            );
            case 'usage': return (
              <>
                <RadioGroupInput label="Q7. How often are you personally using AI tools?" required error={props.errors.personalAiUsage} value={props.responses.personalAiUsage} onChange={v => props.updateResponse('personalAiUsage', v)} options={[{value:'multiple_daily',label:'Multiple times per day'}, {value:'daily', label: 'Once per day'}, {value:'weekly', label:'Several times per week'}, {value:'biweekly', label: 'Once per week'}, {value:'monthly', label:'A few times per month'}, {value:'rarely', label:'Rarely (less than monthly)'}, {value:'never', label:'Never'}]} />
                <RadioGroupInput label="Q8. How often is your organization using AI tools?" required error={props.errors.orgAiUsage} value={props.responses.orgAiUsage} onChange={v => props.updateResponse('orgAiUsage', v)} options={[{value:'daily',label:'Daily - integrated into regular workflows'}, {value:'weekly', label:'Weekly - regular but not daily use'}, {value:'monthly', label:'Monthly - occasional use'}, {value:'quarterly', label: 'Quarterly - very limited use'}, {value:'not_using', label:'Not currently using AI'}, {value:'dont_know', label:"Don't know"}]} />
                <RadioGroupInput label="Q9. When did your organization first start experimenting with AI?" required error={props.errors.aiAdoptionDate} value={props.responses.aiAdoptionDate} onChange={v => props.updateResponse('aiAdoptionDate', v)} options={[{value: '<2020', label: 'Before 2020'}, {value:'2020-2021', label: '2020-2021'}, {value:'2022', label: '2022'}, {value:'2023', label: '2023'}, {value: '2024', label: '2024'}, {value: '2025', label: '2025'}, {value: 'not_started', label: "Haven't started yet"}, {value: 'dont_know', label: "Don't know"}]} />
                <RadioGroupInput label="Q10. How has your AI usage changed in the past 12 months?" required error={props.errors.aiUsageChange} value={props.responses.aiUsageChange} onChange={v => props.updateResponse('aiUsageChange', v)} options={[{value:'increased_sig', label: 'Increased significantly'}, {value:'increased_mod', label: 'Increased moderately'}, {value:'same', label: 'Stayed about the same'}, {value:'decreased', label: 'Decreased'}, {value:'just_started', label: 'We just started using AI in the past year'}, {value:'n/a', label: 'Not applicable - not using AI'}]} />
              </>
            );
            case 'tools': return (
              <>
                <CheckboxGroupInput label="Q11. Which AI tools or platforms is your organization currently using?" description="(Select all that apply)" required error={props.errors.aiTools} value={props.responses.aiTools} onChange={(v, e) => props.toggleArrayItem('aiTools', v, e)} otherValues={{'industry-specific_specify': props.responses.aiToolsIndustrySpecific, 'custom_specify': props.responses.aiToolsCustom, 'other_specify': props.responses.aiToolsOther}} onOtherChange={(k, v) => { if (k === 'industry-specific_specify') props.updateResponse('aiToolsIndustrySpecific', v); else if (k === 'custom_specify') props.updateResponse('aiToolsCustom', v); else props.updateResponse('aiToolsOther', v)}} options={[{value:'chatgpt',label:'ChatGPT (OpenAI)'},{value:'claude',label:'Claude (Anthropic)'},{value:'gemini',label:'Gemini / Bard (Google)'},{value:'copilot',label:'Microsoft Copilot'},{value:'perplexity',label:'Perplexity'},{value:'grok',label:'Grok (xAI)'},{value:'meta',label:'Meta AI / Llama'},{value:'jasper',label:'Jasper'},{value:'copyai',label:'Copy.ai'},{value:'notion',label:'Notion AI'},{value:'canva',label:'Canva AI'},{value:'midjourney',label:'Midjourney'},{value:'dalle',label:'DALL-E / ChatGPT Image Generation'},{value:'firefly',label:'Adobe Firefly'},{value:'grammarly',label:'Grammarly (AI features)'},{value:'hubspot',label:'HubSpot AI tools'},{value:'salesforce',label:'Salesforce Einstein'},{value:'industry-specific_specify',label:'Industry-specific AI platform (please specify)'},{value:'custom_specify',label:'Custom/proprietary AI solution'},{value:'other_specify',label:'Other (please specify)'}, {value:'not_using_ai', label: 'Not currently using AI tools', isExclusive: true}]} />
                { isAiUsed && <>
                    <RadioGroupInput label="Q12. What is the primary AI model/platform your organization relies on most?" required error={props.errors.primaryAiTool} value={props.responses.primaryAiTool} onChange={v => props.updateResponse('primaryAiTool', v)} options={[{value:'chatgpt',label:'ChatGPT (OpenAI)'},{value:'claude',label:'Claude (Anthropic)'},{value:'gemini',label:'Gemini / Bard (Google)'},{value:'copilot',label:'Microsoft Copilot'},{value:'perplexity',label:'Perplexity'},{value:'grok',label:'Grok (xAI)'},{value:'meta',label:'Meta AI / Llama'}]} />
                    <CheckboxGroupInput label="Q13. For what purposes do you use AI tools?" description="(Select all that apply)" required error={props.errors.aiUseCases} value={props.responses.aiUseCases} onChange={(v, e) => props.toggleArrayItem('aiUseCases', v, e)} otherValues={{'other_specify': props.responses.aiUseCasesOther}} onOtherChange={(k,v) => props.updateResponse('aiUseCasesOther', v)} options={[{value:'marketing_copy',label:'Content & Marketing: Writing marketing copy'}, {value:'social_media',label:'Content & Marketing: Social media content creation'}, {value:'email_campaigns',label:'Content & Marketing: Email campaigns'}, {value:'data_analysis',label:'Operations & Analysis: Data analysis / reporting'}, {value:'process_automation',label:'Operations & Analysis: Process automation'}, {value:'customer_chatbots',label:'Customer Service: Customer service chatbots'}, {value:'employee_training',label:'Training & Development: Employee training content'}, {value:'financial_modeling',label:'Finance & Legal: Financial modeling'}, {value:'code_generation',label:'Technology & Development: Code generation / debugging'}, {value:'recruitment',label:'Other: Recruitment / HR'}, {value:'other_specify',label:'Other (please specify)'}]} />
                </>}
              </>
            );
            case 'corporate': return (
              <>
                <CheckboxGroupInput label="Q14. How is your corporate team currently using AI?" description="(Select all that apply)" required error={props.errors.corporateAiUse} value={props.responses.corporateAiUse} onChange={(v, e) => props.toggleArrayItem('corporateAiUse', v, e)} otherValues={{'other_specify': props.responses.corporateAiUseOther}} onOtherChange={(k,v) => props.updateResponse('corporateAiUseOther', v)} options={[{value:'marketing',label:'Marketing & brand management'},{value:'content_creation',label:'Content creation'},{value:'franchise_dev',label:'Franchise development / sales'},{value:'ops_optimization',label:'Operations optimization'},{value:'training',label:'Training & education'},{value:'data_analysis',label:'Data analysis & reporting'},{value:'customer_service',label:'Customer service support'},{value:'finance',label:'Financial planning & analysis'},{value:'tech_dev',label:'Technology development'},{value:'hr',label:'Human resources / recruitment'},{value:'legal',label:'Legal & compliance'},{value:'supply_chain',label:'Supply chain management'},{value:'real_estate',label:'Real estate / site selection'},{value:'not_using_corp',label:'Not using AI at corporate level', isExclusive: true},{value:'other_specify',label:'Other (please specify)'}]} />
                <RankingInput label="Q15. Which departments at your corporate office are using AI most frequently?" maxRank={3} value={props.responses.topDepartmentsAi} onChange={v => props.updateResponse('topDepartmentsAi', v)} options={[{value:'marketing',label:'Marketing'},{value:'operations',label:'Operations'},{value:'tech_it',label:'Technology/IT'},{value:'finance',label:'Finance'},{value:'franchise_dev',label:'Franchise Development'},{value:'training',label:'Training & Education'},{value:'customer_service',label:'Customer Service'},{value:'hr',label:'Human Resources'},{value:'legal',label:'Legal & Compliance'},{value:'executive',label:'Executive Leadership'},{value:'product_dev',label:'Product Development'},{value:'other',label:'Other'}]} />
              </>
            );
            case 'franchisee': return (
              <>
                <RadioGroupInput label="Q16. Are you currently using AI to support your franchisees?" required error={props.errors.franchiseeAiSupport} value={props.responses.franchiseeAiSupport} onChange={v => props.updateResponse('franchiseeAiSupport', v)} options={[{value:'yes_extensively',label:'Yes, extensively'},{value:'yes_moderately',label:'Yes, moderately'},{value:'yes_in_limited_ways',label:'Yes, in limited ways'},{value:'no_plan_6mo',label:'No, but planning to within 6 months'},{value:'no_plan_12mo',label:'No, but planning to within 12 months'},{value:'no_plans',label:'No, and no current plans'},{value:'dont_know',label:"Don't know"}]} />
                { areFranchiseesSupported &&
                  <CheckboxGroupInput label="Q17. How are you supporting franchisees with AI?" description="(Select all that apply)" required error={props.errors.franchiseeSupportMethods} value={props.responses.franchiseeSupportMethods} onChange={(v, e) => props.toggleArrayItem('franchiseeSupportMethods', v, e)} otherValues={{'other_specify': props.responses.franchiseeSupportMethodsOther}} onOtherChange={(k,v) => props.updateResponse('franchiseeSupportMethodsOther', v)} options={[{value:'provide_tools',label:'Providing access to AI tools'},{value:'provide_content',label:'Creating AI-generated marketing content'},{value:'training',label:'Training on AI usage'},{value:'insights',label:'AI-powered operational insights'},{value:'other_specify',label:'Other (please specify)'}]} />
                }
                <SelectInput label="Q18. What percentage of your franchisees are actively using AI tools?" value={props.responses.franchiseeAdoptionRate} onChange={v => props.updateResponse('franchiseeAdoptionRate', v)} options={[{value:'0',label:'0% - None'},{value:'1-10',label:'1-10%'},{value:'11-25',label:'11-25%'},{value:'26-50',label:'26-50%'},{value:'51-75',label:'51-75%'},{value:'76-90',label:'76-90%'},{value:'91-100',label:'91-100%'},{value:'dont_know',label:"Don't know"}]} />
                <CheckboxGroupInput label="Q19. How do franchisees primarily learn about AI tools?" description="(Select all that apply)" value={props.responses.franchiseeAiLearning} onChange={(v,e)=>props.toggleArrayItem('franchiseeAiLearning',v,e)} otherValues={{'other_specify': props.responses.franchiseeAiLearningOther}} onOtherChange={(k,v) => props.updateResponse('franchiseeAiLearningOther', v)} options={[{value:'corp_training',label:'Corporate training programs'},{value:'conferences',label:'Franchisee conferences / conventions'},{value:'peer',label:'Peer franchisee recommendations'},{value:'independent',label:'Independent exploration'},{value:'other_specify',label:'Other (please specify)'}]} />
              </>
            );
            case 'investment': return (
              <>
                <SelectInput label="Q20. What is your organization's annual AI investment/budget for 2025?" value={props.responses.annualAiBudget} onChange={v => props.updateResponse('annualAiBudget', v)} options={[{value:'0',label:'$0 (using only free tools)'},{value:'1-5k',label:'$1 - $5,000'},{value:'5-25k',label:'$5,001 - $25,000'},{value:'25-50k',label:'$25,001 - $50,000'},{value:'50-100k',label:'$50,001 - $100,000'},{value:'100-250k',label:'$100,001 - $250,000'},{value:'250-500k',label:'$250,001 - $500,000'},{value:'500-1m',label:'$500,001 - $1,000,000'},{value:'>1m',label:'Over $1,000,000'},{value:'dont_know',label:"Don't know"},{value:'prefer_not_to_answer',label:'Prefer not to answer'}]} />
                <SelectInput label="Q21. How has your AI budget changed from 2024 to 2025?" value={props.responses.aiBudgetChange} onChange={v => props.updateResponse('aiBudgetChange', v)} options={[{value:'increase_50+',label:'Increased by 50%+'},{value:'increase_25-50',label:'Increased by 25-50%'},{value:'increase_10-25',label:'Increased by 10-25%'},{value:'increase_1-10',label:'Increased by 1-10%'},{value:'same',label:'Stayed about the same'},{value:'decreased',label:'Decreased'},{value:'no_budget_2024',label:"We didn't have an AI budget in 2024"},{value:'dont_know',label:"Don't know"}]} />
                <CheckboxGroupInput label="Q22. Where does your AI budget primarily come from?" description="(Select all that apply)" value={props.responses.aiBudgetSource} onChange={(v, e) => props.toggleArrayItem('aiBudgetSource', v, e)} otherValues={{'other_specify': props.responses.aiBudgetSourceOther}} onOtherChange={(k,v) => props.updateResponse('aiBudgetSourceOther', v)} options={[{value:'tech_it',label:'Technology/IT budget'},{value:'marketing',label:'Marketing budget'},{value:'operations',label:'Operations budget'},{value:'innovation',label:'Innovation/R&D budget'},{value:'dedicated_ai',label:'Dedicated AI budget line item'},{value:'individual_dept',label:'Individual department budgets'},{value:'no_formal',label:'No formal budget allocation'},{value:'dont_know',label:"Don't know"},{value:'other_specify',label:'Other (please specify)'}]} />
                <RadioGroupInput label="Q23. Who has primary responsibility for AI investment decisions?" value={props.responses.aiInvestmentDecisionMaker} onChange={v => props.updateResponse('aiInvestmentDecisionMaker', v)} otherValue={props.responses.aiInvestmentDecisionMakerOther} onOtherChange={v => props.updateResponse('aiInvestmentDecisionMakerOther', v)} options={[{value:'ceo',label:'CEO/President'},{value:'cto',label:'CTO/VP Technology'},{value:'coo',label:'COO/VP Operations'},{value:'cmo',label:'CMO/VP Marketing'},{value:'cfo',label:'CFO/VP Finance'},{value:'committee',label:'Cross-functional committee'},{value:'dept_heads',label:'Individual department heads'},{value:'dont_know',label:"Don't know"}]} />
              </>
            );
            case 'roi': return (
              <>
                <RadioGroupInput label="Q24. Have you measured ROI or business impact from AI implementation?" required={isAiUsed} error={props.errors.measuredRoi} value={props.responses.measuredRoi} onChange={v => props.updateResponse('measuredRoi', v)} options={[{value:'yes_sig_pos',label:"Yes, we've measured significant positive ROI"},{value:'yes_mod_pos',label:"Yes, we've measured moderate positive ROI"},{value:'yes_min',label:'Yes, but ROI has been minimal so far'},{value:'no_plan_to',label:'No, but we plan to measure it'},{value:'no_plans',label:'No, and no plans to measure it'},{value:'too_early',label:'Too early to measure'},{value:'n/a',label:'Not applicable - not using AI'}]} />
                <CheckboxGroupInput label="Q25. What measurable improvements have you seen from AI adoption?" description="(Select all that apply)" value={props.responses.measuredImprovements} onChange={(v, e) => props.toggleArrayItem('measuredImprovements', v, e)} otherValues={{'other_specify': props.responses.measuredImprovementsOther}} onOtherChange={(k,v) => props.updateResponse('measuredImprovementsOther', v)} options={[{value:'time_savings',label:'Time savings / efficiency gains'},{value:'cost_reduction',label:'Cost reduction'},{value:'revenue_increase',label:'Revenue increase'},{value:'customer_satisfaction',label:'Improved customer satisfaction scores'},{value:'no_improvements',label:'No measurable improvements yet', isExclusive: true},{value:'havent_measured',label:"Haven't measured", isExclusive: true},{value:'other_specify',label:'Other (please specify)'}]} />
                <div className="space-y-4 p-4 border border-brand-gray-smoke rounded-lg">
                  <h3 className="font-medium text-brand-dark-bg">Q26. If you've seen improvements, approximately what has been the impact? (Optional)</h3>
                  <SelectInput label="Time Savings:" value={props.responses.timeSavings} onChange={v => props.updateResponse('timeSavings', v)} options={[{value:'n/a',label:'Not applicable / Haven\'t measured'},{value:'no_imp',label:'No improvement'},{value:'1-10',label:'1-10% improvement'},{value:'11-25',label:'11-25% improvement'},{value:'26-50',label:'26-50% improvement'},{value:'51-75',label:'51-75% improvement'},{value:'>75',label:'Over 75% improvement'}]} />
                  <SelectInput label="Cost Reduction:" value={props.responses.costReduction} onChange={v => props.updateResponse('costReduction', v)} options={[{value:'n/a',label:'Not applicable / Haven\'t measured'},{value:'no_red',label:'No reduction'},{value:'1-10',label:'1-10% reduction'},{value:'11-25',label:'11-25% reduction'},{value:'26-50',label:'26-50% reduction'},{value:'>50',label:'Over 50% reduction'}]} />
                  <SelectInput label="Revenue Impact:" value={props.responses.revenueImpact} onChange={v => props.updateResponse('revenueImpact', v)} options={[{value:'n/a',label:'Not applicable / Haven\'t measured'},{value:'no_imp',label:'No impact'},{value:'1-5',label:'1-5% increase'},{value:'6-10',label:'6-10% increase'},{value:'11-20',label:'11-20% increase'},{value:'>20',label:'Over 20% increase'}]} />
                </div>
              </>
            );
            case 'challenges': return (
              <>
                <RankingInput label="Q27. What are the biggest challenges your organization faces with AI implementation?" maxRank={5} required error={props.errors.challengesRanked} value={props.responses.challengesRanked} onChange={v => props.updateResponse('challengesRanked', v)} options={[{value:'privacy',label:'Data privacy and security concerns'},{value:'knowledge',label:'Lack of understanding / knowledge'},{value:'training',label:'Insufficient training'},{value:'cost',label:'High implementation costs'},{value:'integration',label:'Integration with existing systems'},{value:'consistency',label:'Lack of consistency across franchise locations'},{value:'franchisee_resistance',label:'Resistance from franchisees'},{value:'staff_resistance',label:'Resistance from staff'},{value:'too_many_tools',label:'Overwhelming number of AI tool options'},{value:'measuring_roi',label:'Difficulty measuring ROI'},{value:'job_displacement',label:'Concerns about job displacement'},{value:'data_quality',label:'Data quality / availability issues'},{value:'no_challenges',label:'No significant challenges'}]} />
                <RadioGroupInput label="Q28. Which statement best describes your organization's AI knowledge level?" required error={props.errors.aiKnowledgeLevel} value={props.responses.aiKnowledgeLevel} onChange={v => props.updateResponse('aiKnowledgeLevel', v)} options={[{value:'expert',label:'Expert - We have deep AI expertise internally'},{value:'advanced',label:'Advanced - Strong understanding and active implementation'},{value:'intermediate',label:'Intermediate - Good understanding, early implementation'},{value:'beginner',label:'Beginner - Learning but limited implementation'},{value:'novice',label:'Novice - Just starting to explore AI'},{value:'no_knowledge',label:'No knowledge - Not yet engaged with AI'}]} />
                <RadioGroupInput label="Q29. Do you have dedicated AI expertise on your team?" required error={props.errors.dedicatedAiExpertise} value={props.responses.dedicatedAiExpertise} onChange={v => props.updateResponse('dedicatedAiExpertise', v)} options={[{value:'yes_full_time',label:'Yes, full-time dedicated AI specialist(s)'},{value:'yes_tech_team',label:'Yes, technology team members with AI expertise'},{value:'no_consultants',label:'No, but we use external consultants'},{value:'no_self_teaching',label:"No, but we're self-teaching"},{value:'no_plans',label:"No, and we don't have plans to add expertise"},{value:'dont_know',label:"Don't know"}]} />
              </>
            );
            case 'data': return (
              <>
                <ScaleInput required label="Q30. How would you rate your organization's data infrastructure readiness for AI?" value={props.responses.dataInfrastructureReadiness} onChange={v => props.updateResponse('dataInfrastructureReadiness', v)} minLabel="Very Poor" maxLabel="Excellent" description="1: Little to no usable data. 5: Fully prepared with centralized, clean data." />
                <RadioGroupInput label="Q31. Do you use a centralized data platform or data warehouse?" required error={props.errors.centralizedDataPlatform} value={props.responses.centralizedDataPlatform} onChange={v => props.updateResponse('centralizedDataPlatform', v)} options={[{value:'yes_implemented',label:'Yes, fully implemented and operational'},{value:'yes_implementing',label:'Yes, currently being implemented'},{value:'no_planning',label:'No, but planning to implement within 12 months'},{value:'no_plans',label:'No, and no current plans'},{value:'dont_know',label:"Don't know"}]} />
                <CheckboxGroupInput label="Q32. What data sources are you using for AI?" description="(Select all that apply)" value={props.responses.dataSources} onChange={(v,e)=>props.toggleArrayItem('dataSources',v,e)} otherValues={{'other_specify': props.responses.dataSourcesOther}} onOtherChange={(k,v)=>props.updateResponse('dataSourcesOther',v)} options={[{value:'pos',label:'POS (Point of Sale) data'},{value:'crm',label:'Customer relationship management (CRM)'},{value:'marketing_automation',label:'Marketing automation platforms'},{value:'financial',label:'Financial systems'},{value:'inventory',label:'Inventory management systems'},{value:'hris',label:'Employee data / HRIS'},{value:'analytics',label:'Website / app analytics'},{value:'social_media',label:'Social media data'},{value:'feedback',label:'Customer feedback / surveys'},{value:'third_party',label:'Third-party market data'},{value:'operational',label:'Operational systems'},{value:'supply_chain',label:'Supply chain data'},{value:'not_using',label:'Not using data for AI', isExclusive: true},{value:'other_specify',label:'Other (please specify)'}]} />
              </>
            );
            case 'customer': return (
              <>
                <RadioGroupInput label="Q33. Do you use AI in customer-facing applications?" required error={props.errors.customerFacingAi} value={props.responses.customerFacingAi} onChange={v => props.updateResponse('customerFacingAi', v)} options={[{value:'yes_extensively',label:'Yes, extensively'},{value:'yes_moderately',label:'Yes, moderately'},{value:'yes_in_limited_ways',label:'Yes, in limited ways'},{value:'no_planning',label:'No, but planning to'},{value:'no_plans',label:'No, and no plans to'},{value:'dont_know',label:"Don't know"}]} />
                {hasCustomerFacingAi && <>
                  <CheckboxGroupInput label="Q34. How do customers interact with AI at your locations?" description="(Select all that apply)" value={props.responses.customerAiInteractions} onChange={(v,e)=>props.toggleArrayItem('customerAiInteractions',v,e)} otherValues={{'other_specify':props.responses.customerAiInteractionsOther}} onOtherChange={(k,v)=>props.updateResponse('customerAiInteractionsOther',v)} options={[{value:'website_chatbot',label:'Chatbots on website'},{value:'app_chatbot',label:'Chatbots in mobile app'},{value:'voice_ordering',label:'AI-powered voice ordering'},{value:'phone_answering',label:'AI phone answering systems'},{value:'recommendations',label:'Personalized recommendations'},{value:'email_responses',label:'AI-generated email responses'},{value:'kiosks',label:'Self-service kiosks with AI'},{value:'virtual_assistants',label:'Virtual assistants'},{value:'predictive_text',label:'Predictive text / search'},{value:'no_customer_facing',label:"We don't have customer-facing AI", isExclusive: true},{value:'other_specify',label:'Other (please specify)'}]} />
                  <RadioGroupInput label="Q35. Are customers informed when they're interacting with AI?" value={props.responses.customerAiDisclosure} onChange={v => props.updateResponse('customerAiDisclosure', v)} options={[{value:'always',label:'Always clearly disclosed'},{value:'sometimes',label:'Sometimes disclosed'},{value:'rarely',label:'Rarely disclosed'},{value:'never',label:'Never disclosed'},{value:'n/a',label:'Not applicable'},{value:'dont_know',label:"Don't know"}]} />
                  <RadioGroupInput label="Q36. Have you received feedback from customers about AI interactions?" value={props.responses.customerFeedback} onChange={v => props.updateResponse('customerFeedback', v)} options={[{value:'positive',label:'Yes, mostly positive'},{value:'mixed',label:'Yes, mixed feedback'},{value:'negative',label:'Yes, mostly negative'},{value:'no_feedback',label:"No, haven't received specific feedback"},{value:'not_tracked',label:"We don't track this"},{value:'n/a',label:'Not applicable'}]} />
                </>}
              </>
            );
            case 'future': return (
              <>
                <RankingInput label="Q37. What are your organization's top AI priorities for the next 12 months?" maxRank={3} required error={props.errors.aiPriorities} value={props.responses.aiPriorities} onChange={v => props.updateResponse('aiPriorities', v)} options={[{value:'ops_efficiency',label:'Operational efficiency / cost reduction'},{value:'customer_experience',label:'Customer experience enhancement'},{value:'marketing_automation',label:'Marketing personalization & automation'},{value:'data_analysis',label:'Data analysis & business intelligence'},{value:'franchisee_support',label:'Franchisee training & support'},{value:'no_priorities',label:'No specific AI priorities'}]} />
                <CheckboxGroupInput label="Q38. In which areas do you see the greatest potential for AI in franchising?" description="(Select up to 5)" max={5} error={props.errors.greatestAiPotential} value={props.responses.greatestAiPotential} onChange={(v,e)=>props.toggleArrayItem('greatestAiPotential',v,e)} otherValues={{}} onOtherChange={()=>{}} options={[{value:'ops_efficiency',label:'Operational efficiency / cost reduction'},{value:'customer_experience',label:'Customer experience enhancement'},{value:'marketing_automation',label:'Marketing personalization & automation'},{value:'data_analysis',label:'Data analysis & business intelligence'},{value:'franchisee_support',label:'Franchisee training & support'},{value:'site_selection',label:'Site selection / territory planning'},{value:'dynamic_pricing',label:'Dynamic pricing'},{value:'voice_ai',label:'Voice AI / conversational interfaces'}]} />
                <RadioGroupInput label="Q39. How likely is your organization to increase AI investment in 2026?" required error={props.errors.increaseAiInvestment2026} value={props.responses.increaseAiInvestment2026} onChange={v => props.updateResponse('increaseAiInvestment2026', v)} options={[{value:'very_likely',label:'Very likely - planning significant increase'},{value:'somewhat_likely',label:'Somewhat likely - planning moderate increase'},{value:'neutral',label:'Neutral - may stay the same or increase slightly'},{value:'unlikely',label:'Unlikely - will probably maintain current level'},{value:'very_unlikely',label:'Very unlikely - may decrease investment'},{value:'dont_know',label:"Don't know"}]} />
                <RankingInput label="Q40. What would most accelerate AI adoption in your organization?" maxRank={3} required error={props.errors.adoptionAccelerators} value={props.responses.adoptionAccelerators} onChange={v => props.updateResponse('adoptionAccelerators', v)} options={[{value:'lower_cost',label:'Lower costs / better ROI'},{value:'better_training',label:'Better training / education'},{value:'more_proof',label:'More proof of effectiveness'},{value:'easier_integration',label:'Easier integration with existing systems'},{value:'reduced_privacy_risk',label:'Reduced data privacy / security concerns'},{value:'industry_solutions',label:'Industry-specific AI solutions'},{value:'buy_in_franchisees',label:'Buy-in from franchisees'},{value:'buy_in_leadership',label:'Buy-in from leadership'}]} />
              </>
            );
            case 'ethics': return (
              <>
                <RadioGroupInput label="Q41. Does your organization have formal policies governing AI use?" required error={props.errors.aiPolicy} value={props.responses.aiPolicy} onChange={v => props.updateResponse('aiPolicy', v)} options={[{value:'yes_comprehensive',label:'Yes, comprehensive policies in place'},{value:'yes_basic',label:'Yes, basic policies in place'},{value:'in_development',label:'In development'},{value:'no_planning',label:'No, but planning to develop'},{value:'no_plans',label:'No, and no plans to develop'},{value:'dont_know',label:"Don't know"}]} />
                <CheckboxGroupInput label="Q42. What ethical considerations concern you about AI?" description="(Select all that apply)" required error={props.errors.ethicalConcerns} value={props.responses.ethicalConcerns} onChange={(v, e) => props.toggleArrayItem('ethicalConcerns', v, e)} otherValues={{'other_specify': props.responses.ethicalConcernsOther}} onOtherChange={(k,v) => props.updateResponse('ethicalConcernsOther', v)} options={[{value:'bias',label:'Bias in AI decision-making'},{value:'privacy',label:'Data privacy violations'},{value:'job_displacement',label:'Job displacement'},{value:'transparency',label:'Lack of transparency (black box problem)'},{value:'over_reliance',label:'Over-reliance on AI'},{value:'misinformation',label:'Misinformation / "hallucinations"'},{value:'no_concerns',label:'No significant concerns', isExclusive: true},{value:'other_specify',label:'Other (please specify)'}]} />
                <ScaleInput label="Q43. On a scale of 1-5, how concerned are you about AI's impact on jobs in the franchise industry?" required value={props.responses.jobImpactConcern} onChange={v => props.updateResponse('jobImpactConcern', v)} minLabel="Not at all concerned" maxLabel="Extremely concerned" />
                <RadioGroupInput label="Q44. Do you use AI for compliance or regulatory monitoring?" value={props.responses.aiForCompliance} onChange={v => props.updateResponse('aiForCompliance', v)} options={[{value:'yes',label:'Yes'},{value:'no_planning',label:'No, but planning to'},{value:'no_plans',label:'No, and no current plans'},{value:'dont_know',label:"Don't know"}]} />
              </>
            );
            case 'trends': return (
              <>
                <RadioGroupInput label="Q45. How does your organization's AI adoption compare to your competitors?" required error={props.errors.competitorComparison} value={props.responses.competitorComparison} onChange={v => props.updateResponse('competitorComparison', v)} options={[{value:'ahead',label:'Ahead of the curve'},{value:'on_par',label:'On par with competitors'},{value:'behind',label:'Behind the curve'},{value:'dont_know',label:"Don't know"}]} />
                <TextAreaInput label="Q46. What is the most exciting AI trend or application you're watching for in the franchise industry?" required error={props.errors.excitingAiTrend} value={props.responses.excitingAiTrend} onChange={v => props.updateResponse('excitingAiTrend', v)} placeholder="e.g., Hyper-personalization, generative AI for marketing, predictive analytics for site selection..." />
                <TextAreaInput label="Q47. What key questions are you trying to answer with AI right now?" value={props.responses.questionsToAnswer} onChange={v => props.updateResponse('questionsToAnswer', v)} placeholder="e.g., How can we reduce franchisee churn? What is our optimal pricing strategy?" />
              </>
            );
            case 'satisfaction': return (
                <>
                  <ScaleInput label="Q48. On a scale of 1-5, how comfortable are you personally with using AI in your daily work?" required value={props.responses.personalAiComfort} onChange={v => props.updateResponse('personalAiComfort', v)} minLabel="Very uncomfortable" maxLabel="Very comfortable" />
                  <ScaleInput label="Q49. How satisfied are you with the current AI tools you're using?" required value={props.responses.toolSatisfaction} onChange={v => props.updateResponse('toolSatisfaction', v)} minLabel="Very dissatisfied" maxLabel="Very satisfied" description="Rate your overall satisfaction with the AI tools your organization uses." />
                  <TextAreaInput label="Q50. What's one capability you wish your AI tools had?" value={props.responses.desiredAiCapabilities} onChange={v => props.updateResponse('desiredAiCapabilities', v)} placeholder="e.g., Better integration with our CRM, more industry-specific knowledge, voice command capabilities..." />
                </>
            );
            case 'review':
                const reviewableSections = SECTIONS.slice(0, -1); // Exclude the review section itself
                const anyErrors = Object.values(props.errors).some(e => e !== null);
                return (
                <>
                    <h2 className="text-xl font-bold text-brand-dark-bg mb-4">Review Your Answers</h2>
                    <p className="mb-6 text-brand-gray-graphite">Please review your responses before submitting. You can click on a section to jump back and edit your answers.</p>
                    
                    {anyErrors && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                            <div className="flex">
                                <AlertCircle className="w-5 h-5 mr-3" />
                                <div>
                                    <h3 className="font-bold">Please fix the errors before submitting.</h3>
                                    <p className="text-sm">There are one or more required fields that need to be filled out.</p>
                                </div>
                            </div>
                        </div>
                    )}
            
                    <div className="space-y-2">
                        {reviewableSections.map((section, index) => (
                            <button
                                key={section.id}
                                onClick={() => props.jumpToSection?.(index)}
                                className="w-full flex justify-between items-center p-4 bg-white border border-brand-gray-smoke rounded-lg hover:border-brand-orange hover:bg-brand-orange/10 transition-colors"
                            >
                                <div className="flex items-center">
                                    <span className="text-lg mr-3">{section.icon}</span>
                                    <span className="font-medium text-brand-dark-bg">{section.name}</span>
                                </div>
                                <Edit2 className="w-5 h-5 text-brand-gray-steel" />
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-8 space-y-6 pt-6 border-t border-brand-gray-smoke">
                        <RadioGroupInput label="Would you like to receive a copy of the 2025 AI in Franchising Report when it's published?" value={props.responses.receiveReport} onChange={v => props.updateResponse('receiveReport', v)} options={[{value: 'yes_full', label: 'Yes, send me the full report'}, {value: 'yes_summary', label: 'Yes, send me the executive summary'}, {value: 'no', label: 'No, thank you'}]} />
                        <RadioGroupInput label="Would you be open to a follow-up interview to discuss your responses in more detail?" value={props.responses.allowFollowUp} onChange={v => props.updateResponse('allowFollowUp', v)} options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} />
                        <RadioGroupInput label="Would you be interested in being featured in a case study (with your permission)?" value={props.responses.caseStudyInterest} onChange={v => props.updateResponse('caseStudyInterest', v)} options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} />
                        <TextAreaInput label="Do you have any final comments or thoughts?" value={props.responses.finalComments} onChange={v => props.updateResponse('finalComments', v)} placeholder="Share any additional feedback here." />
                        <RadioGroupInput label="Would you like to be entered into a drawing for a $500 gift card?" value={props.responses.enterDrawing} onChange={v => props.updateResponse('enterDrawing', v)} options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} />
                    </div>
                </>
                )
            default: return null;
        }
    }
    const currentSectionData = SECTIONS[sectionIndex];
    return (
        <div className="space-y-6">
            <SectionContent />
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
    const [responses, setResponses] = useState<Responses>(INITIAL_RESPONSES);
    const [errors, setErrors] = useState<Errors>({});
    const [currentSection, setCurrentSection] = useState(0);
    const [history, setHistory] = useState<number[]>([0]);
    const [status, setStatus] = useState<SurveyStatus>(SurveyStatus.IN_PROGRESS);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [sessionId] = useState<string>(() => {
        // Try to get existing session ID from localStorage, or generate new one
        const existingSession = localStorage.getItem('survey_session_id');
        if (existingSession) return existingSession;
        const newSession = generateSessionId();
        localStorage.setItem('survey_session_id', newSession);
        return newSession;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const updateResponse = useCallback((field: keyof Responses, value: any) => {
        setResponses(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    }, [errors]);

    const toggleArrayItem = useCallback((field: keyof Responses, value: string, isExclusive?: boolean) => {
        setResponses(prev => {
            const currentArray = (prev[field] as string[]) || [];
            let newArray;
            if (isExclusive) {
                newArray = currentArray.includes(value) ? [] : [value];
            } else {
                newArray = currentArray.includes(value)
                    ? currentArray.filter(item => item !== value)
                    : [...currentArray, value];
            }
            return { ...prev, [field]: newArray };
        });
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    }, [errors]);

    // Auto-save progress every 30 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (status === SurveyStatus.IN_PROGRESS && responses.email) {
                const currentSectionId = SECTIONS[currentSection].id;
                const progressPercentage = Math.round(((currentSection + 1) / SECTIONS.length) * 100);
                autoSaveProgress(responses, sessionId, currentSectionId, progressPercentage)
                    .then(() => console.log('Progress auto-saved'))
                    .catch(err => console.error('Auto-save failed:', err));
            }
        }, 30000); // Auto-save every 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [responses, currentSection, sessionId, status]);

    const validateSection = useCallback((sectionIndex: number): boolean => {
        const sectionId = SECTIONS[sectionIndex].id;
        const newErrors: Errors = {};
        let isValid = true;
    
        const checkRequired = (field: keyof Responses, errorMsg: string) => {
            const value = responses[field];
            if (typeof value === 'string' && !value.trim()) {
                newErrors[field] = errorMsg;
                isValid = false;
            } else if (Array.isArray(value) && value.length === 0) {
                newErrors[field] = errorMsg;
                isValid = false;
            } else if (Array.isArray(value) && value.length > 0 && value.every(item => item === '')) {
                // For ranking questions
                newErrors[field] = errorMsg;
                isValid = false;
            }
        };
    
        switch (sectionId) {
            case 'demographics':
                checkRequired('email', 'Email address is required.');
                if (responses.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responses.email)) {
                    newErrors.email = 'Please enter a valid email address.';
                    isValid = false;
                }
                checkRequired('companyName', 'Company name is required.');
                checkRequired('industry', 'Please select an industry.');
                if (responses.industry === 'other') checkRequired('industryOther', 'Please specify your industry.');
                checkRequired('role', 'Please select your role.');
                if (responses.role === 'other') checkRequired('roleOther', 'Please specify your role.');
                checkRequired('unitCount', 'Please select the number of units.');
                break;
            case 'usage':
                checkRequired('personalAiUsage', 'This field is required.');
                checkRequired('orgAiUsage', 'This field is required.');
                checkRequired('aiAdoptionDate', 'This field is required.');
                checkRequired('aiUsageChange', 'This field is required.');
                break;
            case 'tools':
                checkRequired('aiTools', 'Please select at least one option.');
                if(responses.orgAiUsage !== 'not_using') {
                    checkRequired('primaryAiTool', 'Please select a primary tool.');
                    checkRequired('aiUseCases', 'Please select at least one use case.');
                }
                break;
            case 'corporate':
                checkRequired('corporateAiUse', 'Please select at least one option.');
                break;
            case 'franchisee':
                checkRequired('franchiseeAiSupport', 'This field is required.');
                if (['yes_extensively', 'yes_moderately', 'yes_in_limited_ways'].includes(responses.franchiseeAiSupport)) {
                    checkRequired('franchiseeSupportMethods', 'Please select at least one support method.');
                }
                break;
            case 'roi':
                if (responses.orgAiUsage !== 'not_using') {
                    checkRequired('measuredRoi', 'This field is required.');
                }
                break;
            case 'challenges':
                checkRequired('challengesRanked', 'Please rank your top challenges.');
                checkRequired('aiKnowledgeLevel', 'This field is required.');
                checkRequired('dedicatedAiExpertise', 'This field is required.');
                break;
            case 'data':
                checkRequired('centralizedDataPlatform', 'This field is required.');
                break;
            case 'customer':
                checkRequired('customerFacingAi', 'This field is required.');
                break;
            case 'future':
                checkRequired('aiPriorities', 'Please rank your top priorities.');
                checkRequired('greatestAiPotential', 'Please select at least one area.');
                checkRequired('increaseAiInvestment2026', 'This field is required.');
                checkRequired('adoptionAccelerators', 'Please rank the accelerators.');
                break;
            case 'ethics':
                checkRequired('aiPolicy', 'This field is required.');
                checkRequired('ethicalConcerns', 'Please select at least one option.');
                checkRequired('aiForCompliance', 'This field is required.');
                break;
            case 'trends':
                checkRequired('competitorComparison', 'This field is required.');
                checkRequired('excitingAiTrend', 'This field is required.');
                break;
            case 'satisfaction':
                // All questions are scale, which have defaults.
                break;
        }
        
        setErrors(newErrors);
        return isValid;
    }, [responses]);

    const handleNext = async () => {
        if (validateSection(currentSection)) {
            if (currentSection < SECTIONS.length - 1) {
                const nextSection = currentSection + 1;
                setCurrentSection(nextSection);
                if (!history.includes(nextSection)) {
                    setHistory(prev => [...prev, nextSection]);
                }
                window.scrollTo(0, 0);
            } else {
                // Final submission
                setIsSubmitting(true);
                setSubmissionError(null);

                try {
                    const result = await submitSurveyResponse(responses, sessionId);

                    if (result.success) {
                        setSubmissionSuccess(true);
                        setStatus(SurveyStatus.COMPLETED);
                        // Clear session storage on successful submission
                        localStorage.removeItem('survey_session_id');
                    } else {
                        setSubmissionError('Failed to submit survey. Please try again or download your responses as backup.');
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    setSubmissionError('An error occurred while submitting. Please try again or download your responses as backup.');
                } finally {
                    setIsSubmitting(false);
                }

                window.scrollTo(0, 0);
            }
        } else {
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (currentSection > 0) {
            setCurrentSection(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const jumpToSection = (index: number) => {
        if (history.includes(index) && index < currentSection) {
            setCurrentSection(index);
            window.scrollTo(0, 0);
        }
    };

    if (status === SurveyStatus.COMPLETED) {
        return <main className="min-h-screen bg-brand-gray-cloud flex items-center justify-center p-4"><CompletionScreen responses={responses} submissionSuccess={submissionSuccess} /></main>;
    }

    const currentSectionData = SECTIONS[currentSection];
    const totalTime = SECTIONS.reduce((acc, s) => acc + s.estimatedMinutes, 0);
    const remainingTime = SECTIONS.slice(currentSection).reduce((acc, s) => acc + s.estimatedMinutes, 0);

    return (
        <main className="min-h-screen bg-brand-gray-cloud p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-8">
                    <img src="https://dhqupibzlgpkwagmkjtg.supabase.co/storage/v1/object/public/images/Asset%201@4x-8.png" alt="Business Logo" className="h-16 mx-auto mb-4" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark-bg mb-2">2025 AI in Franchising Survey</h1>
                    <p className="text-brand-gray-graphite">Thank you for contributing to this important industry research.</p>
                </header>

                <div className="bg-white border border-brand-gray-smoke p-6 sm:p-8 rounded-xl shadow-lg">
                    <ProgressBar currentSection={currentSection} sections={SECTIONS} history={history} jumpToSection={jumpToSection} groups={PROGRESS_BAR_GROUPS} />
                    
                    <div className="flex justify-between items-center border-t border-b border-brand-gray-smoke py-4 mb-8">
                        <div>
                            <span className="text-2xl mr-3">{currentSectionData.icon}</span>
                            <span className="text-xl font-bold text-brand-dark-bg">{currentSectionData.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-brand-gray-graphite">
                            <Clock className="w-4 h-4 mr-1.5" />
                            <span>Est. {remainingTime} mins remaining</span>
                        </div>
                    </div>

                    {renderSectionComponent(currentSection, { responses, updateResponse, toggleArrayItem, errors, jumpToSection })}

                    {submissionError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {submissionError}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-brand-gray-smoke flex justify-between items-center">
                        <button onClick={handlePrev} disabled={currentSection === 0 || isSubmitting} className="flex items-center px-4 py-2 font-bold text-brand-dark-bg bg-brand-gray-smoke rounded-lg hover:bg-brand-gray-steel/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="flex items-center px-6 py-3 font-bold text-white bg-brand-orange rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : (currentSection === SECTIONS.length - 1 ? 'Submit' : 'Next')}
                            {!isSubmitting && (currentSection === SECTIONS.length - 1 ? <Check className="w-5 h-5 ml-2" /> : <ChevronRight className="w-5 h-5 ml-2" />)}
                        </button>
                    </div>
                </div>
            </div>
             {!isChatbotOpen && (
                <button
                    onClick={() => setIsChatbotOpen(true)}
                    className="fixed bottom-6 right-6 bg-brand-orange text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-orange-light transition-colors"
                    aria-label="Open AI Assistant"
                >
                    <MessageCircle className="w-8 h-8" />
                </button>
            )}
            <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        </main>
    );
};

export default App;