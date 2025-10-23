import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to blockchain (defaults to local Hardhat node if not specified)
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

console.log(`Connecting to blockchain at: ${RPC_URL}`);

// Contract ABIs (simplified for demo)
const STAKING_ABI = [
  'function getAllValidators() view returns (tuple(address addr, string name, uint256 stake, uint256 commission, string subnetId, bool active, uint256 uptime, uint256 totalRewards, uint256 registeredAt)[])',
  'function getValidatorCount() view returns (uint256)',
  'function validators(address) view returns (address addr, string name, uint256 stake, uint256 commission, string subnetId, bool active, uint256 uptime, uint256 totalRewards, uint256 registeredAt)',
  'event ValidatorRegistered(address indexed validator, string name, uint256 stake)'
];

const BRIDGE_ABI = [
  'function deposits(address) view returns (uint256)',
  'function getBalance(address) view returns (uint256)',
  'event Deposit(address indexed from, uint256 amount, uint256 timestamp)',
  'event Withdraw(address indexed to, uint256 amount, uint256 timestamp)'
];

const TASK_ABI = [
  'function getTaskCount() view returns (uint256)',
  'function getUserTasks(address) view returns (bytes32[])',
  'function getTask(bytes32) view returns (tuple(bytes32 id, address submitter, uint8 taskType, string prompt, string result, string subnetId, uint256 payment, uint8 status, uint256 createdAt, uint256 completedAt))',
  'event TaskSubmitted(bytes32 indexed taskId, address indexed submitter, uint8 taskType, uint256 payment)',
  'event TaskCompleted(bytes32 indexed taskId, string result)'
];

// Initialize contracts (will be set after deployment)
let stakingContract = null;
let bridgeContract = null;
let taskContract = null;

// Initialize contracts if addresses are provided
if (process.env.STAKING_CONTRACT_ADDRESS) {
  stakingContract = new ethers.Contract(process.env.STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
  console.log('Staking contract initialized at:', process.env.STAKING_CONTRACT_ADDRESS);
}

if (process.env.BRIDGE_CONTRACT_ADDRESS) {
  bridgeContract = new ethers.Contract(process.env.BRIDGE_CONTRACT_ADDRESS, BRIDGE_ABI, provider);
  console.log('Bridge contract initialized at:', process.env.BRIDGE_CONTRACT_ADDRESS);
}

if (process.env.TASK_CONTRACT_ADDRESS) {
  taskContract = new ethers.Contract(process.env.TASK_CONTRACT_ADDRESS, TASK_ABI, provider);
  console.log('Task contract initialized at:', process.env.TASK_CONTRACT_ADDRESS);
}

// ============== API ENDPOINTS ==============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Get latest blocks
app.get('/api/blocks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const blockNumber = await provider.getBlockNumber();
    const blocks = [];
    
    const start = blockNumber - ((page - 1) * limit);
    const end = Math.max(start - limit, 0);
    
    for (let i = start; i > end && i >= 0; i--) {
      try {
        const block = await provider.getBlock(i);
        if (block) {
          blocks.push({
            height: block.number,
            hash: block.hash,
            timestamp: block.timestamp * 1000,
            txCount: block.transactions.length,
            gasUsed: block.gasUsed.toString(),
            gasLimit: block.gasLimit.toString(),
            miner: block.miner,
            reward: "2.0 01A",
            size: block.length || 0,
            difficulty: block.difficulty ? block.difficulty.toString() : "1"
          });
        }
      } catch (e) {
        console.error(`Error fetching block ${i}:`, e.message);
      }
    }
    
    res.json({ 
      blocks, 
      total: blockNumber,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get block by number or hash
app.get('/api/blocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let block;
    
    if (id.startsWith('0x')) {
      block = await provider.getBlock(id);
    } else {
      block = await provider.getBlock(parseInt(id));
    }
    
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }
    
    res.json({
      height: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp * 1000,
      txCount: block.transactions.length,
      transactions: block.transactions,
      gasUsed: block.gasUsed.toString(),
      gasLimit: block.gasLimit.toString(),
      miner: block.miner,
      reward: "2.0 01A",
      extraData: block.extraData,
      size: block.length || 0,
      difficulty: block.difficulty ? block.difficulty.toString() : "1",
      nonce: block.nonce || "0x0"
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    
    const blockNumber = await provider.getBlockNumber();
    const transactions = [];
    
    let collected = 0;
    let blockIndex = blockNumber;
    
    while (collected < limit && blockIndex >= 0) {
      try {
        const block = await provider.getBlock(blockIndex, true);
        if (block && block.prefetchedTransactions) {
          for (const tx of block.prefetchedTransactions) {
            if (collected >= limit) break;
            
            const receipt = await provider.getTransactionReceipt(tx.hash);
            transactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || "Contract Creation",
              value: ethers.formatEther(tx.value) + " 01A",
              gasFee: receipt ? ethers.formatEther(tx.gasPrice * receipt.gasUsed) + " BNB" : "0 BNB",
              gasPrice: ethers.formatUnits(tx.gasPrice, "gwei") + " Gwei",
              gasUsed: receipt ? receipt.gasUsed.toString() : "0",
              status: receipt ? (receipt.status === 1 ? "success" : "failed") : "pending",
              timestamp: block.timestamp * 1000,
              blockHeight: block.number,
              nonce: tx.nonce,
              input: tx.data
            });
            collected++;
          }
        }
      } catch (e) {
        console.error(`Error fetching transactions from block ${blockIndex}:`, e.message);
      }
      blockIndex--;
    }
    
    res.json({ 
      transactions,
      total: blockNumber * 15, // Estimate
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by hash
app.get('/api/transactions/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const tx = await provider.getTransaction(hash);
    const receipt = await provider.getTransactionReceipt(hash);
    
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const block = await provider.getBlock(tx.blockNumber);
    
    res.json({
      hash: tx.hash,
      from: tx.from,
      to: tx.to || "Contract Creation",
      value: ethers.formatEther(tx.value) + " 01A",
      gasFee: receipt ? ethers.formatEther(tx.gasPrice * receipt.gasUsed) + " BNB" : "0 BNB",
      gasPrice: ethers.formatUnits(tx.gasPrice, "gwei") + " Gwei",
      gasUsed: receipt ? receipt.gasUsed.toString() : "0",
      gasLimit: tx.gasLimit.toString(),
      status: receipt ? (receipt.status === 1 ? "success" : "failed") : "pending",
      timestamp: block ? block.timestamp * 1000 : Date.now(),
      blockHeight: tx.blockNumber,
      blockHash: tx.blockHash,
      nonce: tx.nonce,
      input: tx.data,
      logs: receipt ? receipt.logs : [],
      confirmations: receipt ? receipt.confirmations : 0
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get network stats
app.get('/api/stats', async (req, res) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    const prevBlock = await provider.getBlock(blockNumber - 10);
    
    const avgBlockTime = prevBlock ? (block.timestamp - prevBlock.timestamp) / 10 : 2.1;
    
    let validatorCount = 0;
    if (stakingContract) {
      try {
        validatorCount = Number(await stakingContract.getValidatorCount());
      } catch (e) {
        console.error('Error fetching validator count:', e.message);
      }
    }
    
    res.json({
      totalBlocks: blockNumber,
      totalTransactions: blockNumber * 15, // Estimate
      avgBlockTime: avgBlockTime.toFixed(1),
      gasTracker: 0.08,
      totalAddresses: 247,
      activeValidators: validatorCount || 380,
      totalStaked: "12,456,789 01A",
      networkHashrate: "1.5 TH/s",
      currentBlockHeight: blockNumber,
      toraPrice: 3.42,
      bnbPrice: 305.67,
      dailyVolume: "$23.8M",
      tvl: "$142.5M"
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chart data
app.get('/api/stats/chart/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const days = parseInt(req.query.days) || 30;
    
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 5000) + 20000
      });
    }
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get validators
app.get('/api/validators', async (req, res) => {
  try {
    if (!stakingContract) {
      // Return mock validators for now since contracts aren't deployed
      const mockValidators = [
        {
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          name: 'GPT-4 Validator',
          stake: '15000.0 01A',
          commission: 5.0,
          subnetId: 'subnet-1',
          uptime: 99.8,
          totalRewards: '2340.5 01A',
          rank: 1,
          status: 'active'
        },
        {
          address: '0x8a2d35Cc6634C0532925a3b8D4C9db96C4b4d8b7',
          name: 'Vision Validator',
          stake: '12000.0 01A',
          commission: 7.5,
          subnetId: 'subnet-2',
          uptime: 99.2,
          totalRewards: '1890.2 01A',
          rank: 2,
          status: 'active'
        },
        {
          address: '0x9b3d35Cc6634C0532925a3b8D4C9db96C4b4d8b8',
          name: 'Embedding Validator',
          stake: '8500.0 01A',
          commission: 10.0,
          subnetId: 'subnet-3',
          uptime: 98.5,
          totalRewards: '1456.8 01A',
          rank: 3,
          status: 'active'
        },
        {
          address: '0xac4d35Cc6634C0532925a3b8D4C9db96C4b4d8b9',
          name: 'Audio Validator',
          stake: '6200.0 01A',
          commission: 12.5,
          subnetId: 'subnet-4',
          uptime: 97.8,
          totalRewards: '1123.4 01A',
          rank: 4,
          status: 'active'
        }
      ];
      return res.json({ validators: mockValidators });
    }
    
    const validators = await stakingContract.getAllValidators();
    const formattedValidators = validators.map((v, index) => ({
      address: v.addr,
      name: v.name,
      stake: ethers.formatEther(v.stake) + " 01A",
      commission: Number(v.commission) / 100,
      subnetId: v.subnetId,
      uptime: Number(v.uptime) / 100,
      totalRewards: ethers.formatEther(v.totalRewards) + " 01A",
      rank: index + 1,
      status: v.active ? "active" : "inactive"
    }));
    
    res.json({ validators: formattedValidators });
  } catch (error) {
    console.error('Error fetching validators:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get validator by address
app.get('/api/validators/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!stakingContract) {
      return res.status(404).json({ error: 'Staking contract not initialized' });
    }
    
    const validator = await stakingContract.validators(address);
    
    res.json({
      address: validator.addr,
      name: validator.name,
      stake: ethers.formatEther(validator.stake) + " 01A",
      commission: Number(validator.commission) / 100,
      subnetId: validator.subnetId,
      uptime: Number(validator.uptime) / 100,
      totalRewards: ethers.formatEther(validator.totalRewards) + " 01A",
      status: validator.active ? "active" : "inactive"
    });
  } catch (error) {
    console.error('Error fetching validator:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    // Try as transaction hash
    if (q.startsWith('0x') && q.length === 66) {
      try {
        const tx = await provider.getTransaction(q);
        if (tx) {
          return res.json({ type: 'transaction', data: tx });
        }
      } catch (e) {}
    }
    
    // Try as address
    if (q.startsWith('0x') && q.length === 42) {
      try {
        const code = await provider.getCode(q);
        return res.json({ 
          type: 'address', 
          data: { 
            address: q,
            isContract: code !== '0x'
          }
        });
      } catch (e) {}
    }
    
    // Try as block number
    if (!isNaN(q)) {
      try {
        const block = await provider.getBlock(parseInt(q));
        if (block) {
          return res.json({ type: 'block', data: block });
        }
      } catch (e) {}
    }
    
    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Connected to blockchain: ${RPC_URL}\n`);
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe') {
        console.log(`Client subscribed to: ${data.event}`);
      }
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });
  
  ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to 01A Network WebSocket' }));
});

// Listen for new blocks and broadcast
provider.on('block', async (blockNumber) => {
  console.log(`New block: ${blockNumber}`);
  
  try {
    const block = await provider.getBlock(blockNumber);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'new_block',
          payload: {
            height: block.number,
            hash: block.hash,
            timestamp: block.timestamp * 1000,
            txCount: block.transactions.length
          }
        }));
      }
    });
  } catch (e) {
    console.error('Error broadcasting new block:', e);
  }
});

console.log('✅ WebSocket server ready for real-time updates');

// Export for ES modules
export default app;

