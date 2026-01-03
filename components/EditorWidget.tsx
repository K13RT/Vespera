import React from 'react';
import { Maximize2, CheckCircle2, Feather, Sparkles, ArrowRight } from 'lucide-react';

interface EditorWidgetProps {
  onExpand: () => void;
  savedEntry?: string;
}

const EditorWidget: React.FC<EditorWidgetProps> = ({ onExpand, savedEntry }) => {
  const hasEntry = !!savedEntry;

  return (
    <div 
      className="group relative h-full w-full rounded-3xl p-6 md:p-8 shadow-lg bg-white dark:bg-vespera-cardDark transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer border border-transparent hover:border-vespera-accent/30 flex flex-col justify-between overflow-hidden"
      onClick={onExpand}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-purple-50 dark:from-vespera-cardDark dark:via-vespera-cardDark dark:to-[#2A2A4A] opacity-100 transition-colors duration-500"></div>
      
      {/* Animated Blobs - Optimized: Reduced blur on mobile to save GPU fill rate */}
      <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-[40px] md:blur-[80px] group-hover:bg-purple-300/40 dark:group-hover:bg-purple-500/30 transition-all duration-700 pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-[30px] md:blur-[60px] group-hover:bg-blue-200/40 dark:group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-white/80">
                Daily Reflection
            </h2>
             <span className="text-xs font-semibold text-vespera-accent/80 dark:text-purple-300/80 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vespera-accent animate-pulse"></span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
             </span>
          </div>

          <div className="p-2.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/40 group-hover:text-vespera-accent group-hover:bg-white dark:group-hover:bg-white/10 transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
             <Maximize2 size={18} />
          </div>
      </div>
        
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 mt-2">
          {hasEntry ? (
            <div className="animate-fade-in flex flex-col items-center text-center">
               <div className="relative">
                   <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full"></div>
                   <div className="relative p-5 rounded-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 text-green-600 dark:text-green-400 mb-3 shadow-sm border border-green-200 dark:border-green-800/30">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                   </div>
               </div>
               <p className="text-xl font-medium text-gray-700 dark:text-gray-200">
                  Entry Recorded
               </p>
               <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full hover:bg-white/80 dark:hover:bg-black/40 transition-colors">
                  <span>Click to revisit</span>
                  <ArrowRight size={12} />
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full">
              
              {/* Floating Icon Container - Reduced Size */}
              <div className="relative mb-3 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                 {/* Outer Glow Rings */}
                 <div className="absolute inset-0 bg-vespera-accent/20 dark:bg-vespera-accent/30 rounded-full blur-xl scale-75 group-hover:scale-125 transition-transform duration-700"></div>
                 <div className="absolute inset-0 border border-vespera-accent/10 dark:border-white/10 rounded-2xl rotate-12 scale-90 group-hover:rotate-45 group-hover:scale-100 transition-transform duration-700"></div>
                 
                 {/* Main Icon Box - Reduced Padding and Radius */}
                 <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-white to-purple-50 dark:from-white/10 dark:to-white/5 shadow-lg border border-white/60 dark:border-white/10 text-vespera-accent backdrop-blur-sm group-hover:shadow-vespera-accent/20 transition-all duration-500">
                    <Feather size={24} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform duration-500" />
                 </div>
                 
                 {/* Sparkles - Reduced Size */}
                 <div className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce delay-100">
                    <Sparkles size={12} fill="currentColor" />
                 </div>
                 <div className="absolute -bottom-1 -left-1 text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse delay-200">
                    <Sparkles size={10} fill="currentColor" />
                 </div>
              </div>
              
              {/* Prompt Text - Reduced Size */}
              <h3 className="text-xl font-light text-gray-400 dark:text-gray-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-vespera-accent group-hover:to-pink-500 transition-all duration-300">
                  How was your day?
              </h3>
              
            </div>
          )}
      </div>
    </div>
  );
};

export default React.memo(EditorWidget);