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
      const [blocks, transactions, validators, stats] = await Promise.all([
        getRealBlocks(20),
        getRealTransactions(20),
        getRealValidators(),
        getRealNetworkStats()
      ]);

      setData({ blocks, transactions, validators, stats });
    };

    fetchData();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return data;
};