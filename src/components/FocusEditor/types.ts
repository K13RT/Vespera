import { MoodLevel } from '@/types';

export interface FocusEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: any) => void;
  initialEntry?: import('@/types').JournalEntry | null;
  initialContent?: string;
  initialDate?: string | null;
  availableTags?: string[];
  availableLocations?: string[];
}

export interface EditorState {
  title: string;
  content: string;
  highlight: string;
  entryDate: string;
  selectedMood: MoodLevel | null;
  energyLevel: number;
  weather: string;
  impressivePlace: string;
  tags: string[];
  songName: string;
}

export const WEATHER_OPTIONS = ["Trong xanh", "Có mây", "Mưa", "Bão", "Tuyết", "Gió"];
export const DRAFT_STORAGE_KEY = 'vespera_current_draft';

// Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
export const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
  return localISOTime;
};
