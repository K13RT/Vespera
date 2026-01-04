import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JournalEntry, MoodLevel } from '@/types';
import { getMoodStyle } from './types';

interface CalendarGridProps {
  currentDate: Date;
  filteredEntries: JournalEntry[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onEntryClick: (entry: JournalEntry) => void;
  onEmptyDateClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  filteredEntries,
  onPrevMonth,
  onNextMonth,
  onEntryClick,
  onEmptyDateClick
}) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getEntryForDay = (day: number) => {
    return filteredEntries.find(e => {
        const d = new Date(e.date);
        return d.getDate() === day && 
               d.getMonth() === currentDate.getMonth() && 
               d.getFullYear() === currentDate.getFullYear();
    });
  };

  // Generate calendar grid array (Fixed 42 cells)
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  const remainingSlots = 42 - calendarDays.length;
  for(let i = 0; i < remainingSlots; i++) calendarDays.push(null);

  const currentMonthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between px-2 md:px-4 mb-4">
        <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 min-w-[120px] md:min-w-[140px] text-center select-none capitalize">
          {currentMonthName}
        </span>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2 px-1">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, i) => (
          <div key={i} className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">{day}</div>
        ))}
      </div>

      {/* Calendar Grid - 6 rows fixed */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 md:gap-2 min-h-0 px-1 pb-1">
        {calendarDays.map((day, index) => {
          if (day === null) return <div key={index} className="rounded-2xl"></div>;
          
          const entry = getEntryForDay(day);
          const isToday = 
            day === new Date().getDate() && 
            currentDate.getMonth() === new Date().getMonth() && 
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div 
              key={index}
              onClick={() => {
                if (entry) {
                  onEntryClick(entry);
                } else {
                  const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  cellDate.setHours(12, 0, 0, 0);
                  onEmptyDateClick(cellDate);
                }
              }}
              className={`
                relative rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group overflow-hidden will-change-transform
                ${entry 
                  ? `cursor-pointer hover:scale-105 hover:z-10 ${getMoodStyle(entry.mood)}` 
                  : 'cursor-pointer bg-transparent text-gray-300 dark:text-gray-700 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-vespera-accent dark:hover:text-purple-300'
                }
                ${isToday && !entry ? 'ring-2 ring-dashed ring-vespera-accent/50 text-vespera-accent dark:text-vespera-accent' : ''}
              `}
            >
              <span className={`text-xs md:text-lg font-bold z-10 ${entry ? 'text-white drop-shadow-md' : ''}`}>{day}</span>
              
              {/* Today Indicator */}
              {isToday && !entry && (
                <span className="absolute bottom-0.5 md:bottom-1 text-[6px] md:text-[8px] font-bold uppercase tracking-wide text-vespera-accent/70">Hôm nay</span>
              )}
              
              {/* Add hint on hover */}
              {!entry && (
                <span className="absolute bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-vespera-accent/60 dark:text-purple-300/60">+ Thêm</span>
              )}

              {/* Tooltip for entries */}
              {entry && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[180px] bg-white/90 dark:bg-[#1A1A2E]/95 backdrop-blur-xl p-3 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 shadow-xl shadow-purple-500/10 translate-y-2 group-hover:translate-y-0 hidden md:block border border-gray-100 dark:border-white/10 ring-1 ring-black/5">
                  <p className="font-bold text-sm mb-1 truncate text-gray-800 dark:text-white">{entry.title || "Không tiêu đề"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2 leading-relaxed">
                    "{entry.highlight || entry.content.substring(0, 40)}..."
                  </p>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {entry.tags?.slice(0,2).map(t => (
                      <span key={t} className="text-[9px] bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded-md text-gray-500 dark:text-gray-300 font-medium">#{t}</span>
                    ))}
                  </div>
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 dark:bg-[#1A1A2E]/95 rotate-45 border-r border-b border-gray-100 dark:border-white/10"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CalendarGrid);
