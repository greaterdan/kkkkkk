// 01A Network Configuration for MetaMask
// Using Base Sepolia Testnet as the actual network since 01A is built on Base
export const O1A_NETWORK_CONFIG = {
  chainId: '0x14A34', // 84532 in decimal - Base Sepolia Testnet
  chainName: '01A Labs Network (Base Sepolia)',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://sepolia.base.org',
    'https://base-sepolia.g.alchemy.com/v2/demo',
    'https://base-sepolia.public.blastapi.io'
  ],
  blockExplorerUrls: [
    'https://sepolia.basescan.org'
  ],
  iconUrls: [
    'https://01a.network/logo.png'
  ]
};

// Alternative configuration for mainnet (when 01A mainnet is ready)
export const O1A_TESTNET_CONFIG = {
  chainId: '0x2105', // 8453 in decimal - Base Mainnet
  chainName: '01A Labs Network (Base Mainnet)',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://mainnet.base.org',
    'https://base-mainnet.g.alchemy.com/v2/demo',
    'https://base.public.blastapi.io'
  ],
  blockExplorerUrls: [
    'https://basescan.org'
  ],
  iconUrls: [
    'https://01a.network/logo.png'
  ]
};

// Function to add 01A network to MetaMask
export async function add01ANetworkToMetaMask(isTestnet = false) {
  const config = isTestnet ? O1A_TESTNET_CONFIG : O1A_NETWORK_CONFIG;
  
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not detected. Please install MetaMask.');
  }

  try {
    // Try to add the network
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [config],
    });
    
    return { success: true, message: '01A Network added to MetaMask successfully!' };
  } catch (error: any) {
    // If network already exists, try to switch to it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: config.chainId }],
        });
        return { success: true, message: 'Switched to 01A Network!' };
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Network doesn't exist, try to add it again
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [config],
            });
            return { success: true, message: '01A Network added to MetaMask successfully!' };
          } catch (addError) {
            throw new Error('Failed to add 01A Network to MetaMask. Please add manually.');
          }
        }
        throw new Error('Failed to switch to 01A Network. Please add manually.');
      }
    }
    throw new Error('Failed to add 01A Network to MetaMask. Please add manually.');
  }
}

// Function to check if 01A network is already added
export async function check01ANetworkAdded() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === '0x1A' || chainId === '0x1B';
  } catch {
    return false;
  }
}

// Manual network addition instructions
export const MANUAL_NETWORK_INSTRUCTIONS = {
  title: 'Add 01A Network Manually',
  steps: [
    'Open MetaMask and click on the network dropdown',
    'Click "Add Network" or "Custom RPC"',
    'Enter the following details:',
    'Network Name: 01A Labs Network (Base Sepolia)',
    'RPC URL: https://sepolia.base.org',
    'Chain ID: 84532',
    'Currency Symbol: ETH',
    'Block Explorer: https://sepolia.basescan.org',
    'Click "Save" to add the network'
  ]
};
