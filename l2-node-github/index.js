import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import crypto from 'crypto';
import cron from 'node-cron';
import Database from 'better-sqlite3';
import { createHash, createHmac } from 'crypto';
import secp256k1 from 'secp256k1';

dotenv.config();

class EnhancedL2Node {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8545;
    this.chainId = 0x01A; // 26 in decimal
    this.blockTime = 3; // 3 seconds
    this.currentBlock = 0;
    this.pendingTransactions = [];
    this.validators = new Map();
    this.accounts = new Map();
    this.contracts = new Map();
    this.events = [];
    this.receipts = new Map();
    
    // Database for persistence
    this.db = new Database('l2-node.db');
    this.initializeDatabase();
    
    // Native token configuration
    this.nativeToken = {
      name: '01A',
      symbol: '01A',
      decimals: 18
    };
    
    // Gas configuration
    this.gasConfig = {
      gasPrice: ethers.parseUnits('1', 'gwei'), // 1 gwei
      gasLimit: 30000000, // 30M gas limit
      baseGas: 21000, // Base transaction gas
      contractGas: 100000 // Contract execution gas
    };
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupBlockProduction();
    this.initializeGenesis();
  }

  initializeDatabase() {
    // Create tables for persistence
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS blocks (
        number INTEGER PRIMARY KEY,
        hash TEXT UNIQUE NOT NULL,
        parentHash TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        gasUsed TEXT NOT NULL,
        gasLimit TEXT NOT NULL,
        miner TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        extraData TEXT,
        size INTEGER,
        data TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS transactions (
        hash TEXT PRIMARY KEY,
        blockNumber INTEGER,
        from_address TEXT NOT NULL,
        to_address TEXT,
        value TEXT NOT NULL,
        gasPrice TEXT NOT NULL,
        gasLimit TEXT NOT NULL,
        gasUsed TEXT,
        nonce INTEGER NOT NULL,
        data TEXT,
        status INTEGER DEFAULT 1,
        timestamp INTEGER NOT NULL,
        raw TEXT NOT NULL,
        FOREIGN KEY (blockNumber) REFERENCES blocks(number)
      );
      
      CREATE TABLE IF NOT EXISTS accounts (
        address TEXT PRIMARY KEY,
        balance TEXT NOT NULL DEFAULT '0',
        nonce INTEGER NOT NULL DEFAULT 0,
        code TEXT,
        storage TEXT,
        created_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS validators (
        address TEXT PRIMARY KEY,
        stake TEXT NOT NULL,
        commission INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        uptime REAL NOT NULL DEFAULT 100.0,
        total_rewards TEXT NOT NULL DEFAULT '0',
        registered_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blockNumber INTEGER NOT NULL,
        transactionHash TEXT NOT NULL,
        contractAddress TEXT,
        eventName TEXT NOT NULL,
        data TEXT NOT NULL,
        topics TEXT NOT NULL,
        logIndex INTEGER NOT NULL,
        FOREIGN KEY (blockNumber) REFERENCES blocks(number),
        FOREIGN KEY (transactionHash) REFERENCES transactions(hash)
      );
      
      CREATE TABLE IF NOT EXISTS receipts (
        transactionHash TEXT PRIMARY KEY,
        blockNumber INTEGER NOT NULL,
        gasUsed TEXT NOT NULL,
        status INTEGER NOT NULL,
        logs TEXT NOT NULL,
        contractAddress TEXT,
        FOREIGN KEY (blockNumber) REFERENCES blocks(number)
      );
      
      CREATE INDEX IF NOT EXISTS idx_blocks_timestamp ON blocks(timestamp);
      CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_address);
      CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_address);
      CREATE INDEX IF NOT EXISTS idx_events_contract ON events(contractAddress);
    `);
    
    console.log('✅ Database initialized');
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
        const account = await this.getAccount(req.params.address);
        res.json(account);
      } catch (error) {
        res.status(404).json({ error: 'Account not found' });
      }
    });

    this.app.get('/api/network', (req, res) => {
      res.json({
        chainId: this.chainId,
        blockNumber: this.currentBlock,
        blockTime: this.blockTime,
        network: '01A LABS L2',
        validators: this.validators.size,
        totalStaked: this.getTotalStaked()
      });
    });

    this.app.get('/api/validators', (req, res) => {
      const validators = Array.from(this.validators.values());
      res.json({ validators });
    });

    this.app.get('/api/events', (req, res) => {
      const { contract, fromBlock, toBlock } = req.query;
      const events = this.getEvents(contract, fromBlock, toBlock);
      res.json({ events });
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
    console.log('🚀 Initializing Enhanced 01A LABS L2 Network...');
    
    // Check if genesis already exists
    const existingGenesis = this.db.prepare('SELECT * FROM blocks WHERE number = 0').get();
    if (existingGenesis) {
      this.currentBlock = existingGenesis.number;
      console.log('✅ Genesis block already exists');
      return;
    }
    
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
      difficulty: '0x0',
      extraData: '0x',
      size: 0
    };

    // Store genesis block in database
    this.storeBlock(genesisBlock);
    this.currentBlock = 0;

    // Initialize validator set with multiple validators
    const validators = [
      {
        address: '0x351a5Ae420C74B5181570e7EBdD5824d50a80a73',
        stake: ethers.parseEther('1000000'), // 1M 01A staked
        commission: 5,
        active: true,
        uptime: 100.0,
        totalRewards: 0n
      },
      {
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        stake: ethers.parseEther('500000'), // 500K 01A staked
        commission: 7,
        active: true,
        uptime: 99.8,
        totalRewards: 0n
      },
      {
        address: '0x8a2d35Cc6634C0532925a3b8D4C9db96C4b4d8b7',
        stake: ethers.parseEther('250000'), // 250K 01A staked
        commission: 10,
        active: true,
        uptime: 99.5,
        totalRewards: 0n
      }
    ];

    // Store validators in database and memory
    for (const validator of validators) {
      this.validators.set(validator.address, validator);
      this.storeValidator(validator);
    }

    console.log('✅ Genesis block created');
    console.log('✅ Validator set initialized with', validators.length, 'validators');
    console.log(`🌐 Enhanced L2 Network ready on port ${this.port}`);
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

        case 'eth_getTransactionReceipt':
          const receipt = await this.getTransactionReceipt(params[0]);
          result = receipt;
          break;
          
        case 'eth_gasPrice':
          result = `0x${this.gasConfig.gasPrice.toString(16)}`;
          break;
          
        case 'eth_estimateGas':
          const gasEstimate = await this.estimateGas(params[0]);
          result = `0x${gasEstimate.toString(16)}`;
          break;

        case 'eth_getCode':
          const code = await this.getCode(params[0]);
          result = code;
          break;

        case 'eth_getStorageAt':
          const storage = await this.getStorageAt(params[0], params[1]);
          result = storage;
          break;

        case 'eth_call':
          const callResult = await this.call(params[0]);
          result = callResult;
          break;

        case 'eth_getLogs':
          const logs = await this.getLogs(params[0]);
          result = logs;
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
      const stmt = this.db.prepare('SELECT * FROM blocks WHERE number = ?');
      const block = stmt.get(number);
      if (!block) throw new Error('Block not found');
      return JSON.parse(block.data);
    } catch (error) {
      throw new Error('Block not found');
    }
  }

  async getTransaction(hash) {
    try {
      const stmt = this.db.prepare('SELECT * FROM transactions WHERE hash = ?');
      const tx = stmt.get(hash);
      if (!tx) throw new Error('Transaction not found');
      return JSON.parse(tx.raw);
    } catch (error) {
      throw new Error('Transaction not found');
    }
  }

  async getTransactionReceipt(hash) {
    try {
      const stmt = this.db.prepare('SELECT * FROM receipts WHERE transactionHash = ?');
      const receipt = stmt.get(hash);
      if (!receipt) throw new Error('Receipt not found');
      return JSON.parse(receipt.logs);
    } catch (error) {
      throw new Error('Receipt not found');
    }
  }

  async getAccount(address) {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts WHERE address = ?');
      const account = stmt.get(address);
      if (!account) {
        return {
          address,
          balance: '0x0',
          nonce: 0,
          code: '0x',
          storage: {}
        };
      }
      return {
        address: account.address,
        balance: account.balance,
        nonce: account.nonce,
        code: account.code || '0x',
        storage: account.storage ? JSON.parse(account.storage) : {}
      };
    } catch (error) {
      throw new Error('Account not found');
    }
  }

  async getBalance(address) {
    const account = await this.getAccount(address);
    return BigInt(account.balance);
  }

  async getCode(address) {
    const account = await this.getAccount(address);
    return account.code;
  }

  async getStorageAt(address, position) {
    const account = await this.getAccount(address);
    return account.storage[position] || '0x0';
  }

  async estimateGas(txData) {
    // Simple gas estimation based on transaction type
    if (txData.to && txData.data && txData.data !== '0x') {
      return this.gasConfig.contractGas; // Contract call
    }
    return this.gasConfig.baseGas; // Simple transfer
  }

  async call(callData) {
    // Simple contract call simulation
    return '0x'; // Return empty result for now
  }

  async getLogs(filter) {
    const stmt = this.db.prepare(`
      SELECT * FROM events 
      WHERE blockNumber >= ? AND blockNumber <= ?
      ${filter.address ? 'AND contractAddress = ?' : ''}
    `);
    const events = stmt.all(
      filter.fromBlock || 0,
      filter.toBlock || this.currentBlock,
      filter.address || null
    );
    return events;
  }

  async sendTransaction(rawTx) {
    try {
      // Decode and validate transaction
      const tx = ethers.Transaction.from(rawTx);
      
      // Validate transaction
      await this.validateTransaction(tx);
      
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

      console.log(`📝 Transaction ${tx.hash} validated and added to mempool`);
      return tx.hash;
    } catch (error) {
      throw new Error(`Transaction validation failed: ${error.message}`);
    }
  }

  async validateTransaction(tx) {
    // Check gas limit
    if (tx.gasLimit > this.gasConfig.gasLimit) {
      throw new Error('Gas limit too high');
    }

    // Check gas price
    if (tx.gasPrice < this.gasConfig.gasPrice) {
      throw new Error('Gas price too low');
    }

    // Check balance
    const balance = await this.getBalance(tx.from);
    const totalCost = tx.value + (tx.gasLimit * tx.gasPrice);
    if (balance < totalCost) {
      throw new Error('Insufficient balance');
    }

    // Check nonce
    const account = await this.getAccount(tx.from);
    if (tx.nonce < account.nonce) {
      throw new Error('Nonce too low');
    }

    // Verify signature (simplified)
    if (!this.verifySignature(tx)) {
      throw new Error('Invalid signature');
    }
  }

  verifySignature(tx) {
    try {
      // Simplified signature verification
      // In production, use proper secp256k1 verification
      return tx.from && tx.from.length === 42;
    } catch (error) {
      return false;
    }
  }

  async produceBlock() {
    if (this.pendingTransactions.length === 0) {
      return; // No transactions to include
    }

    const blockNumber = this.currentBlock + 1;
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Select validator for this block (round-robin)
    const validatorAddress = this.selectValidator();
    
    // Select transactions for this block (max 100)
    const blockTxs = this.pendingTransactions.splice(0, 100);
    
    // Process transactions
    const receipts = [];
    let totalGasUsed = 0n;
    
    for (const tx of blockTxs) {
      try {
        const receipt = await this.processTransaction(tx);
        receipts.push(receipt);
        totalGasUsed += BigInt(receipt.gasUsed);
      } catch (error) {
        console.error(`❌ Transaction ${tx.hash} failed:`, error.message);
        // Create failed receipt
        receipts.push({
          transactionHash: tx.hash,
          status: 0,
          gasUsed: tx.gasLimit.toString(),
          logs: []
        });
      }
    }

    // Create block
    const block = {
      number: blockNumber,
      hash: '0x' + crypto.randomBytes(32).toString('hex'),
      parentHash: (await this.getBlock(this.currentBlock)).hash,
      timestamp,
      transactions: blockTxs.map(tx => tx.hash),
      gasUsed: '0x' + totalGasUsed.toString(16),
      gasLimit: '0x1c9c380',
      miner: validatorAddress,
      difficulty: '0x0',
      extraData: '0x',
      size: JSON.stringify(block).length
    };

    // Store block and transactions in database
    this.storeBlock(block);
    this.currentBlock = blockNumber;

    // Store transaction receipts
    for (const receipt of receipts) {
      this.storeReceipt(receipt);
    }

    console.log(`⛏️  Block ${blockNumber} produced by ${validatorAddress} with ${blockTxs.length} transactions`);

    // Broadcast to WebSocket clients
    this.broadcastBlock(block);
  }

  selectValidator() {
    // Round-robin validator selection
    const validatorList = Array.from(this.validators.keys());
    const index = this.currentBlock % validatorList.length;
    return validatorList[index];
  }

  async processTransaction(tx) {
    // Store transaction in database
    this.storeTransaction(tx);

    // Process balance changes
    const fromBalance = await this.getBalance(tx.from);
    const gasCost = tx.gasLimit * tx.gasPrice;
    const totalCost = tx.value + gasCost;

    if (fromBalance >= totalCost) {
      // Update sender balance
      await this.updateBalance(tx.from, fromBalance - totalCost);
      
      // Update receiver balance (if not contract creation)
      if (tx.to) {
        const toBalance = await this.getBalance(tx.to);
        await this.updateBalance(tx.to, toBalance + tx.value);
      }

      // Execute smart contract if applicable
      if (tx.to && tx.data && tx.data !== '0x') {
        await this.executeContract(tx);
      }

      // Emit events
      this.emitEvent('Transfer', {
        from: tx.from,
        to: tx.to,
        value: tx.value.toString()
      }, tx.hash);
    }

    // Create transaction receipt
    const receipt = {
      transactionHash: tx.hash,
      blockNumber: this.currentBlock,
      gasUsed: tx.gasLimit.toString(),
      status: 1,
      logs: this.getTransactionLogs(tx.hash)
    };

    return receipt;
  }

  async executeContract(tx) {
    // Simple contract execution simulation
    // In production, this would use a proper EVM
    console.log(`🔧 Executing contract at ${tx.to}`);
    
    // Emit contract events
    this.emitEvent('ContractExecution', {
      contract: tx.to,
      data: tx.data
    }, tx.hash);
  }

  emitEvent(eventName, data, txHash) {
    const event = {
      blockNumber: this.currentBlock,
      transactionHash: txHash,
      contractAddress: null,
      eventName,
      data: JSON.stringify(data),
      topics: [],
      logIndex: this.events.length
    };

    this.events.push(event);
    this.storeEvent(event);
  }

  getTransactionLogs(txHash) {
    return this.events.filter(event => event.transactionHash === txHash);
  }

  async updateBalance(address, newBalance) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO accounts (address, balance, nonce, created_at)
      VALUES (?, ?, 0, ?)
    `);
    stmt.run(address, newBalance.toString(), Date.now());
  }

  storeBlock(block) {
    const stmt = this.db.prepare(`
      INSERT INTO blocks (number, hash, parentHash, timestamp, gasUsed, gasLimit, miner, difficulty, extraData, size, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      block.number,
      block.hash,
      block.parentHash,
      block.timestamp,
      block.gasUsed,
      block.gasLimit,
      block.miner,
      block.difficulty,
      block.extraData || '0x',
      block.size,
      JSON.stringify(block)
    );
  }

  storeTransaction(tx) {
    const stmt = this.db.prepare(`
      INSERT INTO transactions (hash, blockNumber, from_address, to_address, value, gasPrice, gasLimit, gasUsed, nonce, data, status, timestamp, raw)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      tx.hash,
      this.currentBlock,
      tx.from,
      tx.to,
      tx.value.toString(),
      tx.gasPrice.toString(),
      tx.gasLimit.toString(),
      tx.gasLimit.toString(), // Simplified
      tx.nonce,
      tx.data,
      1,
      Date.now(),
      tx.raw
    );
  }

  storeReceipt(receipt) {
    const stmt = this.db.prepare(`
      INSERT INTO receipts (transactionHash, blockNumber, gasUsed, status, logs, contractAddress)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      receipt.transactionHash,
      receipt.blockNumber,
      receipt.gasUsed,
      receipt.status,
      JSON.stringify(receipt.logs),
      receipt.contractAddress || null
    );
  }

  storeEvent(event) {
    const stmt = this.db.prepare(`
      INSERT INTO events (blockNumber, transactionHash, contractAddress, eventName, data, topics, logIndex)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      event.blockNumber,
      event.transactionHash,
      event.contractAddress,
      event.eventName,
      event.data,
      JSON.stringify(event.topics),
      event.logIndex
    );
  }

  storeValidator(validator) {
    const stmt = this.db.prepare(`
      INSERT INTO validators (address, stake, commission, active, uptime, total_rewards, registered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      validator.address,
      validator.stake.toString(),
      validator.commission,
      validator.active ? 1 : 0,
      validator.uptime,
      validator.totalRewards.toString(),
      Date.now()
    );
  }

  getTotalStaked() {
    let total = 0n;
    for (const validator of this.validators.values()) {
      total += validator.stake;
    }
    return total.toString();
  }

  getEvents(contract, fromBlock, toBlock) {
    const stmt = this.db.prepare(`
      SELECT * FROM events 
      WHERE blockNumber >= ? AND blockNumber <= ?
      ${contract ? 'AND contractAddress = ?' : ''}
      ORDER BY blockNumber, logIndex
    `);
    return stmt.all(
      fromBlock || 0,
      toBlock || this.currentBlock,
      contract || null
    );
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
      console.log(`🚀 Enhanced 01A LABS L2 Node running on port ${this.port}`);
      console.log(`🔌 WebSocket server on port 8546`);
      console.log(`🌐 RPC endpoint: http://localhost:${this.port}/rpc`);
      console.log(`📊 Network ID: ${this.chainId}`);
      console.log(`💾 Database: SQLite (persistent storage)`);
      console.log(`🔒 Security: Transaction validation enabled`);
      console.log(`⚡ Consensus: Multi-validator rotation`);
      console.log(`🤖 Smart contracts: Basic execution`);
    });
  }
}

// Start the enhanced L2 node
const l2Node = new EnhancedL2Node();
l2Node.start();
