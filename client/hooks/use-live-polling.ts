import { useEffect, useRef, useCallback } from 'react';

interface UseLivePollingOptions {
  interval?: number;
  enabled?: boolean;
  pauseOnHidden?: boolean;
}

export const useLivePolling = (
  callback: () => void | Promise<void>,
  options: UseLivePollingOptions = {}
) => {
  const {
    interval = 5000, // 5 seconds default
    enabled = true,
    pauseOnHidden = true,
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  const isVisibleRef = useRef(true);

  // Update callback ref when callback changes
  callbackRef.current = callback;

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling

    intervalRef.current = setInterval(async () => {
      if (pauseOnHidden && !isVisibleRef.current) return;
      
      try {
        await callbackRef.current();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }, [interval, pauseOnHidden]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle visibility change
  useEffect(() => {
    if (!pauseOnHidden) return;

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      
      if (enabled) {
        if (document.hidden) {
          stopPolling();
        } else {
          startPolling();
          // Immediately fetch when tab becomes visible
          callbackRef.current();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, startPolling, stopPolling, pauseOnHidden]);

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled && (!pauseOnHidden || !document.hidden)) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enabled, startPolling, stopPolling, pauseOnHidden]);

  return { startPolling, stopPolling };
};
