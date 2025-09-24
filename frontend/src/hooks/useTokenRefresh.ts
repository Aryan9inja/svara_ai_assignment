import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Hook to handle automatic token refresh
export const useTokenRefresh = (intervalMinutes: number = 15) => {
  const { refreshAuth, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up automatic token refresh
    intervalRef.current = setInterval(async () => {
      try {
        await refreshAuth();
        console.log('Token refreshed automatically');
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
        // The auth context will handle logout if refresh fails
      }
    }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, refreshAuth, intervalMinutes]);

  // Manual refresh function
  const manualRefresh = async () => {
    try {
      await refreshAuth();
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  return { manualRefresh };
};