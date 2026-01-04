import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Save, ArrowLeft, 
  Music, MapPin, Cloud, Hash, Zap, Quote, Edit3, 
  CalendarDays, ChevronUp, Minimize2,
  Loader2, Check
} from 'lucide-react';
import { MoodLevel, JournalEntry } from '@/types';
import { MOOD_OPTIONS, JOURNAL_PROMPTS } from '@/constants';

// Sub-components
import PromptCard from './PromptCard';
import MoodSelector, { getEnergyConfig, getMoodColor, getMoodLabel, getMoodIcon } from './MoodSelector';
import MetadataPanel from './MetadataPanel';
import TagInput from './TagInput';
import { FocusEditorProps, DRAFT_STORAGE_KEY, toLocalISOString } from './types';

const FocusEditor: React.FC<FocusEditorProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialEntry = null, 
    initialContent = '', 
    initialDate = null,
    availableTags = [] 
}) => {
  // Mode State
  const [isEditing, setIsEditing] = useState(true);

  // Core Content
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [highlight, setHighlight] = useState('');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString());
  
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
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // UX States
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const lastRefreshTimeRef = useRef<number>(0);

  // Refs
  const titleRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // --- Generate Smart Prompt ---
  const generateSmartPrompt = useCallback((mood: MoodLevel | null) => {
    let pool = JOURNAL_PROMPTS.neutral;
    
    if (mood) {
        if (mood <= 2) pool = JOURNAL_PROMPTS.negative;
        else if (mood === 3) pool = JOURNAL_PROMPTS.neutral;
        else if (mood >= 4) pool = JOURNAL_PROMPTS.positive;
    }

    const randomPromptObj = pool[Math.floor(Math.random() * pool.length)];
    setSuggestedPrompt(randomPromptObj.text);
  }, []);

  // Update prompt when Mood changes
  useEffect(() => {
    if (isOpen && isEditing) {
        generateSmartPrompt(selectedMood);
    }
  }, [selectedMood, generateSmartPrompt, isOpen, isEditing]);

  // --- Auto-save Logic ---
  useEffect(() => {
    if (!isOpen || !isEditing || initialEntry) return;
    if (!title && !content && !highlight && !selectedMood) return;

    setSaveStatus('saving');

    const timeoutId = setTimeout(() => {
        const draftData = {
            title, content, highlight, mood: selectedMood,
            energyLevel, weather, impressivePlace, tags, songName,
            timestamp: Date.now()
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        setSaveStatus('saved');
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [title, content, highlight, selectedMood, energyLevel, weather, impressivePlace, tags, songName, isOpen, isEditing, initialEntry]);

  // --- Initialize/Restore ---
  useEffect(() => {
    if (isOpen) {
        if (initialEntry) {
            setIsEditing(false);
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
            setEntryDate(initialEntry.date);
            setIsToolbarExpanded(false);
            setSaveStatus('idle');
        } else {
            setIsEditing(true);
            setEditingId(null);
            
            const defaultDate = initialDate || new Date().toISOString();
            
            if (initialDate) {
                setContent(''); setTitle(''); setHighlight('');
                setSelectedMood(null); setEnergyLevel(50);
                setWeather('Trong xanh'); setImpressivePlace('');
                setTags([]); setSongName('');
                setEntryDate(defaultDate); setSaveStatus('idle');
            } else {
                const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
                let draftLoaded = false;
                
                if (savedDraft) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                            setTitle(parsed.title || '');
                            setContent(parsed.content || '');
                            setHighlight(parsed.highlight || '');
                            setSelectedMood(parsed.mood || null);
                            setEnergyLevel(parsed.energyLevel || 50);
                            setWeather(parsed.weather || 'Trong xanh');
                            setImpressivePlace(parsed.impressivePlace || '');
                            setTags(parsed.tags || []);
                            setSongName(parsed.songName || '');
                            setEntryDate(defaultDate);
                            setSaveStatus('saved');
                            draftLoaded = true;
                        }
                    } catch (e) {
                        console.error("Failed to restore draft", e);
                    }
                }

                if (!draftLoaded) {
                    setContent(initialContent); setTitle(''); setHighlight('');
                    setSelectedMood(null); setEnergyLevel(50);
                    setWeather('Trong xanh'); setImpressivePlace('');
                    setTags([]); setSongName('');
                    setEntryDate(defaultDate); setSaveStatus('idle');
                }
            }

            setIsToolbarExpanded(false);
            if (!selectedMood) generateSmartPrompt(null);
            setRefreshCount(0);
        }
        
        setCurrentTag(''); setIsExiting(false);
        setActiveTab('mood'); setIsIdle(false);
    }
  }, [isOpen, initialEntry, initialContent, initialDate, generateSmartPrompt]);

  // --- Idle Animation Logic ---
  useEffect(() => {
    if (isOpen && isEditing) {
        setIsIdle(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        if (content.length < 10) {
            idleTimerRef.current = setTimeout(() => {
                setIsIdle(true);
            }, 10000);
        }
    }
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [content, isOpen, isEditing]);

  // --- Handlers ---
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
        onClose();
        setIsExiting(false);
    }, 400);
  };

  const handleSave = () => {
    if (!content.trim() && !title.trim()) return;
    
    let finalTags = [...tags];
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        finalTags.push(currentTag.trim());
    }
    
    onSave({
        id: editingId, 
        date: entryDate,
        content, title, highlight,
        mood: selectedMood, energyLevel, weather, impressivePlace,
        tags: finalTags,
        song: songName ? { title: songName } : undefined,
        images: []
    });

    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setSaveStatus('idle');
    handleClose();
  };

  const insertPromptToContent = () => {
    const promptText = `> ${suggestedPrompt}\n\n`;
    
    if (!content.trim()) {
        setContent(promptText);
    } else {
        setContent(prev => prev + '\n\n' + promptText);
    }
    
    setTimeout(() => {
        if (contentRef.current) {
            contentRef.current.focus();
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, 10);
    
    setIsIdle(false);
  };

  const handleRefreshPrompt = () => {
      const now = Date.now();
      const timeDiff = now - lastRefreshTimeRef.current;
      
      if (timeDiff < 600) {
          setRefreshCount(prev => prev + 1);
      } else {
          setRefreshCount(0);
      }
      
      lastRefreshTimeRef.current = now;

      if (refreshCount > 4) {
          setSuggestedPrompt("Từ từ thôi, hãy lắng nghe lòng mình đã...");
          setRefreshCount(0);
          return;
      }

      generateSmartPrompt(selectedMood);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
        setTags([...tags, tag.trim()]);
        setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(t => t !== tagToRemove));
  };

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

  // --- Rendering Helpers ---
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

  // --- Display Helpers ---
  const getHeaderDate = () => {
      const d = new Date(entryDate);
      if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' });
      }
      return new Date().toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  const getHeaderTime = () => {
      const d = new Date(entryDate);
      if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }

  const energyConfig = getEnergyConfig(energyLevel);
  const CurrentMoodIcon = selectedMood ? getMoodIcon(selectedMood) : Quote;

  if (!isOpen && !isExiting) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#FDFBFD] to-gray-50 dark:from-[#151525] dark:to-[#0f0f1a] transition-opacity duration-500 gpu-layer ${isOpen && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 md:px-12 flex justify-between items-center z-10">
         <button onClick={handleClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all">
            <ArrowLeft size={24} />
         </button>

         {isEditing ? (
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1.5 text-xs font-medium transition-all">
                    {saveStatus === 'saving' && (
                        <>
                            <Loader2 size={12} className="animate-spin text-gray-400" />
                            <span className="text-gray-400">Đang lưu...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Check size={12} className="text-green-500" />
                            <span className="text-green-500">Đã lưu bản nháp</span>
                        </>
                    )}
                </div>

                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-vespera-accent text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
                >
                    <Save size={18} />
                    <span className="font-semibold text-sm">Lưu</span>
                </button>
            </div>
        ) : (
             <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all"
            >
                <Edit3 size={24} />
            </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-5 md:px-12 pb-40 overflow-y-auto no-scrollbar">
        <div className="mt-6 md:mt-12 animate-fade-in-up">
            
            {/* Date Display */}
            <div className="flex flex-col gap-1 mb-8 opacity-80 hover:opacity-100 transition-opacity">
                <div 
                    className="relative group inline-flex cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg px-2 py-1 -ml-2 transition-colors"
                    title={isEditing ? "Nhấn để thay đổi thời gian" : ""}
                >
                    {isEditing && (
                        <input 
                            type="datetime-local" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            value={toLocalISOString(new Date(entryDate))}
                            onChange={(e) => {
                                const newDate = new Date(e.target.value);
                                if (!isNaN(newDate.getTime())) {
                                    setEntryDate(newDate.toISOString());
                                }
                            }}
                        />
                    )}
                    
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-vespera-accent dark:text-purple-400">
                        <CalendarDays size={14} />
                        <span>{getHeaderDate()}</span>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        <span>{getHeaderTime()}</span>
                    </div>
                </div>
            </div>

            {isEditing ? (
                <>
                    {/* Smart Prompt */}
                    <PromptCard
                        prompt={suggestedPrompt}
                        isIdle={isIdle}
                        onInsert={insertPromptToContent}
                        onRefresh={handleRefreshPrompt}
                    />

                    <input 
                        ref={titleRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        placeholder="Tiêu đề..."
                        className="w-full bg-transparent border-none text-3xl md:text-5xl font-bold text-vespera-textLight dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-700 mb-6 md:mb-8 focus:ring-0 outline-none leading-tight"
                    />

                    {/* Highlight Input */}
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
                /* View Mode */
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

                    <div className="text-base md:text-xl font-sans text-gray-800 dark:text-gray-200 leading-loose">
                        {renderFormattedContent(content)}
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Bối cảnh</h3>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 flex-wrap">
                                    {selectedMood && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 dark:bg-white/5 rounded-full border border-gray-200/50 dark:border-white/5">
                                            {CurrentMoodIcon && React.createElement(CurrentMoodIcon, { size: 16, className: getMoodColor(selectedMood) })}
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

      {/* Floating Toolbar (Edit Mode Only) */}
      {isEditing && (
        <div className="fixed bottom-4 md:bottom-6 left-0 right-0 z-40 px-3 md:px-0 flex justify-center pointer-events-none">
            <div className={`
                pointer-events-auto
                w-full max-w-2xl 
                bg-white/95 dark:bg-[#1A1A2E]/95 md:bg-white/90 md:dark:bg-[#1A1A2E]/95
                backdrop-filter-none md:backdrop-blur-xl
                shadow-2xl border border-gray-200/50 dark:border-white/10
                transition-all duration-500 ease-spring-custom
                overflow-hidden flex flex-col
                ${isToolbarExpanded ? 'rounded-3xl p-0 h-auto' : 'rounded-full h-14 md:h-16 cursor-pointer hover:scale-[1.02] hover:bg-white dark:hover:bg-[#1f1f35]'}
            `}>
                {/* Collapsed State */}
                <div 
                    className={`flex items-center justify-between px-5 h-full w-full ${isToolbarExpanded ? 'hidden' : 'flex'}`}
                    onClick={() => setIsToolbarExpanded(true)}
                >
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${selectedMood ? getMoodColor(selectedMood) : 'text-gray-400'}`}>
                            {CurrentMoodIcon && <CurrentMoodIcon size={20} className={selectedMood ? 'fill-current opacity-20' : ''}/>}
                            <span className="text-sm font-bold">{selectedMood ? getMoodLabel(selectedMood) : "Chọn cảm xúc"}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
                        <div className="flex items-center gap-1.5">
                             <div className={`w-2 h-2 rounded-full ${energyConfig.bg}`}></div>
                             <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{energyLevel}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400">
                         <div className="flex items-center -space-x-1">
                            {songName && <div className="p-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-500"><Music size={10} /></div>}
                            {tags.length > 0 && <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-500"><Hash size={10} /></div>}
                         </div>
                         
                         <div className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-vespera-accent">
                             <ChevronUp size={18} />
                         </div>
                    </div>
                </div>

                {/* Expanded State */}
                {isToolbarExpanded && (
                    <div className="flex flex-col animate-fade-in">
                        {/* Tabs */}
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

                        {/* Content */}
                        <div className="p-6 min-h-[160px]">
                            {activeTab === 'mood' ? (
                                <MoodSelector
                                    selectedMood={selectedMood}
                                    energyLevel={energyLevel}
                                    onMoodChange={setSelectedMood}
                                    onEnergyChange={setEnergyLevel}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <MetadataPanel
                                        weather={weather}
                                        impressivePlace={impressivePlace}
                                        songName={songName}
                                        onWeatherChange={setWeather}
                                        onPlaceChange={setImpressivePlace}
                                        onSongChange={setSongName}
                                    />
                                    <TagInput
                                        tags={tags}
                                        currentTag={currentTag}
                                        availableTags={availableTags}
                                        onTagAdd={addTag}
                                        onTagRemove={removeTag}
                                        onCurrentTagChange={setCurrentTag}
                                    />
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
