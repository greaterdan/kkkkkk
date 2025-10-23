# 01A Network Backend

## Deployed Contracts (BNB Testnet)

- **01A Token**: `0x055491ceb4eC353ceEE6F59CD189Bc8ef799610c` (1 Billion Supply)
- **Validator Staking**: `0x7985466c60A4875300a2A88Cbe50fc262F9be054`
- **Bridge**: `0xbe813dC65A5132fA8c02B3C32f64758263e69F78`
- **AI Task Registry**: `0xbe813dC65A5132fA8c02B3C32f64758263e69F78`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in `.env`:
```
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
TOKEN_CONTRACT_ADDRESS=0x055491ceb4eC353ceEE6F59CD189Bc8ef799610c
STAKING_CONTRACT_ADDRESS=0x7985466c60A4875300a2A88Cbe50fc262F9be054
BRIDGE_CONTRACT_ADDRESS=0xbe813dC65A5132fA8c02B3C32f64758263e69F78
TASK_CONTRACT_ADDRESS=0xbe813dC65A5132fA8c02B3C32f64758263e69F78
PORT=4000
ADMIN_PRIVATE_KEY=your_private_key
OPENAI_API_KEY=your_openai_key
```

3. Start the server:
```bash
node server.js
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/token` - 01A Token information
- `GET /api/stats` - Network statistics
- `GET /api/validators` - Validator information
- `GET /api/blocks` - Latest blocks
- `GET /api/transactions` - Latest transactions
- `POST /api/ai/submit-task` - Submit AI task

## Deployment

Contracts are deployed using Foundry. To redeploy:

```bash
forge script script/DeployBillionToken.s.sol --rpc-url bnb_testnet --broadcast
```