# 01A Network - AI Layer-2 Blockchain Explorer

A production-ready Next.js 14 application for the 01A Network, an AI-focused Layer-2 blockchain built on BNB Chain. Features a minimalist black & white terminal-style UI with gold accents.

![01A Network](https://img.shields.io/badge/01A-Network-gold)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-cyan)

## 🚀 Features

### ✅ Completed Features

#### 🎨 Frontend UI
- **Minimalist Terminal Design**: Black & white interface with strategic gold (#f1bc1e) accents
- **Fully Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion animations throughout
- **Particle Background**: Subtle animated particle effects

#### 🔗 Wallet Integration
- **RainbowKit Integration**: Support for MetaMask, Coinbase Wallet, WalletConnect
- **Multi-Chain**: BNB Chain, BNB Testnet, and custom 01A Network
- **Custom Styled**: Terminal-style wallet UI matching the theme

#### 🌉 Bridge
- **Cross-Chain Bridge**: Transfer assets between BNB Chain and 01A Network
- **Real-time Estimates**: Dynamic cost and time calculations
- **Bridge History**: Track your bridge transactions
- **User Guide**: Step-by-step instructions

#### 🔍 Explorer
- **Comprehensive Metrics**: Total blocks, transactions, gas tracker, addresses
- **Daily Charts**: Transaction trends visualization
- **Side-by-Side Layout**: Latest blocks and transactions
- **Detailed Views**: Individual block, transaction, and address pages
- **Smart Search**: Autocomplete with recent searches and type detection

#### 🏢 Subnets
- **Subnet Overview**: LLM, Vision, Embedding, Audio subnets
- **Performance Metrics**: APY, validator count, stake info
- **Detailed Pages**: Individual subnet statistics and activity

#### 👥 Validators
- **Validator Leaderboard**: Sort by stake, uptime, or rewards
- **Real-time Stats**: Total validators, stake, uptime
- **Validator Profiles**: Detailed validator information

#### 💰 Staking
- **Become a Validator**: Stake TORA tokens
- **Subnet Selection**: Choose which subnet to validate
- **Commission Settings**: Configure your validator commission
- **Rewards Calculator**: Estimate daily and annual rewards
- **Requirements Guide**: Clear requirements and setup instructions

#### 🤖 AI Task Submission
- **Multiple Task Types**: LLM, Vision, Embedding, Audio
- **Parameter Configuration**: Adjust temperature, max tokens, etc.
- **Cost Estimation**: Real-time cost calculations
- **Task History**: Track all your submitted tasks
- **Pricing Info**: Transparent pricing per task type

#### 🔎 Advanced Search
- **Smart Detection**: Automatically detects blocks, transactions, addresses
- **Autocomplete**: Suggestions as you type
- **Recent Searches**: Quick access to previous searches
- **Keyboard Navigation**: Arrow keys and Enter support

### 📚 Backend API Integration Ready
- Comprehensive API client with TypeScript types
- WebSocket support for real-time updates
- Error handling and retry logic
- Ready to connect to backend when available

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Wallet**: [Wagmi](https://wagmi.sh/) + [RainbowKit](https://www.rainbowkit.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-org/01a-network.git
cd 01a-network
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```bash
# WalletConnect Project ID (Get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# API Configuration (Update when backend is ready)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=56001
NEXT_PUBLIC_RPC_URL=https://rpc.01a.network
NEXT_PUBLIC_EXPLORER_URL=https://explorer.01a.network

# Contract Addresses (Update when deployed)
NEXT_PUBLIC_BRIDGE_CONTRACT=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_TOKEN_CONTRACT=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_SUBNET_REGISTRY_CONTRACT=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_VALIDATOR_STAKING_CONTRACT=0x0000000000000000000000000000000000000000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
01A/
├── app/                      # Next.js 14 app directory
│   ├── bridge/              # Bridge page
│   ├── explorer/            # Explorer pages
│   │   └── [id]/           # Block/transaction detail
│   ├── stake/              # Validator staking
│   ├── subnets/            # Subnet pages
│   │   └── [id]/           # Subnet detail
│   ├── tasks/              # AI task submission
│   ├── validators/         # Validator leaderboard
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage/Dashboard
│   └── providers.tsx       # React context providers
├── components/             # Reusable components
│   ├── Button.tsx
│   ├── GlassCard.tsx
│   ├── MetricCard.tsx
│   ├── Navbar.tsx
│   ├── ParticleBackground.tsx
│   ├── SearchBar.tsx
│   └── StatusBadge.tsx
├── lib/                    # Utilities and helpers
│   ├── api.ts             # API client
│   ├── hooks/             # Custom React hooks
│   │   └── useRealTimeData.ts
│   ├── mock-data.ts       # Mock data (remove in production)
│   ├── utils.ts           # Utility functions
│   └── wagmi-config.ts    # Wallet configuration
├── public/                # Static assets
├── BACKEND_API_SPEC.md    # Complete backend API specification
└── README.md              # This file
```

---

## 🚦 Usage

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint --fix
```

### Connecting to Real Backend

1. Update `.env.local` with your backend API URL
2. Deploy smart contracts and update contract addresses
3. The API client in `lib/api.ts` is already configured
4. Remove or update `lib/mock-data.ts` when using real data

---

## 📄 Pages Overview

### 🏠 Dashboard (`/`)
- Network overview metrics
- Price information (TORA, BNB)
- Block production chart
- Subnet activity chart
- Call-to-action sections

### 🔍 Explorer (`/explorer`)
- Total blocks, transactions, gas tracker
- Daily transaction chart
- Latest blocks and transactions (side-by-side)
- Tabs for Latest/L1→L2 transactions

### 📝 Block/Transaction Detail (`/explorer/[id]`)
- Complete information display
- Copy functionality
- External verification links

### 🏢 Subnets (`/subnets`)
- All available subnets
- Performance metrics
- APY information

### 👥 Validators (`/validators`)
- Leaderboard with sorting
- Validator profiles
- Staking information

### 💰 Stake (`/stake`)
- Validator registration
- Subnet selection
- Commission configuration
- Rewards calculator
- Requirements and guide

### 🌉 Bridge (`/bridge`)
- BNB ↔ 01A transfers
- Amount input with max button
- Fee estimation
- Bridge history

### 🤖 AI Tasks (`/tasks`)
- Task type selection (LLM, Vision, Embedding, Audio)
- Parameter configuration
- Cost estimation
- Task history and status

---

## 🎨 Design System

### Colors
- **Primary Dark**: `#000000` - Main background
- **Primary Darker**: `#0a0a0a` - Elevated surfaces
- **Primary Accent**: `#ffffff` - Text and borders
- **Primary Gray**: `#808080` - Secondary text
- **Primary Gold**: `#f1bc1e` - Accent color for CTAs

### Typography
- **Primary Font**: Inter Tight (sans-serif)
- **Monospace**: Courier New (terminal elements)

### Components
- **Glass Panels**: Black background with white borders and subtle shadows
- **Buttons**: Terminal-style with square corners, border animations
- **Cards**: Minimal with hover effects
- **Inputs**: Glass effect with focus states

---

## 🔗 Wallet Integration

The app supports multiple wallets through RainbowKit:
- MetaMask
- Coinbase Wallet
- WalletConnect
- Injected wallets

### Supported Networks
- BNB Chain (56)
- BNB Testnet (97)
- 01A Network (56001) - Custom configuration

---

## 📡 API Integration

### API Client (`lib/api.ts`)
Ready-to-use API client with:
- Type-safe endpoints
- Error handling
- Retry logic
- Real-time WebSocket support

### WebSocket Hooks (`lib/hooks/useRealTimeData.ts`)
- `useRealTimeBlocks()` - New block notifications
- `useRealTimeTransactions()` - New transaction notifications
- `useRealTimeStats()` - Network stats updates

See `BACKEND_API_SPEC.md` for complete backend requirements.

---

## 🧪 Backend Development

To make the app fully functional, you need to:

1. **Deploy Blockchain Node**
   - Use Geth, Polygon CDK, or OP Stack
   - Configure for AI workload optimization

2. **Deploy Smart Contracts**
   - Bridge contracts (L1 & L2)
   - Validator staking contract
   - AI task registry contract
   - Subnet registry contract

3. **Build Indexer**
   - Index blocks and transactions
   - Listen for events
   - Store in PostgreSQL

4. **Create REST API**
   - Implement endpoints from `BACKEND_API_SPEC.md`
   - Add authentication (optional)
   - Deploy with proper CORS

5. **Setup WebSocket Server**
   - Real-time block/transaction notifications
   - Network stats updates

See `BACKEND_API_SPEC.md` for detailed specifications.

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
Make sure to set all environment variables in your deployment platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Wagmi and RainbowKit for wallet integration
- Framer Motion for smooth animations
- BNB Chain for the Layer-1 infrastructure

---

## 📞 Support

- **Documentation**: See `BACKEND_API_SPEC.md`
- **Issues**: Open an issue on GitHub
- **Email**: dev@01a.network
- **Discord**: [Join our community](#)

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Frontend UI/UX
- [x] Wallet integration
- [x] Mock data structure
- [x] API client ready

### Phase 2: Backend Integration (In Progress)
- [ ] Deploy blockchain node
- [ ] Deploy smart contracts
- [ ] Build indexer
- [ ] Create REST API
- [ ] Setup WebSocket server

### Phase 3: Production Features
- [ ] Real blockchain data
- [ ] Functional bridge
- [ ] Live staking
- [ ] AI task processing
- [ ] Analytics dashboard

### Phase 4: Advanced Features
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Governance features
- [ ] Multi-language support

---

**Built with ❤️ by the 01A Network Team**
