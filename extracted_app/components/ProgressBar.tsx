import React from 'react';
import { Check } from 'lucide-react';
import { Section, ProgressBarGroup } from '../types';

interface ProgressBarProps {
  currentSection: number;
  sections: Section[];
  history: number[];
  jumpToSection: (index: number) => void;
  groups: ProgressBarGroup[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentSection, sections, history, jumpToSection, groups }) => {
  const progress = ((currentSection) / (sections.length - 1)) * 100;

  const currentSectionId = sections[currentSection]?.id;
  const currentGroup = groups.find(g => g.sectionIds.includes(currentSectionId));
  const currentGroupIndex = currentGroup ? groups.indexOf(currentGroup) : -1;

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-brand-dark-bg">Progress</span>
        <span className="text-sm font-semibold text-brand-orange">{currentSection === sections.length - 1 ? 100 : Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-brand-gray-smoke rounded-full h-2">
        <div
          className="bg-brand-orange h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-4">
        {groups.map((group, idx) => {
          const isActive = idx === currentGroupIndex;
          const isCompleted = idx < currentGroupIndex;
          const canJump = isCompleted;
          
          const firstSectionId = group.sectionIds[0];
          const firstSectionIndex = sections.findIndex(s => s.id === firstSectionId);

          const isFirstSectionInHistory = history.includes(firstSectionIndex);

          return (
            <button
              key={group.name}
              onClick={() => (canJump && isFirstSectionInHistory) && jumpToSection(firstSectionIndex)}
              disabled={!canJump || !isFirstSectionInHistory}
              className={'flex flex-col items-center flex-1 text-center group disabled:cursor-default min-w-0'}
              aria-label={group.name}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium mb-1 border-2 transition-all ${
                isActive ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' :
                isCompleted ? 'bg-green-100 border-green-300 text-green-600 group-hover:border-green-500' :
                'bg-white border-brand-gray-smoke text-brand-gray-steel opacity-60'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : group.icon}
              </div>
              <span className={`text-xs font-medium hidden sm:block transition-colors ${
                isActive ? 'text-brand-dark-bg font-semibold' :
                isCompleted ? 'text-brand-gray-graphite group-hover:text-brand-dark-bg' :
                'text-brand-gray-steel opacity-60'
              }`}>{group.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
