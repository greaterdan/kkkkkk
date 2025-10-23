import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import crypto from 'crypto';
import cron from 'node-cron';
import Database from 'better-sqlite3';

dotenv.config();

class ValidatorNode {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8548;
    this.validatorId = process.env.VALIDATOR_ID || crypto.randomBytes(20).toString('hex');
    this.validatorAddress = process.env.VALIDATOR_ADDRESS || '0x' + this.validatorId;
    this.stakeAmount = BigInt(process.env.STAKE_AMOUNT || '10000000000000000000000'); // 10,000 01A
    this.commission = parseFloat(process.env.COMMISSION || '5.0'); // 5%
    this.subnetId = process.env.SUBNET_ID || 'subnet-1';
    this.l2RpcUrl = process.env.L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc';
    this.uptime = 100.0;
    this.totalRewards = BigInt(0);
    this.isActive = true;
    this.lastBlockTime = Date.now();
    
    // Database for persistence
    this.db = new Database('validator.db');
    this.initDatabase();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupValidatorLogic();
    this.startValidator();
  }

  initDatabase() {
    // Create validator table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS validator_stats (
        id INTEGER PRIMARY KEY,
        timestamp INTEGER,
        uptime REAL,
        rewards TEXT,
        blocks_validated INTEGER,
        stake_amount TEXT
      )
    `);
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Validator info endpoint
    this.app.get('/validator/info', (req, res) => {
      res.json({
        validatorId: this.validatorId,
        address: this.validatorAddress,
        stakeAmount: this.stakeAmount.toString(),
        commission: this.commission,
        subnetId: this.subnetId,
        uptime: this.uptime,
        totalRewards: this.totalRewards.toString(),
        isActive: this.isActive,
        lastBlockTime: this.lastBlockTime
      });
    });

    // Validator stats endpoint
    this.app.get('/validator/stats', (req, res) => {
      const stats = this.db.prepare('SELECT * FROM validator_stats ORDER BY timestamp DESC LIMIT 100').all();
      res.json(stats);
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        validator: this.validatorAddress,
        uptime: this.uptime,
        active: this.isActive
      });
    });
  }

  setupWebSocket() {
    this.wss = new WebSocketServer({ port: 8549 });
    this.wss.on('connection', ws => {
      console.log('Validator WebSocket client connected');
      ws.on('message', message => {
        console.log(`Received: ${message}`);
      });
      ws.on('close', () => {
        console.log('Validator WebSocket client disconnected');
      });
    });
  }

  setupValidatorLogic() {
    // Connect to L2 network
    this.provider = new ethers.JsonRpcProvider(this.l2RpcUrl);
    
    // Monitor L2 network for new blocks
    this.monitorL2Network();
    
    // Update validator stats every minute
    cron.schedule('* * * * *', () => {
      this.updateValidatorStats();
    });
    
    // Validate blocks every 3 seconds (matching L2 block time)
    cron.schedule('*/3 * * * * *', () => {
      this.validateBlock();
    });
  }

  async monitorL2Network() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`🔗 Connected to L2 network. Current block: ${blockNumber}`);
      
      // Monitor for new blocks
      this.provider.on('block', (blockNumber) => {
        console.log(`📦 New block detected: ${blockNumber}`);
        this.lastBlockTime = Date.now();
        this.broadcastUpdate('newBlock', { blockNumber, validator: this.validatorAddress });
      });
    } catch (error) {
      console.error('❌ Failed to connect to L2 network:', error);
      this.uptime = Math.max(0, this.uptime - 1); // Decrease uptime on connection failure
    }
  }

  async validateBlock() {
    try {
      if (!this.isActive) return;
      
      // Simulate block validation
      const validationSuccess = Math.random() > 0.02; // 98% success rate
      
      if (validationSuccess) {
        // Earn rewards for successful validation
        const reward = BigInt(Math.floor(Math.random() * 1000000000000000000)); // Random reward
        this.totalRewards += reward;
        
        console.log(`✅ Block validated successfully. Reward: ${ethers.formatEther(reward)} 01A`);
        this.broadcastUpdate('validation', { 
          success: true, 
          reward: reward.toString(),
          validator: this.validatorAddress 
        });
      } else {
        console.log(`❌ Block validation failed`);
        this.uptime = Math.max(0, this.uptime - 0.1); // Slight uptime decrease
        this.broadcastUpdate('validation', { 
          success: false, 
          validator: this.validatorAddress 
        });
      }
    } catch (error) {
      console.error('❌ Validation error:', error);
      this.uptime = Math.max(0, this.uptime - 0.5);
    }
  }

  updateValidatorStats() {
    const stats = {
      timestamp: Date.now(),
      uptime: this.uptime,
      rewards: this.totalRewards.toString(),
      blocks_validated: Math.floor(Math.random() * 10), // Simulate blocks validated
      stake_amount: this.stakeAmount.toString()
    };
    
    this.db.prepare(`
      INSERT INTO validator_stats (timestamp, uptime, rewards, blocks_validated, stake_amount)
      VALUES (?, ?, ?, ?, ?)
    `).run(stats.timestamp, stats.uptime, stats.rewards, stats.blocks_validated, stats.stake_amount);
  }

  broadcastUpdate(type, data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, data }));
      }
    });
  }

  startValidator() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Validator Node running on port ${this.port}`);
      console.log(`📊 Validator Address: ${this.validatorAddress}`);
      console.log(`💰 Stake Amount: ${ethers.formatEther(this.stakeAmount)} 01A`);
      console.log(`📈 Commission: ${this.commission}%`);
      console.log(`🌐 Subnet: ${this.subnetId}`);
      console.log(`🔗 L2 RPC: ${this.l2RpcUrl}`);
    });
    
    console.log(`🌐 Validator WebSocket server running on port 8549`);
  }
}

const validator = new ValidatorNode();
