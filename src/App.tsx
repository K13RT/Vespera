import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Settings } from 'lucide-react';
import EditorWidget from '@/components/EditorWidget';
import MoodTracker from '@/components/MoodTracker';
import InsightsBlock from '@/components/InsightsBlock';
import HistoryBlock from '@/components/HistoryBlock';
import FocusEditor from '@/components/FocusEditor';
import SettingsModal from '@/components/SettingsModal';
import { JournalEntry, VesperaBackup } from '@/types';
import { INITIAL_ENTRIES } from '@/data/mockEntries';
import { useJournalEntries } from '@/hooks/useJournalEntries';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Journal entries with localStorage persistence
  const { 
    entries: journalEntries, 
    isLoaded,
    saveEntry,
    importEntries,
    clearEntries: clearStoredEntries 
  } = useJournalEntries(INITIAL_ENTRIES);
  
  const [currentDraft, setCurrentDraft] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [targetDateForNewEntry, setTargetDateForNewEntry] = useState<string | null>(null);
  
  // Auto Night Shift Logic
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleEntryClick = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry);
    setTargetDateForNewEntry(null);
    setIsFocusMode(true);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedEntry(null);
    setTargetDateForNewEntry(date.toISOString());
    setIsFocusMode(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsFocusMode(false);
    setTimeout(() => {
        setSelectedEntry(null);
        setTargetDateForNewEntry(null);
    }, 500);
  }, []);

  const handleSaveEntry = useCallback((entryData: any) => {
    saveEntry(entryData);
    
    if (!entryData.id) {
        setCurrentDraft("");
    }
  }, [saveEntry]);

  const handleExportData = useCallback(() => {
    const backupData: VesperaBackup = {
      meta: {
        version: "1.0",
        appName: "Vespera",
        backupDate: new Date().toISOString(),
        totalEntries: journalEntries.length
      },
      data: journalEntries
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const dateStr = new Date().toISOString().split('T')[0];
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vespera_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [journalEntries]);

  const validateVesperaData = (json: any): boolean => {
    if (!json || typeof json !== 'object') return false;
    
    let entriesToCheck = json;
    
    if (json.meta && json.data && Array.isArray(json.data)) {
        if (json.meta.appName !== 'Vespera') console.warn("Backup might not be from Vespera");
        entriesToCheck = json.data;
    } else if (Array.isArray(json)) {
        entriesToCheck = json;
    } else {
        return false;
    }

    if (entriesToCheck.length === 0) return true;
    
    const firstItem = entriesToCheck[0];
    return Boolean(firstItem.id && (firstItem.content !== undefined || firstItem.highlight !== undefined));
  };

  const handleImportData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            const parsedJson = JSON.parse(content);
            
            if (validateVesperaData(parsedJson)) {
                const newEntries = Array.isArray(parsedJson) ? parsedJson : parsedJson.data;
                const count = newEntries.length;
                
                if (window.confirm(`Tìm thấy ${count} bài viết trong bản sao lưu.\nBạn có chắc chắn muốn khôi phục không? Dữ liệu hiện tại sẽ bị thay thế.`)) {
                    importEntries(newEntries);
                }
            } else {
                alert("File không hợp lệ hoặc bị hỏng! Vui lòng kiểm tra lại file sao lưu.");
                throw new Error("Invalid Validation");
            }
        } catch (error) {
            console.error("Error reading file", error);
            throw error; 
        }
    };
    reader.readAsText(file);
  }, []);

  const handleClearData = useCallback(() => {
    clearStoredEntries();
  }, [clearStoredEntries]);

  const handleExpandEditor = useCallback(() => {
      setSelectedEntry(null);
      setTargetDateForNewEntry(null);
      setIsFocusMode(true);
  }, []);

  const allTags = React.useMemo(() => 
    Array.from(new Set(journalEntries.flatMap(entry => entry.tags || []))), 
  [journalEntries]);

  const latestEntryContent = journalEntries.length > 0 && new Date(journalEntries[0].date).toDateString() === new Date().toDateString() 
    ? journalEntries[0].content 
    : undefined;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? 'bg-vespera-dark text-vespera-textDark' : 'bg-vespera-light text-vespera-textLight'}`}>
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        onClear={handleClearData}
        totalEntries={journalEntries.length}
      />

      <FocusEditor 
        isOpen={isFocusMode} 
        onClose={handleCloseEditor} 
        onSave={handleSaveEntry}
        initialContent={currentDraft}
        initialEntry={selectedEntry}
        initialDate={targetDateForNewEntry}
        availableTags={allTags}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 md:p-8 lg:p-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300">
                    Vespera
                </h1>
                <p className="text-sm opacity-60 font-medium">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2.5 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/5 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 focus:outline-none"
                    aria-label="Settings"
                >
                    <Settings size={18} />
                </button>

                <button 
                    onClick={toggleTheme}
                    className="relative w-16 h-10 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/5 transition-all duration-300 focus:outline-none group shadow-inner"
                    aria-label="Toggle Theme"
                >
                    <div className="absolute inset-0 flex items-center justify-between px-2.5">
                         <Sun size={16} className={`text-gray-500 transition-opacity duration-300 ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
                         <Moon size={16} className={`text-gray-400 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
                    </div>
                    
                    <div className={`absolute top-1 left-1 w-8 h-8 rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center ${isDarkMode ? 'translate-x-6 bg-[#2A2A4A] border border-white/10' : 'translate-x-0 bg-white border border-gray-100'}`}>
                        {isDarkMode ? (
                             <Moon size={16} className="text-purple-300 fill-purple-300/20" />
                        ) : (
                             <Sun size={16} className="text-orange-400 fill-orange-400/20" />
                        )}
                    </div>
                </button>
            </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[200px]">
            
            <div className="md:col-span-2 lg:col-span-2 md:row-span-1 min-h-[200px] md:min-h-0">
                <EditorWidget 
                    onExpand={handleExpandEditor} 
                    savedEntry={latestEntryContent}
                />
            </div>

            <div className="md:col-span-1 lg:col-span-1 md:row-span-1 min-h-[200px] md:min-h-0">
                <MoodTracker entries={journalEntries} />
            </div>

            <div className="md:col-span-1 lg:col-span-1 md:row-span-1 min-h-[200px] md:min-h-0">
                <InsightsBlock entries={journalEntries} />
            </div>

            <div className="md:col-span-2 lg:col-span-4 md:row-span-2 min-h-[400px]">
                <HistoryBlock 
                    entries={journalEntries} 
                    onEntryClick={handleEntryClick}
                    onEmptyDateClick={handleDateSelect}
                />
            </div>

        </div>
      </div>
    </div>
  );
}

export default App;
