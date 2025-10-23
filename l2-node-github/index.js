import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import crypto from 'crypto';
import cron from 'node-cron';

dotenv.config();

class L2Node {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8545;
    this.chainId = 0x01A; // 26 in decimal
    this.blockTime = 3; // 3 seconds
    this.currentBlock = 0;
    this.pendingTransactions = [];
    this.validators = new Map();
    this.state = new Map(); // In-memory storage for now
    this.accounts = new Map();
    
    // Native token configuration
    this.nativeToken = {
      name: '01A',
      symbol: '01A',
      decimals: 18
    };
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupBlockProduction();
    this.initializeGenesis();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // JSON-RPC endpoints
    this.app.post('/rpc', (req, res) => {
      this.handleRPC(req, res);
    });

    // REST API endpoints
    this.app.get('/api/block/:number', async (req, res) => {
      try {
        const block = await this.getBlock(parseInt(req.params.number));
        res.json(block);
      } catch (error) {
        res.status(404).json({ error: 'Block not found' });
      }
    });

    this.app.get('/api/transaction/:hash', async (req, res) => {
      try {
        const tx = await this.getTransaction(req.params.hash);
        res.json(tx);
      } catch (error) {
        res.status(404).json({ error: 'Transaction not found' });
      }
    });

    this.app.get('/api/account/:address', async (req, res) => {
      try {
        const balance = await this.getBalance(req.params.address);
        res.json({ address: req.params.address, balance: balance.toString() });
      } catch (error) {
        res.status(404).json({ error: 'Account not found' });
      }
    });

    this.app.get('/api/network', (req, res) => {
      res.json({
        chainId: this.chainId,
        blockNumber: this.currentBlock,
        blockTime: this.blockTime,
        network: '01A LABS L2'
      });
    });
  }

  setupWebSocket() {
    this.wss = new WebSocketServer({ port: 8546 });
    this.wss.on('connection', (ws) => {
      console.log('🔌 New WebSocket connection');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
    });
  }

  setupBlockProduction() {
    // Produce blocks every 3 seconds
    cron.schedule('*/3 * * * * *', () => {
      this.produceBlock();
    });
  }

  async initializeGenesis() {
    console.log('🚀 Initializing 01A LABS L2 Network...');
    
    // Create genesis block
    const genesisBlock = {
      number: 0,
      hash: '0x' + crypto.randomBytes(32).toString('hex'),
      parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: Math.floor(Date.now() / 1000),
      transactions: [],
      gasUsed: '0x0',
      gasLimit: '0x1c9c380', // 30M gas limit
      miner: '0x0000000000000000000000000000000000000000',
      difficulty: '0x0'
    };

    this.state.set(`block:${0}`, JSON.stringify(genesisBlock));
    this.currentBlock = 0;

    // Initialize validator set
    this.validators.set('0x351a5Ae420C74B5181570e7EBdD5824d50a80a73', {
      address: '0x351a5Ae420C74B5181570e7EBdD5824d50a80a73',
      stake: ethers.parseEther('1000000'), // 1M 01A staked
      commission: 5,
      active: true
    });

    console.log('✅ Genesis block created');
    console.log('✅ Validator set initialized');
    console.log(`🌐 L2 Network ready on port ${this.port}`);
  }

  async handleRPC(req, res) {
    const { method, params, id } = req.body;

    try {
      let result;
      
      switch (method) {
        case 'eth_chainId':
          result = `0x${this.chainId.toString(16)}`;
          break;
          
        case 'net_version':
          result = this.chainId.toString();
          break;
          
        case 'eth_blockNumber':
          result = `0x${this.currentBlock.toString(16)}`;
          break;
          
        case 'eth_getBalance':
          const balance = await this.getBalance(params[0]);
          result = `0x${balance.toString(16)}`;
          break;
          
        case 'eth_getBlockByNumber':
          const blockNumber = params[0] === 'latest' ? this.currentBlock : parseInt(params[0], 16);
          const block = await this.getBlock(blockNumber);
          result = block;
          break;
          
        case 'eth_sendRawTransaction':
          const txHash = await this.sendTransaction(params[0]);
          result = txHash;
          break;
          
        case 'eth_getTransactionByHash':
          const tx = await this.getTransaction(params[0]);
          result = tx;
          break;
          
        case 'eth_gasPrice':
          result = '0x3b9aca00'; // 1 gwei
          break;
          
        case 'eth_estimateGas':
          result = '0x5208'; // 21000 gas
          break;
          
        default:
          throw new Error(`Method ${method} not supported`);
      }

      res.json({ jsonrpc: '2.0', result, id });
    } catch (error) {
      res.json({ jsonrpc: '2.0', error: { code: -32603, message: error.message }, id });
    }
  }

  async getBlock(number) {
    try {
      const blockData = this.state.get(`block:${number}`);
      if (!blockData) throw new Error('Block not found');
      return JSON.parse(blockData);
    } catch (error) {
      throw new Error('Block not found');
    }
  }

  async getTransaction(hash) {
    try {
      const txData = this.state.get(`tx:${hash}`);
      if (!txData) throw new Error('Transaction not found');
      return JSON.parse(txData);
    } catch (error) {
      throw new Error('Transaction not found');
    }
  }

  async getBalance(address) {
    try {
      const balance = this.state.get(`balance:${address}`);
      return balance ? BigInt(balance) : 0n;
    } catch (error) {
      return 0n;
    }
  }

  async sendTransaction(rawTx) {
    try {
      // Decode transaction
      const tx = ethers.Transaction.from(rawTx);
      
      // Add to pending transactions
      this.pendingTransactions.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        data: tx.data,
        nonce: tx.nonce,
        raw: rawTx
      });

      console.log(`📝 Transaction ${tx.hash} added to mempool`);
      return tx.hash;
    } catch (error) {
      throw new Error('Invalid transaction');
    }
  }

  async produceBlock() {
    if (this.pendingTransactions.length === 0) {
      return; // No transactions to include
    }

    const blockNumber = this.currentBlock + 1;
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Select transactions for this block (max 100)
    const blockTxs = this.pendingTransactions.splice(0, 100);
    
    // Process transactions
    for (const tx of blockTxs) {
      await this.processTransaction(tx);
    }

    // Create block
    const block = {
      number: blockNumber,
      hash: '0x' + crypto.randomBytes(32).toString('hex'),
      parentHash: (await this.getBlock(this.currentBlock)).hash,
      timestamp,
      transactions: blockTxs.map(tx => tx.hash),
      gasUsed: '0x' + (blockTxs.length * 21000).toString(16),
      gasLimit: '0x1c9c380',
      miner: '0x351a5Ae420C74B5181570e7EBdD5824d50a80a73',
      difficulty: '0x0'
    };

    // Store block
    this.state.set(`block:${blockNumber}`, JSON.stringify(block));
    this.currentBlock = blockNumber;

    console.log(`⛏️  Block ${blockNumber} produced with ${blockTxs.length} transactions`);

    // Broadcast to WebSocket clients
    this.broadcastBlock(block);
  }

  async processTransaction(tx) {
    // Store transaction
    this.state.set(`tx:${tx.hash}`, JSON.stringify(tx));

    // Process balance changes (simplified)
    if (tx.to) {
      const fromBalance = await this.getBalance(tx.from);
      const toBalance = await this.getBalance(tx.to);
      
      if (fromBalance >= tx.value) {
        this.state.set(`balance:${tx.from}`, (fromBalance - tx.value).toString());
        this.state.set(`balance:${tx.to}`, (toBalance + tx.value).toString());
      }
    }
  }

  broadcastBlock(block) {
    const message = JSON.stringify({
      type: 'newBlock',
      block: block
    });

    this.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }

  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        ws.send(JSON.stringify({ type: 'subscribed', channel: data.channel }));
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 01A LABS L2 Node running on port ${this.port}`);
      console.log(`🔌 WebSocket server on port 8546`);
      console.log(`🌐 RPC endpoint: http://localhost:${this.port}/rpc`);
      console.log(`📊 Network ID: ${this.chainId}`);
    });
  }
}

// Start the L2 node
const l2Node = new L2Node();
l2Node.start();
