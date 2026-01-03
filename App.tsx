import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Settings } from 'lucide-react';
import EditorWidget from './components/EditorWidget';
import MoodTracker from './components/MoodTracker';
import InsightsBlock from './components/InsightsBlock';
import HistoryBlock from './components/HistoryBlock';
import FocusEditor from './components/FocusEditor';
import SettingsModal from './components/SettingsModal';
import { MoodLevel, JournalEntry } from './types';

// Helper to generate dates relative to today to ensure the calendar always looks populated
const getPastDate = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

// Initial Mock Data for History - 15 Entries
const INITIAL_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: getPastDate(0),
        title: "Midnight Inspiration",
        highlight: "Suddenly understood how to fix the layout bug.",
        content: "I was about to go to sleep when the solution hit me. I had to get up and write it down. The night is so quiet and peaceful for coding.",
        mood: MoodLevel.Excellent,
        energyLevel: 85,
        weather: "Clear",
        tags: ["coding", "late-night", "epiphany"],
        impressivePlace: "Home Office",
        images: []
    },
    {
        id: '2',
        date: getPastDate(1),
        title: "Heavy Rain & Jazz",
        highlight: "Found a new jazz playlist that is perfect for reading.",
        content: "It rained all evening. I stayed inside, made tea, and read for three hours straight. It felt like time stopped.",
        mood: MoodLevel.Good,
        energyLevel: 60,
        weather: "Rainy",
        tags: ["reading", "chill", "jazz"],
        song: { title: "Blue in Green - Miles Davis" },
        images: []
    },
    {
        id: '3',
        date: getPastDate(3),
        title: "A Tough Meeting",
        highlight: "Managed to stay calm despite the criticism.",
        content: "Work was stressful today. The project review didn't go as planned, but I learned a lot about what needs to be improved. Need to rest now.",
        mood: MoodLevel.Bad,
        energyLevel: 30,
        weather: "Cloudy",
        tags: ["work", "reflection", "stress"],
        images: []
    },
    {
        id: '4',
        date: getPastDate(4),
        title: "Sunday Brunch",
        highlight: "The pancakes were fluffy perfection.",
        content: "Met with Sarah for brunch. We talked about everything and nothing. It's nice to disconnect from screens for a while.",
        mood: MoodLevel.Excellent,
        energyLevel: 90,
        weather: "Sunny",
        impressivePlace: "The Morning Owl Cafe",
        tags: ["friends", "food", "weekend"],
        images: []
    },
    {
        id: '5',
        date: getPastDate(5),
        title: "Just an Okay Day",
        highlight: "Cleared my email inbox.",
        content: "Nothing special happened today. Just a routine day. Sometimes routine is good, it keeps the chaos away.",
        mood: MoodLevel.Neutral,
        energyLevel: 50,
        weather: "Cloudy",
        tags: ["routine", "chore"],
        images: []
    },
    {
        id: '6',
        date: getPastDate(7),
        title: "Learning React 19",
        highlight: "The new hooks are interesting!",
        content: "Spent the whole afternoon diving into the documentation. The compiler improvements look promising. I'm excited to try them in Vespera.",
        mood: MoodLevel.Good,
        energyLevel: 75,
        weather: "Windy",
        tags: ["coding", "learning", "tech"],
        images: []
    },
    {
        id: '7',
        date: getPastDate(8),
        title: "Exhausted",
        highlight: "Finally finished the report.",
        content: "I pushed myself too hard today. My eyes are burning. Note to self: take more breaks tomorrow.",
        mood: MoodLevel.Terrible,
        energyLevel: 10,
        weather: "Stormy",
        tags: ["burnout", "work"],
        images: []
    },
    {
        id: '8',
        date: getPastDate(10),
        title: "Park Walk",
        highlight: "Saw a double rainbow.",
        content: "Took a long walk in the park before sunset. The air was fresh after the rain. Nature really heals.",
        mood: MoodLevel.Good,
        energyLevel: 65,
        weather: "Clear",
        impressivePlace: "City Park",
        tags: ["nature", "walk", "health"],
        images: []
    },
    {
        id: '9',
        date: getPastDate(12),
        title: "Movie Night",
        highlight: "Rewatched Interstellar.",
        content: "That soundtrack never gets old. It makes me feel so small yet so connected to the universe.",
        mood: MoodLevel.Excellent,
        energyLevel: 70,
        weather: "Clear",
        song: { title: "Cornfield Chase - Hans Zimmer" },
        tags: ["movie", "sci-fi", "inspiration"],
        images: []
    },
    {
        id: '10',
        date: getPastDate(14),
        title: "Grocery Run",
        highlight: "Found fresh strawberries.",
        content: "Did the weekly shopping. Prices are going up, which is annoying. But I'm going to make a smoothie tomorrow.",
        mood: MoodLevel.Neutral,
        energyLevel: 45,
        weather: "Cloudy",
        tags: ["chores", "food"],
        images: []
    },
    {
        id: '11',
        date: getPastDate(15),
        title: "Design System Update",
        highlight: "Standardized the color palette.",
        content: "Refining the UI tokens. It's tedious work but it pays off in the long run. The purple shades look much better now.",
        mood: MoodLevel.Good,
        energyLevel: 80,
        weather: "Sunny",
        tags: ["design", "ui/ux", "work"],
        images: []
    },
    {
        id: '12',
        date: getPastDate(18),
        title: "Feeling Melancholy",
        highlight: "Wrote a poem.",
        content: "Sometimes sadness isn't bad, it's just a quiet place to be. I missed my old home today.",
        mood: MoodLevel.Bad,
        energyLevel: 35,
        weather: "Rainy",
        tags: ["personal", "poetry", "emotions"],
        images: []
    },
    {
        id: '13',
        date: getPastDate(20),
        title: "Gym Session",
        highlight: "Personal best on deadlift.",
        content: "Felt strong today. Physical activity clears my mind better than anything else.",
        mood: MoodLevel.Excellent,
        energyLevel: 95,
        weather: "Clear",
        impressivePlace: "Iron Gym",
        tags: ["fitness", "gym", "health"],
        images: []
    },
    {
        id: '14',
        date: getPastDate(22),
        title: "Pizza Night",
        highlight: "Extra cheese makes everything better.",
        content: "Too tired to cook. Ordered pizza and watched a sitcom. Simple pleasures.",
        mood: MoodLevel.Good,
        energyLevel: 40,
        weather: "Cloudy",
        tags: ["food", "relax"],
        images: []
    },
    {
        id: '15',
        date: getPastDate(25),
        title: "Planning the Month",
        highlight: "Set clear goals.",
        content: "Sat down with my planner. I want to focus more on mindfulness this coming month.",
        mood: MoodLevel.Neutral,
        energyLevel: 60,
        weather: "Clear",
        tags: ["planning", "goals"],
        images: []
    }
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // State for Journaling
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [currentDraft, setCurrentDraft] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  // Auto Night Shift Logic
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      // Enable dark mode between 6 PM (18:00) and 6 AM (06:00)
      if (hour >= 18 || hour < 6) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    };

    checkTime();
    // Check every minute
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // useCallback ensures these functions don't change identity on every render,
  // allowing React.memo in children to work effectively.
  const handleEntryClick = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsFocusMode(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsFocusMode(false);
    // Slight delay to clear selection so the close animation looks smooth
    setTimeout(() => {
        setSelectedEntry(null);
    }, 500);
  }, []);

  const handleSaveEntry = useCallback((entryData: any) => {
    // Functional update prevents dependency on journalEntries, keeping this function stable
    setJournalEntries(currentEntries => {
        if (entryData.id) {
            // Update existing entry
            return currentEntries.map(entry => 
                entry.id === entryData.id ? { ...entry, ...entryData } : entry
            );
        } else {
            // Create new entry
            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                ...entryData
            };
            // Add to history (prepend)
            return [newEntry, ...currentEntries];
        }
    });
    
    // Only reset draft if it's a new entry (not editing)
    if (!entryData.id) {
        setCurrentDraft("");
    }
  }, []);

  // --- Data Management Functions ---
  const handleExportData = useCallback(() => {
    // We access journalEntries directly from state for export (event handler)
    // To make this callback stable, we can use a ref or accept that it depends on journalEntries.
    // However, since SettingsModal is often closed, re-creating this isn't a huge perf hit.
    // Better yet, we can pass journalEntries to the modal only when open.
    // For simplicity with best practices, we'll let this rebuild when entries change.
    // But to optimize "smoothness" of opening other things, we keep it simple.
    
    // NOTE: Inside an event handler, we read the current state. 
    // If we want this truly stable, we'd use a Ref for entries, but that's overkill here.
    const dataStr = JSON.stringify(journalEntries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vespera-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [journalEntries]);

  const handleImportData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            if (Array.isArray(json)) {
                // Simple validation check
                const isValid = json.every(item => item.id && (item.content || item.highlight));
                if (isValid) {
                    setJournalEntries(json);
                    console.log("Data imported successfully");
                } else {
                    alert("Invalid Vespera backup file format.");
                }
            }
        } catch (error) {
            console.error("Error reading file", error);
            alert("Error reading file.");
        }
    };
    reader.readAsText(file);
  }, []);

  const handleClearData = useCallback(() => {
    setJournalEntries([]);
  }, []);

  const handleExpandEditor = useCallback(() => {
      setSelectedEntry(null); // Ensure we are in "New Mode"
      setIsFocusMode(true);
  }, []);

  // Collect all unique tags from history for suggestions
  // Memoize this to prevent recalculation on every render
  const allTags = React.useMemo(() => 
    Array.from(new Set(journalEntries.flatMap(entry => entry.tags || []))), 
  [journalEntries]);

  // Extract latest entry content safely
  const latestEntryContent = journalEntries.length > 0 && new Date(journalEntries[0].date).toDateString() === new Date().toDateString() 
    ? journalEntries[0].content 
    : undefined;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? 'bg-vespera-dark text-vespera-textDark' : 'bg-vespera-light text-vespera-textLight'}`}>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        onClear={handleClearData}
        totalEntries={journalEntries.length}
      />

      {/* Focus Mode Overlay */}
      <FocusEditor 
        isOpen={isFocusMode} 
        onClose={handleCloseEditor} 
        onSave={handleSaveEntry}
        initialContent={currentDraft}
        initialEntry={selectedEntry}
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
                {/* Settings Button */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2.5 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/5 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 focus:outline-none"
                    aria-label="Settings"
                >
                    <Settings size={18} />
                </button>

                {/* Enhanced Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="relative w-16 h-10 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/5 transition-all duration-300 focus:outline-none group shadow-inner"
                    aria-label="Toggle Theme"
                >
                    {/* Background Icons */}
                    <div className="absolute inset-0 flex items-center justify-between px-2.5">
                         <Sun size={16} className={`text-gray-500 transition-opacity duration-300 ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
                         <Moon size={16} className={`text-gray-400 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
                    </div>
                    
                    {/* Sliding Knob */}
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

        {/* Bento Grid Layout - Updated to 4 columns for better flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[200px]">
            
            {/* Block 1: Editor (Medium: 2x1) */}
            <div className="md:col-span-2 lg:col-span-2 md:row-span-1 min-h-[200px] md:min-h-0">
                <EditorWidget 
                    onExpand={handleExpandEditor} 
                    savedEntry={latestEntryContent}
                />
            </div>

            {/* Block 2: Mood Chart (Small: 1x1) */}
            <div className="md:col-span-1 lg:col-span-1 md:row-span-1 min-h-[200px] md:min-h-0">
                <MoodTracker entries={journalEntries} />
            </div>

            {/* Block 3: Stats/Insights (Small: 1x1) */}
            <div className="md:col-span-1 lg:col-span-1 md:row-span-1 min-h-[200px] md:min-h-0">
                <InsightsBlock entries={journalEntries} />
            </div>

            {/* Block 4: History (Large: 4x2) - INCREASED HEIGHT HERE */}
            <div className="md:col-span-2 lg:col-span-4 md:row-span-2 min-h-[400px]">
                <HistoryBlock 
                    entries={journalEntries} 
                    onEntryClick={handleEntryClick}
                />
            </div>

        </div>
      </div>
    </div>
  );
}

export default App;