# 01A LABS L2 Network

A complete Layer-2 blockchain network built from scratch.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    01A LABS L2 Network                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   L2 Node   │  │   L2 RPC    │  │   L2 Explorer       │  │
│  │             │  │             │  │                     │  │
│  │ • Consensus │  │ • JSON-RPC  │  │ • Block Explorer    │  │
│  │ • Block Prod│  │ • WebSocket │  │ • Transaction View  │  │
│  │ • State Mgmt│  │ • REST API  │  │ • Address Lookup    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Bridge    │  │  Validators  │  │   01A Token        │  │
│  │             │  │             │  │                     │  │
│  │ • L1 ↔ L2   │  │ • PoS       │  │ • Native Token      │  │
│  │ • Deposits  │  │ • Staking   │  │ • Gas Fees          │  │
│  │ • Withdraws │  │ • Rewards   │  │ • Governance        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Start the entire L2 network:
```bash
./start-l2.sh
```

### Or start components individually:

#### 1. L2 Node (Core Blockchain)
```bash
cd l2-node
npm install
node index.js
```
- **Port**: 8545
- **WebSocket**: 8546
- **Features**: Block production, consensus, state management

#### 2. L2 RPC Server
```bash
cd l2-rpc
npm install
node index.js
```
- **Port**: 8547
- **Features**: JSON-RPC API, WebSocket support

#### 3. L2 Explorer
```bash
cd l2-explorer
npm install
node index.js
```
- **Port**: 3001
- **Features**: Block explorer, transaction viewer

## 🌐 Network Details

- **Chain ID**: 26 (0x01A)
- **Block Time**: 3 seconds
- **Consensus**: Proof of Stake
- **Native Token**: 01A
- **Gas Limit**: 30M per block
- **Gas Price**: 1 gwei

## 📡 API Endpoints

### L2 Node (Port 8545)
- `POST /rpc` - JSON-RPC endpoint
- `GET /api/block/:number` - Get block by number
- `GET /api/transaction/:hash` - Get transaction by hash
- `GET /api/account/:address` - Get account balance
- `GET /api/network` - Network information

### L2 RPC (Port 8547)
- `POST /rpc` - Main RPC endpoint
- `GET /health` - Health check
- `GET /api/network` - Network info

### L2 Explorer (Port 3001)
- `GET /` - Home page
- `GET /block/:number` - Block details
- `GET /tx/:hash` - Transaction details
- `GET /address/:address` - Address details

## 🔧 Configuration

### Environment Variables
```bash
# L2 Node
PORT=8545
L2_NODE_URL=http://localhost:8545

# L2 RPC
RPC_PORT=8547
L2_NODE_URL=http://localhost:8545

# L2 Explorer
EXPLORER_PORT=3001
L2_RPC_URL=http://localhost:8547
```

## 🧪 Testing

### Connect with MetaMask:
1. Add custom network:
   - **Network Name**: 01A LABS L2
   - **RPC URL**: http://localhost:8547/rpc
   - **Chain ID**: 26
   - **Currency Symbol**: 01A

### Send a transaction:
```javascript
// Using ethers.js
const provider = new ethers.JsonRpcProvider('http://localhost:8547/rpc');
const wallet = new ethers.Wallet('your-private-key', provider);

const tx = await wallet.sendTransaction({
  to: '0x...',
  value: ethers.parseEther('1.0')
});
```

## 🔍 Explorer Features

- **Real-time block updates**
- **Transaction tracking**
- **Address balance lookup**
- **Network statistics**
- **WebSocket support**

## 🏗️ Development

### Adding new features:
1. **Consensus**: Modify `l2-node/index.js`
2. **RPC Methods**: Add to `l2-rpc/index.js`
3. **Explorer UI**: Update `l2-explorer/views/`

### Customizing:
- **Block time**: Change `this.blockTime` in L2 node
- **Gas limits**: Modify gas settings
- **Consensus**: Implement custom consensus algorithm
- **Validators**: Add/remove validators

## 📊 Monitoring

### Health Checks:
- L2 Node: `http://localhost:8545/api/network`
- L2 RPC: `http://localhost:8547/health`
- Explorer: `http://localhost:3001`

### WebSocket Events:
```javascript
const ws = new WebSocket('ws://localhost:8546');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'newBlock') {
    console.log('New block:', data.block);
  }
};
```

## 🚀 Production Deployment

### Requirements:
- **Node.js**: 18+
- **Memory**: 4GB+ RAM
- **Storage**: 100GB+ SSD
- **Network**: Stable internet connection

### Deployment:
1. **Docker**: Create Docker containers
2. **Kubernetes**: Deploy on K8s cluster
3. **Cloud**: Use AWS/GCP/Azure
4. **VPS**: Deploy on dedicated server

## 🔐 Security

- **Validator keys**: Store securely
- **RPC endpoints**: Use HTTPS in production
- **Rate limiting**: Implement rate limiting
- **Monitoring**: Set up alerts and monitoring

## 📈 Performance

- **Block time**: 3 seconds
- **TPS**: ~1000 transactions/second
- **Finality**: 1 block (3 seconds)
- **Gas efficiency**: Optimized for AI workloads

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ by 01A LABS**
