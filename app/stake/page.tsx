'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Award, Info, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useAccount, useBalance } from 'wagmi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function StakePage() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const searchParams = useSearchParams();
  
  const [amount, setAmount] = useState('');
  const [selectedSubnet, setSelectedSubnet] = useState('subnet-1');
  const [isStaking, setIsStaking] = useState(false);

  // Get subnet from URL params if coming from subnet page
  useEffect(() => {
    const subnetFromUrl = searchParams.get('subnet');
    if (subnetFromUrl) {
      setSelectedSubnet(subnetFromUrl);
    }
  }, [searchParams]);

  const minStake = 10000;

  const subnets = [
    { 
      id: 'subnet-1', 
      name: 'GPT-4 Inference', 
      type: 'LLM', 
      apy: 45.2, 
      validators: 128,
      description: 'Large Language Model inference for text generation, completion, and conversation. Powers AI chatbots, content creation, and natural language processing tasks.'
    },
    { 
      id: 'subnet-2', 
      name: 'Vision Transformers', 
      type: 'Vision', 
      apy: 38.5, 
      validators: 96,
      description: 'Computer vision models for image recognition, object detection, and visual analysis. Handles image classification, facial recognition, and medical imaging tasks.'
    },
    { 
      id: 'subnet-3', 
      name: 'Embeddings Pro', 
      type: 'Embedding', 
      apy: 42.1, 
      validators: 84,
      description: 'Vector embeddings for semantic search, recommendation systems, and similarity matching. Powers search engines, content discovery, and AI-powered recommendations.'
    },
    { 
      id: 'subnet-4', 
      name: 'Audio Genesis', 
      type: 'Audio', 
      apy: 36.8, 
      validators: 72,
      description: 'Audio processing models for speech recognition, music generation, and sound analysis. Handles voice assistants, audio transcription, and sound synthesis tasks.'
    },
  ];

  const selectedSubnetData = subnets.find((s) => s.id === selectedSubnet);

  const estimatedRewards = amount && !isNaN(parseFloat(amount))
    ? ((parseFloat(amount) * (selectedSubnetData?.apy || 0)) / 100 / 365).toFixed(4)
    : '0';

  const handleStake = async () => {
    if (!address || !amount || parseFloat(amount) < minStake) return;

    setIsStaking(true);

    // TODO: Implement actual staking contract interaction
    try {
      // 1. Approve 01A tokens
      // await approve(stakingContractAddress, amount);

      // 2. Call staking contract
      // await stakingContract.stake(selectedSubnet, amount, commission);

      // Simulate staking
      await new Promise((resolve) => setTimeout(resolve, 3000));

      alert('Successfully staked! You are now a validator.');
      setAmount('');
    } catch (error) {
      console.error('Staking error:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="text-xs text-gray-500 font-mono mb-2">
            <span className="text-white">$</span> stake.validator()
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-mono">
            [ BECOME_A_VALIDATOR ]
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {'>'} Stake 01A tokens | Secure the network | Earn rewards
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassCard className="p-3" delay={0}>
            <div className="space-y-1 font-mono">
              <Shield className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">MIN_STAKE</p>
              <p className="text-lg font-bold text-white">{minStake.toLocaleString()} 01A</p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.05}>
            <div className="space-y-1 font-mono">
              <TrendingUp className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">AVG_APY</p>
              <p className="text-lg font-bold text-white">
                {(subnets.reduce((acc, s) => acc + s.apy, 0) / subnets.length).toFixed(1)}%
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.1}>
            <div className="space-y-1 font-mono">
              <Users className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">TOTAL_VALIDATORS</p>
              <p className="text-lg font-bold text-white">
                {subnets.reduce((acc, s) => acc + s.validators, 0)}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.15}>
            <div className="space-y-1 font-mono">
              <Award className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">YOUR_BALANCE</p>
              <p className="text-lg font-bold text-white">
                {balance ? parseFloat(balance.formatted).toFixed(2) : '0.00'}
              </p>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staking Form */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6" gradient>
              <div className="space-y-6 font-mono">
                <h2 className="text-lg font-bold text-white">[ STAKE_CONFIGURATION ]</h2>

                {/* Subnet Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase">SELECT_SUBNET</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-4">
                    {subnets.map((subnet) => (
                      <div key={subnet.id} className="relative group">
                        <button
                          onClick={() => setSelectedSubnet(subnet.id)}
                          className={`w-full p-3 border transition-all text-left ${
                            selectedSubnet === subnet.id
                              ? 'border-primary-gold bg-primary-gold/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-bold text-white">{subnet.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                [{subnet.type}]
                              </p>
                            </div>
                            {selectedSubnet === subnet.id && (
                              <span className="text-primary-gold text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-500">APY: {subnet.apy}%</span>
                            <span className="text-gray-500">{subnet.validators} validators</span>
                          </div>
                        </button>
                        
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 border border-white/20 rounded text-xs text-white max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="text-center">
                            <p className="font-bold text-primary-gold mb-1">{subnet.name}</p>
                            <p className="text-gray-300 text-[10px] leading-relaxed">{subnet.description}</p>
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stake Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-gray-500 uppercase">STAKE_AMOUNT</label>
                    {address && (
                      <span className="text-[10px] text-gray-400">
                        Balance: {balance?.formatted || '0'} 01A
                      </span>
                    )}
                  </div>
                  <div className="glass-panel p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Min: ${minStake.toLocaleString()} 01A`}
                        className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder-gray-600"
                        min={minStake}
                        step="100"
                      />
                      <span className="text-lg text-gray-400">01A</span>
                    </div>
                  </div>
                  {amount && parseFloat(amount) < minStake && (
                    <p className="text-[10px] text-red-400">
                      Minimum stake: {minStake.toLocaleString()} 01A
                    </p>
                  )}
                </div>


                {/* Estimated Rewards */}
                {amount && parseFloat(amount) >= minStake && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 border border-primary-gold/30 bg-primary-gold/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">ESTIMATED_DAILY_REWARDS</p>
                        <p className="text-2xl font-bold text-primary-gold mt-1">
                          {estimatedRewards} 01A
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-primary-gold" />
                    </div>
                    <div className="space-y-1 text-[10px] text-gray-400">
                      <div className="flex justify-between">
                        <span>Annual Rewards:</span>
                        <span className="text-white">
                          {(parseFloat(estimatedRewards) * 365).toFixed(2)} 01A
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <span className="text-white">{selectedSubnetData?.apy}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stake Button */}
                <button
                  onClick={handleStake}
                  disabled={
                    !address ||
                    !amount ||
                    parseFloat(amount) < minStake ||
                    isStaking
                  }
                  className={`w-full px-6 py-4 border transition-all text-sm font-bold ${
                    !address || !amount || parseFloat(amount) < minStake
                      ? 'border-white/20 text-gray-600 cursor-not-allowed'
                      : isStaking
                      ? 'border-primary-gold text-primary-gold cursor-wait'
                      : 'border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-black'
                  }`}
                >
                  {!address
                    ? '[CONNECT_WALLET_TO_STAKE]'
                    : isStaking
                    ? '[STAKING...]'
                    : '[STAKE_AND_BECOME_VALIDATOR]'}
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            {/* Requirements */}
            <GlassCard className="p-4">
              <div className="space-y-3 font-mono">
                <div className="flex items-center gap-2 text-white">
                  <Info className="w-4 h-4" />
                  <h3 className="text-sm font-bold">[ REQUIREMENTS ]</h3>
                </div>
                <div className="space-y-2 text-[10px] text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold">✓</span>
                    <p>Minimum {minStake.toLocaleString()} 01A tokens</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold">✓</span>
                    <p>Stable internet connection (99% uptime)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold">✓</span>
                    <p>8GB RAM, 4 CPU cores minimum</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold">✓</span>
                    <p>500GB SSD storage</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold">✓</span>
                    <p>Technical knowledge for node setup</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* How to Setup */}
            <GlassCard className="p-4">
              <div className="space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white">[ SETUP_GUIDE ]</h3>
                <div className="space-y-2 text-[10px] text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">1.</span>
                    <p>Stake your 01A tokens above</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">2.</span>
                    <p>Setup validator node using our CLI</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">3.</span>
                    <p>Configure your validator keys</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-gold mt-0.5">4.</span>
                    <p>Start validating and earn rewards</p>
                  </div>
                </div>
                <Link href="#">
                  <button className="w-full px-3 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-[10px] flex items-center justify-center gap-2">
                    [READ_DOCS]
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </GlassCard>

            {/* Risks */}
            <GlassCard className="p-4">
              <div className="space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white">[ RISKS ]</h3>
                <div className="space-y-1.5 text-[10px] text-gray-400">
                  <p>
                    • <span className="text-white">Slashing:</span> Downtime or malicious behavior can result in stake loss
                  </p>
                  <p>
                    • <span className="text-white">Lock period:</span> Staked tokens have 14-day unbonding period
                  </p>
                  <p>
                    • <span className="text-white">Technical:</span> Node failures can affect rewards
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

