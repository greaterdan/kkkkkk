import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { number: string } }
) {
  try {
    const { number } = params;
    const blockNumber = parseInt(number);
    
    // In a real implementation, this would fetch from your L2 node
    // For now, we'll generate realistic block data
    const blockData = {
      number: blockNumber,
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      timestamp: Math.floor(Date.now() / 1000) - Math.random() * 3600,
      transactions: Array.from({ length: Math.floor(Math.random() * 50) + 1 }, () => `0x${Math.random().toString(16).slice(2, 66)}`),
      gasUsed: '0x1e8480', // 2,000,000
      gasLimit: '0x1c9c380', // 30,000,000
      miner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      difficulty: '0x0',
      totalDifficulty: '0x0',
      size: Math.floor(Math.random() * 10000) + 1000,
      extraData: '0x',
      nonce: '0x0000000000000000',
      parentHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      stateRoot: `0x${Math.random().toString(16).slice(2, 66)}`,
      receiptsRoot: `0x${Math.random().toString(16).slice(2, 66)}`,
      transactionsRoot: `0x${Math.random().toString(16).slice(2, 66)}`,
      uncles: [],
      reward: '0.01',
      fees: '0.001234',
      baseFeePerGas: '0x7',
      burntFees: '0.00059'
    };

    return NextResponse.json(blockData);
  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json({ error: 'Failed to fetch block' }, { status: 500 });
  }
}
