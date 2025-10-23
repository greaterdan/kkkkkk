import { NextResponse } from 'next/server';
import { getRealNetworkStats, getRealBlocks, getRealTransactions } from '@/lib/real-data';

export async function GET() {
  try {
    const [stats, blocks, transactions] = await Promise.all([
      getRealNetworkStats(),
      getRealBlocks(20),
      getRealTransactions(20)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        blocks,
        transactions,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blockchain data',
      data: {
        stats: {
          totalBlocks: 0,
          totalTransactions: 0,
          gasTracker: '0.08',
          avgBlockTime: 3,
          totalAddresses: 0,
          totalStaked: '0',
          totalRewards: '0'
        },
        blocks: [],
        transactions: [],
        timestamp: Date.now()
      }
    });
  }
}
