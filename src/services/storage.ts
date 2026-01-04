import { JournalEntry, VesperaBackup } from '@/types';

const STORAGE_KEY = 'vespera_journal_entries';
const DRAFT_KEY = 'vespera_current_draft';

/**
 * Storage service for Vespera journal entries
 * Uses localStorage for data persistence
 */
export const StorageService = {
  /**
   * Load journal entries from localStorage
   */
  loadEntries(): JournalEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      // Handle both old format (array) and new format (VesperaBackup)
      if (Array.isArray(parsed)) {
        return parsed;
      }
      
      if (parsed.data && Array.isArray(parsed.data)) {
        return parsed.data;
      }
      
      return [];
    } catch (error) {
      console.error('[Vespera] Failed to load entries:', error);
      return [];
    }
  },

  /**
   * Save journal entries to localStorage
   */
  saveEntries(entries: JournalEntry[]): boolean {
    try {
      const backup: VesperaBackup = {
        meta: {
          version: '1.0',
          appName: 'Vespera',
          backupDate: new Date().toISOString(),
          totalEntries: entries.length
        },
        data: entries
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
      return true;
    } catch (error) {
      console.error('[Vespera] Failed to save entries:', error);
      return false;
    }
  },

  /**
   * Clear all stored entries
   */
  clearEntries(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Load draft content
   */
  loadDraft(): string {
    try {
      return localStorage.getItem(DRAFT_KEY) || '';
    } catch {
      return '';
    }
  },

  /**
   * Save draft content
   */
  saveDraft(content: string): void {
    try {
      if (content) {
        localStorage.setItem(DRAFT_KEY, content);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (error) {
      console.error('[Vespera] Failed to save draft:', error);
    }
  },

  /**
   * Clear draft
   */
  clearDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
  },

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = '__vespera_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get storage info
   */
  getStorageInfo(): { entriesCount: number; lastBackup: string | null } {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { entriesCount: 0, lastBackup: null };
      }
      
      const parsed = JSON.parse(stored);
      
      if (parsed.meta) {
        return {
          entriesCount: parsed.meta.totalEntries || 0,
          lastBackup: parsed.meta.backupDate || null
        };
      }
      
      if (Array.isArray(parsed)) {
        return { entriesCount: parsed.length, lastBackup: null };
      }
      
      return { entriesCount: 0, lastBackup: null };
    } catch {
      return { entriesCount: 0, lastBackup: null };
    }
  }
};

export default StorageService;
