// API Integration Layer - Ready for backend integration
// Update API_URL when backend is deployed

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';

// Types
export interface ApiBlock {
  height: number;
  hash: string;
  timestamp: number;
  txCount: number;
  gasUsed: string;
  miner: string;
  reward: string;
}

export interface ApiTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasFee: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  blockHeight: number;
}

export interface ApiStats {
  totalBlocks: number;
  totalTransactions: number;
  avgBlockTime: number;
  gasTracker: number;
  totalAddresses: number;
  activeValidators: number;
  totalStaked: string;
  networkHashrate: string;
}

export interface ApiSubnet {
  id: string;
  name: string;
  taskType: string;
  totalStaked: string;
  epochReward: string;
  validatorCount: number;
  minerCount: number;
  apy: number;
  description: string;
  status: 'active' | 'inactive';
}

export interface ApiValidator {
  address: string;
  name: string;
  stake: string;
  commission: number;
  uptime: number;
  totalRewards: string;
  subnetId: string;
  rank: number;
  status: 'active' | 'inactive';
}

// API Client
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Blocks
  async getBlocks(page: number = 1, limit: number = 20): Promise<{ blocks: ApiBlock[]; total: number }> {
    return this.fetch(`/blocks?page=${page}&limit=${limit}`);
  }

  async getBlockByNumber(blockNumber: number): Promise<ApiBlock> {
    return this.fetch(`/blocks/${blockNumber}`);
  }

  async getBlockByHash(hash: string): Promise<ApiBlock> {
    return this.fetch(`/blocks/hash/${hash}`);
  }

  // Transactions
  async getTransactions(page: number = 1, limit: number = 30): Promise<{ transactions: ApiTransaction[]; total: number }> {
    return this.fetch(`/transactions?page=${page}&limit=${limit}`);
  }

  async getTransactionByHash(hash: string): Promise<ApiTransaction> {
    return this.fetch(`/transactions/${hash}`);
  }

  async getTransactionsByAddress(address: string, page: number = 1): Promise<{ transactions: ApiTransaction[]; total: number }> {
    return this.fetch(`/addresses/${address}/transactions?page=${page}`);
  }

  // Stats
  async getNetworkStats(): Promise<ApiStats> {
    return this.fetch('/stats');
  }

  async getChartData(type: 'blocks' | 'transactions', days: number = 30): Promise<any[]> {
    return this.fetch(`/stats/chart/${type}?days=${days}`);
  }

  // Search
  async search(query: string): Promise<{ type: 'block' | 'transaction' | 'address'; data: any }> {
    return this.fetch(`/search?q=${encodeURIComponent(query)}`);
  }

  // Subnets
  async getSubnets(): Promise<ApiSubnet[]> {
    return this.fetch('/subnets');
  }

  async getSubnetById(id: string): Promise<ApiSubnet> {
    return this.fetch(`/subnets/${id}`);
  }

  async getSubnetActivity(id: string, days: number = 30): Promise<any[]> {
    return this.fetch(`/subnets/${id}/activity?days=${days}`);
  }

  // Validators
  async getValidators(sortBy: 'stake' | 'uptime' | 'rewards' = 'stake'): Promise<ApiValidator[]> {
    return this.fetch(`/validators?sortBy=${sortBy}`);
  }

  async getValidatorByAddress(address: string): Promise<ApiValidator> {
    return this.fetch(`/validators/${address}`);
  }

  async getValidatorsBySubnet(subnetId: string): Promise<ApiValidator[]> {
    return this.fetch(`/subnets/${subnetId}/validators`);
  }

  // Addresses
  async getAddressBalance(address: string): Promise<{ balance: string; transactions: number }> {
    return this.fetch(`/addresses/${address}/balance`);
  }

  async getAddressInfo(address: string): Promise<any> {
    return this.fetch(`/addresses/${address}`);
  }
}

// Export singleton instance
export const api = new APIClient(API_URL);

// WebSocket connection for real-time updates
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (typeof window === 'undefined') return;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const listeners = this.listeners.get(data.type);
          if (listeners) {
            listeners.forEach((callback) => callback(data.payload));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Send subscription message if connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', event }));
    }
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(event);
        // Send unsubscribe message if connected
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'unsubscribe', event }));
        }
      }
    }
  }
}

export const wsClient = new WebSocketClient();

