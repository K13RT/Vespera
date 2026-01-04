import React from 'react';
import { Calendar as CalendarIcon, Hash, Edit2, MapPin } from 'lucide-react';
import { JournalEntry } from '@/types';

interface EntryCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick }) => {
  const dateObj = new Date(entry.date);
  const isDateValid = !isNaN(dateObj.getTime());

  return (
    <div 
      onClick={onClick}
      className="relative min-w-[280px] w-[280px] md:min-w-[320px] h-full p-4 md:p-6 rounded-3xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#1f1f35] transition-all cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-white/10 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 will-change-transform"
    >
      {/* Top: Title & Date */}
      <div className="shrink-0 mb-3">
        <div className="flex justify-between items-start mb-2">
          {entry.title ? (
            <h4 className="font-bold text-vespera-textLight dark:text-white text-lg line-clamp-2 leading-tight" title={entry.title}>
              {entry.title}
            </h4>
          ) : (
            <span className="text-lg font-medium italic text-gray-400">Không tiêu đề</span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarIcon size={12} />
            <span>
              {isDateValid 
                ? dateObj.toLocaleDateString('vi-VN', { weekday: 'short', month: 'long', day: 'numeric' })
                : "Ngày không xác định"
              }
            </span>
          </div>
          {( (entry.locations && entry.locations.length > 0) || entry.impressivePlace) && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[100px]" title={entry.locations?.join(', ') || entry.impressivePlace}>
              <MapPin size={10} />
              <span className="truncate">
                {entry.locations && entry.locations.length > 0 
                    ? `${entry.locations[0]}${entry.locations.length > 1 ? ` +${entry.locations.length - 1}` : ''}`
                    : entry.impressivePlace
                }
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Highlight */}
      <div className="flex-1 mb-4 overflow-hidden relative">
        {entry.highlight ? (
          <div className="relative pl-4 h-full">
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-vespera-accent/50 to-pink-500/50 rounded-full"></div>
            <p className="text-sm font-medium text-vespera-textLight/80 dark:text-gray-300 line-clamp-3 italic leading-relaxed">
              "{entry.highlight}"
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {entry.content}
          </p>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 dark:from-[#2A2A4A] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Bottom: Tags */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-white/10 shrink-0">
        <div className="flex gap-2 flex-wrap flex-1 mr-2 max-h-[24px] overflow-hidden">
          {entry.tags && entry.tags.length > 0 ? (
            <>
              {entry.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-semibold text-vespera-accent dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1">
                  <Hash size={10} className="opacity-50" /> {tag}
                </span>
              ))}
              {entry.tags.length > 2 && (
                <span className="text-[10px] font-medium text-gray-400 self-center">+{entry.tags.length - 2}</span>
              )}
            </>
          ) : (
            <span className="text-[10px] text-gray-400 italic">Không thẻ</span>
          )}
        </div>
        <div className="p-2 rounded-full text-gray-400 group-hover:text-vespera-accent bg-white dark:bg-white/10 shadow-sm opacity-60 group-hover:opacity-100 transition-all">
          <Edit2 size={14} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(EntryCard);
