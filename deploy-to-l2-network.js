const { ethers } = require('ethers');

async function deployToL2Network() {
    console.log('🚀 Deploying 01A Token to L2 Network...');
    
    // Connect to L2 network
    const provider = new ethers.JsonRpcProvider('http://localhost:8545/rpc');
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    
    console.log('📡 Connected to L2 Network');
    console.log('💰 Deployer address:', wallet.address);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
    
    // Deploy Token01A to L2
    console.log('🪙 Deploying Token01A to L2...');
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
    console.log('✅ Token01A deployed to L2 at:', tokenAddress);
    
    // Deploy Cross-Chain Bridge to L2
    console.log('🌉 Deploying Cross-Chain Bridge to L2...');
    const bridgeFactory = new ethers.ContractFactory(
        [
            'constructor(address _token01A, address _bnbTokenAddress)',
            'function bridgeFromBNB(address user, uint256 amount) external',
            'function bridgeToBNB(uint256 tokenAmount) external',
            'function get01ABalance(address user) external view returns (uint256)',
            'function getBridgeBalance() external view returns (uint256)'
        ],
        `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CrossChainBridge {
    address public token01A;
    address public bnbTokenAddress;
    address public owner;
    
    // Bridge rates (1 BNB = 1000 01A)
    uint256 public constant BNB_TO_01A_RATE = 1000;
    
    event BridgeFromBNB(address indexed user, uint256 bnbAmount, uint256 tokenAmount, uint256 timestamp);
    event BridgeToBNB(address indexed user, uint256 tokenAmount, uint256 bnbAmount, uint256 timestamp);
    
    constructor(address _token01A, address _bnbTokenAddress) {
        token01A = _token01A;
        bnbTokenAddress = _bnbTokenAddress;
        owner = msg.sender;
    }
    
    // Bridge from BNB Testnet to L2 (mint 01A tokens)
    function bridgeFromBNB(address user, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Calculate 01A tokens to mint
        uint256 tokenAmount = amount * BNB_TO_01A_RATE;
        
        // Mint 01A tokens to user
        (bool success,) = token01A.call(abi.encodeWithSignature("mint(address,uint256)", user, tokenAmount));
        require(success, "Token mint failed");
        
        emit BridgeFromBNB(user, amount, tokenAmount, block.timestamp);
    }
    
    // Bridge from L2 to BNB Testnet (burn 01A tokens)
    function bridgeToBNB(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        
        // Calculate BNB to return
        uint256 bnbAmount = tokenAmount / BNB_TO_01A_RATE;
        
        // Check user has enough 01A tokens
        (bool success, bytes memory data) = token01A.staticcall(abi.encodeWithSignature("balanceOf(address)", msg.sender));
        require(success, "Balance query failed");
        uint256 userBalance = abi.decode(data, (uint256));
        require(userBalance >= tokenAmount, "Insufficient 01A tokens");
        
        // Transfer tokens from user to bridge (burn them)
        (bool transferSuccess,) = token01A.call(abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), tokenAmount));
        require(transferSuccess, "Token transfer failed");
        
        emit BridgeToBNB(msg.sender, tokenAmount, bnbAmount, block.timestamp);
    }
    
    function get01ABalance(address user) external view returns (uint256) {
        (bool success, bytes memory data) = token01A.staticcall(abi.encodeWithSignature("balanceOf(address)", user));
        require(success, "Balance query failed");
        return abi.decode(data, (uint256));
    }
    
    function getBridgeBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`,
        wallet
    );
    
    const bridge = await bridgeFactory.deploy(tokenAddress, '0x28EBd5A87ABA39F5f0D30b0843EaaaF890a785eb'); // BNB Testnet token address
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log('✅ Cross-Chain Bridge deployed to L2 at:', bridgeAddress);
    
    // Set bridge address in token
    console.log('🔗 Setting bridge in Token01A...');
    const setBridgeTx = await token.setBridge(bridgeAddress);
    await setBridgeTx.wait();
    console.log('✅ Bridge set in Token01A');
    
    console.log('\n🎉 L2 Network Token Bridge deployed successfully!');
    console.log('--------------------------------------------------');
    console.log('L2_TOKEN_CONTRACT_ADDRESS=' + tokenAddress);
    console.log('L2_BRIDGE_CONTRACT_ADDRESS=' + bridgeAddress);
    console.log('BNB_TOKEN_ADDRESS=0x28EBd5A87ABA39F5f0D30b0843EaaaF890a785eb');
    console.log('EXCHANGE_RATE=1 BNB = 1000 01A');
    console.log('--------------------------------------------------');
}

deployToL2Network().catch(console.error);
