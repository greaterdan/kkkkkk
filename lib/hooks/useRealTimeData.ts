import { useEffect, useState } from 'react';
import { wsClient } from '@/lib/api';

// Hook for real-time blocks
export function useRealTimeBlocks(callback: (block: any) => void) {
  useEffect(() => {
    wsClient.subscribe('new_block', callback);
    return () => wsClient.unsubscribe('new_block', callback);
  }, [callback]);
}

// Hook for real-time transactions
export function useRealTimeTransactions(callback: (tx: any) => void) {
  useEffect(() => {
    wsClient.subscribe('new_transaction', callback);
    return () => wsClient.unsubscribe('new_transaction', callback);
  }, [callback]);
}

// Hook for network stats updates
export function useRealTimeStats(callback: (stats: any) => void) {
  useEffect(() => {
    wsClient.subscribe('stats_update', callback);
    return () => wsClient.unsubscribe('stats_update', callback);
  }, [callback]);
}

// General hook for WebSocket connection
export function useWebSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    wsClient.connect();

    const checkConnection = setInterval(() => {
      // This is a simplified check - you'd need to expose connection state from wsClient
      setConnected(true);
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      wsClient.disconnect();
    };
  }, []);

  return { connected };
}

