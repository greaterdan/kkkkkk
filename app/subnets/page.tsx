'use client';

import { motion } from 'framer-motion';
import { Cpu, Camera, Database, Headphones, ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { mockSubnets } from '@/lib/mock-data';

export default function SubnetsPage() {
  const taskTypeIcons = {
    LLM: Cpu,
    Vision: Camera,
    Embedding: Database,
    Audio: Headphones,
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-black gradient-text">AI Subnets</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Specialized networks for different AI tasks. Choose your expertise and start earning rewards.
          </p>
        </motion.div>

        {/* Subnets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSubnets.map((subnet, idx) => {
            const IconComponent = taskTypeIcons[subnet.taskType];
            return (
              <motion.div
                key={subnet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/subnets/${subnet.id}`}>
                  <GlassCard className="h-full cursor-pointer hover:scale-105 transition-all duration-300" gradient>
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 border border-white/20 rounded-lg">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{subnet.name}</h3>
                          <p className="text-sm text-gray-400">{subnet.taskType} Tasks</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {subnet.description}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-primary-accent" />
                            <span className="text-xs text-gray-400">APY</span>
                          </div>
                          <p className="text-lg font-bold text-primary-accent">{subnet.apy}%</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-primary-purple" />
                            <span className="text-xs text-gray-400">Validators</span>
                          </div>
                          <p className="text-lg font-bold text-white">{subnet.validatorCount}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Staked</span>
                          <span className="text-white font-medium">{subnet.totalStaked}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Epoch Reward</span>
                          <span className="text-primary-purple font-medium">{subnet.epochReward}</span>
                        </div>
                      </div>

                      {/* Click indicator */}
                      <div className="flex items-center justify-center text-primary-accent text-sm font-medium">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Click to view subnet
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-8 text-center" gradient>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Mining?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join the 01A LABS network and start earning rewards by contributing to AI tasks.
              Choose your subnet and begin your journey as a validator or miner.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/stake">
                <Button variant="primary" size="lg">
                  Start Staking
                </Button>
              </Link>
              <Link href="/validators">
                <Button variant="outline" size="lg">
                  View Validators
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}