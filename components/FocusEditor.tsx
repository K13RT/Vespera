import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Save, ArrowLeft, Mic, 
  Music, MapPin, Cloud, Hash, Zap, Quote, Edit3, 
  Battery, BatteryLow, BatteryMedium, BatteryFull, CheckCircle2,
  CalendarDays, MoreVertical, ChevronUp, ChevronDown, Minimize2,
  Sparkles, RefreshCw, PenLine
} from 'lucide-react';
import { MoodLevel, JournalEntry } from '../types';
import { MOOD_OPTIONS, JOURNAL_PROMPTS } from '../constants';

interface FocusEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: any) => void; 
  initialEntry?: JournalEntry | null;
  initialContent?: string;
  availableTags?: string[];
}

const WEATHER_OPTIONS = ["Trong xanh", "Có mây", "Mưa", "Bão", "Tuyết", "Gió"];

const FocusEditor: React.FC<FocusEditorProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialEntry = null, 
    initialContent = '', 
    availableTags = [] 
}) => {
  // Mode State
  const [isEditing, setIsEditing] = useState(true);

  // Core Content
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [highlight, setHighlight] = useState('');
  
  // Metadata
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [energyLevel, setEnergyLevel] = useState(50);
  const [weather, setWeather] = useState('Trong xanh');
  const [impressivePlace, setImpressivePlace] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Suggestion System
  const [suggestedPrompt, setSuggestedPrompt] = useState('');
  
  // Media
  const [songName, setSongName] = useState('');
  
  // UI State
  const [isExiting, setIsExiting] = useState(false);
  const [activeTab, setActiveTab] = useState<'mood' | 'details'>('mood');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  
  // --- UX Polish States ---
  const [isIdle, setIsIdle] = useState(false); // User hasn't typed for a while
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshCount, setRefreshCount] = useState(0); // Easter egg counter
  const lastRefreshTimeRef = useRef<number>(0); // Throttle tracker

  // Refs for navigation and formatting
  const titleRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // --- Logic: Generate Smart Prompt ---
  const generateSmartPrompt = useCallback((mood: MoodLevel | null) => {
    // Default to neutral pool if no mood or neutral mood
    let pool = JOURNAL_PROMPTS.neutral;
    
    if (mood) {
        if (mood <= 2) pool = JOURNAL_PROMPTS.negative; // Terrible(1), Bad(2)
        else if (mood === 3) pool = JOURNAL_PROMPTS.neutral; // Neutral(3)
        else if (mood >= 4) pool = JOURNAL_PROMPTS.positive; // Good(4), Excellent(5)
    }

    // New structure: pool is an array of objects {id, text, type}
    const randomPromptObj = pool[Math.floor(Math.random() * pool.length)];
    setSuggestedPrompt(randomPromptObj.text);
  }, []);

  // Update prompt when Mood changes
  useEffect(() => {
    if (isOpen && isEditing) {
        generateSmartPrompt(selectedMood);
    }
  }, [selectedMood, generateSmartPrompt, isOpen, isEditing]);

  // --- UX: Idle Animation Logic ---
  useEffect(() => {
    if (isOpen && isEditing) {
        // Reset idle state when content changes
        setIsIdle(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        // If content is empty or very short, start timer to suggest prompt
        if (content.length < 10) {
            idleTimerRef.current = setTimeout(() => {
                setIsIdle(true);
            }, 10000); // 10 seconds of inactivity
        }
    }
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [content, isOpen, isEditing]);


  useEffect(() => {
    if (isOpen) {
        if (initialEntry) {
            // Load existing entry -> View Mode
            setIsEditing(false); // Default to View Mode
            setEditingId(initialEntry.id);
            setTitle(initialEntry.title || '');
            setContent(initialEntry.content || '');
            setHighlight(initialEntry.highlight || '');
            setSelectedMood(initialEntry.mood || null);
            setEnergyLevel(initialEntry.energyLevel || 50);
            setWeather(initialEntry.weather || 'Trong xanh');
            setImpressivePlace(initialEntry.impressivePlace || '');
            setTags(initialEntry.tags || []);
            setSongName(initialEntry.song?.title || '');
            setIsToolbarExpanded(false);
        } else {
            // New Entry -> Edit Mode
            setIsEditing(true);
            setEditingId(null);
            setContent(initialContent);
            setTitle('');
            setHighlight('');
            setSelectedMood(null);
            setEnergyLevel(50);
            setWeather('Trong xanh');
            setImpressivePlace('');
            setTags([]);
            setSongName('');
            setIsToolbarExpanded(false); // Start collapsed to encourage writing first
            generateSmartPrompt(null); // Initial prompt
            setRefreshCount(0);
        }
        
        // Reset transient states
        setCurrentTag('');
        setIsExiting(false);
        setActiveTab('mood');
        setShowSuggestions(false);
        setIsIdle(false);
    }
  }, [isOpen, initialEntry, initialContent, generateSmartPrompt]);

  const handleCloseEditor = () => {
    setIsExiting(true);
    setTimeout(() => {
        onClose();
        setIsExiting(false);
    }, 400); 
  };
  
  // Alias for handleClose to match internal usage
  const handleClose = handleCloseEditor;

  const handleSave = () => {
    if (!content.trim() && !title.trim()) return;
    
    // Capture any tag currently being typed but not yet added
    let finalTags = [...tags];
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        finalTags.push(currentTag.trim());
    }
    
    onSave({
        id: editingId, 
        // Ensure date is valid. If viewing old entry, keep its date. If new, generate.
        date: initialEntry?.date || new Date().toISOString(),
        content,
        title,
        highlight,
        mood: selectedMood,
        energyLevel,
        weather,
        impressivePlace,
        tags: finalTags,
        song: songName ? { title: songName } : undefined,
        images: [] 
    });
    handleClose();
  };

  // --- UX: Insert Prompt into Content ---
  const insertPromptToContent = () => {
    // Removed blockquote format (> ), kept bold (** **)
    const promptText = `**${suggestedPrompt}**\n\n`;
    
    // If content exists, append with newline. If empty, just set it.
    // However, usually prompts are better at the start if the user is stuck.
    // Let's check cursor position if possible, but simplest is append if not empty, or set if empty.
    
    if (!content.trim()) {
        setContent(promptText);
    } else {
        setContent(prev => prev + '\n\n' + promptText);
    }
    
    // Focus the textarea
    setTimeout(() => {
        if (contentRef.current) {
            contentRef.current.focus();
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, 10);
    
    // Provide immediate feedback by turning off idle
    setIsIdle(false);
  };

  // --- UX: Easter Egg Refresh Logic ---
  const handleRefreshPrompt = () => {
      const now = Date.now();
      const timeDiff = now - lastRefreshTimeRef.current;
      
      // If clicked faster than 600ms
      if (timeDiff < 600) {
          setRefreshCount(prev => prev + 1);
      } else {
          setRefreshCount(0); // Reset count if they slowed down
      }
      
      lastRefreshTimeRef.current = now;

      // Easter Egg Trigger
      if (refreshCount > 4) {
          setSuggestedPrompt("Từ từ thôi, hãy lắng nghe lòng mình đã...");
          setRefreshCount(0); // Reset to allow normal use after reading
          return;
      }

      generateSmartPrompt(selectedMood);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
        setTags([...tags, tag.trim()]);
        setCurrentTag('');
        setShowSuggestions(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          addTag(currentTag);
      }
  };

  const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(t => t !== tagToRemove));
  };

  // --- Keyboard Navigation Handlers ---
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          highlightRef.current?.focus();
      }
  };

  const handleHighlightKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          contentRef.current?.focus();
      }
  };

  // --- Rendering Helpers (For View Mode) ---
  const renderInlineStyles = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|> .*)/g);
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
              return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
              return <em key={index} className="italic text-gray-700 dark:text-gray-300">{part.slice(1, -1)}</em>;
          }
          if (part.startsWith('> ')) {
              return <span key={index} className="block pl-4 border-l-2 border-vespera-accent/50 text-gray-500 dark:text-gray-400 italic my-2">{renderInlineStyles(part.slice(2))}</span>;
          }
          return <span key={index}>{part}</span>;
      });
  };

  const renderFormattedContent = (textString: string) => {
      if (!textString) return null;
      const lines = textString.split('\n');
      return lines.map((line, i) => {
          if (line.trim().startsWith('> ')) {
               // Handle Blockquote specially in view mode
               return (
                   <div key={i} className="pl-4 border-l-4 border-purple-200 dark:border-purple-800 my-4 py-1">
                       <p className="text-lg font-medium italic text-gray-600 dark:text-gray-400">
                           {renderInlineStyles(line.trim().substring(2))}
                       </p>
                   </div>
               )
          }
          if (line.trim().startsWith('- ')) {
              return (
                  <div key={i} className="flex items-start gap-3 mb-3 pl-2 group">
                      <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-vespera-accent shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex-1 text-lg leading-relaxed text-vespera-textLight dark:text-gray-200">
                          {renderInlineStyles(line.trim().substring(2))}
                      </div>
                  </div>
              );
          }
          if (!line.trim()) return <div key={i} className="h-6"></div>;
          return (
              <p key={i} className="mb-6 text-lg leading-relaxed text-vespera-textLight dark:text-gray-200">
                  {renderInlineStyles(line)}
              </p>
          );
      });
  };

  const suggestedTags = availableTags.filter(
    tag => tag.toLowerCase().includes(currentTag.toLowerCase()) && !tags.includes(tag)
  );

  const getHeaderDate = () => {
      if (initialEntry && initialEntry.date) {
          const d = new Date(initialEntry.date);
          if (!isNaN(d.getTime())) {
              return d.toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' });
          }
      }
      return new Date().toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  const getHeaderTime = () => {
      if (initialEntry && initialEntry.date) {
          const d = new Date(initialEntry.date);
          if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
      }
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }

  const getMoodIcon = (level: number) => {
      const option = MOOD_OPTIONS.find(o => o.level === level);
      return option ? option.icon : Cloud;
  };
  const getMoodLabel = (level: number) => {
      const option = MOOD_OPTIONS.find(o => o.level === level);
      return option ? option.label : 'Unknown';
  };
  const getMoodColor = (level: number) => {
    const option = MOOD_OPTIONS.find(o => o.level === level);
    return option ? option.color : 'text-gray-400';
  };

  const getEnergyConfig = (level: number) => {
    if (level <= 20) return { label: 'Kiệt sức', color: 'text-red-400', bg: 'bg-red-400', icon: BatteryLow };
    if (level <= 40) return { label: 'Mệt mỏi', color: 'text-orange-400', bg: 'bg-orange-400', icon: BatteryMedium };
    if (level <= 60) return { label: 'Ổn', color: 'text-yellow-400', bg: 'bg-yellow-400', icon: BatteryMedium };
    if (level <= 85) return { label: 'Nhiều năng lượng', color: 'text-green-400', bg: 'bg-green-400', icon: BatteryFull };
    return { label: 'Sung sức', color: 'text-vespera-accent', bg: 'bg-vespera-accent', icon: Zap };
  };

  const energyConfig = getEnergyConfig(energyLevel);
  const EnergyIcon = energyConfig.icon;
  const CurrentMoodIcon = selectedMood ? getMoodIcon(selectedMood) : Quote;

  if (!isOpen && !isExiting) return null;

  return (
    // Added 'gpu-layer' to enable hardware acceleration for the modal transition
    <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#FDFBFD] to-gray-50 dark:from-[#151525] dark:to-[#0f0f1a] transition-opacity duration-500 gpu-layer ${isOpen && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* 1. Minimal Header */}
      <div className="shrink-0 pt-4 px-4 md:px-12 flex justify-between items-center z-10">
         <button onClick={handleClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all">
            <ArrowLeft size={24} />
         </button>

         {/* Action Button */}
         {isEditing ? (
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-vespera-accent text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
            >
                <Save size={18} />
                <span className="font-semibold text-sm">Lưu</span>
            </button>
        ) : (
             <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all"
            >
                <Edit3 size={24} />
            </button>
        )}
      </div>

      {/* 2. Scrollable Paper (Main Content) */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-5 md:px-12 pb-40 overflow-y-auto no-scrollbar">
        <div className="mt-6 md:mt-12 animate-fade-in-up">
            
            {/* Date Display (Document Style) */}
            <div className="flex flex-col gap-1 mb-8 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-vespera-accent dark:text-purple-400">
                    <CalendarDays size={14} />
                    <span>{getHeaderDate()}</span>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    <span>{getHeaderTime()}</span>
                </div>
            </div>

            {isEditing ? (
                /* ================= EDIT MODE UI ================= */
                <>
                    {/* --- SMART PROMPT SUGGESTION --- */}
                    <div className="flex items-start gap-3 mb-8 animate-fade-in group">
                        <div className={`mt-0.5 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-vespera-accent dark:text-purple-300 transition-all duration-700 ${isIdle ? 'animate-pulse ring-4 ring-purple-100/50 dark:ring-purple-900/20' : ''}`}>
                            <Sparkles size={14} fill="currentColor" className={isIdle ? "opacity-100" : "opacity-70"} />
                        </div>
                        
                        <div className="flex-1">
                            <p 
                                onClick={insertPromptToContent}
                                className="text-sm font-medium text-gray-500 dark:text-gray-400 italic leading-relaxed cursor-pointer hover:text-vespera-accent dark:hover:text-purple-300 transition-colors duration-200"
                                title="Bấm để viết về chủ đề này"
                            >
                                {suggestedPrompt}
                            </p>
                            {/* Insert Prompt Helper Text */}
                            <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                    onClick={insertPromptToContent}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-vespera-accent uppercase tracking-wide hover:underline"
                                >
                                    <PenLine size={10} />
                                    Viết về điều này
                                </button>
                                <button 
                                    onClick={handleRefreshPrompt}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wide hover:underline"
                                >
                                    <RefreshCw size={10} />
                                    Đổi câu hỏi
                                </button>
                            </div>
                        </div>
                    </div>

                    <input 
                        ref={titleRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        placeholder="Tiêu đề..."
                        className="w-full bg-transparent border-none text-3xl md:text-5xl font-bold text-vespera-textLight dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-700 mb-6 md:mb-8 focus:ring-0 outline-none leading-tight"
                    />

                    {/* Styled Highlight Input */}
                    <div className="mb-8 md:mb-10 relative group">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-vespera-accent/20 rounded-full group-focus-within:bg-vespera-accent transition-colors"></div>
                        <textarea
                            ref={highlightRef}
                            value={highlight}
                            onChange={(e) => {
                                if (e.target.value.length <= 80) setHighlight(e.target.value);
                            }}
                            onKeyDown={handleHighlightKeyDown}
                            placeholder="Điểm nhấn trong ngày..."
                            className="w-full bg-transparent rounded-r-xl py-2 pl-4 md:pl-6 pr-4 text-lg md:text-2xl font-serif italic text-gray-600 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 border-none focus:ring-0 resize-none outline-none overflow-hidden"
                            rows={1}
                            style={{ minHeight: '3rem' }}
                        />
                         <div className={`text-[10px] text-right mt-1 transition-opacity ${highlight ? 'opacity-40' : 'opacity-0'}`}>
                            {highlight.length}/80
                         </div>
                    </div>

                    {/* Main Content Area */}
                    <textarea
                        ref={contentRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Hãy viết ra những suy nghĩ của bạn..."
                        className="w-full min-h-[50vh] bg-transparent border-none resize-none focus:ring-0 text-base md:text-xl text-vespera-textLight dark:text-gray-200 leading-loose placeholder:text-gray-300 dark:placeholder:text-gray-700 font-sans outline-none"
                        autoFocus
                    />
                    
                </>
            ) : (
                /* ================= VIEW MODE UI ================= */
                <div className="animate-fade-in">
                    {title && (
                        <h1 className="text-3xl md:text-5xl font-bold text-vespera-textLight dark:text-white mb-8 leading-tight">
                            {title}
                        </h1>
                    )}

                    {highlight && (
                        <div className="mb-10 pl-4 md:pl-6 border-l-4 border-vespera-accent/30 py-2">
                            <p className="text-xl md:text-2xl font-serif italic text-gray-700 dark:text-gray-300 leading-relaxed">
                                {highlight}
                            </p>
                        </div>
                    )}

                    {/* Markdown Rendered Content */}
                    <div className="text-base md:text-xl font-sans text-gray-800 dark:text-gray-200 leading-loose">
                        {renderFormattedContent(content)}
                    </div>

                    {/* View Mode Footer Details */}
                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 gap-10">
                        {/* Metadata Column */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Bối cảnh</h3>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 flex-wrap">
                                    {selectedMood && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 dark:bg-white/5 rounded-full border border-gray-200/50 dark:border-white/5">
                                            {React.createElement(getMoodIcon(selectedMood), { size: 16, className: getMoodColor(selectedMood) })}
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{getMoodLabel(selectedMood)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 dark:bg-white/5 rounded-full border border-gray-200/50 dark:border-white/5">
                                        <Zap size={16} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{energyLevel}% Năng lượng</span>
                                    </div>
                                </div>
                                
                                {weather && (
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <Cloud size={16} />
                                        <span>Thời tiết: {weather}</span>
                                    </div>
                                )}
                                {impressivePlace && (
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin size={16} />
                                        <span>Tại: {impressivePlace}</span>
                                    </div>
                                )}
                                {songName && (
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <Music size={16} />
                                        <span>Đang nghe: {songName}</span>
                                    </div>
                                )}
                            </div>

                            {tags.length > 0 && (
                                 <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-vespera-accent dark:text-purple-300 text-xs font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                 </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* 3. Floating Collapsible Toolbar (Only for Edit Mode) */}
      {isEditing && (
        <div className="fixed bottom-4 md:bottom-6 left-0 right-0 z-40 px-3 md:px-0 flex justify-center pointer-events-none">
            
            {/* The Toolbar Container */}
            {/* Optimized for Mobile: Increased opacity to 95/100 and removed blur. Desktop keeps blur. */}
            <div className={`
                pointer-events-auto
                w-full max-w-2xl 
                bg-white/95 dark:bg-[#1A1A2E]/95 md:bg-white/90 md:dark:bg-[#1A1A2E]/95
                backdrop-filter-none md:backdrop-blur-xl
                shadow-2xl border border-gray-200/50 dark:border-white/10
                transition-all duration-500 ease-spring-custom
                overflow-hidden flex flex-col
                ${isToolbarExpanded ? 'rounded-3xl p-0 h-auto' : 'rounded-full h-14 md:h-16 cursor-pointer hover:scale-[1.02] hover:bg-white dark:hover:bg-[#1f1f35]'}
            `}
            >
                {/* ----------------- COLLAPSED STATE ----------------- */}
                <div 
                    className={`flex items-center justify-between px-5 h-full w-full ${isToolbarExpanded ? 'hidden' : 'flex'}`}
                    onClick={() => setIsToolbarExpanded(true)}
                >
                    {/* Left: Mood & Energy Summary */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${selectedMood ? getMoodColor(selectedMood) : 'text-gray-400'}`}>
                            <CurrentMoodIcon size={20} className={selectedMood ? 'fill-current opacity-20' : ''}/>
                            <span className="text-sm font-bold">{selectedMood ? getMoodLabel(selectedMood) : "Chọn cảm xúc"}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
                        <div className="flex items-center gap-1.5">
                             <div className={`w-2 h-2 rounded-full ${energyConfig.bg}`}></div>
                             <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{energyLevel}%</span>
                        </div>
                    </div>

                    {/* Right: Context Indicators & Expand Icon */}
                    <div className="flex items-center gap-3 text-gray-400">
                         {/* Mini Indicators */}
                         <div className="flex items-center -space-x-1">
                            {songName && <div className="p-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-500"><Music size={10} /></div>}
                            {/* Image indicator removed */}
                            {tags.length > 0 && <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-500"><Hash size={10} /></div>}
                         </div>
                         
                         <div className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-vespera-accent">
                             <ChevronUp size={18} />
                         </div>
                    </div>
                </div>


                {/* ----------------- EXPANDED STATE ----------------- */}
                {isToolbarExpanded && (
                    <div className="flex flex-col animate-fade-in">
                        {/* Toolbar Header (Tabs & Close) */}
                        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-gray-100 dark:border-white/5">
                            <div className="flex p-1 gap-1 bg-gray-100/50 dark:bg-white/5 rounded-xl">
                                <button 
                                    onClick={() => setActiveTab('mood')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'mood' ? 'bg-white dark:bg-white/10 text-vespera-accent shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Cảm xúc
                                </button>
                                <button 
                                    onClick={() => setActiveTab('details')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'details' ? 'bg-white dark:bg-white/10 text-vespera-accent shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Chi tiết
                                </button>
                            </div>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsToolbarExpanded(false); }}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>

                        {/* Toolbar Content Area */}
                        <div className="p-6 min-h-[160px]">
                            {activeTab === 'mood' ? (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Mood Section */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center px-1">
                                            {MOOD_OPTIONS.map((option) => {
                                                const isSelected = selectedMood === option.level;
                                                return (
                                                    <button
                                                        key={option.level}
                                                        onClick={() => setSelectedMood(option.level)}
                                                        className={`group relative transition-all duration-300 outline-none ${isSelected ? 'scale-110 -translate-y-1' : 'hover:-translate-y-1'}`}
                                                    >
                                                        <div className={`
                                                            p-3 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center
                                                            ${isSelected 
                                                                ? `bg-white dark:bg-white/10 shadow-lg ${option.color.replace('text-', 'shadow-')}/20 ring-1 ring-${option.color.replace('text-', '')}/30` 
                                                                : 'bg-gray-50 dark:bg-white/5 text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 grayscale hover:grayscale-0'
                                                            }
                                                        `}>
                                                            <option.icon 
                                                                size={22} 
                                                                className={`transition-all duration-300 ${isSelected ? option.color + ' fill-current opacity-100' : 'text-gray-400 opacity-60 group-hover:opacity-100'}`} 
                                                                strokeWidth={isSelected ? 2.5 : 2}
                                                            />
                                                        </div>
                                                        {isSelected && <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold ${option.color} whitespace-nowrap`}>{option.label}</span>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Energy Section */}
                                    <div className="bg-gray-50/80 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 transition-all mt-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <EnergyIcon size={16} className={energyConfig.color} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Năng lượng</span>
                                            </div>
                                            <span className={`text-sm font-bold transition-colors duration-300 ${energyConfig.color}`}>
                                                {energyConfig.label} <span className="text-gray-400 font-normal">({energyLevel}%)</span>
                                            </span>
                                        </div>
                                        
                                        <div className="relative h-6 flex items-center group">
                                            <div className="absolute inset-x-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-red-400 via-orange-400 to-green-400 transition-all duration-100 ease-linear"
                                                    style={{ width: `${energyLevel}%` }}
                                                ></div>
                                            </div>
                                            <div 
                                                className="absolute h-5 w-5 bg-white shadow-md rounded-full border border-gray-100 cursor-grab active:cursor-grabbing transition-all duration-75 flex items-center justify-center hover:scale-110"
                                                style={{ left: `calc(${energyLevel}% - 10px)` }}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${energyConfig.bg}`}></div>
                                            </div>
                                            <input 
                                                type="range" min="0" max="100" 
                                                value={energyLevel}
                                                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in space-y-4">
                                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl min-w-[140px] flex-1 border border-transparent focus-within:border-vespera-accent/30 transition-colors">
                                            <Cloud size={16} className="text-blue-400 shrink-0" />
                                            <select 
                                                value={weather} 
                                                onChange={(e) => setWeather(e.target.value)}
                                                className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full outline-none text-gray-700 dark:text-gray-200"
                                            >
                                                {WEATHER_OPTIONS.map(w => (
                                                    <option key={w} value={w} className="bg-white dark:bg-[#151525]">{w}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl min-w-[140px] flex-1 border border-transparent focus-within:border-vespera-accent/30 transition-colors">
                                            <MapPin size={16} className="text-purple-400 shrink-0" />
                                            <input 
                                                type="text" value={impressivePlace} onChange={(e) => setImpressivePlace(e.target.value)}
                                                placeholder="Thêm địa điểm..."
                                                className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl flex-[2] border border-transparent focus-within:border-vespera-accent/30 transition-colors">
                                            <Music size={16} className="text-pink-400 shrink-0" />
                                            <input 
                                                type="text" value={songName} onChange={(e) => setSongName(e.target.value)}
                                                placeholder="Bạn đang nghe bài gì?"
                                                className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        {showSuggestions && currentTag && suggestedTags.length > 0 && (
                                            <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#1A1A2E] border border-gray-100 dark:border-white/10 rounded-lg shadow-xl overflow-hidden max-h-32 overflow-y-auto z-50">
                                                {suggestedTags.map(tag => (
                                                    <div key={tag} className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/10 text-xs cursor-pointer text-gray-600 dark:text-gray-300" onMouseDown={(e) => { e.preventDefault(); addTag(tag); }}>
                                                        #{tag}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl flex-wrap border border-transparent focus-within:border-vespera-accent/30 transition-colors">
                                            <Hash size={16} className="text-gray-400" />
                                            {tags.map(tag => (
                                                <span key={tag} className="animate-fade-in px-2.5 py-1 rounded-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/40 dark:to-purple-900/20 text-purple-700 dark:text-purple-200 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm border border-purple-100 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all select-none whitespace-nowrap">
                                                    #{tag}
                                                    <button
                                                        onClick={() => removeTag(tag)}
                                                        className="p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-400 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200 transition-colors"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ))}
                                            <input 
                                                type="text" value={currentTag} onChange={(e) => { setCurrentTag(e.target.value); setShowSuggestions(true); }}
                                                onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                onKeyDown={handleAddTag} placeholder="Thêm thẻ..."
                                                className="bg-transparent border-none p-0 text-xs focus:ring-0 flex-1 min-w-[60px] outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default FocusEditor;