import { MoodLevel } from '@/types';

export interface HistoryBlockProps {
  entries: import('@/types').JournalEntry[];
  onEntryClick: (entry: import('@/types').JournalEntry) => void;
  onEmptyDateClick: (date: Date) => void;
}

// Helper to map mood to modern gradient styles
export const getMoodStyle = (mood?: MoodLevel) => {
    switch (mood) {
        case MoodLevel.Terrible: 
            return 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-lg shadow-slate-500/30 border border-white/10 text-white';
        case MoodLevel.Bad: 
            return 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30 border border-white/10 text-white';
        case MoodLevel.Neutral: 
            return 'bg-gradient-to-br from-indigo-300 to-indigo-400 shadow-lg shadow-indigo-400/30 border border-white/10 text-white';
        case MoodLevel.Good: 
            return 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30 border border-white/10 text-white';
        case MoodLevel.Excellent: 
            return 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 border border-white/10 text-white';
        default: 
            return 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-transparent';
    }
};
