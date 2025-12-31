"use client";

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { getSyncQueue } from '@/lib/offline-storage';

/**
 * Offline Indicator Component
 * 
 * Shows current online/offline status and number of items waiting to sync.
 * Displays a non-intrusive indicator in the corner of the screen.
 */
export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueueCount, setSyncQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);
    updateSyncQueueCount();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check sync queue periodically
    const interval = setInterval(updateSyncQueueCount, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const updateSyncQueueCount = () => {
    const queue = getSyncQueue();
    setSyncQueueCount(queue.length);
  };

  const triggerSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    // Trigger sync via custom event
    window.dispatchEvent(new CustomEvent('trigger-sync'));
    
    // Reset syncing state after a delay
    setTimeout(() => {
      setIsSyncing(false);
      updateSyncQueueCount();
    }, 2000);
  };

  // Don't show indicator if online and nothing to sync
  if (isOnline && syncQueueCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto bg-gray-900 text-white rounded-lg shadow-lg p-3 flex items-center space-x-2 min-w-[200px] border border-gray-700">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {isOnline ? (
            isSyncing ? (
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
            ) : (
              <Wifi className="w-5 h-5 text-green-400" />
            )
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
        </div>

        {/* Status Text */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            {isOnline ? (isSyncing ? 'Syncing...' : 'Online') : 'Offline'}
          </div>
          {syncQueueCount > 0 && (
            <div className="text-xs text-gray-400">
              {syncQueueCount} item{syncQueueCount !== 1 ? 's' : ''} to sync
            </div>
          )}
        </div>

        {/* Sync Button */}
        {isOnline && syncQueueCount > 0 && !isSyncing && (
          <button
            onClick={triggerSync}
            className="flex-shrink-0 p-1 hover:bg-gray-800 rounded transition-colors"
            title="Sync now"
          >
            <Cloud className="w-4 h-4 text-blue-400" />
          </button>
        )}
      </div>
    </div>
  );
}

