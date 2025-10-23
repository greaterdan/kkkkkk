#!/bin/bash

echo "🎯 01A Network - AI System Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY is not set."
    echo "Please set your OpenAI API key:"
    echo "export OPENAI_API_KEY=your_api_key_here"
    echo ""
    echo "Or add it to your .env file:"
    echo "OPENAI_API_KEY=your_api_key_here"
    echo ""
    read -p "Do you want to continue without OpenAI API key? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ OpenAI API key is set"
fi

# Check if L2 node is running
echo "🔍 Checking L2 node connection..."
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null 2>&1; then
    echo "✅ L2 node is running on localhost:8545"
else
    echo "⚠️  L2 node is not running on localhost:8545"
    echo "Please start your L2 node first:"
    echo "cd l2-node-github && npm start"
    echo ""
    read -p "Do you want to continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Compile contracts
echo "🔨 Compiling smart contracts..."
cd backend/token-bridge
if command -v forge &> /dev/null; then
    forge build
    echo "✅ Contracts compiled successfully"
else
    echo "⚠️  Foundry is not installed. Please install Foundry to compile contracts."
    echo "Run: curl -L https://foundry.paradigm.xyz | bash"
    echo "Then: foundryup"
fi
cd ../..

# Deploy contracts
echo "🚀 Deploying AI contracts..."
node deploy-ai-contracts.js

# Start backend server
echo "🚀 Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start frontend
echo "🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 AI System Setup Complete!"
echo "=============================="
echo "✅ Backend server running on http://localhost:4000"
echo "✅ Frontend running on http://localhost:3000"
echo "✅ AI contracts deployed"
echo ""
echo "📋 Next steps:"
echo "1. Open http://localhost:3000/tasks"
echo "2. Connect your wallet"
echo "3. Submit an AI task"
echo ""
echo "🛑 To stop the servers, press Ctrl+C"

# Wait for user to stop
wait
