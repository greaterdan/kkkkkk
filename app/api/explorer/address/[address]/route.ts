import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    
    // Generate realistic address data for 01A L2 chain
    const addressData = {
      address: address,
      type: 'Contract',
      balance: {
        '01A': '1234.5678',
        'BNB': '2.3456'
      },
      usdValue: {
        '01A': 4222.22,
        'BNB': 1407.36
      },
      statistics: {
        totalTransactions: 1247,
        totalSent: '3456.78',
        totalReceived: '3599.35'
      },
      activity: {
        firstSeen: Math.floor(Date.now() / 1000) - 86400 * 30,
        lastActivity: Math.floor(Date.now() / 1000) - 3600
      },
      contractInfo: {
        name: '01A Token',
        compiler: 'Solidity 0.8.19',
        verified: true
      }
    };

    return NextResponse.json(addressData);
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}
