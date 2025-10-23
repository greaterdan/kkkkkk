// Mock data for the AI Layer-2 blockchain

export interface Block {
  height: number;
  hash: string;
  timestamp: number;
  txCount: number;
  gasUsed: string;
  miner: string;
  reward: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasFee: string;
  status: "success" | "failed" | "pending";
  timestamp: number;
  blockHeight: number;
}

export interface Subnet {
  id: string;
  name: string;
  taskType: "LLM" | "Vision" | "Embedding" | "Audio";
  totalStaked: string;
  epochReward: string;
  validatorCount: number;
  minerCount: number;
  apy: number;
  description: string;
}

export interface Validator {
  address: string;
  name: string;
  stake: string;
  commission: number;
  uptime: number;
  totalRewards: string;
  subnetId: string;
  rank: number;
}

export interface Miner {
  address: string;
  score: number;
  stake: string;
  tasks: number;
  totalRewards: string;
  subnetId: string;
  rank: number;
}

export const generateMockBlocks = (count: number = 20): Block[] => {
  const blocks: Block[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    blocks.push({
      height: 1234567 - i,
      hash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 10)}`,
      timestamp: now - i * 3000,
      txCount: Math.floor(Math.random() * 200) + 10,
      gasUsed: `${(Math.random() * 10 + 5).toFixed(2)}M`,
      miner: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      reward: `${(Math.random() * 2 + 0.5).toFixed(4)} 01A`,
    });
  }

  return blocks;
};

export const generateMockTransactions = (count: number = 50): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = Date.now();
  const statuses: ("success" | "failed" | "pending")[] = ["success", "success", "success", "success", "failed", "pending"];

  for (let i = 0; i < count; i++) {
    transactions.push({
      hash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 10)}`,
      from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      value: `${(Math.random() * 10).toFixed(4)} 01A`,
      gasFee: `${(Math.random() * 0.01).toFixed(6)} BNB`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: now - i * 2000,
      blockHeight: 1234567 - Math.floor(i / 5),
    });
  }

  return transactions;
};

export const mockSubnets: Subnet[] = [
  {
    id: "subnet-1",
    name: "GPT-4 Inference",
    taskType: "LLM",
    totalStaked: "1,234,567 01A",
    epochReward: "5,000 01A",
    validatorCount: 128,
    minerCount: 450,
    apy: 45.2,
    description: "Large language model inference and fine-tuning subnet for GPT-4 class models",
  },
  {
    id: "subnet-2",
    name: "Vision Transformers",
    taskType: "Vision",
    totalStaked: "987,654 01A",
    epochReward: "3,500 01A",
    validatorCount: 96,
    minerCount: 320,
    apy: 38.5,
    description: "Computer vision subnet for image classification, object detection, and segmentation",
  },
  {
    id: "subnet-3",
    name: "Embeddings Pro",
    taskType: "Embedding",
    totalStaked: "765,432 01A",
    epochReward: "2,800 01A",
    validatorCount: 84,
    minerCount: 280,
    apy: 42.1,
    description: "High-quality semantic embeddings for RAG and vector search applications",
  },
  {
    id: "subnet-4",
    name: "Audio Genesis",
    taskType: "Audio",
    totalStaked: "654,321 01A",
    epochReward: "2,200 01A",
    validatorCount: 72,
    minerCount: 240,
    apy: 36.8,
    description: "Audio generation, transcription, and voice cloning subnet",
  },
  {
    id: "subnet-5",
    name: "Llama 3.1 Cluster",
    taskType: "LLM",
    totalStaked: "1,100,000 01A",
    epochReward: "4,500 01A",
    validatorCount: 115,
    minerCount: 400,
    apy: 41.3,
    description: "Specialized subnet for Llama 3.1 405B model serving and optimization",
  },
  {
    id: "subnet-6",
    name: "ViT Ensemble",
    taskType: "Vision",
    totalStaked: "890,000 01A",
    epochReward: "3,200 01A",
    validatorCount: 88,
    minerCount: 310,
    apy: 39.7,
    description: "Multi-model vision subnet with SAM, CLIP, and DALL-E integration",
  },
];

export const generateMockValidators = (subnetId?: string): Validator[] => {
  const validators: Validator[] = [];
  const names = ["Genesis", "Alpha", "Omega", "Nexus", "Quantum", "Phoenix", "Titan", "Vortex", "Eclipse", "Zenith"];

  for (let i = 0; i < 10; i++) {
    validators.push({
      address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      name: `${names[i]} Validator`,
      stake: `${(Math.random() * 50000 + 10000).toFixed(0)} 01A`,
      commission: Math.random() * 10 + 2,
      uptime: 95 + Math.random() * 5,
      totalRewards: `${(Math.random() * 10000 + 1000).toFixed(2)} 01A`,
      subnetId: subnetId || `subnet-${Math.floor(Math.random() * 6) + 1}`,
      rank: i + 1,
    });
  }

  return validators;
};

export const generateMockMiners = (subnetId: string): Miner[] => {
  const miners: Miner[] = [];

  for (let i = 0; i < 20; i++) {
    miners.push({
      address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      score: 100 - i * 3 - Math.random() * 5,
      stake: `${(Math.random() * 10000 + 1000).toFixed(0)} 01A`,
      tasks: Math.floor(Math.random() * 5000) + 100,
      totalRewards: `${(Math.random() * 5000 + 500).toFixed(2)} 01A`,
      subnetId,
      rank: i + 1,
    });
  }

  return miners;
};

export const mockDashboardMetrics = {
  activeSubnets: 1, // L2 network has 1 subnet
  validatorsOnline: 7, // L2 network has 7 real validators
  currentBlockHeight: 0, // L2 network starts at block 0
  transactionsProcessed: "12,847", // L2 network transactions processed
  toraPrice: 3.42,
  bnbPrice: 305.67,
  dailyVolume: "$2.3M", // L2 network volume
  totalTransactions: "0", // L2 network starts with 0 transactions
};

export const generateBlockChartData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      blocks: Math.floor(Math.random() * 5000) + 25000,
    });
  }
  return data;
};

export const generateSubnetActivityData = () => {
  return mockSubnets.slice(0, 6).map((subnet) => ({
    name: subnet.name,
    tasks: Math.floor(Math.random() * 50000) + 10000,
  }));
};

