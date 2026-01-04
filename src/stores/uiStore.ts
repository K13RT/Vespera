import { create } from 'zustand';
import { JournalEntry } from '@/types';

interface UIState {
  // Theme
  isDarkMode: boolean;
  
  // Editor modal
  isFocusMode: boolean;
  selectedEntry: JournalEntry | null;
  targetDateForNewEntry: string | null;
  currentDraft: string;
  
  // Settings modal
  isSettingsOpen: boolean;
  
  // Actions
  setDarkMode: (isDark: boolean) => void;
  toggleTheme: () => void;
  
  // Editor actions
  openEditor: (entry?: JournalEntry | null, targetDate?: string | null) => void;
  closeEditor: () => void;
  setDraft: (draft: string) => void;
  clearDraft: () => void;
  
  // Settings actions
  openSettings: () => void;
  closeSettings: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  // Initial state
  isDarkMode: false,
  isFocusMode: false,
  selectedEntry: null,
  targetDateForNewEntry: null,
  currentDraft: '',
  isSettingsOpen: false,

  // Theme
  setDarkMode: (isDark) => {
    set({ isDarkMode: isDark });
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const { isDarkMode, setDarkMode } = get();
    setDarkMode(!isDarkMode);
  },

  // Editor
  openEditor: (entry = null, targetDate = null) => {
    set({
      isFocusMode: true,
      selectedEntry: entry,
      targetDateForNewEntry: targetDate
    });
  },

  closeEditor: () => {
    set({ isFocusMode: false });
    // Delay clearing entry to allow exit animation
    setTimeout(() => {
      set({
        selectedEntry: null,
        targetDateForNewEntry: null
      });
    }, 500);
  },

  setDraft: (draft) => set({ currentDraft: draft }),
  
  clearDraft: () => set({ currentDraft: '' }),

  // Settings
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false })
}));

export default useUIStore;
