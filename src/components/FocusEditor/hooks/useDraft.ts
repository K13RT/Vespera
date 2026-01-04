import { useState, useEffect, useCallback } from 'react';
import { MoodLevel } from '@/types';
import { DRAFT_STORAGE_KEY, EditorState } from '../types';

interface UseDraftOptions {
  isOpen: boolean;
  isEditing: boolean;
  hasInitialEntry: boolean;
}

interface UseDraftReturn {
  saveStatus: 'idle' | 'saving' | 'saved';
  loadDraft: () => EditorState | null;
  clearDraft: () => void;
}

export function useDraft(
  state: EditorState,
  options: UseDraftOptions
): UseDraftReturn {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const { isOpen, isEditing, hasInitialEntry } = options;

  // Auto-save draft effect
  useEffect(() => {
    // Only auto-save for new entries (not editing existing entries)
    if (!isOpen || !isEditing || hasInitialEntry) return;

    // Don't save empty states
    if (!state.title && !state.content && !state.highlight && !state.selectedMood) return;

    setSaveStatus('saving');

    const timeoutId = setTimeout(() => {
      const draftData = {
        ...state,
        timestamp: Date.now()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setSaveStatus('saved');
    }, 1500); // Wait 1.5s after changes before saving

    return () => clearTimeout(timeoutId);
  }, [
    state.title, 
    state.content, 
    state.highlight, 
    state.selectedMood, 
    state.energyLevel, 
    state.weather, 
    state.impressivePlace, 
    state.tags, 
    state.songName, 
    isOpen, 
    isEditing, 
    hasInitialEntry
  ]);

  // Load draft from localStorage
  const loadDraft = useCallback((): EditorState | null => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return null;

      const parsed = JSON.parse(savedDraft);
      
      // Only restore if draft is less than 24 hours old
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return {
          title: parsed.title || '',
          content: parsed.content || '',
          highlight: parsed.highlight || '',
          entryDate: new Date().toISOString(),
          selectedMood: parsed.selectedMood || null,
          energyLevel: parsed.energyLevel || 50,
          weather: parsed.weather || 'Trong xanh',
          impressivePlace: parsed.impressivePlace || '',
          tags: parsed.tags || [],
          songName: parsed.songName || ''
        };
      }
    } catch (e) {
      console.error("Failed to restore draft", e);
    }
    return null;
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setSaveStatus('idle');
  }, []);

  return {
    saveStatus,
    loadDraft,
    clearDraft
  };
}

export default useDraft;
