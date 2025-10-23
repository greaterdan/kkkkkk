import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Define custom 01A L2 chain for production
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
      http: [process.env.NEXT_PUBLIC_L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc'],
    },
  },
  blockExplorers: {
    default: { 
      name: '01A L2 Explorer', 
      url: process.env.NEXT_PUBLIC_L2_EXPLORER_URL || 'https://l2-explorer-production.up.railway.app' 
    },
  },
  testnet: false, // Your main L2 network
} as const;

// WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f05a7f4cc39e34eec8c3e8b4d4e8b4d';

export const config = createConfig({
  chains: [zeroOneA, bsc, bscTestnet], // L2 network first
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
    [zeroOneA.id]: http(process.env.NEXT_PUBLIC_L2_RPC_URL || 'https://l2-rpc-production.up.railway.app/rpc'),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
