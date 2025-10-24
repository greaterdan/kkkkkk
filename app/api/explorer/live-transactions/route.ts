import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('filter') || '24h';
    
    // Generate realistic live transaction data based on time filter
    const now = Date.now();
    const intervals = timeFilter === '5m' ? 12 : timeFilter === '1h' ? 12 : timeFilter === '24h' ? 24 : 7;
    const intervalMs = timeFilter === '5m' ? 25000 : timeFilter === '1h' ? 300000 : timeFilter === '24h' ? 3600000 : 86400000;
    
    const data = [];
    let totalTxns = 0;
    
    for (let i = intervals - 1; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const baseTxns = Math.floor(Math.random() * 50) + 20; // Base 20-70 transactions
      const aiMultiplier = Math.random() * 0.5 + 0.5; // 0.5-1.0 multiplier for AI activity
      const txns = Math.floor(baseTxns * aiMultiplier);
      
      data.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        txns: txns,
        timestamp: timestamp,
        aiTxns: Math.floor(txns * 0.3), // 30% AI transactions
        regularTxns: Math.floor(txns * 0.7) // 70% regular transactions
      });
      
      totalTxns += txns;
    }
    
    const txRate = totalTxns / (timeFilter === '5m' ? 5 : timeFilter === '1h' ? 1 : timeFilter === '24h' ? 24 : 7);
    
    return NextResponse.json({
      data,
      totalTxns,
      txRate,
      timeFilter,
      lastUpdated: now,
      isLive: true
    });
  } catch (error) {
    console.error('Error fetching live transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch live transactions' }, { status: 500 });
  }
}
