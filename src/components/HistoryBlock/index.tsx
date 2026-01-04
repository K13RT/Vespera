import React, { useState, useMemo, useEffect } from 'react';
import { Book, Calendar as CalendarIcon, Search, Filter, LayoutGrid, List, ArrowLeftRight, PlusCircle } from 'lucide-react';
import { JournalEntry, MoodLevel } from '@/types';

// Sub-components
import FilterBar from './FilterBar';
import EntryCard from './EntryCard';
import CalendarGrid from './CalendarGrid';
import { HistoryBlockProps } from './types';

const HistoryBlock: React.FC<HistoryBlockProps> = ({ entries, onEntryClick, onEmptyDateClick }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Pagination
  const [visibleCount, setVisibleCount] = useState(20);

  // Search & Filter
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<MoodLevel | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'calendar' : 'list');
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery, filterMood, filterTag, viewMode]);

  // Filtering Logic
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesText = 
            !searchQuery ||
            entry.title?.toLowerCase().includes(lowerQuery) ||
            entry.content.toLowerCase().includes(lowerQuery) ||
            entry.highlight?.toLowerCase().includes(lowerQuery) ||
            entry.impressivePlace?.toLowerCase().includes(lowerQuery);

        const matchesMood = !filterMood || entry.mood === filterMood;
        const matchesTag = !filterTag || (entry.tags && entry.tags.includes(filterTag));

        return matchesText && matchesMood && matchesTag;
    });
  }, [entries, searchQuery, filterMood, filterTag]);

  const visibleEntries = useMemo(() => {
      return filteredEntries.slice(0, visibleCount);
  }, [filteredEntries, visibleCount]);

  const hasMoreEntries = visibleCount < filteredEntries.length;

  const handleLoadMore = () => {
      setVisibleCount(prev => prev + 20);
  };

  const availableTags = useMemo(() => {
      const tags = new Set<string>();
      entries.forEach(e => e.tags?.forEach(t => tags.add(t)));
      return Array.from(tags);
  }, [entries]);

  // Calendar helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const getEntryForDay = (day: number) => {
    return filteredEntries.find(e => {
        const d = new Date(e.date);
        return d.getDate() === day && 
               d.getMonth() === currentDate.getMonth() && 
               d.getFullYear() === currentDate.getFullYear();
    });
  };
  
  const calendarDays: (number | null)[] = [];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  
  const entriesInMonthCount = calendarDays.filter(day => day !== null && getEntryForDay(day as number)).length;
  const hasActiveFilters = searchQuery || filterMood || filterTag;

  const clearFilters = () => {
      setSearchQuery('');
      setFilterMood(null);
      setFilterTag(null);
  };

  return (
    <div className="h-full w-full rounded-3xl p-4 md:p-6 shadow-lg bg-white dark:bg-vespera-cardDark flex flex-col transition-all duration-300 overflow-hidden relative border border-gray-100 dark:border-white/5">
       
       {/* Header */}
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
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border transition-all duration-300 ${showFilters || hasActiveFilters ? 'bg-vespera-accent text-white border-vespera-accent shadow-md shadow-vespera-accent/20' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10'}`}
             >
                 {hasActiveFilters ? <Filter size={18} /> : <Search size={18} />}
             </button>

             {/* View Switcher (Desktop) */}
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

       {/* Filter Bar */}
       <FilterBar
         showFilters={showFilters}
         searchQuery={searchQuery}
         filterMood={filterMood}
         filterTag={filterTag}
         availableTags={availableTags}
         hasActiveFilters={!!hasActiveFilters}
         onSearchChange={setSearchQuery}
         onMoodChange={setFilterMood}
         onTagChange={setFilterTag}
         onClearFilters={clearFilters}
       />
       
       {/* Content Area */}
       <div className="flex-1 min-h-0 relative">
         
         {/* List View */}
         <div className={`absolute inset-0 transition-opacity duration-300 ${viewMode === 'list' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div 
                className="h-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-2 -mx-2 px-2 flex gap-4"
                style={{ contentVisibility: 'auto' }}
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
                    <>
                    {visibleEntries.map((entry) => (
                        <EntryCard
                          key={entry.id}
                          entry={entry}
                          onClick={() => onEntryClick(entry)}
                        />
                    ))}

                    {hasMoreEntries && (
                        <div className="flex flex-col justify-center items-center min-w-[100px] px-4">
                            <button 
                                onClick={handleLoadMore}
                                className="group flex flex-col items-center gap-2 p-4 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-vespera-accent hover:text-white transition-all duration-300 text-gray-500"
                            >
                                <div className="p-2 rounded-full bg-white dark:bg-white/10 group-hover:bg-white/20">
                                    <PlusCircle size={24} />
                                </div>
                                <span className="text-xs font-bold whitespace-nowrap">Xem thêm</span>
                            </button>
                        </div>
                    )}
                    </>
                )}
            </div>
         </div>

         {/* Calendar View */}
         <div className={`absolute inset-0 transition-opacity duration-300 flex flex-col ${viewMode === 'calendar' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <CalendarGrid
              currentDate={currentDate}
              filteredEntries={filteredEntries}
              onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              onEntryClick={onEntryClick}
              onEmptyDateClick={onEmptyDateClick}
            />
         </div>

       </div>
    </div>
  );
};

export default React.memo(HistoryBlock);
