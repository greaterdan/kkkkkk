# 01A Network Backend

Complete backend infrastructure for the 01A Network blockchain explorer and API.

## 🚀 Quick Start

### Option 1: Use Local Blockchain (Fastest for Development)

```bash
# Terminal 1: Start local Hardhat blockchain node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local

# Terminal 3: Start backend API
npm start
```

Your blockchain and API will be running! 🎉
- **Blockchain RPC**: http://127.0.0.1:8545
- **Backend API**: http://localhost:4000/api
- **WebSocket**: ws://localhost:4000

### Option 2: Use BNB Testnet

```bash
# 1. Get testnet BNB from https://testnet.binance.org/faucet-smart

# 2. Create .env file
cp env.example .env

# 3. Add your private key to .env
ADMIN_PRIVATE_KEY=your_private_key_here

# 4. Deploy to testnet
npm run deploy:testnet

# 5. Start backend
npm start
```

---

## 📦 What's Included

### Smart Contracts

1. **Bridge.sol** - Cross-chain bridge for BNB ↔ 01A transfers
2. **ValidatorStaking.sol** - Validator registration and staking
3. **AITaskRegistry.sol** - AI task submission and management

### Backend API

Complete REST API with:
- Block explorer endpoints
- Transaction tracking
- Validator management
- Network statistics
- Search functionality
- WebSocket for real-time updates

---

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your settings
```

---

## 📝 Commands

### Blockchain Management

```bash
# Start local blockchain node
npm run node

# Compile contracts
npm compile

# Clean artifacts
npm run clean

# Run tests
npm test
```

### Deployment

```bash
# Deploy to local network
npm run deploy:local

# Deploy to BNB Testnet
npm run deploy:testnet

# Deploy to BNB Mainnet (BE CAREFUL!)
npm run deploy:mainnet
```

### Server

```bash
# Start API server
npm start

# Start with auto-reload (requires nodemon)
npm run dev
```

---

## 🌐 API Endpoints

### Blocks

```
GET /api/blocks?page=1&limit=20
GET /api/blocks/:blockNumber
GET /api/blocks/hash/:hash
```

### Transactions

```
GET /api/transactions?page=1&limit=30
GET /api/transactions/:hash
```

### Validators

```
GET /api/validators
GET /api/validators/:address
```

### Network Stats

```
GET /api/stats
GET /api/stats/chart/:type?days=30
```

### Search

```
GET /api/search?q=0x...
```

### Health

```
GET /api/health
```

---

## 🔗 WebSocket Events

Connect to `ws://localhost:4000`

### Subscribe to Events

```javascript
const ws = new WebSocket('ws://localhost:4000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'new_block') {
    console.log('New block:', data.payload);
  }
};

// Subscribe
ws.send(JSON.stringify({ 
  type: 'subscribe', 
  event: 'new_block' 
}));
```

### Available Events

- `new_block` - New block mined
- `new_transaction` - New transaction
- `stats_update` - Network stats update

---

## 📊 Contract Interaction Examples

### Deploy a Validator

```javascript
const { ethers } = require('ethers');

// Connect to network
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Connect to staking contract
const staking = new ethers.Contract(
  STAKING_ADDRESS,
  STAKING_ABI,
  signer
);

// Register as validator
const tx = await staking.registerValidator(
  "My Validator",
  "subnet-1",
  500, // 5% commission
  { value: ethers.parseEther("10000") } // 10,000 01A
);

await tx.wait();
console.log('Validator registered!');
```

### Submit AI Task

```javascript
const task = await taskRegistry.submitTask(
  0, // TaskType.LLM
  "Generate a story about AI",
  "subnet-1",
  { value: ethers.parseEther("0.002") }
);

await task.wait();
console.log('Task submitted!');
```

---

## 🔑 Environment Variables

```bash
# Blockchain RPC
RPC_URL=http://127.0.0.1:8545

# Contract Addresses (auto-populated after deployment)
BRIDGE_CONTRACT_ADDRESS=
STAKING_CONTRACT_ADDRESS=
TASK_CONTRACT_ADDRESS=

# Server Configuration
PORT=4000

# Optional: For deployment
ADMIN_PRIVATE_KEY=
```

---

## 🗂️ Project Structure

```
backend/
├── contracts/              # Solidity smart contracts
│   ├── Bridge.sol
│   ├── ValidatorStaking.sol
│   └── AITaskRegistry.sol
├── scripts/                # Deployment scripts
│   └── deploy.js
├── server.js              # Express API server
├── hardhat.config.js      # Hardhat configuration
├── package.json
└── README.md
```

---

## 🧪 Testing

### Test on Local Network

```bash
# Terminal 1: Start node
npm run node

# Terminal 2: Deploy
npm run deploy:local

# Terminal 3: Test API
curl http://localhost:4000/api/health
curl http://localhost:4000/api/blocks
curl http://localhost:4000/api/stats
```

### Using with Frontend

1. Start backend: `npm start`
2. Note the contract addresses from deployment
3. Update frontend `/Users/dani/Desktop/01A/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BRIDGE_CONTRACT=0x...
NEXT_PUBLIC_STAKING_CONTRACT=0x...
NEXT_PUBLIC_TASK_CONTRACT=0x...
```

4. Restart frontend: `npm run dev`

---

## 🚨 Troubleshooting

### "Contract not initialized"
- Make sure you've run `npm run deploy:local`
- Check that .env has contract addresses

### "Cannot connect to blockchain"
- Ensure Hardhat node is running: `npm run node`
- Check RPC_URL in .env

### "No transactions showing"
- Generate some activity:
  ```bash
  # Send a test transaction
  npx hardhat console --network localhost
  > const [signer] = await ethers.getSigners()
  > await signer.sendTransaction({to: "0x...", value: ethers.parseEther("1")})
  ```

---

## 🎯 Production Deployment

### Using Your Own L2

1. **Setup L2 Node**:
   - Use Polygon CDK, OP Stack, or custom Geth fork
   - Configure chain ID and consensus

2. **Deploy Contracts**:
   ```bash
   # Update hardhat.config.js with your network
   networks: {
     myL2: {
       url: "https://rpc.my-l2.com",
       chainId: 56001,
       accounts: [process.env.ADMIN_PRIVATE_KEY]
     }
   }
   
   # Deploy
   npx hardhat run scripts/deploy.js --network myL2
   ```

3. **Configure Backend**:
   ```bash
   RPC_URL=https://rpc.my-l2.com
   # Add contract addresses from deployment
   ```

4. **Deploy Backend**:
   ```bash
   # On your server
   git clone https://github.com/your-org/01A
   cd 01A/backend
   npm install
   npm start
   
   # Or use PM2 for production
   npm install -g pm2
   pm2 start server.js --name "01a-backend"
   ```

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Express.js Documentation](https://expressjs.com/)
- [BNB Chain Documentation](https://docs.bnbchain.org/)

---

## 🤝 Support

For issues or questions:
- Open an issue on GitHub
- Email: dev@01a.network
- Discord: [Join our community](#)

---

**Built with ❤️ by the 01A Network Team**

