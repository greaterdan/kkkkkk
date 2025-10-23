import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import crypto from 'crypto';
import cron from 'node-cron';
import Database from 'better-sqlite3';

dotenv.config();

class VisionValidator {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8552;
    this.validatorId = 'vision-validator-002';
    this.validatorAddress = '0x829d8a18f4b4c0532925a3b8D4C9db96C4b4d6146';
    this.validatorName = 'Vision Transformers Validator';
    this.stakeAmount = BigInt('15000000000000000000000'); // 15,000 01A
    this.commission = 7.0; // 7%
    this.subnetId = 'subnet-2'; // Vision Transformers subnet
    this.l2RpcUrl = process.env.L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc';
    this.uptime = 100.0;
    this.totalRewards = BigInt(0);
    this.blocksValidated = 0;
    this.isActive = true;
    this.lastBlockTime = Date.now();
    this.startTime = Date.now();
    
    // Database for persistence
    this.db = new Database('vision_validator.db');
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
    this.wss = new WebSocketServer({ port: 8553 });
    this.wss.on('connection', ws => {
      console.log('Vision Validator WebSocket client connected');
      ws.on('message', message => {
        console.log(`Received: ${message}`);
      });
      ws.on('close', () => {
        console.log('Vision Validator WebSocket client disconnected');
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
      console.log(`🔗 Vision Validator connected to L2 network. Current block: ${blockNumber}`);
      
      // Monitor for new blocks
      this.provider.on('block', (blockNumber) => {
        console.log(`📦 Vision Validator detected new block: ${blockNumber}`);
        this.lastBlockTime = Date.now();
        this.broadcastUpdate('newBlock', { 
          blockNumber, 
          validator: this.validatorName,
          address: this.validatorAddress 
        });
      });
    } catch (error) {
      console.error('❌ Vision Validator failed to connect to L2 network:', error);
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
        
        console.log(`✅ Vision Validator validated block successfully. Reward: ${ethers.formatEther(reward)} 01A`);
        this.broadcastUpdate('validation', { 
          success: true, 
          reward: reward.toString(),
          validator: this.validatorName,
          blocksValidated: this.blocksValidated
        });
      } else {
        console.log(`❌ Vision Validator block validation failed`);
        this.uptime = Math.max(0, this.uptime - 0.1);
        this.broadcastUpdate('validation', { 
          success: false, 
          validator: this.validatorName 
        });
      }
    } catch (error) {
      console.error('❌ Vision Validator validation error:', error);
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
      console.log(`🚀 Vision Validator running on port ${this.port}`);
      console.log(`📊 Validator Name: ${this.validatorName}`);
      console.log(`📊 Validator Address: ${this.validatorAddress}`);
      console.log(`💰 Stake Amount: ${ethers.formatEther(this.stakeAmount)} 01A`);
      console.log(`📈 Commission: ${this.commission}%`);
      console.log(`🌐 Subnet: ${this.subnetId}`);
      console.log(`🔗 L2 RPC: ${this.l2RpcUrl}`);
    });
    
    console.log(`🌐 Vision Validator WebSocket server running on port 8553`);
  }
}

const validator = new VisionValidator();
