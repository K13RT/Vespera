import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JournalEntry, VesperaBackup } from '@/types';
import { INITIAL_ENTRIES } from '@/data/mockEntries';

interface JournalState {
  // State
  entries: JournalEntry[];
  isLoaded: boolean;
  
  // Actions
  addEntry: (entry: Partial<JournalEntry>) => JournalEntry;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  saveEntry: (entryData: Partial<JournalEntry> & { id?: string }) => JournalEntry;
  importEntries: (entries: JournalEntry[]) => void;
  clearEntries: () => void;
  
  // Computed helpers
  getAllTags: () => string[];
  getTodayEntry: () => JournalEntry | undefined;
  
  // Export helper
  exportBackup: () => VesperaBackup;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoaded: false,

      addEntry: (entryData) => {
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          date: entryData.date || new Date().toISOString(),
          content: entryData.content || '',
          images: entryData.images || [],
          ...entryData
        };
        
        set((state) => ({ 
          entries: [newEntry, ...state.entries],
          isLoaded: true 
        }));
        
        return newEntry;
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id)
        }));
      },

      saveEntry: (entryData) => {
        const { addEntry, updateEntry, entries } = get();
        
        if (entryData.id) {
          updateEntry(entryData.id, entryData);
          return entries.find(e => e.id === entryData.id) as JournalEntry;
        } else {
          return addEntry(entryData);
        }
      },

      importEntries: (newEntries) => {
        set({ entries: newEntries, isLoaded: true });
      },

      clearEntries: () => {
        set({ entries: [], isLoaded: true });
      },

      getAllTags: () => {
        const { entries } = get();
        return Array.from(new Set(entries.flatMap(entry => entry.tags || [])));
      },

      getTodayEntry: () => {
        const { entries } = get();
        const today = new Date().toDateString();
        return entries.find(e => new Date(e.date).toDateString() === today);
      },

      exportBackup: () => {
        const { entries } = get();
        return {
          meta: {
            version: '1.0',
            appName: 'Vespera',
            backupDate: new Date().toISOString(),
            totalEntries: entries.length
          },
          data: entries
        };
      }
    }),
    {
      name: 'vespera-journal-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Mark as loaded after rehydration
          state.isLoaded = true;
          
          // If no entries exist, load initial entries
          if (state.entries.length === 0) {
            state.entries = INITIAL_ENTRIES;
          }
        }
      }
    }
  )
);

export default useJournalStore;
