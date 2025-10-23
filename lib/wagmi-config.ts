import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Define custom 01A L2 chain
export const zeroOneA = {
  id: 26, // Your L2 network Chain ID
  name: '01A LABS L2 Network',
  network: '01a-l2',
  nativeCurrency: {
    decimals: 18,
    name: '01A',
    symbol: '01A',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'], // Your L2 node
    },
    public: {
      http: ['http://localhost:8545'], // Your L2 node
    },
  },
  blockExplorers: {
    default: { name: '01A L2 Explorer', url: 'http://localhost:3001' },
  },
  testnet: false, // Your main L2 network
} as const;

// WalletConnect project ID - using a valid project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f05a7f4cc39e34eec8c3e8b4d4e8b4d';

export const config = createConfig({
  chains: [bscTestnet, bsc, zeroOneA], // BNB Testnet first for bridging
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: '01A LABS L2 Network',
    }),
  ],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'), // BNB Testnet for bridging
    [bsc.id]: http(),
    [zeroOneA.id]: http('http://localhost:8545'), // L2 node for other features
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
