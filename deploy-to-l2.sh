#!/bin/bash

echo "🚀 Deploying Smart Contracts to 01A L2 Network"
echo "=============================================="

# Check if L2 node is running
if ! curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "❌ L2 node is not running. Please start it first:"
    echo "   cd l2-node && node index.js"
    exit 1
fi

echo "✅ L2 node is running"

# Create deployment script
cat > deploy-l2.js << 'EOF'
const { ethers } = require('ethers');

async function deployContracts() {
    // Connect to L2 network
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    
    console.log('📡 Connected to L2 network');
    console.log('💰 Deployer address:', wallet.address);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
    
    // Deploy Token01A
    console.log('🪙 Deploying Token01A...');
    const Token01A = await ethers.getContractFactory('Token01A');
    const token = await Token01A.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log('✅ Token01A deployed at:', tokenAddress);
    
    // Deploy ValidatorStaking
    console.log('🏦 Deploying ValidatorStaking...');
    const ValidatorStaking = await ethers.getContractFactory('ValidatorStaking');
    const staking = await ValidatorStaking.deploy(tokenAddress);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log('✅ ValidatorStaking deployed at:', stakingAddress);
    
    // Deploy Bridge
    console.log('🌉 Deploying Bridge...');
    const Bridge = await ethers.getContractFactory('Bridge');
    const bridge = await Bridge.deploy(tokenAddress);
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log('✅ Bridge deployed at:', bridgeAddress);
    
    // Deploy AITaskRegistry
    console.log('🤖 Deploying AITaskRegistry...');
    const AITaskRegistry = await ethers.getContractFactory('AITaskRegistry');
    const taskRegistry = await AITaskRegistry.deploy();
    await taskRegistry.waitForDeployment();
    const taskAddress = await taskRegistry.getAddress();
    console.log('✅ AITaskRegistry deployed at:', taskAddress);
    
    // Save deployment info
    const deploymentInfo = {
        network: "01A L2 Network",
        deployer: wallet.address,
        contracts: {
            Token01A: tokenAddress,
            ValidatorStaking: stakingAddress,
            Bridge: bridgeAddress,
            AITaskRegistry: taskAddress
        },
        timestamp: Math.floor(Date.now() / 1000),
        status: "Successfully deployed to L2 network"
    };
    
    require('fs').writeFileSync('deployment-info-l2.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('📄 Deployment info saved to deployment-info-l2.json');
    
    console.log('');
    console.log('🎉 All contracts deployed successfully!');
    console.log('=====================================');
    console.log('Token01A:', tokenAddress);
    console.log('ValidatorStaking:', stakingAddress);
    console.log('Bridge:', bridgeAddress);
    console.log('AITaskRegistry:', taskAddress);
}

deployContracts().catch(console.error);
EOF

# Install hardhat if not exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm init -y
    npm install hardhat @nomicfoundation/hardhat-toolbox ethers
fi

# Run deployment
echo "🚀 Starting deployment..."
node deploy-l2.js

# Update backend .env with new addresses
if [ -f "deployment-info-l2.json" ]; then
    echo "📝 Updating backend configuration..."
    TOKEN_ADDR=$(node -p "require('./deployment-info-l2.json').contracts.Token01A")
    STAKING_ADDR=$(node -p "require('./deployment-info-l2.json').contracts.ValidatorStaking")
    BRIDGE_ADDR=$(node -p "require('./deployment-info-l2.json').contracts.Bridge")
    TASK_ADDR=$(node -p "require('./deployment-info-l2.json').contracts.AITaskRegistry")
    
    cat > backend/.env << EOF
L2_RPC_URL=http://localhost:8545
L2_WS_URL=ws://localhost:8546
PORT=4000
TOKEN_CONTRACT_ADDRESS=$TOKEN_ADDR
STAKING_CONTRACT_ADDRESS=$STAKING_ADDR
BRIDGE_CONTRACT_ADDRESS=$BRIDGE_ADDR
TASK_CONTRACT_ADDRESS=$TASK_ADDR
EOF
    
    echo "✅ Backend configuration updated"
fi

echo ""
echo "🎉 Deployment complete!"
echo "====================="
echo "Your contracts are now deployed on your L2 network!"
echo "Start the backend with: ./start-l2-backend.sh"
