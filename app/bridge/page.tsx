'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Info, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { zeroOneA } from '@/lib/wagmi-config';

export default function BridgePage() {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  const [fromChain, setFromChain] = useState<'bnb' | '01a'>('bnb');
  const [amount, setAmount] = useState('');
  const [bridgeStatus, setBridgeStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  // Get balance for current chain
  const { data: balance } = useBalance({
    address,
    chainId: fromChain === 'bnb' ? bsc.id : zeroOneA.id,
  });

  const toChain = fromChain === 'bnb' ? '01a' : 'bnb';

  const handleSwapDirection = () => {
    setFromChain(fromChain === 'bnb' ? '01a' : 'bnb');
    setAmount('');
  };

  const handleMaxClick = () => {
    if (balance) {
      // Leave a small amount for gas
      const maxAmount = parseFloat(balance.formatted) - 0.01;
      setAmount(maxAmount > 0 ? maxAmount.toString() : '0');
    }
  };

  const handleBridge = async () => {
    if (!address || !amount || parseFloat(amount) <= 0) return;

    setBridgeStatus('pending');

    // TODO: Implement actual bridge contract interaction
    // This is a placeholder for the bridge logic
    try {
      // 1. Check if on correct chain
      const correctChainId = fromChain === 'bnb' ? bsc.id : zeroOneA.id;
      if (chain?.id !== correctChainId) {
        await switchChain({ chainId: correctChainId });
      }

      // 2. Approve tokens (if needed)
      // await approve(bridgeContractAddress, amount);

      // 3. Call bridge contract
      // await bridgeContract.deposit(amount);

      // Simulate bridge transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setBridgeStatus('success');
      setTimeout(() => {
        setBridgeStatus('idle');
        setAmount('');
      }, 5000);
    } catch (error) {
      console.error('Bridge error:', error);
      setBridgeStatus('error');
      setTimeout(() => setBridgeStatus('idle'), 3000);
    }
  };

  const estimatedTime = fromChain === 'bnb' ? '~5 minutes' : '~1 hour';
  const bridgeFee = '0.001 BNB';

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 text-center"
        >
          <div className="text-xs text-gray-500 font-mono mb-2">
            <span className="text-white">$</span> bridge.init()
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-mono">
            [ CROSS-CHAIN_BRIDGE ]
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {'>'} Transfer assets between BNB Chain and 01A Network
          </p>
        </motion.div>

        {/* Bridge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6" gradient>
            <div className="space-y-4 font-mono">
              {/* From Chain */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-500 uppercase">FROM</label>
                  {address && (
                    <span className="text-[10px] text-gray-400">
                      Balance: {balance?.formatted || '0'} {balance?.symbol || ''}
                    </span>
                  )}
                </div>
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-primary-gold flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {fromChain === 'bnb' ? 'BNB' : '01A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {fromChain === 'bnb' ? 'BNB Chain' : '01A Network'}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {fromChain === 'bnb' ? 'Layer 1' : 'Layer 2'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder-gray-600"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={handleMaxClick}
                      className="px-2 py-1 border border-white/30 text-white hover:bg-white hover:text-black transition-all text-[10px]"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapDirection}
                  className="p-2 border border-white/30 hover:bg-white hover:border-white hover:text-black transition-all group"
                >
                  <ArrowDown className="w-5 h-5 text-white group-hover:text-black" />
                </button>
              </div>

              {/* To Chain */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase">TO</label>
                <div className="glass-panel p-4 opacity-70">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-white/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {toChain === 'bnb' ? 'BNB' : '01A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {toChain === 'bnb' ? 'BNB Chain' : '01A Network'}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {toChain === 'bnb' ? 'Layer 1' : 'Layer 2'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {amount || '0.0'}
                  </div>
                </div>
              </div>

              {/* Bridge Info */}
              {amount && parseFloat(amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-4 border-t border-white/10"
                >
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Estimated Time:</span>
                    <span className="text-white">{estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Bridge Fee:</span>
                    <span className="text-white">{bridgeFee}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">You Will Receive:</span>
                    <span className="text-primary-gold font-bold">
                      ~{(parseFloat(amount) - parseFloat(bridgeFee.split(' ')[0])).toFixed(4)}{' '}
                      {toChain === 'bnb' ? 'BNB' : '01A'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Bridge Button */}
              <button
                onClick={handleBridge}
                disabled={!address || !amount || parseFloat(amount) <= 0 || bridgeStatus === 'pending'}
                className={`w-full px-6 py-4 border transition-all text-sm font-bold ${
                  !address || !amount || parseFloat(amount) <= 0
                    ? 'border-white/20 text-gray-600 cursor-not-allowed'
                    : bridgeStatus === 'pending'
                    ? 'border-primary-gold text-primary-gold cursor-wait'
                    : bridgeStatus === 'success'
                    ? 'border-green-400 text-green-400'
                    : bridgeStatus === 'error'
                    ? 'border-red-400 text-red-400'
                    : 'border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-black'
                }`}
              >
                {!address
                  ? '[CONNECT_WALLET]'
                  : bridgeStatus === 'pending'
                  ? '[BRIDGING...]'
                  : bridgeStatus === 'success'
                  ? '[SUCCESS_✓]'
                  : bridgeStatus === 'error'
                  ? '[ERROR_X]'
                  : '[BRIDGE_TOKENS]'}
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-4 h-full">
              <div className="space-y-3 font-mono">
                <div className="flex items-center gap-2 text-white">
                  <Info className="w-4 h-4" />
                  <h3 className="text-sm font-bold">[ HOW_IT_WORKS ]</h3>
                </div>
                <div className="space-y-2 text-[10px] text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">1.</span>
                    <p>Connect your wallet and select the chain</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">2.</span>
                    <p>Enter the amount you want to bridge</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">3.</span>
                    <p>Approve the transaction in your wallet</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">4.</span>
                    <p>Wait for the bridge to process (5 min - 1 hour)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">5.</span>
                    <p>Receive tokens on the destination chain</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-4 h-full">
              <div className="space-y-3 font-mono">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4" />
                  <h3 className="text-sm font-bold">[ YOUR_BRIDGES ]</h3>
                </div>
                {!address ? (
                  <p className="text-[10px] text-gray-400">Connect wallet to see your bridge history</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-white/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-[10px] text-white">1.5 BNB → 01A</span>
                      </div>
                      <span className="text-[10px] text-gray-400">2h ago</span>
                    </div>
                    <p className="text-[10px] text-gray-500 text-center">No bridge transactions yet</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-start gap-3 font-mono">
              <Info className="w-4 h-4 text-primary-gold flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400">
                  <span className="text-white font-bold">Important:</span> Bridge transactions are
                  irreversible. Make sure you're sending to the correct address. Bridging from L2
                  to L1 requires a longer wait time due to fraud proof windows.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[10px] text-primary-gold hover:text-white transition-colors"
                >
                  Learn more about the bridge
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

