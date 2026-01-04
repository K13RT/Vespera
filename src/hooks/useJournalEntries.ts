import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '@/types';
import StorageService from '@/services/storage';

/**
 * Custom hook for managing journal entries with localStorage persistence
 */
export function useJournalEntries(initialEntries: JournalEntry[] = []) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = StorageService.loadEntries();
    
    if (stored.length > 0) {
      setEntries(stored);
    } else if (initialEntries.length > 0) {
      // Use initial entries only if no stored data exists
      setEntries(initialEntries);
      StorageService.saveEntries(initialEntries);
    }
    
    setIsLoaded(true);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && entries.length >= 0) {
      StorageService.saveEntries(entries);
    }
  }, [entries, isLoaded]);

  // Add new entry
  const addEntry = useCallback((entryData: Partial<JournalEntry>) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: entryData.date || new Date().toISOString(),
      content: entryData.content || '',
      images: entryData.images || [],
      ...entryData
    };
    
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  // Update existing entry
  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  }, []);

  // Delete entry
  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // Save entry (add or update)
  const saveEntry = useCallback((entryData: Partial<JournalEntry> & { id?: string }) => {
    if (entryData.id) {
      updateEntry(entryData.id, entryData);
      return entryData as JournalEntry;
    } else {
      return addEntry(entryData);
    }
  }, [addEntry, updateEntry]);

  // Import entries (replace all)
  const importEntries = useCallback((newEntries: JournalEntry[]) => {
    setEntries(newEntries);
  }, []);

  // Clear all entries
  const clearEntries = useCallback(() => {
    setEntries([]);
    StorageService.clearEntries();
  }, []);

  return {
    entries,
    isLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    saveEntry,
    importEntries,
    clearEntries
  };
}

export default useJournalEntries;
