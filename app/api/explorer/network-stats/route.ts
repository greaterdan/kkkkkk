import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Generate realistic network statistics for a new 01A L2 chain (3 days old)
    const now = Date.now();
    const baseBlockNumber = 5000 + Math.floor(Math.random() * 2000); // 5K-7K blocks
    const baseTxCount = 15000 + Math.floor(Math.random() * 5000); // 15K-20K transactions
    const baseAddresses = 1200 + Math.floor(Math.random() * 300); // 1.2K-1.5K addresses
    
    // Simulate realistic gas prices for new L2 (slightly higher than established L2s)
    const gasTracker = 0.08 + Math.random() * 0.05; // 0.08-0.13 Gwei
    
    // Calculate 24h transactions for active new L2
    const txns24h = 8000 + Math.floor(Math.random() * 3000); // 8K-11K daily transactions
    
    const networkStats = {
      totalBlocks: baseBlockNumber,
      totalTxns: baseTxCount,
      gasTracker: parseFloat(gasTracker.toFixed(2)),
      avgBlockTime: 3.0, // L2 block time
      addresses: baseAddresses,
      txns24h: txns24h,
      lastUpdated: now,
      networkStatus: 'ACTIVE',
      chainId: '0x1A', // 01A chain ID
      version: '01A-v1.0.0'
    };

    return NextResponse.json(networkStats);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return NextResponse.json({ error: 'Failed to fetch network stats' }, { status: 500 });
  }
}
