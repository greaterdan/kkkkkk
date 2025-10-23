'use client';

import { useState, useEffect } from 'react';
import { getRealBlocks, getRealTransactions, getRealValidators, getRealNetworkStats, RealBlock, RealTransaction, RealValidator } from '../real-data';

// Real-time data hooks for client components
export const useRealTimeData = () => {
  const [data, setData] = useState<{
    blocks: RealBlock[];
    transactions: RealTransaction[];
    validators: RealValidator[];
    stats: any;
  }>({
    blocks: [],
    transactions: [],
    validators: [],
    stats: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blocks, transactions, validators, stats] = await Promise.all([
          getRealBlocks(20),
          getRealTransactions(20),
          getRealValidators(),
          getRealNetworkStats()
        ]);

        setData({ blocks, transactions, validators, stats });
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    fetchData();
    
    // Set up real-time updates every 3 seconds (matching block time)
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return data;
};