'use client';

import { motion } from 'framer-motion';
import { Layers, TrendingUp, Users, Award, ArrowRight, Cpu, Camera, Database, Headphones } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { mockSubnets, Subnet } from '@/lib/mock-data';

const taskTypeColors = {
  LLM: 'from-blue-500 to-purple-500',
  Vision: 'from-green-500 to-teal-500',
  Embedding: 'from-orange-500 to-pink-500',
  Audio: 'from-yellow-500 to-red-500',
};

const taskTypeIcons = {
  LLM: Cpu,
  Vision: Camera,
  Embedding: Database,
  Audio: Headphones,
};

export default function SubnetsPage() {
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
            <span className="text-white">$</span> subnets.list()
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-mono">
            [ AI_SUBNETS ]
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {'>'} Specialized networks for AI tasks | Join as miner or validator
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassCard gradient delay={0}>
            <div className="text-center space-y-1 font-mono">
              <Layers className="w-5 h-5 text-white mx-auto" />
              <p className="text-xl font-bold text-white">
                {mockSubnets.length}
              </p>
              <p className="text-[10px] text-gray-400 uppercase">Subnets</p>
            </div>
          </GlassCard>
          <GlassCard gradient delay={0.1}>
            <div className="text-center space-y-1 font-mono">
              <Users className="w-5 h-5 text-white mx-auto" />
              <p className="text-xl font-bold text-white">
                {mockSubnets.reduce((acc, s) => acc + s.validatorCount, 0)}
              </p>
              <p className="text-[10px] text-gray-400 uppercase">Validators</p>
            </div>
          </GlassCard>
          <GlassCard gradient delay={0.2}>
            <div className="text-center space-y-1 font-mono">
              <Award className="w-5 h-5 text-white mx-auto" />
              <p className="text-xl font-bold text-white">
                {mockSubnets.reduce((acc, s) => acc + s.minerCount, 0)}
              </p>
              <p className="text-[10px] text-gray-400 uppercase">Miners</p>
            </div>
          </GlassCard>
          <GlassCard gradient delay={0.3}>
            <div className="text-center space-y-1 font-mono">
              <TrendingUp className="w-5 h-5 text-white mx-auto" />
              <p className="text-xl font-bold text-white">
                {(
                  mockSubnets.reduce((acc, s) => acc + s.apy, 0) /
                  mockSubnets.length
                ).toFixed(1)}
                %
              </p>
              <p className="text-[10px] text-gray-400 uppercase">Avg APY</p>
            </div>
          </GlassCard>
        </div>

        {/* Subnets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockSubnets.map((subnet, idx) => (
            <SubnetCard key={subnet.id} subnet={subnet} delay={idx * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubnetCard({ subnet, delay }: { subnet: Subnet; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Link href={`/subnets/${subnet.id}`}>
        <GlassCard hover className="p-4 h-full font-mono" gradient>
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 border border-white/20 rounded">
                  {(() => {
                    const IconComponent = taskTypeIcons[subnet.taskType];
                    return <IconComponent className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{subnet.name}</h3>
                  <span className="inline-block px-2 py-0.5 border border-white/30 text-[10px] font-medium text-white mt-1">
                    [{subnet.taskType}]
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
            </div>

            {/* Description */}
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {subnet.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="space-y-0.5">
                <p className="text-gray-500 uppercase">STAKED</p>
                <p className="text-sm font-bold text-white">{subnet.totalStaked}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gray-500 uppercase">REWARD</p>
                <p className="text-sm font-bold text-white">{subnet.epochReward}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gray-500 uppercase">VALIDATORS</p>
                <p className="text-sm font-bold text-white">{subnet.validatorCount}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gray-500 uppercase">MINERS</p>
                <p className="text-sm font-bold text-white">{subnet.minerCount}</p>
              </div>
            </div>

            {/* APY Badge */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">ANNUAL_APY</span>
                <span className="text-lg font-bold text-white">
                  {subnet.apy}%
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

