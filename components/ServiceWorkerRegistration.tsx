"use client";

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * 
 * Registers the service worker for offline functionality and PWA support.
 * This runs on the client side after the app loads.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Registered successfully:', registration.scope);
            
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    console.log('[SW] New version available - reload to update');
                    // Could show a toast notification here
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('[SW] Registration failed:', error);
          });
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

