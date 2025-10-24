const { ethers } = require('ethers');

async function testBridge() {
    // Connect to BNB Testnet
    const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    
    console.log('📡 Connected to BNB Testnet');
    console.log('💰 Deployer address:', wallet.address);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'BNB');
    
    // Test the bridge contract
    const bridgeAddress = '0x7985466c60A4875300a2A88Cbe50fc262F9be054';
    const bridgeContract = new ethers.Contract(
        bridgeAddress,
        [
            'function deposit() external payable',
            'function getBalance(address user) external view returns (uint256)',
            'function withdraw(uint256 amount) external'
        ],
        wallet
    );
    
    console.log('🌉 Testing bridge contract at:', bridgeAddress);
    
    try {
        // Test deposit
        console.log('💰 Testing deposit of 0.01 BNB...');
        const depositTx = await bridgeContract.deposit({
            value: ethers.parseEther('0.01')
        });
        await depositTx.wait();
        console.log('✅ Deposit successful!');
        
        // Check balance
        const bridgeBalance = await bridgeContract.getBalance(wallet.address);
        console.log('💰 Bridge balance:', ethers.formatEther(bridgeBalance), 'BNB');
        
    } catch (error) {
        console.error('❌ Bridge test failed:', error.message);
    }
}

testBridge().catch(console.error);
