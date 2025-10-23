# 01A Network - Backend API Specification

This document outlines the complete backend API specification needed to make the 01A Network frontend fully functional.

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [REST API Endpoints](#rest-api-endpoints)
4. [WebSocket Events](#websocket-events)
5. [Smart Contracts](#smart-contracts)
6. [Database Schema](#database-schema)
7. [Deployment Guide](#deployment-guide)

---

## Overview

The backend consists of:
- **Blockchain Indexer**: Indexes blocks, transactions, and events from the 01A chain
- **REST API**: Serves data to the frontend
- **WebSocket Server**: Provides real-time updates
- **Smart Contracts**: Handle bridge, staking, subnets, and tasks

---

## Technology Stack

### Recommended Stack
```
Blockchain Node:
├── Geth (Go-Ethereum fork)
├── Or use: Polygon CDK, OP Stack, Arbitrum Orbit
└── Custom consensus for AI workloads

Indexer:
├── The Graph (subgraphs) - Recommended
├── Or custom: Node.js + ethers.js + PostgreSQL
└── Real-time event listening

API Server:
├── Node.js + Express.js + TypeScript
├── Or: Python + FastAPI
└── JWT authentication (optional)

Database:
├── PostgreSQL (main data)
├── Redis (caching, real-time)
└── MongoDB (optional, for logs)

WebSocket:
├── Socket.io (Node.js)
└── Or: Python + WebSockets library
```

---

## REST API Endpoints

### Base URL
```
Production: https://api.01a.network/v1
Development: http://localhost:4000/api
```

### 1. Blocks

#### GET `/blocks`
Get paginated list of blocks

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response:**
```json
{
  "blocks": [
    {
      "height": 1234567,
      "hash": "0x...",
      "timestamp": 1698765432000,
      "txCount": 124,
      "gasUsed": "12345678",
      "gasLimit": "30000000",
      "miner": "0x...",
      "reward": "2.0 TORA",
      "size": 12345,
      "difficulty": "1000000"
    }
  ],
  "total": 1234567,
  "page": 1,
  "limit": 20
}
```

#### GET `/blocks/:blockNumber`
Get block by number

**Response:**
```json
{
  "height": 1234567,
  "hash": "0x...",
  "parentHash": "0x...",
  "timestamp": 1698765432000,
  "txCount": 124,
  "transactions": ["0x...", "0x..."],
  "gasUsed": "12345678",
  "gasLimit": "30000000",
  "miner": "0x...",
  "reward": "2.0 TORA",
  "extraData": "0x...",
  "size": 12345,
  "difficulty": "1000000",
  "nonce": "0x..."
}
```

#### GET `/blocks/hash/:hash`
Get block by hash

---

### 2. Transactions

#### GET `/transactions`
Get paginated list of transactions

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string: "success" | "failed" | "pending")

**Response:**
```json
{
  "transactions": [
    {
      "hash": "0x...",
      "from": "0x...",
      "to": "0x...",
      "value": "1.5 TORA",
      "gasFee": "0.0002 BNB",
      "gasPrice": "5 Gwei",
      "gasUsed": "21000",
      "status": "success",
      "timestamp": 1698765432000,
      "blockHeight": 1234567,
      "nonce": 42,
      "input": "0x..."
    }
  ],
  "total": 99775,
  "page": 1,
  "limit": 30
}
```

#### GET `/transactions/:hash`
Get transaction by hash

**Response:**
```json
{
  "hash": "0x...",
  "from": "0x...",
  "to": "0x...",
  "value": "1.5 TORA",
  "gasFee": "0.0002 BNB",
  "gasPrice": "5 Gwei",
  "gasUsed": "21000",
  "gasLimit": "100000",
  "status": "success",
  "timestamp": 1698765432000,
  "blockHeight": 1234567,
  "blockHash": "0x...",
  "nonce": 42,
  "input": "0x...",
  "logs": [],
  "confirmations": 12
}
```

---

### 3. Addresses

#### GET `/addresses/:address`
Get address information

**Response:**
```json
{
  "address": "0x...",
  "balance": "123.456 TORA",
  "transactionCount": 789,
  "firstSeen": 1698765432000,
  "lastActivity": 1698865432000,
  "isContract": false,
  "contractCode": null
}
```

#### GET `/addresses/:address/transactions`
Get transactions for an address

**Query Parameters:**
- `page` (number)
- `limit` (number)

---

### 4. Network Stats

#### GET `/stats`
Get overall network statistics

**Response:**
```json
{
  "totalBlocks": 97815,
  "totalTransactions": 99775,
  "avgBlockTime": 2.1,
  "gasTracker": 0.08,
  "totalAddresses": 247,
  "activeValidators": 380,
  "totalStaked": "12,456,789 TORA",
  "networkHashrate": "1.5 TH/s",
  "currentBlockHeight": 1234567,
  "toraPrice": 3.42,
  "bnbPrice": 305.67,
  "dailyVolume": "23.8M",
  "tvl": "142.5M"
}
```

#### GET `/stats/chart/:type`
Get chart data for blocks or transactions

**Parameters:**
- `type`: "blocks" | "transactions"

**Query Parameters:**
- `days` (number, default: 30)

**Response:**
```json
{
  "data": [
    { "date": "2024-01-01", "value": 25432 },
    { "date": "2024-01-02", "value": 26123 }
  ]
}
```

---

### 5. Subnets

#### GET `/subnets`
Get all subnets

**Response:**
```json
{
  "subnets": [
    {
      "id": "subnet-1",
      "name": "GPT-4 Inference",
      "taskType": "LLM",
      "totalStaked": "1,234,567 TORA",
      "epochReward": "5,000 TORA",
      "validatorCount": 128,
      "minerCount": 450,
      "apy": 45.2,
      "description": "Large language model inference...",
      "status": "active",
      "createdAt": 1698765432000
    }
  ]
}
```

#### GET `/subnets/:id`
Get subnet by ID

#### GET `/subnets/:id/validators`
Get validators for a subnet

#### GET `/subnets/:id/activity`
Get activity data for a subnet

**Query Parameters:**
- `days` (number, default: 30)

---

### 6. Validators

#### GET `/validators`
Get all validators

**Query Parameters:**
- `sortBy`: "stake" | "uptime" | "rewards"
- `subnetId` (optional)

**Response:**
```json
{
  "validators": [
    {
      "address": "0x...",
      "name": "Genesis Validator",
      "stake": "50,000 TORA",
      "commission": 5.5,
      "uptime": 99.8,
      "totalRewards": "5,234.12 TORA",
      "subnetId": "subnet-1",
      "rank": 1,
      "status": "active",
      "delegators": 45
    }
  ]
}
```

#### GET `/validators/:address`
Get validator by address

---

### 7. Search

#### GET `/search`
Search for blocks, transactions, or addresses

**Query Parameters:**
- `q` (string): Search query

**Response:**
```json
{
  "type": "transaction",
  "data": { /* transaction object */ }
}
```

---

### 8. Bridge

#### GET `/bridge/transactions`
Get bridge transactions for an address

**Query Parameters:**
- `address` (string)
- `page` (number)
- `limit` (number)

**Response:**
```json
{
  "transactions": [
    {
      "id": "bridge-tx-123",
      "from": "BNB Chain",
      "to": "01A Network",
      "amount": "1.5 BNB",
      "status": "completed",
      "timestamp": 1698765432000,
      "txHashL1": "0x...",
      "txHashL2": "0x..."
    }
  ]
}
```

#### POST `/bridge/initiate`
Initiate a bridge transaction

**Request Body:**
```json
{
  "from": "bnb",
  "to": "01a",
  "amount": "1.5",
  "address": "0x..."
}
```

---

### 9. AI Tasks

#### GET `/tasks`
Get tasks for an address

**Query Parameters:**
- `address` (string)
- `status` (optional)

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-123",
      "type": "llm",
      "status": "completed",
      "prompt": "...",
      "result": "...",
      "cost": "0.002 TORA",
      "createdAt": 1698765432000,
      "completedAt": 1698765437000,
      "subnetId": "subnet-1"
    }
  ]
}
```

#### POST `/tasks/submit`
Submit a new AI task

**Request Body:**
```json
{
  "type": "llm",
  "prompt": "Generate a story about...",
  "parameters": {
    "temperature": 0.7,
    "maxTokens": 1000
  },
  "subnetId": "subnet-1"
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('wss://api.01a.network');
```

### Events to Subscribe

#### `new_block`
Emitted when a new block is mined

**Payload:**
```json
{
  "type": "new_block",
  "payload": {
    "height": 1234567,
    "hash": "0x...",
    "timestamp": 1698765432000,
    "txCount": 124
  }
}
```

#### `new_transaction`
Emitted for new transactions

**Payload:**
```json
{
  "type": "new_transaction",
  "payload": {
    "hash": "0x...",
    "from": "0x...",
    "to": "0x...",
    "value": "1.5 TORA"
  }
}
```

#### `stats_update`
Emitted every 10 seconds with network stats

**Payload:**
```json
{
  "type": "stats_update",
  "payload": {
    "totalBlocks": 97815,
    "totalTransactions": 99775,
    "gasTracker": 0.08
  }
}
```

---

## Smart Contracts

### 1. Bridge Contract (L1 - BNB Chain)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract L1Bridge {
    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount, bytes32 proof);

    function deposit() external payable {
        require(msg.value > 0, "Amount must be > 0");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(address to, uint256 amount, bytes32[] memory proof) external {
        // Verify merkle proof
        // Transfer tokens
        emit Withdraw(to, amount, proof[0]);
    }
}
```

### 2. Bridge Contract (L2 - 01A Network)

```solidity
contract L2Bridge {
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    function mint(address to, uint256 amount) external {
        // Only callable by bridge operator
        emit Mint(to, amount);
    }

    function burn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        emit Burn(msg.sender, amount);
    }
}
```

### 3. Validator Staking Contract

```solidity
contract ValidatorStaking {
    struct Validator {
        uint256 stake;
        uint256 commission; // in basis points (500 = 5%)
        string name;
        string subnetId;
        bool isActive;
    }

    mapping(address => Validator) public validators;
    uint256 public constant MIN_STAKE = 10000 ether;

    event ValidatorRegistered(address indexed validator, uint256 stake);
    event Staked(address indexed validator, uint256 amount);
    event Unstaked(address indexed validator, uint256 amount);

    function registerValidator(
        string memory name,
        string memory subnetId,
        uint256 commission
    ) external payable {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(commission <= 2000, "Commission too high"); // Max 20%
        
        validators[msg.sender] = Validator({
            stake: msg.value,
            commission: commission,
            name: name,
            subnetId: subnetId,
            isActive: true
        });

        emit ValidatorRegistered(msg.sender, msg.value);
    }

    function stake() external payable {
        require(validators[msg.sender].isActive, "Not a validator");
        validators[msg.sender].stake += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external {
        require(validators[msg.sender].stake >= amount, "Insufficient stake");
        validators[msg.sender].stake -= amount;
        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }
}
```

### 4. AI Task Submission Contract

```solidity
contract AITaskRegistry {
    struct Task {
        address submitter;
        string taskType; // "llm", "vision", "embedding", "audio"
        string prompt;
        string subnetId;
        uint256 payment;
        uint256 createdAt;
        bool completed;
    }

    mapping(bytes32 => Task) public tasks;

    event TaskSubmitted(bytes32 indexed taskId, address submitter, string taskType);
    event TaskCompleted(bytes32 indexed taskId, string result);

    function submitTask(
        string memory taskType,
        string memory prompt,
        string memory subnetId
    ) external payable returns (bytes32) {
        bytes32 taskId = keccak256(abi.encodePacked(msg.sender, block.timestamp, prompt));
        
        tasks[taskId] = Task({
            submitter: msg.sender,
            taskType: taskType,
            prompt: prompt,
            subnetId: subnetId,
            payment: msg.value,
            createdAt: block.timestamp,
            completed: false
        });

        emit TaskSubmitted(taskId, msg.sender, taskType);
        return taskId;
    }

    function completeTask(bytes32 taskId, string memory result) external {
        // Only callable by validators
        tasks[taskId].completed = true;
        emit TaskCompleted(taskId, result);
    }
}
```

---

## Database Schema (PostgreSQL)

```sql
-- Blocks table
CREATE TABLE blocks (
    height BIGINT PRIMARY KEY,
    hash VARCHAR(66) UNIQUE NOT NULL,
    parent_hash VARCHAR(66) NOT NULL,
    timestamp BIGINT NOT NULL,
    miner VARCHAR(42) NOT NULL,
    gas_used BIGINT NOT NULL,
    gas_limit BIGINT NOT NULL,
    tx_count INTEGER NOT NULL,
    reward VARCHAR(50),
    size INTEGER,
    difficulty VARCHAR(100),
    nonce VARCHAR(66),
    extra_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocks_timestamp ON blocks(timestamp);
CREATE INDEX idx_blocks_miner ON blocks(miner);

-- Transactions table
CREATE TABLE transactions (
    hash VARCHAR(66) PRIMARY KEY,
    block_height BIGINT REFERENCES blocks(height),
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42),
    value VARCHAR(100),
    gas_price BIGINT,
    gas_used BIGINT,
    gas_limit BIGINT,
    nonce BIGINT,
    status VARCHAR(20),
    timestamp BIGINT NOT NULL,
    input TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_from ON transactions(from_address);
CREATE INDEX idx_transactions_to ON transactions(to_address);
CREATE INDEX idx_transactions_block ON transactions(block_height);

-- Addresses table
CREATE TABLE addresses (
    address VARCHAR(42) PRIMARY KEY,
    balance VARCHAR(100),
    transaction_count INTEGER DEFAULT 0,
    first_seen BIGINT,
    last_activity BIGINT,
    is_contract BOOLEAN DEFAULT FALSE,
    contract_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Validators table
CREATE TABLE validators (
    address VARCHAR(42) PRIMARY KEY,
    name VARCHAR(255),
    subnet_id VARCHAR(50),
    stake VARCHAR(100),
    commission DECIMAL(5,2),
    uptime DECIMAL(5,2),
    total_rewards VARCHAR(100),
    rank INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Tasks table
CREATE TABLE ai_tasks (
    id VARCHAR(66) PRIMARY KEY,
    submitter VARCHAR(42) NOT NULL,
    task_type VARCHAR(20),
    prompt TEXT,
    result TEXT,
    subnet_id VARCHAR(50),
    cost VARCHAR(100),
    status VARCHAR(20),
    created_at BIGINT,
    completed_at BIGINT
);
```

---

## Deployment Guide

### Step 1: Deploy Smart Contracts
```bash
# Install Hardhat
npm install --save-dev hardhat

# Deploy to BNB testnet
npx hardhat run scripts/deploy.js --network bnbTestnet

# Deploy to 01A network
npx hardhat run scripts/deploy.js --network 01a
```

### Step 2: Setup Database
```bash
# Create PostgreSQL database
createdb 01a_network

# Run migrations
psql 01a_network < schema.sql
```

### Step 3: Run Indexer
```bash
# Start indexing from genesis
node indexer/start.js --from-block 0

# Or use The Graph
graph deploy 01a-network
```

### Step 4: Start API Server
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start server
npm run dev # Development
npm run build && npm start # Production
```

### Step 5: Configure Frontend
Update `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=https://api.01a.network/v1
NEXT_PUBLIC_WS_URL=wss://api.01a.network
NEXT_PUBLIC_BRIDGE_CONTRACT=0x...
NEXT_PUBLIC_STAKING_CONTRACT=0x...
```

---

## Additional Resources

- [Geth Documentation](https://geth.ethereum.org/docs)
- [The Graph](https://thegraph.com/docs)
- [Polygon CDK](https://docs.polygon.technology/cdk/)
- [OP Stack](https://stack.optimism.io/)

---

## Support

For questions or issues, please open an issue on GitHub or contact the team at dev@01a.network

