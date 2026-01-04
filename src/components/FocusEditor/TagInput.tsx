import React, { useState } from 'react';
import { Hash, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  currentTag: string;
  availableTags: string[];
  onTagAdd: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onCurrentTagChange: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  currentTag,
  availableTags,
  onTagAdd,
  onTagRemove,
  onCurrentTagChange
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestedTags = availableTags.filter(
    tag => tag.toLowerCase().includes(currentTag.toLowerCase()) && !tags.includes(tag)
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        onTagAdd(currentTag.trim());
        onCurrentTagChange('');
        setShowSuggestions(false);
      }
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onTagAdd(tag.trim());
      onCurrentTagChange('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      {/* Suggestions Dropdown */}
      {showSuggestions && currentTag && suggestedTags.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#1A1A2E] border border-gray-100 dark:border-white/10 rounded-lg shadow-xl overflow-hidden max-h-32 overflow-y-auto z-50">
          {suggestedTags.map(tag => (
            <div 
              key={tag} 
              className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/10 text-xs cursor-pointer text-gray-600 dark:text-gray-300" 
              onMouseDown={(e) => { e.preventDefault(); handleAddTag(tag); }}
            >
              #{tag}
            </div>
          ))}
        </div>
      )}

      {/* Tag Input Container */}
      <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl flex-wrap border border-transparent focus-within:border-vespera-accent/30 transition-colors">
        <Hash size={16} className="text-gray-400" />
        
        {/* Existing Tags */}
        {tags.map(tag => (
          <span 
            key={tag} 
            className="animate-fade-in px-2.5 py-1 rounded-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/40 dark:to-purple-900/20 text-purple-700 dark:text-purple-200 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm border border-purple-100 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all select-none whitespace-nowrap"
          >
            #{tag}
            <button
              onClick={() => onTagRemove(tag)}
              className="p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-400 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        
        {/* Input Field */}
        <input 
          type="text" 
          value={currentTag} 
          onChange={(e) => { onCurrentTagChange(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)} 
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown} 
          placeholder="Thêm thẻ..."
          className="bg-transparent border-none p-0 text-xs focus:ring-0 flex-1 min-w-[60px] outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default React.memo(TagInput);
