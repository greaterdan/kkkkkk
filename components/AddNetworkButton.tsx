'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, AlertCircle, Copy, Info } from 'lucide-react';
import { add01ANetworkToMetaMask, check01ANetworkAdded, MANUAL_NETWORK_INSTRUCTIONS } from '@/lib/metamask-config';

interface AddNetworkButtonProps {
  isTestnet?: boolean;
  className?: string;
}

export function AddNetworkButton({ isTestnet = false, className = '' }: AddNetworkButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showManual, setShowManual] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddNetwork = async () => {
    setIsAdding(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await add01ANetworkToMetaMask(isTestnet);
      setStatus('success');
      setMessage(result.message);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const networkConfig = {
    name: isTestnet ? '01A Labs Network (BNB Smart Chain)' : '01A Labs Network (BNB Testnet)',
    rpcUrl: isTestnet ? 'https://bsc-dataseed1.binance.org/' : 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    chainId: isTestnet ? '56' : '97',
    symbol: 'BNB',
    explorer: isTestnet ? 'https://bscscan.com' : 'https://testnet.bscscan.com'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Manual Setup Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowManual(!showManual)}
          className="px-6 py-3 border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-black transition-all text-sm font-mono"
        >
          {showManual ? '[HIDE_MANUAL_SETUP]' : '[SHOW_MANUAL_SETUP]'}
        </button>
      </div>

      {/* Manual Setup Instructions */}
      {showManual && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-black/20 border border-white/10 rounded"
        >
          <div className="flex items-center gap-2 text-white font-mono">
            <Info className="w-4 h-4 text-primary-gold" />
            <h3 className="text-sm font-bold">{MANUAL_NETWORK_INSTRUCTIONS.title}</h3>
          </div>
          
          <div className="space-y-3 text-xs font-mono">
            {MANUAL_NETWORK_INSTRUCTIONS.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-primary-gold mt-0.5">{index + 1}.</span>
                <span className="text-gray-300">{step}</span>
              </div>
            ))}
          </div>

          {/* Network Configuration Details */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-sm font-bold text-white font-mono">Network Configuration:</h4>
            <div className="space-y-2">
              {[
                { label: 'Network Name:', value: networkConfig.name },
                { label: 'RPC URL:', value: networkConfig.rpcUrl },
                { label: 'Chain ID:', value: networkConfig.chainId },
                { label: 'Currency Symbol:', value: networkConfig.symbol },
                { label: 'Block Explorer:', value: networkConfig.explorer }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <span className="text-xs text-gray-400 font-mono">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-mono">{item.value}</span>
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
