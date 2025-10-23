#!/bin/bash

echo "🚀 Deploying 01A LABS L2 Network to Production..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Deploy L2 Node
echo "⛏️  Deploying L2 Node to Railway..."
cd l2-node
railway deploy --service l2-node
L2_NODE_URL=$(railway domain)
echo "✅ L2 Node deployed: $L2_NODE_URL"

# Deploy L2 RPC
echo "🌐 Deploying L2 RPC to Railway..."
cd ../l2-rpc
railway deploy --service l2-rpc
L2_RPC_URL=$(railway domain)
echo "✅ L2 RPC deployed: $L2_RPC_URL"

# Deploy L2 Explorer to Vercel
echo "🔍 Deploying L2 Explorer to Vercel..."
cd ../l2-explorer
vercel --prod
EXPLORER_URL=$(vercel ls | grep l2-explorer | awk '{print $2}')
echo "✅ L2 Explorer deployed: $EXPLORER_URL"

echo ""
echo "🎉 01A LABS L2 Network Deployed!"
echo ""
echo "🌐 L2 Node:     $L2_NODE_URL"
echo "📡 L2 RPC:      $L2_RPC_URL"
echo "🔍 Explorer:    $EXPLORER_URL"
echo ""
echo "🔗 Connect with MetaMask:"
echo "Network Name: 01A LABS L2"
echo "RPC URL: $L2_RPC_URL/rpc"
echo "Chain ID: 26"
echo "Currency Symbol: 01A"
