#!/usr/bin/env node

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration
const L2_RPC_URL = process.env.L2_RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || '0x1234567890123456789012345678901234567890123456789012345678901234'; // Default for testing

async function deployAITaskRegistry() {
  console.log('🚀 Deploying AITaskRegistry contract...');
  
  try {
    // Connect to L2 network
    const provider = new ethers.JsonRpcProvider(L2_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log('📡 Connected to L2 network:', L2_RPC_URL);
    console.log('👤 Deployer address:', wallet.address);
    
    // Read contract bytecode and ABI
    const contractPath = path.join(__dirname, 'backend', 'contracts', 'AITaskRegistry.sol');
    const compiledPath = path.join(__dirname, 'backend', 'token-bridge', 'out', 'AITaskRegistry.sol', 'AITaskRegistry.json');
    
    if (!fs.existsSync(compiledPath)) {
      console.error('❌ Contract not compiled. Please run: cd backend/token-bridge && forge build');
      process.exit(1);
    }
    
    const compiled = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
    
    // Deploy contract
    console.log('📦 Deploying AITaskRegistry...');
    const factory = new ethers.ContractFactory(compiled.abi, compiled.bytecode.object, wallet);
    const contract = await factory.deploy();
    
    console.log('⏳ Waiting for deployment confirmation...');
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log('✅ AITaskRegistry deployed at:', contractAddress);
    
    // Save deployment info
    const deploymentInfo = {
      network: 'L2',
      contractName: 'AITaskRegistry',
      address: contractAddress,
      txHash: contract.deploymentTransaction().hash,
      blockNumber: await provider.getBlockNumber(),
      timestamp: Date.now(),
      deployer: wallet.address
    };
    
    const deploymentFile = path.join(__dirname, 'backend', 'deployment-info.json');
    let deployments = {};
    
    if (fs.existsSync(deploymentFile)) {
      deployments = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    }
    
    deployments.AITaskRegistry = deploymentInfo;
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));
    
    console.log('💾 Deployment info saved to:', deploymentFile);
    
    // Update environment file
    const envPath = path.join(__dirname, 'backend', '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add TASK_CONTRACT_ADDRESS
    if (envContent.includes('TASK_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /TASK_CONTRACT_ADDRESS=.*/,
        `TASK_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nTASK_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('🔧 Environment file updated');
    
    return contractAddress;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🎯 01A Network - AI Contract Deployment');
  console.log('=====================================');
  
  const address = await deployAITaskRegistry();
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log('📋 Next steps:');
  console.log('1. Update your frontend with the contract address');
  console.log('2. Set OPENAI_API_KEY in your environment');
  console.log('3. Start your backend server');
  console.log('4. Test AI task submission');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { deployAITaskRegistry };
