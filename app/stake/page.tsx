'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Award, Info, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useAccount, useBalance, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getRealSubnets } from '@/lib/real-data';
import { ApiSubnet } from '@/lib/api';

function StakePageContent() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: walletClient } = useWalletClient();
  const searchParams = useSearchParams();
  
  const [amount, setAmount] = useState('');
  const [selectedSubnet, setSelectedSubnet] = useState('subnet-1');
  const [isStaking, setIsStaking] = useState(false);
  const [subnets, setSubnets] = useState<ApiSubnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValidator, setIsValidator] = useState(false);
  const [validatorInfo, setValidatorInfo] = useState<any>(null);
  const [stakingStats, setStakingStats] = useState<any>(null);

  // Get subnet from URL params if coming from subnet page
  useEffect(() => {
    const subnetFromUrl = searchParams.get('subnet');
    if (subnetFromUrl) {
      setSelectedSubnet(subnetFromUrl);
    }
  }, [searchParams]);

  // Fetch real subnets data
  useEffect(() => {
    const fetchSubnets = async () => {
      try {
        const realSubnets = await getRealSubnets();
        setSubnets(realSubnets);
      } catch (error) {
        console.error('Error fetching subnets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubnets();
  }, []);

  // Fetch real staking statistics
  useEffect(() => {
    const fetchStakingStats = async () => {
      try {
        const response = await fetch('/api/staking/stats');
        if (response.ok) {
          const data = await response.json();
          setStakingStats(data);
        }
      } catch (error) {
        console.error('Error fetching staking stats:', error);
      }
    };

    fetchStakingStats();
  }, []);

  // Check if user is already a validator
  useEffect(() => {
    const checkValidatorStatus = async () => {
      if (!address || !walletClient) return;

      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        
        const stakingContract = new ethers.Contract(
          '0x055491ceb4eC353ceEE6F59CD189Bc8ef799610c',
          [
            'function getValidator(address validator) external view returns (address, string memory, uint256, uint256, string memory, bool, uint256, uint256, uint256)'
          ],
          signer
        );

        const validatorData = await stakingContract.getValidator(address);
        if (validatorData && validatorData[5]) { // active field
          setIsValidator(true);
          setValidatorInfo({
            name: validatorData[1],
            stake: ethers.formatEther(validatorData[2]),
            commission: validatorData[3],
            subnetId: validatorData[4],
            uptime: validatorData[6],
            totalRewards: ethers.formatEther(validatorData[7])
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log('Not a validator or contract error:', errorMessage);
      }
    };

    checkValidatorStatus();
  }, [address, walletClient]);

  const minStake = stakingStats?.minStake || 10000;

  const selectedSubnetData = subnets.find((s) => s.id === selectedSubnet);

  const estimatedRewards = amount && !isNaN(parseFloat(amount))
    ? ((parseFloat(amount) * (selectedSubnetData?.apy || 0)) / 100 / 365).toFixed(4)
    : '0';

  const handleStake = async () => {
    if (!address || !amount || parseFloat(amount) < minStake || !walletClient) return;

    setIsStaking(true);

    try {
      // Connect to Base Sepolia
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Get the staking contract
      const stakingContract = new ethers.Contract(
        '0x055491ceb4eC353ceEE6F59CD189Bc8ef799610c', // ValidatorStaking address
        [
          'function registerValidator(string memory name, string memory subnetId, uint256 commission) external payable',
          'function getValidator(address validator) external view returns (address, string memory, uint256, uint256, string memory, bool, uint256, uint256, uint256)',
          'function getValidatorCount() external view returns (uint256)'
        ],
        signer
      );

      // Get validator name and commission
      const validatorName = `Validator-${address.slice(0, 6)}`;
      const commission = 500; // 5% commission in basis points
      
      console.log('🚀 Registering validator...');
      console.log('📝 Name:', validatorName);
      console.log('🌐 Subnet:', selectedSubnet);
      console.log('💰 Amount:', amount, '01A');
      console.log('📊 Commission:', commission / 100, '%');

      // Register as validator with staking
      const tx = await stakingContract.registerValidator(
        validatorName,
        selectedSubnet,
        commission,
        {
          value: ethers.parseEther(amount)
        }
      );
      
      console.log('⏳ Transaction sent:', tx.hash);
      await tx.wait();
      
      console.log('✅ Successfully registered as validator!');
      alert(`Successfully staked ${amount} 01A! You are now a validator on ${selectedSubnet}.`);
      setAmount('');
      
    } catch (error) {
      console.error('Staking error:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('insufficient funds')) {
        alert('Insufficient ETH balance. Please add ETH to your wallet for gas fees.');
      } else if (errorMessage.includes('Already registered')) {
        alert('You are already registered as a validator.');
      } else if (errorMessage.includes('Insufficient stake')) {
        alert(`Minimum stake required is ${minStake} 01A tokens.`);
      } else {
        alert(`Staking failed: ${errorMessage}`);
      }
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

        {/* Validator Status */}
        {isValidator && validatorInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4 border border-green-500/30" gradient>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="w-4 h-4 border border-green-500 flex items-center justify-center">
                  <span className="text-green-500">✓</span>
                </div>
                <div>
                  <p className="text-green-400 font-bold">YOU ARE A VALIDATOR!</p>
                  <p className="text-gray-300">
                    Name: {validatorInfo.name} | Stake: {validatorInfo.stake} 01A | 
                    Subnet: {validatorInfo.subnetId} | Commission: {validatorInfo.commission / 100}%
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassCard className="p-3" delay={0}>
            <div className="space-y-1 font-mono">
              <Shield className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">TOTAL_STAKED</p>
              <p className="text-lg font-bold text-white">
                {stakingStats?.totalStaked?.toLocaleString() || '0'} 01A
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.05}>
            <div className="space-y-1 font-mono">
              <TrendingUp className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">APY</p>
              <p className="text-lg font-bold text-white">
                {stakingStats?.apy || '0.0'}%
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.1}>
            <div className="space-y-1 font-mono">
              <Users className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">VALIDATORS</p>
              <p className="text-lg font-bold text-white">
                {stakingStats?.totalValidators || '0'}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.15}>
            <div className="space-y-1 font-mono">
              <Award className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">EPOCH_REWARD</p>
              <p className="text-lg font-bold text-white">
                {stakingStats?.epochReward?.toLocaleString() || '0'} 01A
              </p>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staking Form */}
          {!isValidator ? (
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
                              ? 'border-[#0201ff] bg-[#0201ff]/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-bold text-white">{subnet.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                [{subnet.taskType}]
                              </p>
                            </div>
                            {selectedSubnet === subnet.id && (
                              <span className="text-[#0201ff] text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-500">APY: {subnet.apy}%</span>
                            <span className="text-gray-500">{subnet.validatorCount} validators</span>
                          </div>
                        </button>
                        
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 border border-white/20 rounded text-xs text-white max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="text-center">
                            <p className="font-bold text-[#0201ff] mb-1">{subnet.name}</p>
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
                    className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">ESTIMATED_DAILY_REWARDS</p>
                        <p className="text-2xl font-bold text-[#0201ff] mt-1">
                          {estimatedRewards} 01A
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-[#0201ff]" />
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
                      ? 'border-[#0201ff] text-[#0201ff] cursor-wait'
                      : 'border-[#0201ff] text-[#0201ff] hover:bg-[#0201ff] hover:text-black'
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
          ) : (
            <div className="lg:col-span-2 space-y-4">
              <GlassCard className="p-6" gradient>
                <div className="space-y-6 font-mono text-center">
                  <h2 className="text-lg font-bold text-white">[ VALIDATOR_DASHBOARD ]</h2>
                  <div className="space-y-4">
                    <p className="text-green-400 font-bold">✓ You are already a validator!</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name:</p>
                        <p className="text-white">{validatorInfo?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Stake:</p>
                        <p className="text-white">{validatorInfo?.stake} 01A</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Subnet:</p>
                        <p className="text-white">{validatorInfo?.subnetId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Commission:</p>
                        <p className="text-white">{validatorInfo?.commission / 100}%</p>
                      </div>
                    </div>
                    <Link href="/validators">
                      <button className="w-full px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-sm">
                        [VIEW_VALIDATORS]
                      </button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

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
                    <span className="text-[#0201ff]">✓</span>
                    <p>Minimum {minStake.toLocaleString()} 01A tokens</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff]">✓</span>
                    <p>Stable internet connection (99% uptime)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff]">✓</span>
                    <p>8GB RAM, 4 CPU cores minimum</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff]">✓</span>
                    <p>500GB SSD storage</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff]">✓</span>
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
                    <span className="text-[#0201ff] mt-0.5">1.</span>
                    <p>Stake your 01A tokens above</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">2.</span>
                    <p>Setup validator node using our CLI</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">3.</span>
                    <p>Configure your validator keys</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">4.</span>
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

export default function StakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="text-white font-mono">Loading...</div>
    </div>}>
      <StakePageContent />
    </Suspense>
  );
}

