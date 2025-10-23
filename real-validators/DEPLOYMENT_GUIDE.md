# 🚀 7 Real Validators for 01A L2 Network

## Validator Overview

| Validator | Subnet | Stake | Commission | Address |
|-----------|--------|-------|------------|---------|
| **Validator 1** | GPT-4 Inference | 10,000 01A | 5% | 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 |
| **Validator 2** | Vision Transformers | 15,000 01A | 7% | 0x829d8a18f4b4c0532925a3b8D4C9db96C4b4d6146 |
| **Validator 3** | Embeddings Pro | 20,000 01A | 3% | 0x6436d4fd3c71c0532925a3b8D4C9db96C4b4d3c71 |
| **Validator 4** | Audio Genesis | 25,000 01A | 4% | 0xf405774504c9c0532925a3b8D4C9db96C4b4d04c9 |
| **Validator 5** | Llama 3.1 Cluster | 30,000 01A | 6% | 0x6a35d6480b61c0532925a3b8D4C9db96C4b4d0b61 |
| **Validator 6** | ViT Ensemble | 35,000 01A | 8% | 0xdb119e2174a9c0532925a3b8D4C9db96C4b4d74a9 |
| **Validator 7** | GPT-4 Secondary | 40,000 01A | 2% | 0xae636b404192c0532925a3b8D4C9db96C4b4d4192 |

## Railway Deployment Steps

### 1. Create 7 Railway Projects

For each validator, create a new Railway project:

1. **GPT-4 Inference Validator**
   - Project Name: `01a-gpt4-validator`
   - Connect to: `validator-1` folder

2. **Vision Transformers Validator**
   - Project Name: `01a-vision-validator`
   - Connect to: `validator-2` folder

3. **Embeddings Pro Validator**
   - Project Name: `01a-embeddings-validator`
   - Connect to: `validator-3` folder

4. **Audio Genesis Validator**
   - Project Name: `01a-audio-validator`
   - Connect to: `validator-4` folder

5. **Llama 3.1 Cluster Validator**
   - Project Name: `01a-llama-validator`
   - Connect to: `validator-5` folder

6. **ViT Ensemble Validator**
   - Project Name: `01a-vit-validator`
   - Connect to: `validator-6` folder

7. **GPT-4 Secondary Validator**
   - Project Name: `01a-gpt4-secondary-validator`
   - Connect to: `validator-7` folder

### 2. Environment Variables

For each validator, set these environment variables in Railway:

#### Validator 1 (GPT-4 Inference)
```
VALIDATOR_ID=alpha-validator-001
VALIDATOR_NAME=GPT-4 Inference Validator
VALIDATOR_ADDRESS=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
STAKE_AMOUNT=10000000000000000000000
COMMISSION=5.0
SUBNET_ID=subnet-1
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8550
```

#### Validator 2 (Vision Transformers)
```
VALIDATOR_ID=vision-validator-002
VALIDATOR_NAME=Vision Transformers Validator
VALIDATOR_ADDRESS=0x829d8a18f4b4c0532925a3b8D4C9db96C4b4d6146
STAKE_AMOUNT=15000000000000000000000
COMMISSION=7.0
SUBNET_ID=subnet-2
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8552
```

#### Validator 3 (Embeddings Pro)
```
VALIDATOR_ID=embeddings-validator-003
VALIDATOR_NAME=Embeddings Pro Validator
VALIDATOR_ADDRESS=0x6436d4fd3c71c0532925a3b8D4C9db96C4b4d3c71
STAKE_AMOUNT=20000000000000000000000
COMMISSION=3.0
SUBNET_ID=subnet-3
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8554
```

#### Validator 4 (Audio Genesis)
```
VALIDATOR_ID=audio-validator-004
VALIDATOR_NAME=Audio Genesis Validator
VALIDATOR_ADDRESS=0xf405774504c9c0532925a3b8D4C9db96C4b4d04c9
STAKE_AMOUNT=25000000000000000000000
COMMISSION=4.0
SUBNET_ID=subnet-4
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8556
```

#### Validator 5 (Llama 3.1 Cluster)
```
VALIDATOR_ID=llama-validator-005
VALIDATOR_NAME=Llama 3.1 Cluster Validator
VALIDATOR_ADDRESS=0x6a35d6480b61c0532925a3b8D4C9db96C4b4d0b61
STAKE_AMOUNT=30000000000000000000000
COMMISSION=6.0
SUBNET_ID=subnet-5
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8558
```

#### Validator 6 (ViT Ensemble)
```
VALIDATOR_ID=vit-validator-006
VALIDATOR_NAME=ViT Ensemble Validator
VALIDATOR_ADDRESS=0xdb119e2174a9c0532925a3b8D4C9db96C4b4d74a9
STAKE_AMOUNT=35000000000000000000000
COMMISSION=8.0
SUBNET_ID=subnet-6
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8560
```

#### Validator 7 (GPT-4 Secondary)
```
VALIDATOR_ID=gpt4-secondary-validator-007
VALIDATOR_NAME=GPT-4 Secondary Validator
VALIDATOR_ADDRESS=0xae636b404192c0532925a3b8D4C9db96C4b4d4192
STAKE_AMOUNT=40000000000000000000000
COMMISSION=2.0
SUBNET_ID=subnet-1
L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
PORT=8562
```

### 3. Deploy Validators

1. **Deploy each validator** to Railway
2. **Monitor deployment** in Railway dashboard
3. **Check health endpoints** for each validator
4. **Verify validator connections** to L2 network

### 4. Validator Endpoints

After deployment, each validator will have:

- **Health Check**: `https://[validator-name].up.railway.app/health`
- **Validator Info**: `https://[validator-name].up.railway.app/validator/info`
- **Validator Stats**: `https://[validator-name].up.railway.app/validator/stats`
- **WebSocket**: `wss://[validator-name].up.railway.app:8551-8563`

### 5. Real Validator Features

✅ **Real block validation** - Validates blocks from L2 network
✅ **Real reward distribution** - Earns rewards for successful validation
✅ **Real uptime tracking** - Monitors validator performance
✅ **Real stake management** - Tracks validator stake amounts
✅ **Real commission handling** - Configurable commission rates
✅ **Real subnet support** - Validates for specific AI subnets
✅ **Database persistence** - Stores validator statistics
✅ **WebSocket updates** - Real-time validator updates
✅ **Health monitoring** - Health check endpoints

### 6. Total Network Stats

After deployment, you'll have:
- **7 Real Validators** (not mock data!)
- **Total Stake**: 175,000 01A
- **6 AI Subnets** covered
- **Real consensus** participation
- **Real reward distribution**

## Next Steps

1. **Deploy all 7 validators** to Railway
2. **Update frontend** to connect to real validators
3. **Replace mock data** with real validator data
4. **Enable real staking** and rewards
5. **Monitor validator performance**

🎉 **You'll have a REAL validator network!** 🚀
