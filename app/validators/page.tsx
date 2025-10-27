'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Shield, Trophy, Star } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { ValidatorChat } from '@/components/ValidatorChat';
import { generateMockValidators } from '@/lib/mock-data';
import { getRealValidators } from '@/lib/real-data';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ValidatorsPage() {
  const [sortBy, setSortBy] = useState<'stake' | 'uptime' | 'rewards'>('stake');
  const [allValidators, setAllValidators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        console.log('Fetching real validators...');
        const realValidators = await getRealValidators();
        console.log('Real validators:', realValidators);
        
        if (realValidators.length > 0) {
          // Convert real validators to display format
          const displayValidators = realValidators.map(validator => ({
            id: validator.address,
            name: validator.name,
            address: validator.address,
            stake: validator.stake,
            commission: validator.commission,
            uptime: validator.uptime,
            totalRewards: validator.totalRewards,
            subnetId: validator.subnetId,
            location: validator.location,
            active: validator.active,
            rank: validator.rank
          }));
          
          setAllValidators(displayValidators);
          console.log('Set real validators:', displayValidators);
        } else {
          // Fallback to mock data if no real validators
          const mockValidators = generateMockValidators().slice(0, 7);
          setAllValidators(mockValidators);
          console.log('Using mock validators as fallback');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching validators:', error);
        // Fallback to mock data
        const mockValidators = generateMockValidators().slice(0, 7);
        setAllValidators(mockValidators);
        setIsLoading(false);
      }
    };

    fetchValidators();
  }, []);

  const sortedValidators = [...allValidators].sort((a, b) => {
    if (sortBy === 'stake') {
      return (
        parseFloat(b.stake.replace(/[^0-9.]/g, '')) -
        parseFloat(a.stake.replace(/[^0-9.]/g, ''))
      );
    } else if (sortBy === 'uptime') {
      return b.uptime - a.uptime;
    } else {
      return (
        parseFloat(b.totalRewards.replace(/[^0-9.]/g, '')) -
        parseFloat(a.totalRewards.replace(/[^0-9.]/g, ''))
      );
    }
  });

  // Update ranks
  sortedValidators.forEach((v, i) => (v.rank = i + 1));

  const totalStake = allValidators.length > 0 ? allValidators.reduce(
    (acc, v) => acc + parseFloat(v.stake.replace(/[^0-9.]/g, '')),
    0
  ) : 0;
  const avgUptime = allValidators.length > 0 ?
    allValidators.reduce((acc, v) => acc + v.uptime, 0) / allValidators.length : 0;
  const totalRewards = allValidators.length > 0 ? allValidators.reduce(
    (acc, v) => acc + parseFloat(v.totalRewards.replace(/[^0-9.]/g, '')),
    0
  ) : 0;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="text-xs text-gray-500 font-mono">
            <span className="text-white">$</span> validators.query()
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-mono">
            [ VALIDATORS ]
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {'>'} Network validators securing the AI Layer-2 | Stake 01A to earn rewards
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassCard gradient delay={0}>
            <div className="space-y-1 font-mono">
              <Users className="w-4 h-4 text-white" />
              <p className="text-[10px] text-gray-500 uppercase">VALIDATORS</p>
              <p className="text-xl font-bold text-white">{allValidators.length}</p>
            </div>
          </GlassCard>

          <GlassCard gradient delay={0.1}>
            <div className="space-y-1 font-mono">
              <Shield className="w-4 h-4 text-white" />
              <p className="text-[10px] text-gray-500 uppercase">STAKED</p>
              <p className="text-xl font-bold text-white">
                {totalStake.toFixed(0)}
              </p>
            </div>
          </GlassCard>

          <GlassCard gradient delay={0.2}>
            <div className="space-y-1 font-mono">
              <TrendingUp className="w-4 h-4 text-white" />
              <p className="text-[10px] text-gray-500 uppercase">AVG_UPTIME</p>
              <p className="text-xl font-bold text-white">
                {avgUptime.toFixed(1)}%
              </p>
            </div>
          </GlassCard>

          <GlassCard gradient delay={0.3}>
            <div className="space-y-1 font-mono">
              <Award className="w-4 h-4 text-white" />
              <p className="text-[10px] text-gray-500 uppercase">REWARDS</p>
              <p className="text-xl font-bold text-white">
                {totalRewards.toFixed(0)}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* CTA Card */}
        <GlassCard className="p-4" gradient>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 font-mono">
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-bold text-white">[ BECOME_VALIDATOR ]</h2>
              <p className="text-[10px] text-gray-400">
                {'>'} Stake 01A tokens | Min: 10,000 01A | Earn rewards
              </p>
            </div>
            <Link href="/stake">
              <button className="flex items-center gap-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-xs">
                <Shield className="w-3 h-3" />
                [STAKE_NOW]
              </button>
            </Link>
          </div>
        </GlassCard>

        {/* Sort Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 font-mono">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            [ LEADERBOARD ]
          </h2>
          <div className="flex items-center gap-2 glass-panel p-1">
            <span className="text-[10px] text-gray-500 px-2">SORT:</span>
            <button
              onClick={() => setSortBy('stake')}
              className={`px-3 py-1 text-[10px] font-medium transition-all ${
                sortBy === 'stake'
                  ? 'bg-[#0201ff] text-black border border-[#0201ff]'
                  : 'text-white hover:bg-white hover:text-black border border-transparent hover:border-white'
              }`}
            >
              [STAKE]
            </button>
            <button
              onClick={() => setSortBy('uptime')}
              className={`px-3 py-1 text-[10px] font-medium transition-all ${
                sortBy === 'uptime'
                  ? 'bg-[#0201ff] text-black border border-[#0201ff]'
                  : 'text-white hover:bg-white hover:text-black border border-transparent hover:border-white'
              }`}
            >
              [UPTIME]
            </button>
            <button
              onClick={() => setSortBy('rewards')}
              className={`px-3 py-1 text-[10px] font-medium transition-all ${
                sortBy === 'rewards'
                  ? 'bg-[#0201ff] text-black border border-[#0201ff]'
                  : 'text-white hover:bg-white hover:text-black border border-transparent hover:border-white'
              }`}
            >
              [REWARDS]
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Validators Table */}
          <div className="lg:col-span-2">
            <GlassCard className="h-[600px]" gradient>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-x-auto font-mono">
                  <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        RANK
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        VALIDATOR
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        SUBNET
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        LOCATION
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        STAKE
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        COMMISSION
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        UPTIME
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        REWARDS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400 font-mono">
                          Loading real validators from L2 network...
                        </td>
                      </tr>
                    ) : sortedValidators.length > 0 ? (
                      sortedValidators.map((validator, idx) => (
                      <motion.tr
                        key={`${validator.address}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1">
                            {idx < 3 && (
                              <Star className="w-3 h-3 text-[#0201ff] fill-[#0201ff]" />
                            )}
                            <span className={`font-bold text-xs ${idx === 0 ? 'text-[#0201ff]' : 'text-white'}`}>
                              #{validator.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div>
                            <p className="text-white font-bold text-xs">{validator.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {validator.address}
                            </p>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-block px-2 py-0.5 border border-white/30 text-[10px] font-medium text-white">
                            {validator.subnetId}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-gray-300 text-xs font-mono">
                            {validator.location}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-white font-bold text-xs">{validator.stake}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-gray-300 text-xs">
                            {validator.commission.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-white"
                                style={{ width: `${validator.uptime}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-white font-medium">
                              {validator.uptime.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-white font-bold text-xs">
                            {validator.totalRewards}
                          </span>
                        </td>
                      </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400 font-mono">
                          No validators found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Validator Chat */}
          <div className="lg:col-span-1">
            <ValidatorChat 
              validatorData={allValidators} 
              transactionData={[]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

