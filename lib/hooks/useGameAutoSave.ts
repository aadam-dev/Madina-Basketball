"use client";

import { useEffect, useRef } from 'react';
import { saveGameState, getCurrentGameState, hasRecoverableGame, addToSyncQueue, clearCurrentGame, addGameToHistory } from '../offline-storage';

/**
 * Custom Hook: useGameAutoSave
 * 
 * Automatically saves game state to localStorage and handles recovery.
 * Usage: Call this hook in your scoreboard component with the current game state.
 */

interface GameAutoSaveOptions {
  gameMode: 'basic' | 'stats' | 'full';
  enabled?: boolean; // Default true
  autoSaveInterval?: number; // Default 2000ms
  onRecover?: (state: any) => void;
}

export function useGameAutoSave(gameState: any, options: GameAutoSaveOptions) {
  const { gameMode, enabled = true, autoSaveInterval = 2000, onRecover } = options;
  const lastSaveRef = useRef<number>(0);
  const recoveryCheckedRef = useRef<boolean>(false);

  // Check for recoverable game on mount
  useEffect(() => {
    if (!enabled || recoveryCheckedRef.current) return;
    
    recoveryCheckedRef.current = true;
    
    if (hasRecoverableGame()) {
      const recovered = getCurrentGameState();
      if (recovered && recovered.gameMode === gameMode) {
        const message = `Found unsaved ${gameMode} game from ${new Date(recovered.timestamp).toLocaleString()}.\n\nRecover this game?`;
        
        if (window.confirm(message)) {
          onRecover?.(recovered);
        } else {
          clearCurrentGame();
        }
      }
    }
  }, [enabled, gameMode, onRecover]);

  // Auto-save game state
  useEffect(() => {
    if (!enabled || !gameState.gameStarted) return;

    const now = Date.now();
    if (now - lastSaveRef.current < autoSaveInterval) return;

    lastSaveRef.current = now;
    
    saveGameState({
      ...gameState,
      gameMode,
      id: gameState.id || `local_${Date.now()}`,
    });
  }, [gameState, gameMode, enabled, autoSaveInterval]);

  // Handle game end - move to history and clear current
  useEffect(() => {
    if (gameState.gameEnded && enabled) {
      const finalState = getCurrentGameState();
      if (finalState) {
        addGameToHistory(finalState);
        clearCurrentGame();
      }
    }
  }, [gameState.gameEnded, enabled]);

  return {
    hasSaved: lastSaveRef.current > 0,
    lastSaveTime: lastSaveRef.current,
  };
}

/**
 * Custom Hook: useOfflineSync
 * 
 * Handles syncing queued data when online.
 */
export function useOfflineSync() {
  useEffect(() => {
    const handleSync = async () => {
      const { getSyncQueue, removeFromSyncQueue, incrementSyncRetry } = await import('../offline-storage');
      const queue = getSyncQueue();
      
      for (const item of queue) {
        try {
          if (item.action === 'save-game') {
            const response = await fetch('/api/games', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data),
            });
            
            if (response.ok) {
              removeFromSyncQueue(item.id);
              console.log('[Sync] Successfully synced game:', item.id);
            } else {
              throw new Error('Sync failed');
            }
          }
        } catch (error) {
          console.error('[Sync] Failed to sync item:', item.id, error);
          incrementSyncRetry(item.id);
          
          // Remove after 5 failed retries
          if (item.retries >= 5) {
            removeFromSyncQueue(item.id);
            console.warn('[Sync] Removed item after 5 failed retries:', item.id);
          }
        }
      }
    };

    // Trigger sync on online event
    window.addEventListener('online', handleSync);
    
    // Trigger sync on custom event
    window.addEventListener('trigger-sync', handleSync as EventListener);
    
    // Initial sync if online
    if (navigator.onLine) {
      handleSync();
    }

    return () => {
      window.removeEventListener('online', handleSync);
      window.removeEventListener('trigger-sync', handleSync as EventListener);
    };
  }, []);
}

