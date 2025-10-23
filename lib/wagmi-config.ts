import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Define custom 01A chain
export const zeroOneA = {
  id: 56_001, // Custom chain ID for 01A
  name: '01A Network',
  network: '01a',
  nativeCurrency: {
    decimals: 18,
    name: '01A',
    symbol: '01A',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.01a.network'], // Replace with your actual RPC
    },
    public: {
      http: ['https://rpc.01a.network'],
    },
  },
  blockExplorers: {
    default: { name: '01A Explorer', url: 'https://explorer.01a.network' },
  },
  testnet: false,
} as const;

// WalletConnect project ID - replace with your own from cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [bsc, bscTestnet, zeroOneA],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: '01A Network',
    }),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [zeroOneA.id]: http(), // Will use custom RPC URL
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
