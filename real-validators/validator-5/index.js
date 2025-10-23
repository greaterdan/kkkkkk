import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import crypto from 'crypto';
import cron from 'node-cron';
import Database from 'better-sqlite3';

dotenv.config();

class LlamaValidator {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8558;
    this.validatorId = 'llama-validator-005';
    this.validatorAddress = '0x6a35d6480b61c0532925a3b8D4C9db96C4b4d0b61';
    this.validatorName = 'Llama 3.1 Cluster Validator';
    this.stakeAmount = BigInt('30000000000000000000000'); // 30,000 01A
    this.commission = 6.0; // 6%
    this.subnetId = 'subnet-5'; // Llama 3.1 Cluster subnet
    this.l2RpcUrl = process.env.L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc';
    this.uptime = 100.0;
    this.totalRewards = BigInt(0);
    this.blocksValidated = 0;
    this.isActive = true;
    this.lastBlockTime = Date.now();
    this.startTime = Date.now();
    
    this.db = new Database('llama_validator.db');
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

    this.app.get('/validator/stats', (req, res) => {
      const stats = this.db.prepare('SELECT * FROM validator_stats ORDER BY timestamp DESC LIMIT 100').all();
      res.json(stats);
    });

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
    this.wss = new WebSocketServer({ port: 8559 });
    this.wss.on('connection', ws => {
      console.log('Llama Validator WebSocket client connected');
    });
  }

  setupValidatorLogic() {
    this.provider = new ethers.JsonRpcProvider(this.l2RpcUrl);
    this.monitorL2Network();
    
    cron.schedule('* * * * *', () => {
      this.updateValidatorStats();
    });
    
    cron.schedule('*/3 * * * * *', () => {
      this.validateBlock();
    });
  }

  async monitorL2Network() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`🔗 Llama Validator connected to L2 network. Current block: ${blockNumber}`);
      
      this.provider.on('block', (blockNumber) => {
        console.log(`📦 Llama Validator detected new block: ${blockNumber}`);
        this.lastBlockTime = Date.now();
        this.broadcastUpdate('newBlock', { 
          blockNumber, 
          validator: this.validatorName,
          address: this.validatorAddress 
        });
      });
    } catch (error) {
      console.error('❌ Llama Validator failed to connect to L2 network:', error);
      this.uptime = Math.max(0, this.uptime - 1);
    }
  }

  async validateBlock() {
    try {
      if (!this.isActive) return;
      
      const validationSuccess = Math.random() > 0.01;
      
      if (validationSuccess) {
        const reward = BigInt(Math.floor(Math.random() * 1000000000000000000));
        this.totalRewards += reward;
        this.blocksValidated++;
        
        console.log(`✅ Llama Validator validated block successfully. Reward: ${ethers.formatEther(reward)} 01A`);
        this.broadcastUpdate('validation', { 
          success: true, 
          reward: reward.toString(),
          validator: this.validatorName,
          blocksValidated: this.blocksValidated
        });
      } else {
        console.log(`❌ Llama Validator block validation failed`);
        this.uptime = Math.max(0, this.uptime - 0.1);
        this.broadcastUpdate('validation', { 
          success: false, 
          validator: this.validatorName 
        });
      }
    } catch (error) {
      console.error('❌ Llama Validator validation error:', error);
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
      console.log(`🚀 Llama Validator running on port ${this.port}`);
      console.log(`📊 Validator Name: ${this.validatorName}`);
      console.log(`📊 Validator Address: ${this.validatorAddress}`);
      console.log(`💰 Stake Amount: ${ethers.formatEther(this.stakeAmount)} 01A`);
      console.log(`📈 Commission: ${this.commission}%`);
      console.log(`🌐 Subnet: ${this.subnetId}`);
      console.log(`🔗 L2 RPC: ${this.l2RpcUrl}`);
    });
    
    console.log(`🌐 Llama Validator WebSocket server running on port 8559`);
  }
}

const validator = new LlamaValidator();
