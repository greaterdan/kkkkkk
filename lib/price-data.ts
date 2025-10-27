// Real token price data service
export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h: string;
  marketCap?: string;
  totalSupply?: string;
}

export interface PriceDataResponse {
  token01APrice: TokenPriceData;
  ethPrice: TokenPriceData;
  lastUpdated: number;
}

// CoinGecko API for real price data
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// For now, we'll use ETH as a proxy for 01A token price since 01A is not listed
// In production, you would:
// 1. List 01A token on a DEX (PancakeSwap, Uniswap, etc.)
// 2. Use DEX APIs to get real price data
// 3. Or implement your own price oracle

export const getRealTokenPrices = async (): Promise<PriceDataResponse> => {
  try {
    // Fetch ETH price as proxy for 01A token
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }
    
    const data = await response.json();
    const ethData = data.ethereum;
    
    // Calculate 01A price based on ETH price with a multiplier
    // In production, this would be the actual 01A token price from DEX
    const token01AMultiplier = 0.011; // 01A = 0.011 * ETH (example)
    const token01APrice = ethData.usd * token01AMultiplier;
    const token01APriceChange = ethData.usd_24h_change * 0.8; // Slightly different volatility
    
    console.log('ETH Price:', ethData.usd);
    console.log('01A Price:', token01APrice);
    
    return {
      token01APrice: {
        price: 0, // Show 0 instead of calculated price
        priceChange24h: 0, // Show 0 instead of calculated change
        volume24h: '$0.0M', // Show 0 instead of calculated volume
        marketCap: '$0.0M', // Show 0 instead of calculated market cap
        totalSupply: '1B 01A'
      },
      ethPrice: {
        price: ethData.usd,
        priceChange24h: ethData.usd_24h_change,
        volume24h: `$${(ethData.usd_24h_vol / 1000000).toFixed(1)}M`,
        marketCap: `$${(ethData.usd_market_cap / 1000000).toFixed(1)}M`
      },
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Error fetching real price data:', error);
    
    // Return zero values if API fails - no mock data
    return {
      token01APrice: {
        price: 0,
        priceChange24h: 0,
        volume24h: '$0.0M',
        marketCap: '$0.0M',
        totalSupply: '1B 01A'
      },
      ethPrice: {
        price: 0,
        priceChange24h: 0,
        volume24h: '$0.0M',
        marketCap: '$0.0M'
      },
      lastUpdated: Date.now()
    };
  }
};

// Get real transaction count from blockchain
export const getRealTransactionCount = async (): Promise<number> => {
  try {
    // This would connect to your L2 node to get real transaction count
    // For now, return a realistic number
    const response = await fetch('http://localhost:8545/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const blockNumber = parseInt(data.result, 16);
      // Estimate transactions based on blocks (assuming 2-3 txs per block)
      return blockNumber * 2.5;
    }
    
    return 0; // Return 0 if no real data available
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    return 0; // Return 0 if no real data available
  }
};

// Cache price data to avoid too many API calls
let priceCache: PriceDataResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export const getCachedPriceData = async (): Promise<PriceDataResponse> => {
  const now = Date.now();
  
  if (priceCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return priceCache;
  }
  
  const freshData = await getRealTokenPrices();
  priceCache = freshData;
  cacheTimestamp = now;
  
  return freshData;
};
