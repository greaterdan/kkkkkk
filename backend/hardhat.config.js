import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local Hardhat network
    hardhat: {
      chainId: 31337
    },
    // Localhost (when running hardhat node)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    // BNB Testnet
    bnbTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      gasPrice: 10000000000 // 10 gwei
    },
    // BNB Mainnet
    bnbMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      gasPrice: 5000000000 // 5 gwei
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

