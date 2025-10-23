import fs from 'fs';

console.log('🚀 Creating mock deployment for testing...');

// Mock contract addresses (these would be real after deployment)
const mockDeployment = {
  network: 'BNB Testnet',
  rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  chainId: 97,
  deployer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Mock address
  contracts: {
    ValidatorStaking: '0x1234567890123456789012345678901234567890', // Mock address
    Bridge: '0x2345678901234567890123456789012345678901', // Mock address
    AITaskRegistry: '0x3456789012345678901234567890123456789012' // Mock address
  },
  timestamp: new Date().toISOString()
};

// Save deployment info
fs.writeFileSync('deployment-info.json', JSON.stringify(mockDeployment, null, 2));
console.log('📄 Mock deployment info saved to deployment-info.json');

// Create .env with mock addresses
const envContent = `RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
STAKING_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
BRIDGE_CONTRACT_ADDRESS=0x2345678901234567890123456789012345678901
TASK_CONTRACT_ADDRESS=0x3456789012345678901234567890123456789012
PORT=4000
ADMIN_PRIVATE_KEY=your_private_key_here`;

fs.writeFileSync('.env', envContent);
console.log('📄 Updated .env with mock contract addresses');

console.log('\n✅ Mock deployment complete!');
console.log('🔧 To deploy real contracts:');
console.log('1. Get BNB Testnet BNB from faucet');
console.log('2. Add your private key to .env');
console.log('3. Run: npx hardhat run scripts/deploy.js --network bnbTestnet');
console.log('\n📡 For now, using mock addresses for testing...');
