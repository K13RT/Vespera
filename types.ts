export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
  highlight?: string;
  mood?: MoodLevel;
  energyLevel?: number; // 0-100
  weather?: string;
  impressivePlace?: string; // Replaced location
  tags?: string[];
  song?: {
    title: string;
    link?: string;
  };
  images: string[];
}

export enum MoodLevel {
  Terrible = 1,
  Bad = 2,
  Neutral = 3,
  Good = 4,
  Excellent = 5,
}

export interface ChartDataPoint {
  day: string;
  value: number;
}

export interface BackupMetadata {
  version: string;
  appName: string;
  backupDate: string;
  totalEntries: number;
}

export interface VesperaBackup {
  meta: BackupMetadata;
  data: JournalEntry[];
}