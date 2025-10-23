# 01A L2 Network Validator

This is a real validator node for the 01A L2 Network that can be deployed on Railway.

## Features

- ✅ **Real validator logic** - Validates blocks from the L2 network
- ✅ **Stake tracking** - Tracks validator stake and rewards
- ✅ **Uptime monitoring** - Monitors validator performance
- ✅ **Commission handling** - Configurable commission rates
- ✅ **Subnet support** - Validates for specific subnets
- ✅ **Database persistence** - Stores validator statistics
- ✅ **WebSocket updates** - Real-time validator updates
- ✅ **Health monitoring** - Health check endpoints

## Deployment on Railway

1. **Create new Railway project** for validator
2. **Connect to GitHub** repository
3. **Set environment variables**:
   ```
   VALIDATOR_ID=validator_001
   VALIDATOR_ADDRESS=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
   STAKE_AMOUNT=10000000000000000000000
   COMMISSION=5.0
   SUBNET_ID=subnet-1
   L2_RPC_URL=https://l2-rpc-production.up.railway.app/rpc
   ```
4. **Deploy** - Railway will automatically deploy the validator

## Validator Endpoints

- `GET /validator/info` - Validator information
- `GET /validator/stats` - Validator statistics
- `GET /health` - Health check
- `WebSocket :8549` - Real-time updates

## Multiple Validators

To create multiple validators:

1. **Deploy multiple instances** with different environment variables
2. **Use different VALIDATOR_ID** for each validator
3. **Use different VALIDATOR_ADDRESS** for each validator
4. **Configure different SUBNET_ID** for subnet-specific validators

## Example Validators

- **Validator 1**: subnet-1, 5% commission, 10,000 01A stake
- **Validator 2**: subnet-2, 7% commission, 15,000 01A stake  
- **Validator 3**: subnet-3, 3% commission, 20,000 01A stake

## Real Validator Features

- **Block Validation**: Validates blocks from L2 network
- **Reward Distribution**: Earns rewards for successful validation
- **Uptime Tracking**: Monitors validator performance
- **Stake Management**: Tracks validator stake amounts
- **Commission Handling**: Configurable commission rates
- **Subnet Support**: Validates for specific AI subnets
