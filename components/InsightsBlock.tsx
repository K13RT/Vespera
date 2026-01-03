import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Type, Target, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { JournalEntry } from '../types';

interface InsightsBlockProps {
  entries: JournalEntry[];
}

// Helper component for number animation
const CountUp = ({ end, duration = 1000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure final number is exact
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};

const InsightsBlock: React.FC<InsightsBlockProps> = ({ entries }) => {
  const [view, setView] = useState<'streak' | 'words'>('streak');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleView = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setView(prev => prev === 'streak' ? 'words' : 'streak');
    setTimeout(() => setIsAnimating(false), 300); // Reset animation lock
  };

  // --- Real Stats Calculation ---
  const { streakDays, wordCount, progressPercent, wordGoal } = useMemo(() => {
    // 1. Word Count Calculation
    const totalWords = entries.reduce((acc, entry) => {
        const words = entry.content ? entry.content.trim().split(/\s+/).length : 0;
        return acc + words;
    }, 0);

    // 2. Streak Calculation
    let streak = 0;
    if (entries.length > 0) {
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();
        
        // Check if we have an entry today or yesterday to start the streak
        const hasEntryToday = sortedEntries.some(e => new Date(e.date).toDateString() === todayStr);
        const hasEntryYesterday = sortedEntries.some(e => new Date(e.date).toDateString() === yesterdayStr);

        if (hasEntryToday || hasEntryYesterday) {
            streak = hasEntryToday ? 1 : 0; // If today has entry, start at 1. If only yesterday, we'll count it in loop.
            
            // We need to check distinct days
            const uniqueDates = Array.from(new Set(sortedEntries.map(e => new Date(e.date).toDateString())));
            
            // Normalize uniqueDates to actual Date objects for comparison
            const uniqueDateObjs = uniqueDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

            // If start with today, we already counted 1.
            let currentDateCheck = hasEntryToday ? today : yesterday;
            
            // If we started with 1 (Today), we check backwards from Yesterday.
            // If we started with 0 (No Today, but Yes Yesterday), we check backwards from Yesterday (streak becomes 1 immediately).
            if (!hasEntryToday && hasEntryYesterday) {
                currentDateCheck = yesterday;
            } else if (hasEntryToday) {
                // If we have today, the loop should verify yesterday next
                const d = new Date(today);
                d.setDate(d.getDate() - 1);
                currentDateCheck = d;
            }

            // Loop to count consecutive days
            // This is a simplified greedy check. 
            // We look for "currentDateCheck" in our unique list. If found, increment streak, move check back 1 day.
            let keepChecking = true;
            
            // If we don't have today, but have yesterday, streak starts at 1 (yesterday)
            // But if we have today, streak starts at 1.
            // Let's reset and do a simple loop.
            streak = 0;
            let checkDate = new Date(); // Start checking from today
            
            // Allow streak to be valid if user missed today but wrote yesterday
            const hasToday = uniqueDates.includes(todayStr);
            if (!hasToday) {
                 checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday
                 // If yesterday is missing too, streak is 0
                 if (!uniqueDates.includes(checkDate.toDateString())) {
                     keepChecking = false;
                 }
            }

            while(keepChecking) {
                const dateString = checkDate.toDateString();
                if (uniqueDates.includes(dateString)) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1); // Go back one day
                } else {
                    keepChecking = false;
                }
            }
        }
    }

    const goal = 5000; // Hardcoded monthly/total goal for now
    const percent = Math.min((totalWords / goal) * 100, 100);

    return { 
        streakDays: streak, 
        wordCount: totalWords, 
        wordGoal: goal,
        progressPercent: percent 
    };
  }, [entries]);

  return (
    <div 
        onClick={toggleView}
        className="relative h-full w-full rounded-3xl shadow-lg bg-white dark:bg-vespera-cardDark overflow-hidden group cursor-pointer select-none transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
        {/* Animated Background Gradients */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${view === 'streak' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-red-100/30 dark:bg-red-900/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-700 ${view === 'words' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-[-20%] right-[-20%] w-full h-full bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-2/3 h-2/3 bg-cyan-100/30 dark:bg-cyan-900/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col p-5">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-vespera-accent transition-colors">
                    {view === 'streak' ? 'Consistency' : 'Total Volume'}
                </h3>
                <div className="p-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-300 group-hover:bg-white dark:group-hover:bg-white/10 group-hover:text-vespera-accent transition-all duration-300 transform group-hover:rotate-180">
                    <ChevronRight size={14} />
                </div>
            </div>

            {/* Main Stats Display */}
            <div className="flex-1 flex flex-col justify-center">
                
                {/* STREAK VIEW */}
                <div className={`transition-all duration-500 transform absolute inset-x-5 top-14 bottom-5 ${view === 'streak' ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-10 opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="flex flex-col items-center text-center gap-1">
                        <div className="relative mb-2">
                             {/* Pulsing Rings - Only show if streak > 0 */}
                             {streakDays > 0 && <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping opacity-75"></div>}
                             <div className={`relative p-4 rounded-full shadow-sm border ${streakDays > 0 ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-800/30' : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10'}`}>
                                <Flame size={32} fill={streakDays > 0 ? "currentColor" : "none"} fillOpacity={0.6} className={streakDays > 0 ? "animate-pulse" : ""} />
                             </div>
                             {streakDays > 0 && (
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles size={16} className="text-yellow-400 animate-bounce" fill="currentColor" />
                                </div>
                             )}
                        </div>
                        
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">
                                <CountUp end={streakDays} />
                            </span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">days</span>
                        </div>
                        <p className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${streakDays > 2 ? 'text-orange-500/80 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-400 bg-gray-100 dark:bg-white/5'}`}>
                            {streakDays > 5 ? "You're on fire!" : streakDays > 0 ? "Keep it up!" : "Start today!"}
                        </p>
                    </div>
                </div>

                {/* WORDS VIEW */}
                <div className={`transition-all duration-500 transform absolute inset-x-5 top-12 bottom-5 ${view === 'words' ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95 pointer-events-none'}`}>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 mb-0.5">Words Written</p>
                                <div className="text-3xl font-bold text-gray-800 dark:text-white leading-none">
                                    <CountUp end={wordCount} />
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                <Type size={20} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Target size={10} />
                                    <span>Goal: {wordGoal}</span>
                                </div>
                                <span className={progressPercent >= 100 ? "text-green-500" : "text-blue-500"}>
                                    {Math.round(progressPercent)}%
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 ease-out rounded-full relative"
                                    style={{ width: `${view === 'words' ? progressPercent : 0}%` }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            {progressPercent >= 80 && (
                                <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 mt-1">
                                    <Trophy size={10} />
                                    <span>Almost there!</span>
                                </div>
                            )}
                        </div>
                     </div>
                </div>

            </div>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${view === 'streak' ? 'w-4 bg-orange-400' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-300 ${view === 'words' ? 'w-4 bg-blue-400' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>

        </div>
    </div>
  );
};

export default React.memo(InsightsBlock);