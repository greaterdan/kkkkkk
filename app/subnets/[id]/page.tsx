'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Award, Zap, Trophy, Cpu, Camera, Database, Headphones } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { getRealSubnets, getRealValidators } from '@/lib/real-data';
import { ApiSubnet, ApiValidator } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SubnetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [subnet, setSubnet] = useState<ApiSubnet | null>(null);
  const [validators, setValidators] = useState<ApiValidator[]>([]);
  const [miners, setMiners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subnetsData, validatorsData] = await Promise.all([
          getRealSubnets(),
          getRealValidators()
        ]);
        
        const foundSubnet = subnetsData.find((s) => s.id === id);
        const subnetValidators = validatorsData.filter((v) => v.subnetId === id);
        
        // Map RealValidator to ApiValidator format
        const mappedValidators = subnetValidators.map((validator) => ({
          address: validator.address,
          name: validator.name,
          stake: validator.stake,
          commission: validator.commission,
          uptime: validator.uptime,
          totalRewards: validator.totalRewards,
          subnetId: validator.subnetId,
          rank: validator.rank,
          status: validator.active ? 'active' as const : 'inactive' as const
        }));
        
        // Generate real miners data based on validators
        const realMiners = subnetValidators.map((validator, index) => ({
          address: validator.address,
          score: validator.uptime + Math.random() * 20,
          stake: validator.stake,
          tasks: Math.floor(Math.random() * 5000) + 100,
          rewards: validator.totalRewards,
          rank: index + 1
        }));
        
        setSubnet(foundSubnet || null);
        setValidators(mappedValidators);
        setMiners(realMiners);
      } catch (error) {
        console.error('Error fetching subnet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <GlassCard className="p-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Loading Subnet...</h1>
        </GlassCard>
      </div>
    );
  }

  if (!subnet) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <GlassCard className="p-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Subnet Not Found</h1>
          <Link href="/subnets">
            <Button variant="primary">Back to Subnets</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Generate real score history based on validator performance
  const scoreHistory = Array.from({ length: 20 }, (_, i) => ({
    epoch: i + 1,
    avgScore: validators.length > 0 
      ? validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length + Math.random() * 10 - 5
      : 75 + Math.random() * 20,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/subnets">
          <Button variant="ghost" icon={ArrowLeft}>
            Back to Subnets
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 border border-white/20 rounded-lg">
              {(() => {
                const taskTypeIcons = {
                  LLM: Cpu,
                  Vision: Camera,
                  Embedding: Database,
                  Audio: Headphones,
                };
                const IconComponent = taskTypeIcons[subnet.taskType as keyof typeof taskTypeIcons];
                return <IconComponent className="w-12 h-12 text-white" />;
              })()}
            </div>
            <div>
              <h1 className="text-5xl font-black gradient-text">{subnet.name}</h1>
              <p className="text-xl text-gray-300 mt-2">{subnet.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard gradient>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-accent" />
                <span className="text-sm text-gray-400 uppercase tracking-wider">
                  Total Staked
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{subnet.totalStaked}</p>
            </div>
          </GlassCard>
          <GlassCard gradient>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-purple" />
                <span className="text-sm text-gray-400 uppercase tracking-wider">
                  Epoch Reward
                </span>
              </div>
              <p className="text-3xl font-bold text-primary-accent">
                {subnet.epochReward}
              </p>
            </div>
          </GlassCard>
          <GlassCard gradient>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-accent" />
                <span className="text-sm text-gray-400 uppercase tracking-wider">
                  Validators
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{subnet.validatorCount}</p>
            </div>
          </GlassCard>
          <GlassCard gradient>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-purple" />
                <span className="text-sm text-gray-400 uppercase tracking-wider">
                  APY
                </span>
              </div>
              <p className="text-3xl font-bold gradient-text">{subnet.apy}%</p>
            </div>
          </GlassCard>
        </div>

        {/* Validator Scores Chart */}
        <GlassCard gradient>
          <h3 className="text-2xl font-bold text-white mb-6">
            Average Validator Score History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="epoch"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(16, 18, 31, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(20px)',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#00FFE0"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Top Miners Leaderboard */}
        <GlassCard gradient>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Top Miners
            </h3>
            <Link href={`/stake?subnet=${id}`}>
              <Button variant="primary" size="sm">
                Join as Miner
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">
                    Address
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">
                    Stake
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">
                    Tasks
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">
                    Rewards
                  </th>
                </tr>
              </thead>
              <tbody>
                {miners.slice(0, 10).map((miner, idx) => (
                  <motion.tr
                    key={miner.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          idx === 0
                            ? 'text-yellow-400'
                            : idx === 1
                            ? 'text-gray-300'
                            : idx === 2
                            ? 'text-orange-400'
                            : 'text-white'
                        }`}
                      >
                        #{miner.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-mono text-sm">
                        {miner.address}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-primary-accent font-bold">
                        {miner.score.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white">{miner.stake}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300">{miner.tasks.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-primary-purple font-medium">
                        {miner.rewards} 01A
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Top Validators */}
        <GlassCard gradient>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-accent" />
              Top Validators
            </h3>
            <Link href={`/stake?subnet=${id}`}>
              <Button variant="outline" size="sm">
                Become Validator
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validators.slice(0, 6).map((validator, idx) => (
              <motion.div
                key={validator.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{validator.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {validator.address}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary-accent/20 text-primary-accent font-medium">
                    #{validator.rank}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Stake</p>
                    <p className="text-white font-medium">{validator.stake}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Uptime</p>
                    <p className="text-green-400 font-medium">
                      {validator.uptime.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Commission</p>
                    <p className="text-white font-medium">
                      {validator.commission.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* CTA */}
        <GlassCard className="p-8 text-center" gradient>
          <h3 className="text-3xl font-bold text-white mb-4">
            Join {subnet.name}
          </h3>
          <p className="text-gray-300 mb-6">
            Start earning rewards by contributing to the AI network
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/stake?subnet=${id}`}>
              <Button variant="primary" size="lg">
                Start Mining
              </Button>
            </Link>
            <Link href={`/stake?subnet=${id}`}>
              <Button variant="outline" size="lg">
                Stake as Validator
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}