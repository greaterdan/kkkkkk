const { ethers } = require('ethers');

async function deployTokenBridge() {
    // Connect to BNB Testnet
    const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    
    console.log('📡 Connected to BNB Testnet');
    console.log('💰 Deployer address:', wallet.address);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'BNB');
    
    // Deploy Token01A
    console.log('🪙 Deploying Token01A...');
    const tokenFactory = new ethers.ContractFactory(
        [
            'constructor()',
            'function setBridge(address _bridge) external',
            'function mint(address to, uint256 amount) external',
            'function transfer(address to, uint256 value) public returns (bool)',
            'function approve(address spender, uint256 value) public returns (bool)',
            'function transferFrom(address from, address to, uint256 value) public returns (bool)',
            'function balanceOf(address account) public view returns (uint256)',
            'function name() public view returns (string)',
            'function symbol() public view returns (string)',
            'function decimals() public view returns (uint8)',
            'function totalSupply() public view returns (uint256)'
        ],
        `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Token01A {
    string public name = "01A Token";
    string public symbol = "01A";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public owner;
    address public bridge;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function setBridge(address _bridge) external {
        require(msg.sender == owner, "Only owner can set bridge");
        bridge = _bridge;
    }
    
    function mint(address to, uint256 amount) external {
        require(msg.sender == bridge, "Only bridge can mint");
        require(to != address(0), "Cannot mint to zero address");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}`,
        wallet
    );
    
    const token = await tokenFactory.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log('✅ Token01A deployed at:', tokenAddress);
    
    // Deploy TokenBridge
    console.log('🌉 Deploying TokenBridge...');
    const bridgeFactory = new ethers.ContractFactory(
        [
            'constructor(address _token01A)',
            'function bridgeBNBTo01A() external payable',
            'function bridge01AToBNB(uint256 tokenAmount) external',
            'function get01ABalance(address user) external view returns (uint256)',
            'function getBridgeBNBBalance() external view returns (uint256)',
            'function withdrawBNB() external'
        ],
        `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TokenBridge {
    address public token01A;
    address public owner;
    
    uint256 public constant BNB_TO_01A_RATE = 1000;
    
    event BridgeDeposit(address indexed user, uint256 bnbAmount, uint256 tokenAmount, uint256 timestamp);
    event BridgeWithdraw(address indexed user, uint256 tokenAmount, uint256 bnbAmount, uint256 timestamp);
    
    constructor(address _token01A) {
        token01A = _token01A;
        owner = msg.sender;
    }
    
    function bridgeBNBTo01A() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        uint256 tokenAmount = msg.value * BNB_TO_01A_RATE;
        
        // Call mint function on token contract
        (bool success,) = token01A.call(abi.encodeWithSignature("mint(address,uint256)", msg.sender, tokenAmount));
        require(success, "Token mint failed");
        
        emit BridgeDeposit(msg.sender, msg.value, tokenAmount, block.timestamp);
    }
    
    function bridge01AToBNB(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        
        uint256 bnbAmount = tokenAmount / BNB_TO_01A_RATE;
        
        require(address(this).balance >= bnbAmount, "Insufficient BNB in bridge");
        
        // Transfer tokens from user to bridge
        (bool success,) = token01A.call(abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), tokenAmount));
        require(success, "Token transfer failed");
        
        payable(msg.sender).transfer(bnbAmount);
        
        emit BridgeWithdraw(msg.sender, tokenAmount, bnbAmount, block.timestamp);
    }
    
    function get01ABalance(address user) external view returns (uint256) {
        (bool success, bytes memory data) = token01A.staticcall(abi.encodeWithSignature("balanceOf(address)", user));
        require(success, "Balance query failed");
        return abi.decode(data, (uint256));
    }
    
    function getBridgeBNBBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function withdrawBNB() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {}
}`,
        wallet
    );
    
    const bridge = await bridgeFactory.deploy(tokenAddress);
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log('✅ TokenBridge deployed at:', bridgeAddress);
    
    // Set bridge address in token
    console.log('🔗 Setting bridge in Token01A...');
    const setBridgeTx = await token.setBridge(bridgeAddress);
    await setBridgeTx.wait();
    console.log('✅ Bridge set in Token01A');
    
    // Fund bridge with some BNB for testing
    console.log('💰 Funding bridge with 10 BNB...');
    const fundTx = await wallet.sendTransaction({
        to: bridgeAddress,
        value: ethers.parseEther('10')
    });
    await fundTx.wait();
    console.log('✅ Bridge funded with 10 BNB');
    
    console.log('\n🎉 Token Bridge deployed successfully!');
    console.log('--------------------------------------------------');
    console.log('TOKEN_CONTRACT_ADDRESS=' + tokenAddress);
    console.log('BRIDGE_CONTRACT_ADDRESS=' + bridgeAddress);
    console.log('BRIDGE_BNB_BALANCE=10.0 BNB');
    console.log('EXCHANGE_RATE=1 BNB = 1000 01A');
    console.log('--------------------------------------------------');
}

deployTokenBridge().catch(console.error);
