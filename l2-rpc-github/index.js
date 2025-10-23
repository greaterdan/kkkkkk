import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

class L2RPC {
  constructor() {
    this.app = express();
    this.port = process.env.RPC_PORT || 8547;
    this.l2NodeUrl = process.env.L2_NODE_URL || 'http://localhost:8545';
    this.chainId = 0x01A; // 26 in decimal
    this.networkName = '01A LABS L2';
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Main RPC endpoint
    this.app.post('/rpc', async (req, res) => {
      try {
        const result = await this.handleRPCRequest(req.body);
        res.json(result);
      } catch (error) {
        res.json({
          jsonrpc: '2.0',
          error: { code: -32603, message: error.message },
          id: req.body.id
        });
      }
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        network: this.networkName,
        chainId: this.chainId,
        timestamp: Date.now()
      });
    });

    // Network info
    this.app.get('/api/network', (req, res) => {
      res.json({
        name: this.networkName,
        chainId: this.chainId,
        rpcUrl: `http://localhost:${this.port}/rpc`,
        explorer: `http://localhost:3001`,
        nativeCurrency: {
          name: '01A',
          symbol: '01A',
          decimals: 18
        }
      });
    });
  }

  async handleRPCRequest(request) {
    const { method, params, id } = request;

    // Forward to L2 node
    try {
      const response = await axios.post(`${this.l2NodeUrl}/rpc`, request);
      return response.data;
    } catch (error) {
      // Handle specific methods locally
      switch (method) {
        case 'eth_chainId':
          return {
            jsonrpc: '2.0',
            result: `0x${this.chainId.toString(16)}`,
            id
          };
        case 'net_version':
          return {
            jsonrpc: '2.0',
            result: this.chainId.toString(),
            id
          };
          
        case 'eth_syncing':
          return {
            jsonrpc: '2.0',
            result: false,
            id
          };
          
        default:
          throw new Error(`Method ${method} not supported`);
      }
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🌐 01A LABS L2 RPC Server running on port ${this.port}`);
      console.log(`📡 RPC endpoint: http://localhost:${this.port}/rpc`);
      console.log(`🔗 Connected to L2 node: ${this.l2NodeUrl}`);
    });
  }
}

// Start the RPC server
const rpcServer = new L2RPC();
rpcServer.start();
