import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import crypto from 'crypto';
import cron from 'node-cron';
import Database from 'better-sqlite3';

dotenv.config();

class AlphaValidator {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8550;
    this.validatorId = 'alpha-validator-001';
    this.validatorAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    this.validatorName = 'GPT-4 Inference Validator';
    this.stakeAmount = BigInt('10000000000000000000000'); // 10,000 01A
    this.commission = 5.0; // 5%
    this.subnetId = 'subnet-1'; // GPT-4 Inference subnet
    this.l2RpcUrl = process.env.L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc';
    this.uptime = 100.0;
    this.totalRewards = BigInt(0);
    this.blocksValidated = 0;
    this.isActive = true;
    this.lastBlockTime = Date.now();
    this.startTime = Date.now();
    
    // Database for persistence
    this.db = new Database('alpha_validator.db');
    this.initDatabase();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupValidatorLogic();
    this.startValidator();
  }

  initDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS validator_stats (
        id INTEGER PRIMARY KEY,
        timestamp INTEGER,
        uptime REAL,
        rewards TEXT,
        blocks_validated INTEGER,
        stake_amount TEXT,
        commission REAL
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
        name: this.validatorName,
        address: this.validatorAddress,
        stakeAmount: this.stakeAmount.toString(),
        commission: this.commission,
        subnetId: this.subnetId,
        uptime: this.uptime,
        totalRewards: this.totalRewards.toString(),
        blocksValidated: this.blocksValidated,
        isActive: this.isActive,
        lastBlockTime: this.lastBlockTime,
        startTime: this.startTime
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
        validator: this.validatorName,
        address: this.validatorAddress,
        uptime: this.uptime,
        active: this.isActive,
        blocksValidated: this.blocksValidated
      });
    });
  }

  setupWebSocket() {
    this.wss = new WebSocketServer({ port: 8551 });
    this.wss.on('connection', ws => {
      console.log('Alpha Validator WebSocket client connected');
      ws.on('message', message => {
        console.log(`Received: ${message}`);
      });
      ws.on('close', () => {
        console.log('Alpha Validator WebSocket client disconnected');
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
      console.log(`🔗 Alpha Validator connected to L2 network. Current block: ${blockNumber}`);
      
      // Monitor for new blocks
      this.provider.on('block', (blockNumber) => {
        console.log(`📦 Alpha Validator detected new block: ${blockNumber}`);
        this.lastBlockTime = Date.now();
        this.broadcastUpdate('newBlock', { 
          blockNumber, 
          validator: this.validatorName,
          address: this.validatorAddress 
        });
      });
    } catch (error) {
      console.error('❌ Alpha Validator failed to connect to L2 network:', error);
      this.uptime = Math.max(0, this.uptime - 1);
    }
  }

  async validateBlock() {
    try {
      if (!this.isActive) return;
      
      // Simulate block validation with high success rate
      const validationSuccess = Math.random() > 0.01; // 99% success rate
      
      if (validationSuccess) {
        // Earn rewards for successful validation
        const reward = BigInt(Math.floor(Math.random() * 1000000000000000000)); // Random reward
        this.totalRewards += reward;
        this.blocksValidated++;
        
        console.log(`✅ Alpha Validator validated block successfully. Reward: ${ethers.formatEther(reward)} 01A`);
        this.broadcastUpdate('validation', { 
          success: true, 
          reward: reward.toString(),
          validator: this.validatorName,
          blocksValidated: this.blocksValidated
        });
      } else {
        console.log(`❌ Alpha Validator block validation failed`);
        this.uptime = Math.max(0, this.uptime - 0.1);
        this.broadcastUpdate('validation', { 
          success: false, 
          validator: this.validatorName 
        });
      }
    } catch (error) {
      console.error('❌ Alpha Validator validation error:', error);
      this.uptime = Math.max(0, this.uptime - 0.5);
    }
  }

  updateValidatorStats() {
    const stats = {
      timestamp: Date.now(),
      uptime: this.uptime,
      rewards: this.totalRewards.toString(),
      blocks_validated: this.blocksValidated,
      stake_amount: this.stakeAmount.toString(),
      commission: this.commission
    };
    
    this.db.prepare(`
      INSERT INTO validator_stats (timestamp, uptime, rewards, blocks_validated, stake_amount, commission)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(stats.timestamp, stats.uptime, stats.rewards, stats.blocks_validated, stats.stake_amount, stats.commission);
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
      console.log(`🚀 Alpha Validator running on port ${this.port}`);
      console.log(`📊 Validator Name: ${this.validatorName}`);
      console.log(`📊 Validator Address: ${this.validatorAddress}`);
      console.log(`💰 Stake Amount: ${ethers.formatEther(this.stakeAmount)} 01A`);
      console.log(`📈 Commission: ${this.commission}%`);
      console.log(`🌐 Subnet: ${this.subnetId}`);
      console.log(`🔗 L2 RPC: ${this.l2RpcUrl}`);
    });
    
    console.log(`🌐 Alpha Validator WebSocket server running on port 8551`);
  }
}

const validator = new AlphaValidator();
