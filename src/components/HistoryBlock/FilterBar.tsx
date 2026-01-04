import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { MoodLevel } from '@/types';
import { MOOD_OPTIONS } from '@/constants';

interface FilterBarProps {
  showFilters: boolean;
  searchQuery: string;
  filterMood: MoodLevel | null;
  filterTag: string | null;
  availableTags: string[];
  hasActiveFilters: boolean;
  onSearchChange: (query: string) => void;
  onMoodChange: (mood: MoodLevel | null) => void;
  onTagChange: (tag: string | null) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showFilters,
  searchQuery,
  filterMood,
  filterTag,
  availableTags,
  hasActiveFilters,
  onSearchChange,
  onMoodChange,
  onTagChange,
  onClearFilters
}) => {
  return (
    <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${showFilters ? 'max-h-[250px] md:max-h-[200px] mb-4 opacity-100' : 'max-h-0 mb-0 opacity-0'}`}>
      <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-100 dark:border-white/5 space-y-3">
        {/* Search Input */}
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-vespera-accent transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm ký ức, địa điểm, nội dung..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-vespera-accent/20 focus:border-vespera-accent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 transition-all"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Mood Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">Cảm xúc:</span>
            {MOOD_OPTIONS.map((option) => {
              const isSelected = filterMood === option.level;
              return (
                <button
                  key={option.level}
                  onClick={() => onMoodChange(isSelected ? null : option.level)}
                  className={`p-1.5 rounded-lg transition-all border shrink-0 ${isSelected ? `bg-white dark:bg-white/10 border-${option.color.split('-')[1]}-400 shadow-sm scale-105` : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-white/5 opacity-50 hover:opacity-100'}`}
                  title={option.label}
                >
                  <option.icon size={16} className={option.color} fill={isSelected ? "currentColor" : "none"} />
                </button>
              );
            })}
          </div>
          
          <div className="hidden md:block w-px bg-gray-200 dark:bg-white/10"></div>

          {/* Tags Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 flex-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">Thẻ:</span>
            {availableTags.map(tag => {
              const isSelected = filterTag === tag;
              return (
                <button 
                  key={tag}
                  onClick={() => onTagChange(isSelected ? null : tag)}
                  className={`text-[10px] px-2.5 py-1 rounded-md whitespace-nowrap border transition-all ${isSelected ? 'bg-vespera-accent text-white border-vespera-accent shadow-sm' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-vespera-accent/50 hover:text-vespera-accent'}`}
                >
                  #{tag}
                </button>
              )
            })}
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <button 
              onClick={onClearFilters}
              className="text-[10px] font-bold text-red-400 hover:text-red-500 whitespace-nowrap ml-auto self-center bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-md transition-colors"
            >
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilterBar);
