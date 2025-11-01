import React, { useState, useCallback, useId, useMemo, useEffect, useRef } from 'react';
import { SECTIONS, INITIAL_RESPONSES, PROGRESS_BAR_GROUPS } from './constants';
import { Responses, Errors, SurveyStatus, Section } from './types';
import ProgressBar from './components/ProgressBar';
import IntroScreen from './components/IntroScreen';
import CompletionScreen from './components/WelcomeScreen';
import Chatbot from './components/Chatbot';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Edit2, Clock, ChevronsUpDown, MessageCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { submitSurveyResponse, generateSessionId } from './supabaseClient';
import { sanitizeInput } from './lib/sanitize';
import {
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
    AGNTMKT_FOLLOWUP_OPTIONS,
} from './surveyOptions';
import { REVIEW_SECTIONS, formatReviewAnswer } from './reviewConfig';

const getSectionIndexById = (id: string) => SECTIONS.findIndex(section => section.id === id);

const CHAT_PROMPT_STORAGE_KEY = 'agntmkt_chat_prompt_dismissed';

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

const CorporateAIMatrixInput: React.FC<{
  label: string;
  description?: string;
  departments: { id: string; label: string }[];
  purposes: { value: string; label: string; isExclusive?: boolean }[];
  value: Record<string, string[]>;
  onChange: (departmentId: string, selections: string[]) => void;
  required?: boolean;
  error?: string | null;
}> = ({ label, description, departments, purposes, value, onChange, required, error }) => {
  const purposeOrder = useMemo<Record<string, number>>(() => {
    const orderMap: Record<string, number> = {};
    purposes.forEach((option, index) => {
      orderMap[option.value] = index;
    });
    return orderMap;
  }, [purposes]);

  const exclusiveValues = useMemo(
    () => purposes.filter(option => option.isExclusive).map(option => option.value),
    [purposes]
  );

  const toggleSelection = (departmentId: string, optionValue: string) => {
    const currentSelections = value[departmentId] ?? [];
    const option = purposes.find(p => p.value === optionValue);
    let nextSelections: string[];

    if (currentSelections.includes(optionValue)) {
      nextSelections = currentSelections.filter(item => item !== optionValue);
    } else if (option?.isExclusive) {
      nextSelections = [optionValue];
    } else {
      const withoutExclusive = currentSelections.filter(item => !exclusiveValues.includes(item));
      nextSelections = [...withoutExclusive, optionValue];
    }

    const sorted = nextSelections.sort((a, b) => (purposeOrder[a] ?? 0) - (purposeOrder[b] ?? 0));
    onChange(departmentId, sorted);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark-bg mb-1">
        {label}
        {required && <span className="text-brand-orange ml-1">*</span>}
      </label>
      {description && <p className="text-sm text-brand-gray-graphite mb-3">{description}</p>}
      <div className="space-y-4">
        {departments.map((department) => {
          const selections = value[department.id] ?? [];
          const hasExclusiveSelection = selections.some(selection => exclusiveValues.includes(selection));
          return (
            <div key={department.id} className="border border-brand-gray-smoke rounded-lg p-4 bg-white shadow-sm">
              <h4 className="text-sm font-semibold text-brand-dark-bg">{department.label}</h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {purposes.map((purpose) => {
                  const isSelected = selections.includes(purpose.value);
                  const isExclusive = !!purpose.isExclusive;
                  const isDisabled = !isSelected && hasExclusiveSelection && !isExclusive;
                  return (
                    <label
                      key={purpose.value}
                      className={`flex items-center p-3 border rounded-lg transition-all ${isSelected ? 'bg-brand-orange/10 border-brand-orange ring-1 ring-brand-orange' : 'bg-white border-brand-gray-smoke hover:border-brand-gray-steel'} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(department.id, purpose.value)}
                        disabled={isDisabled}
                        className="w-4 h-4 text-brand-orange border-brand-gray-steel rounded focus:ring-brand-orange focus:ring-offset-0"
                      />
                      <span className="ml-3 text-sm text-brand-dark-bg">{purpose.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500 mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
    </div>
  );
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
  openReviewSection?: string | null;
  onToggleReviewSection?: (sectionId: string) => void;
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
                  <RadioGroupInput label="Q3. What industry is your franchise brand in?" required error={props.errors.industry} value={props.responses.industry} onChange={v => props.updateResponse('industry', v)} options={INDUSTRY_OPTIONS} otherValue={props.responses.industryOther} onOtherChange={v => props.updateResponse('industryOther', v)} />
                  <RadioGroupInput label="Q4. What is your role/title?" required error={props.errors.role} value={props.responses.role} onChange={v => props.updateResponse('role', v)} options={ROLE_OPTIONS} otherValue={props.responses.roleOther} onOtherChange={v => props.updateResponse('roleOther', v)} />
                  <SelectInput label="Q5. How many franchise units does your brand have?" required error={props.errors.unitCount} value={props.responses.unitCount} onChange={v => props.updateResponse('unitCount', v)} options={UNIT_COUNT_OPTIONS} />
                  <SelectInput label="Q6. What is your brand's annual system-wide revenue?" value={props.responses.annualRevenue} onChange={v => props.updateResponse('annualRevenue', v)} options={ANNUAL_REVENUE_OPTIONS} />
                </>
            );
            case 'usage': return (
              <>
                <RadioGroupInput label="Q7. How often are you personally using AI tools?" required error={props.errors.personalAiUsage} value={props.responses.personalAiUsage} onChange={v => props.updateResponse('personalAiUsage', v)} options={PERSONAL_AI_USAGE_OPTIONS} />
                <RadioGroupInput label="Q8. How often is your organization using AI tools?" required error={props.errors.orgAiUsage} value={props.responses.orgAiUsage} onChange={v => props.updateResponse('orgAiUsage', v)} options={ORG_AI_USAGE_OPTIONS} />
                <RadioGroupInput label="Q9. How has your AI usage changed in the past 12 months?" required error={props.errors.aiUsageChange} value={props.responses.aiUsageChange} onChange={v => props.updateResponse('aiUsageChange', v)} options={AI_USAGE_CHANGE_OPTIONS} />
              </>
            );
            case 'tools': return (
              <>
                <CheckboxGroupInput label="Q10. Which AI tools or platforms is your organization currently using?" description="(Select all that apply)" required error={props.errors.aiTools} value={props.responses.aiTools} onChange={(v, e) => props.toggleArrayItem('aiTools', v, e)} otherValues={{'industry-specific_specify': props.responses.aiToolsIndustrySpecific, 'custom_specify': props.responses.aiToolsCustom, 'other_specify': props.responses.aiToolsOther}} onOtherChange={(k, v) => { if (k === 'industry-specific_specify') props.updateResponse('aiToolsIndustrySpecific', v); else if (k === 'custom_specify') props.updateResponse('aiToolsCustom', v); else props.updateResponse('aiToolsOther', v)}} options={AI_TOOL_OPTIONS} />
                { isAiUsed && <>
                    <RadioGroupInput label="Q11. What is the primary AI model/platform your organization relies on most?" required error={props.errors.primaryAiTool} value={props.responses.primaryAiTool} onChange={v => props.updateResponse('primaryAiTool', v)} options={PRIMARY_AI_TOOL_OPTIONS} />
                    <CheckboxGroupInput label="Q12. For what purposes do you use AI tools?" description="(Select all that apply)" required error={props.errors.aiUseCases} value={props.responses.aiUseCases} onChange={(v, e) => props.toggleArrayItem('aiUseCases', v, e)} otherValues={{'other_specify': props.responses.aiUseCasesOther}} onOtherChange={(k,v) => props.updateResponse('aiUseCasesOther', v)} options={AI_USE_CASE_OPTIONS} />
                </>}
              </>
            );
            case 'corporate': return (
              <>
                <CorporateAIMatrixInput
                  label="Q13. Which departments at your corporate office are using AI, and for what purposes?"
                  description="Select all purposes that apply for each department."
                  required
                  error={props.errors.corporateAiMatrix}
                  departments={CORPORATE_DEPARTMENT_ROWS}
                  purposes={CORPORATE_PURPOSE_OPTIONS}
                  value={props.responses.corporateAiMatrix}
                  onChange={(departmentId, selections) => {
                    const nextMatrix = { ...props.responses.corporateAiMatrix };
                    if (selections.length > 0) {
                      nextMatrix[departmentId] = selections;
                    } else {
                      delete nextMatrix[departmentId];
                    }
                    props.updateResponse('corporateAiMatrix', nextMatrix);
                  }}
                />
              </>
            );
            case 'franchisee': return (
              <>
                <RadioGroupInput label="Q14. Are you currently using AI to support your franchisees?" required error={props.errors.franchiseeAiSupport} value={props.responses.franchiseeAiSupport} onChange={v => props.updateResponse('franchiseeAiSupport', v)} options={FRANCHISEE_AI_SUPPORT_OPTIONS} />
                { areFranchiseesSupported &&
                  <CheckboxGroupInput label="Q15. How are you supporting franchisees with AI?" description="(Select all that apply)" required error={props.errors.franchiseeSupportMethods} value={props.responses.franchiseeSupportMethods} onChange={(v, e) => props.toggleArrayItem('franchiseeSupportMethods', v, e)} otherValues={{'other_specify': props.responses.franchiseeSupportMethodsOther}} onOtherChange={(k,v) => props.updateResponse('franchiseeSupportMethodsOther', v)} options={FRANCHISEE_SUPPORT_METHOD_OPTIONS} />
                }
                <SelectInput label="Q16. What percentage of your franchisees are actively using AI tools?" value={props.responses.franchiseeAdoptionRate} onChange={v => props.updateResponse('franchiseeAdoptionRate', v)} options={FRANCHISEE_ADOPTION_RATE_OPTIONS} />
                <CheckboxGroupInput label="Q17. How do franchisees primarily learn about AI tools?" description="(Select all that apply)" value={props.responses.franchiseeAiLearning} onChange={(v,e)=>props.toggleArrayItem('franchiseeAiLearning',v,e)} otherValues={{'other_specify': props.responses.franchiseeAiLearningOther}} onOtherChange={(k,v) => props.updateResponse('franchiseeAiLearningOther', v)} options={FRANCHISEE_AI_LEARNING_OPTIONS} />
              </>
            );
            case 'investment': return (
              <>
                <SelectInput label="Q18. What is your organization's annual AI investment/budget for 2025?" value={props.responses.annualAiBudget} onChange={v => props.updateResponse('annualAiBudget', v)} options={ANNUAL_AI_BUDGET_OPTIONS} />
                <SelectInput label="Q19. How has your AI budget changed from 2024 to 2025?" value={props.responses.aiBudgetChange} onChange={v => props.updateResponse('aiBudgetChange', v)} options={AI_BUDGET_CHANGE_OPTIONS} />
                <RadioGroupInput label="Q20. Who has primary responsibility for AI investment decisions?" value={props.responses.aiInvestmentDecisionMaker} onChange={v => props.updateResponse('aiInvestmentDecisionMaker', v)} options={AI_INVESTMENT_DECISION_MAKER_OPTIONS} />
              </>
            );
            case 'roi': return (
              <>
                <RadioGroupInput label="Q21. Have you measured ROI or business impact from AI implementation?" required={isAiUsed} error={props.errors.measuredRoi} value={props.responses.measuredRoi} onChange={v => props.updateResponse('measuredRoi', v)} options={MEASURED_ROI_OPTIONS} />
                <CheckboxGroupInput label="Q22. What measurable improvements have you seen from AI adoption?" description="(Select all that apply)" value={props.responses.measuredImprovements} onChange={(v, e) => props.toggleArrayItem('measuredImprovements', v, e)} otherValues={{'other_specify': props.responses.measuredImprovementsOther}} onOtherChange={(k,v) => props.updateResponse('measuredImprovementsOther', v)} options={MEASURED_IMPROVEMENTS_OPTIONS} />
              </>
            );
            case 'challenges': return (
              <>
                <RankingInput label="Q23. What are the biggest challenges your organization faces with AI implementation? (Rank top 5)" maxRank={5} required error={props.errors.challengesRanked} value={props.responses.challengesRanked} onChange={v => props.updateResponse('challengesRanked', v)} options={CHALLENGES_OPTIONS} />
                <RadioGroupInput label="Q24. Do you have dedicated AI expertise on your team?" required error={props.errors.dedicatedAiExpertise} value={props.responses.dedicatedAiExpertise} onChange={v => props.updateResponse('dedicatedAiExpertise', v)} options={DEDICATED_AI_EXPERTISE_OPTIONS} />
              </>
            );
            case 'data': return (
              <>
                <ScaleInput required label="Q25. How would you rate your organization's data infrastructure readiness for AI? (1-5 scale)" value={props.responses.dataInfrastructureReadiness} onChange={v => props.updateResponse('dataInfrastructureReadiness', v)} minLabel="Very Poor" maxLabel="Excellent" description="1: Little to no usable data. 5: Fully prepared with centralized, clean data." />
                <RadioGroupInput label="Q26. Do you use a centralized data platform or data warehouse?" required error={props.errors.centralizedDataPlatform} value={props.responses.centralizedDataPlatform} onChange={v => props.updateResponse('centralizedDataPlatform', v)} options={CENTRALIZED_DATA_PLATFORM_OPTIONS} />
                <CheckboxGroupInput label="Q27. What data sources are you using for AI?" description="(Select all that apply)" value={props.responses.dataSources} onChange={(v,e)=>props.toggleArrayItem('dataSources',v,e)} otherValues={{'other_specify': props.responses.dataSourcesOther}} onOtherChange={(k,v)=>props.updateResponse('dataSourcesOther',v)} options={DATA_SOURCES_OPTIONS} />
              </>
            );
            case 'customer': return (
              <>
                <RadioGroupInput label="Q28. Do you use AI in customer-facing applications?" required error={props.errors.customerFacingAi} value={props.responses.customerFacingAi} onChange={v => props.updateResponse('customerFacingAi', v)} options={CUSTOMER_FACING_AI_OPTIONS} />
                {hasCustomerFacingAi && <>
                  <CheckboxGroupInput label="Q29. How do customers interact with AI at your locations?" description="(Select all that apply)" value={props.responses.customerAiInteractions} onChange={(v,e)=>props.toggleArrayItem('customerAiInteractions',v,e)} otherValues={{'other_specify':props.responses.customerAiInteractionsOther}} onOtherChange={(k,v)=>props.updateResponse('customerAiInteractionsOther',v)} options={CUSTOMER_AI_INTERACTIONS_OPTIONS} />
                  <RadioGroupInput label="Q30. Have you received feedback from customers about AI interactions?" value={props.responses.customerFeedback} onChange={v => props.updateResponse('customerFeedback', v)} options={CUSTOMER_FEEDBACK_OPTIONS} />
                </>}
              </>
            );
            case 'future': return (
              <>
                <RadioGroupInput label="Q31. Where do you see the greatest potential for AI specifically at your brand?" required error={props.errors.greatestAiPotential} value={props.responses.greatestAiPotential} onChange={v => props.updateResponse('greatestAiPotential', v)} options={GREATEST_AI_POTENTIAL_SINGLE_OPTIONS} otherValue={props.responses.greatestAiPotentialOther} onOtherChange={v => props.updateResponse('greatestAiPotentialOther', v)} />
                <RadioGroupInput label="Q32. How likely is your organization to increase AI investment in 2026?" required error={props.errors.increaseAiInvestment2026} value={props.responses.increaseAiInvestment2026} onChange={v => props.updateResponse('increaseAiInvestment2026', v)} options={INCREASE_AI_INVESTMENT_OPTIONS} />
                <RankingInput label="Q33. What would most accelerate AI adoption in your organization? (Rank top 3)" maxRank={3} required error={props.errors.adoptionAccelerators} value={props.responses.adoptionAccelerators} onChange={v => props.updateResponse('adoptionAccelerators', v)} options={ADOPTION_ACCELERATORS_OPTIONS} />
              </>
            );
            case 'ethics': return (
              <>
                <RadioGroupInput label="Q34. Does your organization have formal policies governing AI use?" required error={props.errors.aiPolicy} value={props.responses.aiPolicy} onChange={v => props.updateResponse('aiPolicy', v)} options={AI_POLICY_OPTIONS} />
                <CheckboxGroupInput label="Q35. What ethical considerations concern you about AI?" description="(Select all that apply)" required error={props.errors.ethicalConcerns} value={props.responses.ethicalConcerns} onChange={(v, e) => props.toggleArrayItem('ethicalConcerns', v, e)} otherValues={{'other_specify': props.responses.ethicalConcernsOther}} onOtherChange={(k,v) => props.updateResponse('ethicalConcernsOther', v)} options={ETHICAL_CONCERNS_OPTIONS} />
                <ScaleInput label="Q36. How concerned are you about AI's impact on jobs within your organization? (1-5 scale)" required value={props.responses.jobImpactConcern} onChange={v => props.updateResponse('jobImpactConcern', v)} minLabel="Not at all concerned" maxLabel="Extremely concerned" />
                <RadioGroupInput label="Q37. Are you using AI for compliance or risk management?" value={props.responses.aiForCompliance} onChange={v => props.updateResponse('aiForCompliance', v)} options={AI_FOR_COMPLIANCE_OPTIONS} />
              </>
            );
            case 'trends': return (
              <>
                <RadioGroupInput label="Q38. How would you describe your organization's approach to AI compared to competitors?" required error={props.errors.competitorComparison} value={props.responses.competitorComparison} onChange={v => props.updateResponse('competitorComparison', v)} options={COMPETITOR_COMPARISON_OPTIONS} />
                <TextAreaInput label="Q39. What AI trend are you most excited or concerned about for franchising?" required error={props.errors.excitingAiTrend} value={props.responses.excitingAiTrend} onChange={v => props.updateResponse('excitingAiTrend', v)} placeholder="e.g., Hyper-personalization, generative AI for marketing, predictive analytics for site selection..." />
              </>
            );
            case 'satisfaction': return (
                <>
                  <ScaleInput label="Q40. How comfortable are you personally with using AI tools? (1-5 scale)" required value={props.responses.personalAiComfort} onChange={v => props.updateResponse('personalAiComfort', v)} minLabel="Very uncomfortable" maxLabel="Very comfortable" />
                  <TextAreaInput label="Q41. What AI capabilities are you most hoping to see developed for franchising?" value={props.responses.desiredAiCapabilities} onChange={v => props.updateResponse('desiredAiCapabilities', v)} placeholder="e.g., Better integration with our CRM, more industry-specific knowledge, voice command capabilities..." />
                </>
            );
            case 'closing': return (
              <>
                <RadioGroupInput label="Q42. Would you like to receive a complimentary copy of the 2025 AI in Franchising Report?" value={props.responses.receiveReport} onChange={v => props.updateResponse('receiveReport', v)} options={RECEIVE_REPORT_OPTIONS} />
                <TextAreaInput label="Q43. Is there anything about AI in franchising you'd like to know more about, or a topic we didn't ask about that we should have included?" value={props.responses.surveyFeedback} onChange={v => props.updateResponse('surveyFeedback', v)} placeholder="Share topics or questions you'd like us to cover in future surveys." />
                <RadioGroupInput label="Q44. AGNTMKT puts out this report every year completely free because we believe in franchising and the power of sharing ideas. If you're not sure where to start with AI, we'd love an opportunity to meet with you and share our solutions - or check out our website at agntmkt.ai. Would you like us to follow up with you?" value={props.responses.agntmktFollowup} onChange={v => props.updateResponse('agntmktFollowup', v)} options={AGNTMKT_FOLLOWUP_OPTIONS} />
              </>
            );
            case 'review':
                const anyErrors = Object.values(props.errors).some(e => e !== null);
                return (
                <>
                    <h2 className="text-xl font-bold text-brand-dark-bg mb-4">Review Your Answers</h2>
                    <p className="mb-6 text-brand-gray-graphite">Expand a section below to review your responses. Use the edit button to jump back and make changes before submitting.</p>

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

                    <div className="space-y-3">
                        {REVIEW_SECTIONS.map((sectionConfig) => {
                            const sectionMeta = SECTIONS.find((meta) => meta.id === sectionConfig.id);
                            const sectionIndex = sectionMeta ? SECTIONS.indexOf(sectionMeta) : -1;
                            const isOpen = props.openReviewSection === sectionConfig.id;
                            return (
                                <div key={sectionConfig.id} className="border border-brand-gray-smoke rounded-lg bg-white">
                                    <div className="flex items-center justify-between p-4 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => props.onToggleReviewSection?.(sectionConfig.id)}
                                            className="flex items-center justify-between flex-1 text-left"
                                        >
                                            <span className="flex items-center space-x-3">
                                                <span className="text-lg">{sectionMeta?.icon ?? '📝'}</span>
                                                <span className="font-semibold text-brand-dark-bg">{sectionConfig.name}</span>
                                            </span>
                                            {isOpen ? <ChevronUp className="w-5 h-5 text-brand-gray-steel" /> : <ChevronDown className="w-5 h-5 text-brand-gray-steel" />}
                                        </button>
                                        {sectionIndex > -1 && (
                                            <button
                                                type="button"
                                                onClick={() => props.jumpToSection?.(sectionIndex)}
                                                className="flex items-center px-3 py-1.5 text-sm font-medium text-brand-dark-bg bg-brand-gray-smoke rounded-md hover:bg-brand-gray-steel/60 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                    {isOpen && (
                                        <div className="border-t border-brand-gray-smoke p-4 space-y-4 bg-brand-orange/5">
                                            {sectionConfig.questions.map((question) => {
                                                const answer = formatReviewAnswer(props.responses, question);
                                                return (
                                                    <div key={`${sectionConfig.id}-${question.field}`}> 
                                                        <p className="text-sm font-semibold text-brand-dark-bg">{question.question}</p>
                                                        {Array.isArray(answer) ? (
                                                            <ul className="mt-1 list-disc list-inside text-sm text-brand-gray-graphite space-y-1">
                                                                {answer.map((entry, idx) => (
                                                                    <li key={idx}>{entry}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="mt-1 text-sm text-brand-gray-graphite whitespace-pre-wrap">{answer}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
                );
            default: return null;
        }
    }
    return (
        <div className="space-y-6">
            {SectionContent()}
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
    const [responses, setResponses] = useState<Responses>(INITIAL_RESPONSES);
    const [errors, setErrors] = useState<Errors>({});
    const [currentSection, setCurrentSection] = useState(0);
    const [history, setHistory] = useState<number[]>([0]);
    const [status, setStatus] = useState<SurveyStatus>(SurveyStatus.NOT_STARTED);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [hasChatPromptBeenDismissed, setHasChatPromptBeenDismissed] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.localStorage.getItem(CHAT_PROMPT_STORAGE_KEY) === 'true';
    });
    const [showChatPrompt, setShowChatPrompt] = useState(false);
    const [chatPromptAnimating, setChatPromptAnimating] = useState(false);
    const [chatPromptVisible, setChatPromptVisible] = useState(false);
    const sessionIdRef = useRef<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [openReviewSection, setOpenReviewSection] = useState<string | null>(null);

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

    const getNextSectionIndex = useCallback((sectionIndex: number) => {
        const defaultNext = Math.min(sectionIndex + 1, SECTIONS.length - 1);
        const currentId = SECTIONS[sectionIndex]?.id;

        if (!currentId) {
            return defaultNext;
        }

        if (currentId === 'tools') {
            const notUsingAi = responses.aiTools.includes('not_using_ai');
            if (notUsingAi) {
                const targetIndex = getSectionIndexById('investment');
                if (targetIndex > sectionIndex) {
                    return targetIndex;
                }
            }
        }

        if (currentId === 'franchisee') {
            const supportsFranchisees = ['yes_extensively', 'yes_moderately', 'yes_in_limited_ways'].includes(responses.franchiseeAiSupport);
            if (!supportsFranchisees) {
                const targetIndex = getSectionIndexById('investment');
                if (targetIndex > sectionIndex) {
                    return targetIndex;
                }
            }
        }

        if (currentId === 'customer') {
            const hasCustomerFacingAi = ['yes_extensively', 'yes_moderately', 'yes_in_limited_ways'].includes(responses.customerFacingAi);
            if (!hasCustomerFacingAi) {
                const targetIndex = getSectionIndexById('future');
                if (targetIndex > sectionIndex) {
                    return targetIndex;
                }
            }
        }

        return defaultNext;
    }, [responses.aiTools, responses.franchiseeAiSupport, responses.customerFacingAi]);

    const validateSection = useCallback((sectionIndex: number): boolean => {
        const sectionId = SECTIONS[sectionIndex].id;
        const newErrors: Errors = {};
        let isValid = true;

        const checkRequired = <K extends keyof Responses>(field: K, errorMsg: string) => {
            const value = responses[field];

            if (typeof value === 'string') {
                const cleaned = sanitizeInput(value).trim();
                if (!cleaned) {
                    newErrors[field] = errorMsg;
                    isValid = false;
                }
                return;
            }

            if (Array.isArray(value)) {
                const sanitizedArray = (value as unknown[])
                    .map(item => (typeof item === 'string' ? sanitizeInput(item).trim() : item))
                    .filter(item => {
                        if (typeof item === 'string') {
                            return item.length > 0;
                        }
                        return item !== null && item !== undefined;
                    });

                if (sanitizedArray.length === 0) {
                    newErrors[field] = errorMsg;
                    isValid = false;
                }
                return;
            }

            if (value === null || value === undefined) {
                newErrors[field] = errorMsg;
                isValid = false;
            }
        };
    
        switch (sectionId) {
            case 'demographics': {
                checkRequired('email', 'Email address is required.');
                const sanitizedEmail = sanitizeInput(responses.email).trim();
                if (sanitizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
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
            }
            case 'usage':
                checkRequired('personalAiUsage', 'This field is required.');
                checkRequired('orgAiUsage', 'This field is required.');
                checkRequired('aiUsageChange', 'This field is required.');
                break;
            case 'tools':
                checkRequired('aiTools', 'Please select at least one option.');
                if(responses.orgAiUsage !== 'not_using') {
                    checkRequired('primaryAiTool', 'Please select a primary tool.');
                    checkRequired('aiUseCases', 'Please select at least one use case.');
                }
                break;
            case 'corporate': {
                const matrixSelections = Object.values(responses.corporateAiMatrix || {});
                const hasAnySelections = matrixSelections.some(selection => Array.isArray(selection) && selection.length > 0);
                if (!hasAnySelections) {
                    newErrors.corporateAiMatrix = 'Please map at least one department to a purpose.';
                    isValid = false;
                }
                break;
            }
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
                checkRequired('dedicatedAiExpertise', 'This field is required.');
                break;
            case 'data':
                checkRequired('centralizedDataPlatform', 'This field is required.');
                break;
            case 'customer':
                checkRequired('customerFacingAi', 'This field is required.');
                break;
            case 'future':
                checkRequired('greatestAiPotential', 'Please select an area.');
                if (responses.greatestAiPotential === 'other') {
                    checkRequired('greatestAiPotentialOther', 'Please specify the area of greatest potential.');
                }
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
                const nextSection = getNextSectionIndex(currentSection);
                setCurrentSection(nextSection);
                setHistory(prev => (prev.includes(nextSection) ? prev : [...prev, nextSection]));
                if (SECTIONS[nextSection].id === 'review') {
                    setOpenReviewSection(null);
                }
                window.scrollTo(0, 0);
            } else {
                // Final submission
                setIsSubmitting(true);
                setSubmissionError(null);

                try {
                    const sessionId = sessionIdRef.current ?? (sessionIdRef.current = generateSessionId());
                    const result = await submitSurveyResponse(responses, sessionId);

                    if (result.success) {
                        sessionIdRef.current = null;
                        setSubmissionSuccess(true);
                        setStatus(SurveyStatus.COMPLETED);
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

    const handleToggleReviewSection = useCallback((sectionId: string) => {
        setOpenReviewSection(prev => (prev === sectionId ? null : sectionId));
    }, []);

    const handleStartSurvey = () => {
        setStatus(SurveyStatus.IN_PROGRESS);
        window.scrollTo(0, 0);
    };

    const dismissChatPrompt = useCallback(() => {
        setShowChatPrompt(false);
        setHasChatPromptBeenDismissed(true);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(CHAT_PROMPT_STORAGE_KEY, 'true');
        }
    }, []);

    const handleChatPromptClick = useCallback(() => {
        setIsChatbotOpen(true);
        dismissChatPrompt();
    }, [dismissChatPrompt]);

    const handleChatPromptDismiss = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        dismissChatPrompt();
    }, [dismissChatPrompt]);

    const handleChatPromptKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleChatPromptClick();
        }
    }, [handleChatPromptClick]);

    const currentSectionData = SECTIONS[currentSection];
    const remainingTime = SECTIONS.slice(currentSection).reduce((acc, s) => acc + s.estimatedMinutes, 0);

    useEffect(() => {
        if (!showChatPrompt) {
            setChatPromptVisible(false);
            return;
        }

        if (typeof window === 'undefined') {
            setChatPromptVisible(true);
            return;
        }

        const frame = window.requestAnimationFrame(() => setChatPromptVisible(true));
        return () => window.cancelAnimationFrame(frame);
    }, [showChatPrompt]);

    useEffect(() => {
        if (!showChatPrompt) {
            return;
        }

        setChatPromptAnimating(true);

        const bounceTimer = window.setTimeout(() => setChatPromptAnimating(false), 1200);
        const dismissTimer = window.setTimeout(() => {
            dismissChatPrompt();
        }, 10000);

        return () => {
            window.clearTimeout(bounceTimer);
            window.clearTimeout(dismissTimer);
        };
    }, [showChatPrompt, dismissChatPrompt]);

    useEffect(() => {
        if (hasChatPromptBeenDismissed) {
            return;
        }

        const isDemographics = SECTIONS[currentSection]?.id === 'demographics';

        if (status === SurveyStatus.IN_PROGRESS && isDemographics && !isChatbotOpen && !showChatPrompt) {
            setShowChatPrompt(true);
        }
    }, [currentSection, hasChatPromptBeenDismissed, isChatbotOpen, showChatPrompt, status]);

    useEffect(() => {
        if (isChatbotOpen && !hasChatPromptBeenDismissed) {
            dismissChatPrompt();
        }
    }, [isChatbotOpen, hasChatPromptBeenDismissed, dismissChatPrompt]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-gray-cloud via-white to-brand-gray-cloud">
            {status === SurveyStatus.NOT_STARTED ? (
                <IntroScreen onStart={handleStartSurvey} />
            ) : status === SurveyStatus.COMPLETED ? (
                <main className="min-h-screen bg-brand-gray-cloud flex items-center justify-center p-4">
                    <CompletionScreen responses={responses} submissionSuccess={submissionSuccess} />
                </main>
            ) : (
                <main className="py-8 px-4 sm:px-6 md:px-8">
                    <div className="max-w-3xl mx-auto">
                        <header className="text-center mb-8">
                            <img src="https://dhqupibzlgpkwagmkjtg.supabase.co/storage/v1/object/public/images/Asset%201@4x-8.png" alt="Business Logo" className="h-16 mx-auto mb-4" />
                            <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark-bg mb-2">2025 AI in Franchising Survey</h1>
                            <p className="text-brand-gray-graphite">Thank you for contributing to our third annual AI in Franchising survey. Our goal is to share how AI is being used across the franchise industry. This survey covers topics like usuage, tools, implementation, investment and more. Thank you for taking the time to share your feedback.</p>
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

                            {renderSectionComponent(currentSection, { responses, updateResponse, toggleArrayItem, errors, jumpToSection, openReviewSection, onToggleReviewSection: handleToggleReviewSection })}

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
                                    {isSubmitting ? 'Submitting...' : (currentSection === SECTIONS.length - 1 ? 'Submit' : currentSectionData.id === 'closing' ? 'Review Your Answers' : 'Next')}
                                    {!isSubmitting && (currentSection === SECTIONS.length - 1 ? <Check className="w-5 h-5 ml-2" /> : <ChevronRight className="w-5 h-5 ml-2" />)}
                                </button>
                            </div>
                        </div>
                    </div>
                    {(!isChatbotOpen || showChatPrompt) && (
                        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-40">
                            {showChatPrompt && !isChatbotOpen && (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleChatPromptClick}
                                    onKeyDown={handleChatPromptKeyDown}
                                    className={`relative max-w-xs cursor-pointer rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#38bdf8] px-4 py-3 text-white shadow-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#2563eb] ${
                                        chatPromptVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                    } ${chatPromptAnimating ? 'animate-bounce' : ''}`}
                                    aria-label="Open AI assistant help"
                                >
                                    <p className="pr-6 text-sm font-medium leading-snug">Hi! Need help with the survey?</p>
                                    <button
                                        type="button"
                                        onClick={handleChatPromptDismiss}
                                        className="absolute right-2 top-2 rounded-full bg-white/20 p-1 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/70"
                                        aria-label="Dismiss chat helper"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            {!isChatbotOpen && (
                                <button
                                    onClick={() => setIsChatbotOpen(true)}
                                    className="bg-brand-orange text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-orange-light transition-colors"
                                    aria-label="Open AI Assistant"
                                >
                                    <MessageCircle className="w-8 h-8" />
                                </button>
                            )}
                        </div>
                    )}
                    <Chatbot
                        isOpen={isChatbotOpen}
                        onClose={() => setIsChatbotOpen(false)}
                        currentSectionData={{
                            sectionName: currentSectionData?.name ?? '',
                            sectionId: currentSectionData?.id ?? '',
                            responses
                        }}
                    />
                </main>
            )}
        </div>
    );
};

export default App;
