# 🚀 COMPLETE SETUP GUIDE - GET REAL DATA NOW!

Your frontend is **100% complete** and ready! Here's exactly how to get it working with REAL blockchain data.

---

## ⚡ FASTEST OPTION: Use BNB Chain Directly (5 minutes)

This is the quickest way to get **real blockchain data** right now without setting up your own blockchain.

### Step 1: Get a BscScan API Key (FREE)

1. Go to https://bscscan.com/apis
2. Click "Sign Up" (free account)
3. Create an API key
4. Copy your API key

### Step 2: Update Frontend

Create `/Users/dani/Desktop/01A/.env.local`:

```bash
# BscScan API
NEXT_PUBLIC_BSCSCAN_API_KEY=YOUR_API_KEY_HERE

# Use BNB Chain
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/
NEXT_PUBLIC_CHAIN_ID=56

# WalletConnect ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Step 3: Update API Client

The frontend is already set up! Just make sure your API URL points to a working backend.

### Step 4: Start Frontend

```bash
cd /Users/dani/Desktop/01A
npm run dev
```

**Done! Your site now shows real BNB Chain data!** 🎉

---

## 🏗️ OPTION 2: Run Your Own Local Blockchain (15 minutes)

Want to run your own blockchain locally? Here's how:

### Prerequisites

⚠️ **IMPORTANT**: Hardhat requires Node.js v22 LTS. You're currently on v23.

**Fix Node Version:**

```bash
# Option A: Use NVM (recommended)
nvm install 22
nvm use 22

# Option B: Download from nodejs.org
# Go to https://nodejs.org/ and install Node 22 LTS
```

### Once on Node 22:

```bash
# 1. Go to backend
cd /Users/dani/Desktop/01A/backend

# 2. Start local blockchain (Terminal 1)
npx hardhat node

# This will:
# - Start a local blockchain on http://127.0.0.1:8545
# - Give you 20 test accounts with 10,000 ETH each
# - Show real-time transaction logs
```

```bash
# 3. Deploy contracts (Terminal 2)
npm run deploy:local

# This will:
# - Deploy Bridge, Staking, and Task contracts
# - Create .env file with addresses
# - Show you all contract addresses
```

```bash
# 4. Start backend API (Terminal 3)
npm start

# Backend will run at:
# - API: http://localhost:4000/api
# - WebSocket: ws://localhost:4000
```

```bash
# 5. Update frontend .env.local
# Copy the contract addresses from deployment output

NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BRIDGE_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_STAKING_CONTRACT=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_TASK_CONTRACT=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

```bash
# 6. Start frontend (Terminal 4)
cd /Users/dani/Desktop/01A
npm run dev
```

**Your full blockchain is now running locally!** 🎉

---

## 🌐 OPTION 3: Deploy to BNB Testnet (30 minutes)

Want to deploy to a real testnet? Follow these steps:

### Step 1: Get Testnet BNB

1. Go to https://testnet.bnbchain.org/faucet-smart
2. Paste your wallet address
3. Click "Give me BNB"
4. Wait for testnet BNB (free!)

### Step 2: Configure Backend

```bash
cd /Users/dani/Desktop/01A/backend

# Create .env file
cp env.example .env

# Edit .env and add:
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
ADMIN_PRIVATE_KEY=your_private_key_here
PORT=4000
```

### Step 3: Deploy to Testnet

```bash
# Make sure you're on Node 22 LTS first!
npm run deploy:testnet

# Wait for deployment...
# Copy the contract addresses shown
```

### Step 4: Start Backend

```bash
npm start
```

### Step 5: Update Frontend

```bash
cd /Users/dani/Desktop/01A

# Update .env.local:
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_BRIDGE_CONTRACT=0x...  # From deployment
NEXT_PUBLIC_STAKING_CONTRACT=0x...
NEXT_PUBLIC_TASK_CONTRACT=0x...

# Start frontend
npm run dev
```

**You're now running on BNB Testnet!** 🎉

---

## 📋 What Each File Does

### Backend (`/backend/`)

- **`contracts/`** - Your smart contracts (Bridge, Staking, AI Tasks)
- **`server.js`** - REST API + WebSocket server
- **`scripts/deploy.js`** - Deploy contracts to any network
- **`hardhat.config.js`** - Blockchain configuration

### Frontend (`/01A/`)

- **`lib/api.ts`** - API client (already configured!)
- **`lib/wagmi-config.ts`** - Wallet configuration
- **All pages** - Already built and ready!

---

## 🎯 Testing Your Setup

### Test the Backend API

```bash
# Health check
curl http://localhost:4000/api/health

# Get blocks
curl http://localhost:4000/api/blocks

# Get network stats
curl http://localhost:4000/api/stats

# Get validators
curl http://localhost:4000/api/validators
```

### Test the Frontend

1. Open http://localhost:3000
2. Go to **Explorer** - should show real blocks
3. Click **Connect Wallet** - connect MetaMask
4. Go to **Bridge** - test bridging
5. Go to **Stake** - test staking UI
6. Go to **AI Tasks** - submit a test task

---

## 🔥 Quick Commands Reference

### Backend

```bash
# Start local blockchain
npm run node

# Deploy contracts locally
npm run deploy:local

# Deploy to testnet
npm run deploy:testnet

# Start API server
npm start

# Compile contracts
npm run compile
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🚨 Common Issues & Solutions

### "Module not found" errors in backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### "Hardhat network error"
- Make sure you're on Node 22 LTS: `node -v`
- Check that hardhat node is running: `npx hardhat node`

### "Cannot connect to API"
- Check backend is running: `curl http://localhost:4000/api/health`
- Check NEXT_PUBLIC_API_URL in `.env.local`

### "Wallet not connecting"
- Get a real WalletConnect project ID: https://cloud.walletconnect.com
- Update NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in `.env.local`

### "No data showing"
- Generate test transactions:
  ```bash
  npx hardhat console --network localhost
  > const [signer] = await ethers.getSigners()
  > await signer.sendTransaction({to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", value: ethers.parseEther("1")})
  ```

---

## 💡 Pro Tips

1. **Use Hardhat Console** for testing:
   ```bash
   npx hardhat console --network localhost
   ```

2. **Register a Test Validator**:
   ```javascript
   const staking = await ethers.getContractAt("ValidatorStaking", "0x...");
   await staking.registerValidator("My Validator", "subnet-1", 500, {value: ethers.parseEther("10000")});
   ```

3. **Watch Logs** for real-time updates:
   ```bash
   # Backend logs
   npm start

   # Frontend logs
   npm run dev
   ```

4. **Reset Everything**:
   ```bash
   # Backend
   cd backend
   npx hardhat clean
   rm -rf cache artifacts

   # Restart hardhat node
   npx hardhat node
   npm run deploy:local
   ```

---

## 🎉 Success Checklist

- [ ] Node 22 LTS installed (check: `node -v`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd .. && npm install`)
- [ ] Blockchain running (Hardhat node or testnet)
- [ ] Contracts deployed (you see contract addresses)
- [ ] Backend API running (http://localhost:4000/api/health works)
- [ ] Frontend .env.local configured
- [ ] Frontend running (http://localhost:3000)
- [ ] Wallet connects successfully
- [ ] Real data showing on Explorer page

---

## 🚀 Next Steps

Once everything is working:

1. **Deploy to Production**:
   - Deploy contracts to BNB Mainnet
   - Host backend on a server (AWS, DigitalOcean, etc.)
   - Deploy frontend to Vercel

2. **Add More Features**:
   - Real AI task processing
   - Subnet management
   - Token distribution
   - Governance

3. **Scale**:
   - Add database for faster queries
   - Implement caching
   - Add more RPC nodes
   - Setup load balancer

---

## 📚 Documentation

- **Backend API**: See `/backend/README.md`
- **Smart Contracts**: See `/backend/contracts/`
- **Frontend**: See `/README.md`
- **Full API Spec**: See `/BACKEND_API_SPEC.md`

---

## 💬 Need Help?

- Check the README files in each directory
- Look at the example code in `/backend/server.js`
- Read the API documentation in `/BACKEND_API_SPEC.md`
- Open an issue on GitHub

---

**You've got everything you need! Just pick an option above and start! 🚀**

Remember: **Option 1 (BscScan)** is fastest if you just want to see real data NOW.
**Option 2 (Local)** is best for development.
**Option 3 (Testnet)** is best for testing before mainnet.

