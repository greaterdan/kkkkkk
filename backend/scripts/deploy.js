const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to", hre.network.name);
  console.log("================================================\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy Bridge
  console.log("📦 Deploying Bridge contract...");
  const Bridge = await hre.ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy();
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();
  console.log("✅ Bridge deployed to:", bridgeAddress, "\n");

  // Deploy ValidatorStaking
  console.log("📦 Deploying ValidatorStaking contract...");
  const ValidatorStaking = await hre.ethers.getContractFactory("ValidatorStaking");
  const staking = await ValidatorStaking.deploy();
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ ValidatorStaking deployed to:", stakingAddress, "\n");

  // Deploy AITaskRegistry
  console.log("📦 Deploying AITaskRegistry contract...");
  const AITaskRegistry = await hre.ethers.getContractFactory("AITaskRegistry");
  const taskRegistry = await AITaskRegistry.deploy();
  await taskRegistry.waitForDeployment();
  const taskAddress = await taskRegistry.getAddress();
  console.log("✅ AITaskRegistry deployed to:", taskAddress, "\n");

  // Save deployment info
  const deployment = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString(),
    contracts: {
      Bridge: bridgeAddress,
      ValidatorStaking: stakingAddress,
      AITaskRegistry: taskAddress
    },
    deployer: deployer.address
  };

  const deploymentPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log("💾 Deployment info saved to:", deploymentPath);

  // Create .env file with addresses
  const envContent = `# Generated on ${new Date().toISOString()}
RPC_URL=http://127.0.0.1:8545
BRIDGE_CONTRACT_ADDRESS=${bridgeAddress}
STAKING_CONTRACT_ADDRESS=${stakingAddress}
TASK_CONTRACT_ADDRESS=${taskAddress}
PORT=4000
`;

  fs.writeFileSync(path.join(__dirname, "../.env"), envContent);
  console.log("✅ .env file created with contract addresses\n");

  console.log("================================================");
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("================================================\n");
  console.log("📝 Contract Addresses:");
  console.log("   Bridge:            ", bridgeAddress);
  console.log("   ValidatorStaking:  ", stakingAddress);
  console.log("   AITaskRegistry:    ", taskAddress);
  console.log("\n💡 Next steps:");
  console.log("   1. Start backend: npm start");
  console.log("   2. Update frontend .env.local with these addresses");
  console.log("   3. Connect your frontend to http://localhost:4000/api");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

