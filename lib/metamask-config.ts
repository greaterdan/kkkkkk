// 01A Network Configuration for MetaMask
// Using BNB Testnet as the actual network since 01A is built on BNB
export const O1A_NETWORK_CONFIG = {
  chainId: '0x61', // 97 in decimal - BNB Testnet
  chainName: '01A Labs Network (BNB Testnet)',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'https://data-seed-prebsc-2-s1.binance.org:8545/',
    'https://data-seed-prebsc-1-s2.binance.org:8545/',
    'https://data-seed-prebsc-2-s2.binance.org:8545/',
    'https://data-seed-prebsc-1-s3.binance.org:8545/',
    'https://data-seed-prebsc-2-s3.binance.org:8545/'
  ],
  blockExplorerUrls: [
    'https://testnet.bscscan.com'
  ],
  iconUrls: [
    'https://01a.network/logo.png'
  ]
};

// Alternative configuration for mainnet (when 01A mainnet is ready)
export const O1A_TESTNET_CONFIG = {
  chainId: '0x38', // 56 in decimal - BNB Smart Chain Mainnet
  chainName: '01A Labs Network (BNB Smart Chain)',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://bsc-dataseed1.binance.org/',
    'https://bsc-dataseed2.binance.org/',
    'https://bsc-dataseed3.binance.org/',
    'https://bsc-dataseed4.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed2.defibit.io/',
    'https://bsc-dataseed3.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/',
    'https://bsc-dataseed2.ninicoin.io/',
    'https://bsc-dataseed3.ninicoin.io/'
  ],
  blockExplorerUrls: [
    'https://bscscan.com'
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
    'Network Name: 01A Labs Network (BNB Testnet)',
    'RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/',
    'Chain ID: 97',
    'Currency Symbol: BNB',
    'Block Explorer: https://testnet.bscscan.com',
    'Click "Save" to add the network'
  ]
};
