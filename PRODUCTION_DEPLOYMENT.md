# 🚀 01A LABS L2 Network - Production Deployment

## **Deployment Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION L2 NETWORK                    │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Railway   │  │   Railway   │  │      Vercel         │  │
│  │  L2 Node   │  │  L2 RPC    │  │   L2 Explorer       │  │
│  │             │  │             │  │                     │  │
│  │ • 24/7 Run │  │ • Auto Scale│  │ • Global CDN        │  │
│  │ • Persistent│  │ • Load Bal │  │ • Fast Loading      │  │
│  │ • Database │  │ • Monitoring│  │ • Real-time Updates │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## **🚀 Quick Deployment**

### **Option 1: Automated Deployment**
```bash
./deploy-l2.sh
```

### **Option 2: Manual Deployment**

#### **1. Deploy L2 Node to Railway**
```bash
cd l2-node
railway login
railway deploy --service l2-node
```

#### **2. Deploy L2 RPC to Railway**
```bash
cd l2-rpc
railway deploy --service l2-rpc
```

#### **3. Deploy L2 Explorer to Vercel**
```bash
cd l2-explorer
vercel --prod
```

## **🔧 Configuration**

### **Environment Variables**

#### **L2 Node (Railway)**
```bash
PORT=8545
CHAIN_ID=26
BLOCK_TIME=3
DATABASE_URL=<railway-provided>
VALIDATOR_ADDRESS=0x351a5Ae420C74B5181570e7EBdD5824d50a80a73
NETWORK_NAME=01A LABS L2
```

#### **L2 RPC (Railway)**
```bash
RPC_PORT=8547
L2_NODE_URL=<l2-node-railway-url>
CHAIN_ID=26
NETWORK_NAME=01A LABS L2
```

#### **L2 Explorer (Vercel)**
```bash
L2_RPC_URL=<l2-rpc-railway-url>
EXPLORER_PORT=3001
```

## **🌐 Production URLs**

After deployment, you'll get:
- **L2 Node**: `https://l2-node-production.up.railway.app`
- **L2 RPC**: `https://l2-rpc-production.up.railway.app`
- **Explorer**: `https://l2-explorer.vercel.app`

## **🔗 MetaMask Configuration**

### **Network Details**
- **Network Name**: 01A LABS L2
- **RPC URL**: `https://l2-rpc-production.up.railway.app/rpc`
- **Chain ID**: 26
- **Currency Symbol**: 01A
- **Block Explorer**: `https://l2-explorer.vercel.app`

## **📊 Monitoring**

### **Health Checks**
- **L2 Node**: `https://l2-node-production.up.railway.app/api/network`
- **L2 RPC**: `https://l2-rpc-production.up.railway.app/health`
- **Explorer**: `https://l2-explorer.vercel.app`

### **Railway Dashboard**
- Monitor CPU, Memory, Network usage
- View logs and metrics
- Set up alerts

### **Vercel Dashboard**
- Monitor deployment status
- View build logs
- Set up custom domains

## **🔐 Security**

### **Production Checklist**
- ✅ **HTTPS**: All endpoints use SSL
- ✅ **CORS**: Configured for production domains
- ✅ **Rate Limiting**: Implemented on RPC
- ✅ **Monitoring**: Health checks and alerts
- ✅ **Backups**: Database backups enabled
- ✅ **Scaling**: Auto-scaling configured

## **💰 Cost Estimation**

### **Railway (L2 Node + RPC)**
- **Starter Plan**: $5/month per service
- **Pro Plan**: $20/month per service
- **Total**: $10-40/month

### **Vercel (Explorer)**
- **Hobby Plan**: Free
- **Pro Plan**: $20/month
- **Total**: $0-20/month

### **Total Monthly Cost**: $10-60/month

## **🚀 Scaling Options**

### **High Traffic**
- **Railway**: Upgrade to Pro plan
- **Load Balancer**: Add multiple RPC instances
- **CDN**: Use Cloudflare for global distribution

### **Enterprise**
- **AWS**: Migrate to AWS for maximum reliability
- **Kubernetes**: Use K8s for orchestration
- **Multi-region**: Deploy across multiple regions

## **📈 Performance**

### **Expected Performance**
- **Block Time**: 3 seconds
- **TPS**: 1000+ transactions/second
- **Finality**: 1 block (3 seconds)
- **Uptime**: 99.9%+

### **Optimization**
- **Database**: Use PostgreSQL for persistence
- **Caching**: Redis for transaction caching
- **CDN**: Cloudflare for global distribution

## **🔄 Updates**

### **Deploying Updates**
```bash
# Update L2 Node
cd l2-node
railway deploy

# Update L2 RPC
cd l2-rpc
railway deploy

# Update Explorer
cd l2-explorer
vercel --prod
```

### **Rollback**
```bash
# Rollback to previous version
railway rollback
vercel rollback
```

## **📞 Support**

### **Monitoring**
- **Railway**: Built-in monitoring and alerts
- **Vercel**: Deployment status and logs
- **Custom**: Set up external monitoring

### **Backup**
- **Database**: Automated backups on Railway
- **Code**: Git repository backup
- **Configuration**: Environment variable backup

---

**Ready to deploy your L2 network to production! 🚀**
