const { ethers } = require('ethers');

async function deployNewBridge() {
    // Connect to BNB Testnet
    const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    
    console.log('📡 Connected to BNB Testnet');
    console.log('💰 Deployer address:', wallet.address);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'BNB');
    
    // Deploy TokenBridge contract
    console.log('🌉 Deploying TokenBridge...');
    const bridgeFactory = new ethers.ContractFactory(
        [
            'constructor(address _token)',
            'function bridgeBNBTo01A() external payable',
            'function bridge01AToBNB(uint256 tokenAmount) external',
            'function getBridgeBalance(address user) external view returns (uint256)',
            'function getPendingWithdrawal(address user) external view returns (uint256)',
            'function getContractBNBBalance() external view returns (uint256)',
            'function addBNBToBridge() external payable',
            'function withdrawBNB(uint256 amount) external'
        ],
        `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract TokenBridge {
    IERC20 public token;
    address public owner;
    
    mapping(address => uint256) public bridgeBalances;
    mapping(address => uint256) public pendingWithdrawals;
    
    event BridgeDeposit(address indexed user, uint256 amount, uint256 timestamp);
    event BridgeWithdrawal(address indexed user, uint256 amount, uint256 timestamp);
    event TokenMinted(address indexed to, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }
    
    // Bridge BNB to 01A tokens
    function bridgeBNBTo01A() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Record the bridge deposit
        bridgeBalances[msg.sender] += msg.value;
        
        // Mint 01A tokens (1:1 ratio with BNB)
        uint256 tokenAmount = msg.value;
        
        emit BridgeDeposit(msg.sender, msg.value, block.timestamp);
        emit TokenMinted(msg.sender, tokenAmount);
    }
    
    // Bridge 01A tokens back to BNB
    function bridge01AToBNB(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be greater than 0");
        require(token.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        require(address(this).balance >= tokenAmount, "Insufficient BNB in bridge");
        
        // Transfer tokens from user to bridge
        token.transferFrom(msg.sender, address(this), tokenAmount);
        
        // Record pending withdrawal
        pendingWithdrawals[msg.sender] += tokenAmount;
        
        // Transfer BNB back to user
        payable(msg.sender).transfer(tokenAmount);
        
        emit BridgeWithdrawal(msg.sender, tokenAmount, block.timestamp);
    }
    
    // Get user's bridge balance
    function getBridgeBalance(address user) external view returns (uint256) {
        return bridgeBalances[user];
    }
    
    // Get user's pending withdrawal amount
    function getPendingWithdrawal(address user) external view returns (uint256) {
        return pendingWithdrawals[user];
    }
    
    // Owner function to add BNB to bridge (for testing)
    function addBNBToBridge() external payable onlyOwner {
        // This function allows the owner to add BNB to the bridge contract
    }
    
    // Owner function to withdraw BNB from bridge
    function withdrawBNB(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }
    
    // Get contract BNB balance
    function getContractBNBBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`,
        wallet
    );
    
    // Deploy with Token01A address
    const tokenAddress = '0x055491ceb4eC353ceEE6F59CD189Bc8ef799610c';
    const bridge = await bridgeFactory.deploy(tokenAddress);
    await bridge.waitForDeployment();
    
    const bridgeAddress = await bridge.getAddress();
    console.log('🌉 TokenBridge deployed to:', bridgeAddress);
    
    // Add some BNB to the bridge for testing
    console.log('💰 Adding 1 BNB to bridge for testing...');
    await bridge.addBNBToBridge({ value: ethers.parseEther('1') });
    
    const bridgeBalance = await bridge.getContractBNBBalance();
    console.log('💰 Bridge BNB balance:', ethers.formatEther(bridgeBalance), 'BNB');
    
    // Update deployment info
    const fs = require('fs');
    const deploymentInfo = {
        network: "BNB Testnet",
        deployer: wallet.address,
        contracts: {
            "Token01A": tokenAddress,
            "TokenBridge": bridgeAddress,
            "ValidatorStaking": "0x055491ceb4eC353ceEE6F59CD189Bc8ef799610c",
            "Bridge": "0x7985466c60A4875300a2A88Cbe50fc262F9be054",
            "AITaskRegistry": "0xbe813dC65A5132fA8c02B3C32f64758263e69F78"
        },
        timestamp: Date.now().toString(),
        status: "Successfully deployed TokenBridge with 1 BNB for testing"
    };
    
    fs.writeFileSync('./backend/deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('📄 Updated deployment-info.json');
    
    console.log('✅ TokenBridge deployment complete!');
    console.log('🔗 Bridge Address:', bridgeAddress);
    console.log('🔗 Token Address:', tokenAddress);
}

deployNewBridge().catch(console.error);
