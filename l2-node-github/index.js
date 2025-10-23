const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const crypto = require('crypto');
const cron = require('node-cron');

class WorkingL2Node {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8545;
    this.chainId = 26; // 0x1A
    this.blockTime = 3; // 3 seconds
    this.currentBlock = 0;
    this.pendingTransactions = [];
    this.validators = new Map();
    this.state = new Map();
    this.accounts = new Map();
    this.blocks = [];
    
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
    this.app.get('/api/blocks', (req, res) => {
      res.json(this.blocks.slice(-20).reverse()); // Last 20 blocks
    });

    this.app.get('/api/block/:number', (req, res) => {
      const blockNumber = parseInt(req.params.number);
      const block = this.blocks.find(b => b.number === blockNumber);
      if (block) {
        res.json(block);
      } else {
        res.status(404).json({ error: 'Block not found' });
      }
    });

    this.app.get('/api/status', (req, res) => {
      res.json({
        network: '01A LABS L2',
        chainId: this.chainId,
        currentBlock: this.currentBlock,
        status: 'ONLINE',
        nativeCurrency: this.nativeToken
      });
    });

    // Health check
    this.app.get('/', (req, res) => {
      res.json({
        message: '01A LABS L2 Node',
        status: 'running',
        currentBlock: this.currentBlock,
        chainId: this.chainId
      });
    });
  }

  setupWebSocket() {
    this.wss = new WebSocketServer({ port: 8546 });
    this.wss.on('connection', (ws) => {
      console.log('WebSocket client connected');
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    });
  }

  setupBlockProduction() {
    // Mine blocks every 3 seconds
    setInterval(() => {
      this.mineBlock();
    }, this.blockTime * 1000);
    
    console.log(`🚀 Block production started - mining every ${this.blockTime} seconds`);
  }

  initializeGenesis() {
    const genesisBlock = {
      number: 0,
      hash: '0xe4bed70fd20739dde04201a7f2d0e7e68858f431dc31e9c78b5f4cb206ec722f',
      parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: Math.floor(Date.now() / 1000),
      transactions: [],
      gasUsed: '0x0',
      gasLimit: '0x1c9c380',
      miner: '0x0000000000000000000000000000000000000000',
      difficulty: '0x0'
    };
    
    this.blocks.push(genesisBlock);
    console.log('✅ Genesis block created');
  }

  mineBlock() {
    this.currentBlock++;
    
    const block = {
      number: this.currentBlock,
      hash: this.generateBlockHash(this.currentBlock),
      parentHash: this.blocks[this.blocks.length - 1].hash,
      timestamp: Math.floor(Date.now() / 1000),
      transactions: [...this.pendingTransactions],
      gasUsed: '0x' + (this.pendingTransactions.length * 21000).toString(16),
      gasLimit: '0x1c9c380',
      miner: '0x0000000000000000000000000000000000000000',
      difficulty: '0x0'
    };
    
    this.blocks.push(block);
    this.pendingTransactions = [];
    
    console.log(`⛏️  Mined block #${this.currentBlock} with ${block.transactions.length} transactions`);
    
    // Broadcast new block via WebSocket
    this.broadcastNewBlock(block);
  }

  generateBlockHash(blockNumber) {
    const data = `${blockNumber}-${Date.now()}-${Math.random()}`;
    return '0x' + crypto.createHash('sha256').update(data).digest('hex');
  }

  broadcastNewBlock(block) {
    const message = JSON.stringify({
      type: 'newBlock',
      block: block
    });
    
    this.wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }

  handleRPC(req, res) {
    const { method, params, id } = req.body;
    
    try {
      let result;
      
      switch (method) {
        case 'eth_blockNumber':
          result = '0x' + this.currentBlock.toString(16);
          break;
          
        case 'eth_getBlockByNumber':
          const blockNumber = params[0] === 'latest' ? this.currentBlock : parseInt(params[0], 16);
          const block = this.blocks.find(b => b.number === blockNumber);
          result = block || null;
          break;
          
        case 'eth_getBalance':
          const address = params[0];
          const balance = this.accounts.get(address) || '0x0';
          result = balance;
          break;
          
        case 'eth_sendTransaction':
          const tx = params[0];
          this.pendingTransactions.push({
            hash: this.generateTxHash(tx),
            from: tx.from,
            to: tx.to,
            value: tx.value || '0x0',
            gas: tx.gas || '0x5208',
            gasPrice: tx.gasPrice || '0x3b9aca00',
            nonce: tx.nonce || '0x0',
            data: tx.data || '0x'
          });
          result = this.generateTxHash(tx);
          break;
          
        case 'net_version':
          result = this.chainId.toString();
          break;
          
        case 'eth_chainId':
          result = '0x' + this.chainId.toString(16);
          break;
          
        default:
          throw new Error(`Method ${method} not supported`);
      }
      
      res.json({
        jsonrpc: '2.0',
        result: result,
        id: id
      });
      
    } catch (error) {
      res.json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error.message
        },
        id: id
      });
    }
  }

  generateTxHash(tx) {
    const data = `${tx.from}-${tx.to}-${tx.value}-${Date.now()}`;
    return '0x' + crypto.createHash('sha256').update(data).digest('hex');
  }

  handleWebSocketMessage(ws, data) {
    // Handle WebSocket messages here
    ws.send(JSON.stringify({ type: 'pong', data: data }));
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 01A LABS L2 Node running on port ${this.port}`);
      console.log(`🌐 RPC endpoint: http://localhost:${this.port}/rpc`);
      console.log(`🔍 Explorer: http://localhost:3001`);
      console.log(`⛏️  Mining blocks every ${this.blockTime} seconds`);
    });
  }
}

// Start the node
const node = new WorkingL2Node();
node.start();

module.exports = WorkingL2Node;