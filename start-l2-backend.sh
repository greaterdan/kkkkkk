#!/bin/bash

echo "🚀 Starting 01A L2 Network with Backend"
echo "========================================"

# Check if L2 node is running
if ! curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "📡 Starting L2 Node..."
    cd l2-node
    npm install
    node index.js &
    L2_NODE_PID=$!
    echo "L2 Node PID: $L2_NODE_PID"
    cd ..
    
    # Wait for L2 node to start
    echo "⏳ Waiting for L2 node to start..."
    sleep 5
fi

# Check if L2 RPC is running
if ! curl -s http://localhost:8547 > /dev/null 2>&1; then
    echo "📡 Starting L2 RPC Server..."
    cd l2-rpc
    npm install
    node index.js &
    L2_RPC_PID=$!
    echo "L2 RPC PID: $L2_RPC_PID"
    cd ..
    
    # Wait for L2 RPC to start
    echo "⏳ Waiting for L2 RPC to start..."
    sleep 3
fi

# Start the backend
echo "🔧 Starting Backend API..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
L2_RPC_URL=http://localhost:8545
L2_WS_URL=ws://localhost:8546
PORT=4000
TOKEN_CONTRACT_ADDRESS=
STAKING_CONTRACT_ADDRESS=
BRIDGE_CONTRACT_ADDRESS=
TASK_CONTRACT_ADDRESS=
EOF
fi

# Start backend
node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo ""
echo "✅ 01A L2 Network Started!"
echo "=========================="
echo "🌐 L2 Node: http://localhost:8545"
echo "📡 L2 RPC:  http://localhost:8547"
echo "🔧 Backend: http://localhost:4000"
echo "🔍 Explorer: http://localhost:3001"
echo ""
echo "📊 Your L2 network is now mining blocks every 3 seconds!"
echo "🔗 Connect MetaMask to: http://localhost:8545 (Chain ID: 26)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "🛑 Stopping services..."; kill $L2_NODE_PID $L2_RPC_PID $BACKEND_PID 2>/dev/null; exit' INT
wait
