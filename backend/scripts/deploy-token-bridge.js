const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Token Bridge to BNB Testnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📡 Deploying contracts with account:", deployer.address);
  
  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "BNB");
  
  // Deploy Token01A
  console.log("🪙 Deploying Token01A...");
  const Token01A = await ethers.getContractFactory("Token01A");
  const token = await Token01A.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token01A deployed at:", tokenAddress);
  
  // Deploy TokenBridge
  console.log("🌉 Deploying TokenBridge...");
  const TokenBridge = await ethers.getContractFactory("TokenBridge");
  const bridge = await TokenBridge.deploy(tokenAddress);
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();
  console.log("✅ TokenBridge deployed at:", bridgeAddress);
  
  // Set bridge address in token
  console.log("🔗 Setting bridge in Token01A...");
  const setBridgeTx = await token.setBridge(bridgeAddress);
  await setBridgeTx.wait();
  console.log("✅ Bridge set in Token01A");
  
  // Fund bridge with some BNB for testing
  console.log("💰 Funding bridge with 10 BNB...");
  const fundTx = await deployer.sendTransaction({
    to: bridgeAddress,
    value: ethers.parseEther("10")
  });
  await fundTx.wait();
  console.log("✅ Bridge funded with 10 BNB");
  
  console.log("\n🎉 Token Bridge deployed successfully!");
  console.log("--------------------------------------------------");
  console.log("TOKEN_CONTRACT_ADDRESS=" + tokenAddress);
  console.log("BRIDGE_CONTRACT_ADDRESS=" + bridgeAddress);
  console.log("BRIDGE_BNB_BALANCE=10.0 BNB");
  console.log("EXCHANGE_RATE=1 BNB = 1000 01A");
  console.log("--------------------------------------------------");
  
  // Save deployment info
  const deploymentInfo = {
    network: "BNB Testnet",
    deployer: deployer.address,
    contracts: {
      Token01A: tokenAddress,
      TokenBridge: bridgeAddress
    },
    timestamp: Math.floor(Date.now() / 1000),
    status: "Successfully deployed with 1 Billion 01A Token and Bridge"
  };
  
  const fs = require('fs');
  fs.writeFileSync('./deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
