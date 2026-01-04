import React from 'react';
import { Sparkles, PenLine, RefreshCw } from 'lucide-react';

interface PromptCardProps {
  prompt: string;
  isIdle: boolean;
  onInsert: () => void;
  onRefresh: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isIdle,
  onInsert,
  onRefresh
}) => {
  return (
    <div className="flex items-start gap-3 mb-8 animate-fade-in group">
      <div className={`mt-0.5 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-vespera-accent dark:text-purple-300 transition-all duration-700 ${isIdle ? 'animate-pulse ring-4 ring-purple-100/50 dark:ring-purple-900/20' : ''}`}>
        <Sparkles size={14} fill="currentColor" className={isIdle ? "opacity-100" : "opacity-70"} />
      </div>
      
      <div className="flex-1">
        <p 
          onClick={onInsert}
          className="text-sm font-medium text-gray-500 dark:text-gray-400 italic leading-relaxed cursor-pointer hover:text-vespera-accent dark:hover:text-purple-300 transition-colors duration-200"
          title="Bấm để viết về chủ đề này"
        >
          {prompt}
        </p>
        
        <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={onInsert}
            className="flex items-center gap-1.5 text-[10px] font-bold text-vespera-accent uppercase tracking-wide hover:underline"
          >
            <PenLine size={10} />
            Viết về điều này
          </button>
          <button 
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wide hover:underline"
          >
            <RefreshCw size={10} />
            Đổi câu hỏi
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PromptCard);
