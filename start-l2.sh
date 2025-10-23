#!/bin/bash

echo "🚀 Starting 01A LABS L2 Network..."

# Create directories
mkdir -p l2-node l2-rpc l2-explorer/views l2-explorer/public

# Install dependencies
echo "📦 Installing L2 Node dependencies..."
cd l2-node && npm install && cd ..

echo "📦 Installing L2 RPC dependencies..."
cd l2-rpc && npm install && cd ..

echo "📦 Installing L2 Explorer dependencies..."
cd l2-explorer && npm install && cd ..

# Start L2 Node
echo "⛏️  Starting L2 Node..."
cd l2-node && node index.js &
L2_NODE_PID=$!

# Wait for L2 node to start
sleep 3

# Start L2 RPC
echo "🌐 Starting L2 RPC Server..."
cd ../l2-rpc && node index.js &
L2_RPC_PID=$!

# Wait for RPC to start
sleep 3

# Start L2 Explorer
echo "🔍 Starting L2 Explorer..."
cd ../l2-explorer && node index.js &
L2_EXPLORER_PID=$!

echo ""
echo "✅ 01A LABS L2 Network Started!"
echo ""
echo "🌐 L2 Node:     http://localhost:8545"
echo "📡 L2 RPC:      http://localhost:8547"
echo "🔍 Explorer:    http://localhost:3001"
echo "🔌 WebSocket:   ws://localhost:8546"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping L2 Network..."
    kill $L2_NODE_PID $L2_RPC_PID $L2_EXPLORER_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait
