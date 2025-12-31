/**
 * Offline Storage Utilities
 * 
 * Provides localStorage-based game data persistence and sync queue management
 * for offline functionality in basketball scoreboards.
 */

export interface GameState {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  overtime: number;
  gameStarted: boolean;
  gameEnded: boolean;
  gameMode: 'basic' | 'stats' | 'full';
  homePlayers?: any[];
  awayPlayers?: any[];
  gameEvents?: any[];
  quarterScores?: any[];
  timestamp: number;
  synced: boolean;
}

export interface SyncQueueItem {
  id: string;
  action: 'save-game' | 'update-game' | 'save-event';
  data: any;
  timestamp: number;
  retries: number;
}

const CURRENT_GAME_KEY = 'mbb_current_game';
const GAMES_HISTORY_KEY = 'mbb_games_history';
const SYNC_QUEUE_KEY = 'mbb_sync_queue';
const MAX_HISTORY = 50; // Keep last 50 games in local storage

/**
 * Save current game state to localStorage
 */
export function saveGameState(gameState: Partial<GameState>): void {
  try {
    const existing = getCurrentGameState();
    const updated = {
      ...existing,
      ...gameState,
      timestamp: Date.now(),
    };
    localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[Offline Storage] Failed to save game state:', error);
  }
}

/**
 * Get current game state from localStorage
 */
export function getCurrentGameState(): GameState | null {
  try {
    const stored = localStorage.getItem(CURRENT_GAME_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('[Offline Storage] Failed to get game state:', error);
  }
  return null;
}

/**
 * Clear current game state
 */
export function clearCurrentGame(): void {
  try {
    localStorage.removeItem(CURRENT_GAME_KEY);
  } catch (error) {
    console.error('[Offline Storage] Failed to clear game state:', error);
  }
}

/**
 * Check if there's a recoverable game (< 24 hours old)
 */
export function hasRecoverableGame(): boolean {
  const state = getCurrentGameState();
  if (!state || state.gameEnded) return false;
  
  const hoursSinceLastUpdate = (Date.now() - state.timestamp) / (1000 * 60 * 60);
  return hoursSinceLastUpdate < 24;
}

/**
 * Add completed game to history
 */
export function addGameToHistory(gameState: GameState): void {
  try {
    const history = getGamesHistory();
    history.unshift(gameState); // Add to beginning
    
    // Keep only last MAX_HISTORY games
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(GAMES_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('[Offline Storage] Failed to add game to history:', error);
  }
}

/**
 * Get games history
 */
export function getGamesHistory(): GameState[] {
  try {
    const stored = localStorage.getItem(GAMES_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('[Offline Storage] Failed to get games history:', error);
  }
  return [];
}

/**
 * Add item to sync queue
 */
export function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>): void {
  try {
    const queue = getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    };
    queue.push(newItem);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('[Offline Storage] Failed to add to sync queue:', error);
  }
}

/**
 * Get sync queue
 */
export function getSyncQueue(): SyncQueueItem[] {
  try {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('[Offline Storage] Failed to get sync queue:', error);
  }
  return [];
}

/**
 * Remove item from sync queue
 */
export function removeFromSyncQueue(itemId: string): void {
  try {
    const queue = getSyncQueue();
    const filtered = queue.filter(item => item.id !== itemId);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('[Offline Storage] Failed to remove from sync queue:', error);
  }
}

/**
 * Update retry count for sync queue item
 */
export function incrementSyncRetry(itemId: string): void {
  try {
    const queue = getSyncQueue();
    const updated = queue.map(item => 
      item.id === itemId 
        ? { ...item, retries: item.retries + 1 }
        : item
    );
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[Offline Storage] Failed to increment retry:', error);
  }
}

/**
 * Clear sync queue
 */
export function clearSyncQueue(): void {
  try {
    localStorage.removeItem(SYNC_QUEUE_KEY);
  } catch (error) {
    console.error('[Offline Storage] Failed to clear sync queue:', error);
  }
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; available: number; percentage: number } {
  try {
    const allKeys = Object.keys(localStorage);
    let used = 0;
    
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        used += key.length + value.length;
      }
    });
    
    // Estimate: most browsers allow 5-10MB localStorage
    const available = 5 * 1024 * 1024; // 5MB
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  } catch (error) {
    console.error('[Offline Storage] Failed to get storage info:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
}

/**
 * Export all data for backup
 */
export function exportAllData(): string {
  const currentGame = getCurrentGameState();
  const history = getGamesHistory();
  const syncQueue = getSyncQueue();
  
  return JSON.stringify({
    currentGame,
    history,
    syncQueue,
    exportDate: new Date().toISOString(),
  }, null, 2);
}

/**
 * Import data from backup
 */
export function importAllData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.currentGame) {
      localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(data.currentGame));
    }
    if (data.history) {
      localStorage.setItem(GAMES_HISTORY_KEY, JSON.stringify(data.history));
    }
    if (data.syncQueue) {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(data.syncQueue));
    }
    
    return true;
  } catch (error) {
    console.error('[Offline Storage] Failed to import data:', error);
    return false;
  }
}

