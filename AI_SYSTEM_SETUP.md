# 01A Network - AI System Setup Guide

This guide will help you set up the complete AI functionality for the 01A Network.

## 🎯 What This System Does

The AI system provides:
- **LLM Processing**: GPT-4 text generation and completion
- **Vision Processing**: DALL-E 3 image generation from text prompts
- **Embedding Processing**: Text embeddings using OpenAI's text-embedding-ada-002
- **Audio Processing**: Audio processing (currently simulated)
- **Payment Processing**: TORA token payments for AI tasks
- **Blockchain Integration**: Task submission and results recorded on-chain

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js 18+ installed
- OpenAI API key
- L2 node running on localhost:8545

### 2. One-Command Setup
```bash
./setup-ai-system.sh
```

This script will:
- Install all dependencies
- Compile smart contracts
- Deploy AI contracts to L2 network
- Start backend and frontend servers

## 🔧 Manual Setup

### Step 1: Install Dependencies
```bash
# Install main dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### Step 2: Set Environment Variables
Create a `.env` file in the backend directory:
```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# L2 Network Configuration
L2_RPC_URL=http://localhost:8545

# Contract Addresses (will be set after deployment)
TASK_CONTRACT_ADDRESS=
```

### Step 3: Start L2 Node
```bash
cd l2-node-github
npm start
```

### Step 4: Compile and Deploy Contracts
```bash
# Compile contracts
cd backend/token-bridge
forge build

# Deploy contracts
cd ../..
node deploy-ai-contracts.js
```

### Step 5: Start Backend Server
```bash
cd backend
npm start
```

### Step 6: Start Frontend
```bash
npm run dev
```

## 🧪 Testing the AI System

### 1. Open the Tasks Page
Navigate to `http://localhost:3000/tasks`

### 2. Connect Your Wallet
Click "Connect Wallet" and connect your MetaMask or other Web3 wallet

### 3. Submit an AI Task
1. Select task type (LLM, Vision, Embedding, Audio)
2. Enter your prompt
3. Click "Submit Task"
4. Wait for processing (usually 2-10 seconds)
5. View the result

### Example Tasks:
- **LLM**: "Write a short story about a robot learning to paint"
- **Vision**: "A futuristic city skyline at sunset"
- **Embedding**: "The quick brown fox jumps over the lazy dog"

## 💰 Payment System

The system uses TORA tokens for payments:
- **LLM**: 0.002 TORA base + 0.000001 TORA per token
- **Vision**: 0.005 TORA base + 0.000002 TORA per token
- **Embedding**: 0.001 TORA base + 0.0000005 TORA per token
- **Audio**: 0.003 TORA base + 0.0000015 TORA per token

## 🔧 API Endpoints

### Submit AI Task
```bash
POST /api/ai/submit-task
Content-Type: application/json

{
  "taskType": "LLM",
  "prompt": "Your prompt here",
  "subnetId": "subnet-1",
  "userAddress": "0x..."
}
```

### Get Task History
```bash
GET /api/ai/tasks?subnetId=subnet-1&limit=20
```

### Get AI Stats
```bash
GET /api/ai/stats
```

## 🏗️ Architecture

```
Frontend (React) → Backend API → OpenAI API
     ↓                ↓
Smart Contracts ← Payment System
     ↓
L2 Blockchain
```

## 🐛 Troubleshooting

### OpenAI API Key Issues
- Ensure your API key is valid and has credits
- Check that the key is set in your environment variables

### L2 Node Connection Issues
- Ensure L2 node is running on localhost:8545
- Check that the node is responding to RPC calls

### Contract Deployment Issues
- Ensure Foundry is installed (`forge --version`)
- Check that contracts compiled successfully
- Verify L2 node is running before deployment

### Payment Issues
- Ensure user has sufficient TORA tokens
- Check that payment processing is working

## 📊 Monitoring

### Backend Logs
```bash
cd backend
npm start
```

### Frontend Logs
Check browser console for any errors

### Contract Events
Monitor smart contract events for task submissions and completions

## 🔒 Security Notes

- Never commit your OpenAI API key to version control
- Use environment variables for all sensitive configuration
- Validate all user inputs before processing
- Implement proper error handling and logging

## 🚀 Production Deployment

For production deployment:
1. Set up proper environment variables
2. Use a production-grade database
3. Implement proper logging and monitoring
4. Set up rate limiting and security measures
5. Deploy contracts to mainnet
6. Configure proper backup and recovery procedures

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are met
4. Verify environment variables are set correctly
