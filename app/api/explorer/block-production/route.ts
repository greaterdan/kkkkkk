import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Generate realistic block production data for 01A L2 chain
    const now = Date.now();
    const hours = 24; // Last 24 hours
    const data = [];
    
    // Generate hourly block production data
    for (let i = hours - 1; i >= 0; i--) {
      const timestamp = now - (i * 60 * 60 * 1000); // Each hour
      const hour = new Date(timestamp).getHours();
      
      // Block production varies by time of day (more active during business hours)
      let baseBlocks = 1200; // ~50 blocks per hour (3 second block time)
      
      // Add some variation based on time of day
      if (hour >= 9 && hour <= 17) {
        baseBlocks += Math.floor(Math.random() * 200); // More active during business hours
      } else if (hour >= 18 && hour <= 23) {
        baseBlocks += Math.floor(Math.random() * 100); // Evening activity
      } else {
        baseBlocks += Math.floor(Math.random() * 50); // Night time
      }
      
      // Add some random variation
      const variation = Math.floor(Math.random() * 100) - 50;
      const blocks = Math.max(1000, baseBlocks + variation);
      
      data.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        blocks: blocks,
        timestamp: timestamp,
        hour: hour
      });
    }

    return NextResponse.json({
      data,
      totalBlocks: data.reduce((sum, item) => sum + item.blocks, 0),
      avgBlocksPerHour: Math.round(data.reduce((sum, item) => sum + item.blocks, 0) / data.length),
      lastUpdated: now
    });
  } catch (error) {
    console.error('Error fetching block production data:', error);
    return NextResponse.json({ error: 'Failed to fetch block production data' }, { status: 500 });
  }
}
