import React, { useState, useMemo } from 'react';
import { Book, Calendar as CalendarIcon, Hash, Edit2, ChevronLeft, ChevronRight, LayoutGrid, List, Search, Filter, X, MapPin, ArrowLeftRight } from 'lucide-react';
import { JournalEntry, MoodLevel } from '../types';
import { MOOD_OPTIONS } from '../constants';

interface HistoryBlockProps {
  entries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
}

// Helper to map mood to modern gradient styles
const getMoodStyle = (mood?: MoodLevel) => {
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

const HistoryBlock: React.FC<HistoryBlockProps> = ({ entries, onEntryClick }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // --- Search & Filter State ---
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<MoodLevel | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'calendar' : 'list');
  };

  // --- Filtering Logic ---
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
        // 1. Text Search (Title, Content, Highlight, Place)
        const lowerQuery = searchQuery.toLowerCase();
        const matchesText = 
            !searchQuery ||
            entry.title?.toLowerCase().includes(lowerQuery) ||
            entry.content.toLowerCase().includes(lowerQuery) ||
            entry.highlight?.toLowerCase().includes(lowerQuery) ||
            entry.impressivePlace?.toLowerCase().includes(lowerQuery);

        // 2. Mood Filter
        const matchesMood = !filterMood || entry.mood === filterMood;

        // 3. Tag Filter
        const matchesTag = !filterTag || (entry.tags && entry.tags.includes(filterTag));

        return matchesText && matchesMood && matchesTag;
    });
  }, [entries, searchQuery, filterMood, filterTag]);

  // Extract all unique tags from entries for the filter list
  const availableTags = useMemo(() => {
      const tags = new Set<string>();
      entries.forEach(e => e.tags?.forEach(t => tags.add(t)));
      return Array.from(tags);
  }, [entries]);

  // --- Calendar Logic ---
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEntryForDay = (day: number) => {
    // We check against the *filtered* entries to visually represent the search results on the calendar
    return filteredEntries.find(e => {
        const d = new Date(e.date);
        return d.getDate() === day && 
               d.getMonth() === currentDate.getMonth() && 
               d.getFullYear() === currentDate.getFullYear();
    });
  };

  // Generate calendar grid array (Fixed 42 cells)
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  const remainingSlots = 42 - calendarDays.length;
  for(let i = 0; i < remainingSlots; i++) calendarDays.push(null);

  const currentMonthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const hasActiveFilters = searchQuery || filterMood || filterTag;
  
  // Count entries in current month view
  const entriesInMonthCount = calendarDays.filter(day => day !== null && getEntryForDay(day as number)).length;

  const clearFilters = () => {
      setSearchQuery('');
      setFilterMood(null);
      setFilterTag(null);
  };

  return (
    <div className="h-full w-full rounded-3xl p-4 md:p-6 shadow-lg bg-white dark:bg-vespera-cardDark flex flex-col transition-all duration-300 overflow-hidden relative border border-gray-100 dark:border-white/5">
       
       {/* Header with Toggle */}
       <div className="flex items-center justify-between mb-4 shrink-0 z-20 relative">
         <div 
            className="flex items-center gap-3 md:gap-4 cursor-pointer group select-none active:opacity-70 transition-opacity"
            onClick={toggleViewMode}
            title="Nhấn để chuyển đổi chế độ xem"
         >
            <div className={`p-2.5 rounded-2xl transition-all duration-300 shadow-sm ${viewMode === 'calendar' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-white/10'}`}>
                {viewMode === 'list' ? <Book size={18} className="md:w-5 md:h-5" /> : <CalendarIcon size={18} className="md:w-5 md:h-5" />}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                        {viewMode === 'list' ? 'Gần đây' : 'Lịch'}
                    </h3>
                    {/* Mobile visual cue for toggling */}
                    <div className="md:hidden text-gray-400 bg-gray-50 dark:bg-white/5 rounded-full p-0.5">
                        <ArrowLeftRight size={10} /> 
                    </div>
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium">
                    {hasActiveFilters 
                        ? `Tìm thấy ${filteredEntries.length} kết quả` 
                        : viewMode === 'list' ? 'Hành trình của bạn' : `${entriesInMonthCount} ký ức được lưu`}
                </p>
            </div>
         </div>

         <div className="flex items-center gap-2">
             {/* Search Toggle Button */}
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border transition-all duration-300 ${showFilters || hasActiveFilters ? 'bg-vespera-accent text-white border-vespera-accent shadow-md shadow-vespera-accent/20' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10'}`}
             >
                 {hasActiveFilters ? <Filter size={18} /> : <Search size={18} />}
             </button>

             {/* View Switcher (Desktop Only) */}
             <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5 hidden md:flex">
                <button 
                    onClick={(e) => { e.stopPropagation(); setViewMode('list'); }}
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-vespera-accent shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Danh sách"
                >
                    <List size={18} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setViewMode('calendar'); }}
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'calendar' ? 'bg-white dark:bg-white/10 text-vespera-accent shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Lịch"
                >
                    <LayoutGrid size={18} />
                </button>
             </div>
         </div>
       </div>

       {/* --- EXPANDABLE FILTER BAR --- */}
       <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${showFilters ? 'max-h-[250px] md:max-h-[200px] mb-4 opacity-100' : 'max-h-0 mb-0 opacity-0'}`}>
            <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-100 dark:border-white/5 space-y-3">
                {/* Search Input */}
                <div className="relative group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-vespera-accent transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm ký ức, địa điểm, nội dung..." 
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-vespera-accent/20 focus:border-vespera-accent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
                                    onClick={() => setFilterMood(isSelected ? null : option.level)}
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
                                    onClick={() => setFilterTag(isSelected ? null : tag)}
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
                            onClick={clearFilters}
                            className="text-[10px] font-bold text-red-400 hover:text-red-500 whitespace-nowrap ml-auto self-center bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-md transition-colors"
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </div>
       </div>
       
       {/* Content Area */}
       <div className="flex-1 min-h-0 relative">
         
         {/* --- LIST VIEW --- */}
         <div className={`absolute inset-0 transition-opacity duration-300 ${viewMode === 'list' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div 
                className="h-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-2 -mx-2 px-2 flex gap-4"
                style={{ contentVisibility: 'auto' }} // Performance Optimization for large lists
            >
                {filteredEntries.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                        {hasActiveFilters ? <Search size={48} className="mb-4 opacity-50" /> : <Book size={48} className="mb-4 opacity-50" /> }
                        <p className="text-base font-medium">{hasActiveFilters ? 'Không tìm thấy kết quả.' : 'Chưa có bài viết nào.'}</p>
                        <p className="text-sm">{hasActiveFilters ? 'Thử điều chỉnh bộ lọc của bạn.' : 'Bắt đầu viết để lưu giữ ký ức.'}</p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                Xóa tìm kiếm
                            </button>
                        )}
                    </div>
                ) : (
                    filteredEntries.map((entry) => {
                        const dateObj = new Date(entry.date);
                        const isDateValid = !isNaN(dateObj.getTime());
                        
                        return (
                            <div 
                                key={entry.id} 
                                onClick={() => onEntryClick(entry)}
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
                                        {entry.impressivePlace && (
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[100px]" title={entry.impressivePlace}>
                                                <MapPin size={10} />
                                                <span className="truncate">{entry.impressivePlace}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Middle: Highlight */}
                                <div className="flex-1 mb-4 overflow-hidden relative">
                                    {entry.highlight ? (
                                        <div className="relative pl-4 h-full">
                                            <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-vespera-accent/50 to-pink-500/50 rounded-full"></div>
                                            <p className="text-sm font-medium text-vespera-textLight/80 dark:text-gray-300 line-clamp-6 italic leading-relaxed">
                                                "{entry.highlight}"
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-6 leading-relaxed">
                                            {entry.content}
                                        </p>
                                    )}
                                    {/* Gradient fade at bottom for text */}
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
                    })
                )}
            </div>
         </div>

         {/* --- CALENDAR VIEW --- */}
         <div className={`absolute inset-0 transition-opacity duration-300 flex flex-col ${viewMode === 'calendar' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            
            {/* Calendar Header Controls */}
            <div className="flex items-center justify-between px-2 md:px-4 mb-4">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 min-w-[120px] md:min-w-[140px] text-center select-none capitalize">
                    {currentMonthName}
                </span>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
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
                    // Empty cell logic
                    if (day === null) return <div key={index} className="rounded-2xl"></div>;
                    
                    const entry = getEntryForDay(day);
                    const isToday = 
                        day === new Date().getDate() && 
                        currentDate.getMonth() === new Date().getMonth() && 
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div 
                            key={index}
                            onClick={() => entry && onEntryClick(entry)}
                            className={`
                                relative rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group overflow-hidden will-change-transform
                                ${entry 
                                    ? `cursor-pointer hover:scale-105 hover:z-10 ${getMoodStyle(entry.mood)}` 
                                    : 'cursor-default bg-transparent text-gray-300 dark:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                                }
                                ${isToday && !entry ? 'ring-2 ring-dashed ring-vespera-accent/50 text-vespera-accent dark:text-vespera-accent' : ''}
                            `}
                        >
                            <span className={`text-xs md:text-lg font-bold z-10 ${entry ? 'text-white drop-shadow-md' : ''}`}>{day}</span>
                            
                            {/* Today Indicator Text */}
                            {isToday && !entry && (
                                <span className="absolute bottom-0.5 md:bottom-1 text-[6px] md:text-[8px] font-bold uppercase tracking-wide text-vespera-accent/70">Hôm nay</span>
                            )}

                            {/* Enhanced Tooltip for Calendar */}
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
                                    {/* Arrow */}
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 dark:bg-[#1A1A2E]/95 rotate-45 border-r border-b border-gray-100 dark:border-white/10"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
         </div>

       </div>
    </div>
  );
};

export default React.memo(HistoryBlock);