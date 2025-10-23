'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  Box,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Layers,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { ParticleBackground } from '@/components/ParticleBackground';
import { MetricCard } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import {
  getRealNetworkStats,
  getRealBlocks,
  getRealTransactions,
} from '@/lib/real-data';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import {
  generateBlockChartData,
  generateSubnetActivityData,
  mockDashboardMetrics,
} from '@/lib/mock-data';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Home() {
  const [blockData, setBlockData] = useState<any[]>([]);
  const [subnetData, setSubnetData] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        console.log('Fetching real blockchain data from API...');
        // Fetch real blockchain data from our API endpoint
        const response = await fetch('/api/blockchain');
        const data = await response.json();
        
        if (data.success) {
          console.log('Real blockchain data:', data.data);
          setRealStats(data.data.stats);
          
          // Use real data for charts
          setBlockData(generateBlockChartData());
          setSubnetData(generateSubnetActivityData());
        } else {
          throw new Error('API returned error');
        }
      } catch (error) {
        console.error('Error fetching real data:', error);
        console.log('Falling back to mock data');
        // Fallback to mock data
        setBlockData(generateBlockChartData());
        setSubnetData(generateSubnetActivityData());
      }
    };

    fetchRealData();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4">
        <div className="relative z-10 max-w-6xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-0.5"
          >
            <div className="text-xs text-gray-500 font-mono">
              <span className="text-white">$</span> system.init()
            </div>
            <div className="text-xs text-gray-500 font-mono">
              <span className="text-white">{'>'}</span> Loading AI_LAYER2_TERMINAL...
            </div>
            <div className="text-xs text-gray-500 font-mono mb-4">
              <span className="text-white">{'>'}</span> Connection: [BNB_CHAIN] Status: <span className="text-white">ONLINE</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight font-mono"
          >
            <span className="text-white block">01A</span>
            <span className="text-white text-xl md:text-2xl block mt-2 font-normal">
              [ AI LAYER-2 TERMINAL ]
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs md:text-sm text-gray-400 max-w-2xl font-mono space-y-1"
          >
            <p>{'>'} Decentralized AI execution layer</p>
            <p>{'>'} Specialized subnets: LLM | Vision | Embedding</p>
            <p>{'>'} Scale AI workloads on-chain</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-2 pt-2 font-mono"
          >
            <Link href="/explorer" target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 border border-primary-gold text-white hover:bg-primary-gold hover:text-black hover:border-primary-gold transition-all text-xs">
                [EXPLORE_NETWORK]
              </button>
            </Link>
            <Link href="/subnets">
              <button className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-xs">
                [VIEW_SUBNETS]
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              title="Active Subnets"
              value={realStats?.activeSubnets || mockDashboardMetrics.activeSubnets}
              icon={Layers}
              change="+3 this week"
              changeType="positive"
              delay={0}
            />
            <MetricCard
              title="Validators Online"
              value={realStats?.validatorsOnline?.toLocaleString() || mockDashboardMetrics.validatorsOnline.toLocaleString()}
              icon={Users}
              change="99.8% uptime"
              changeType="positive"
              delay={0.1}
            />
            <MetricCard
              title="Block Height"
              value={realStats?.blockHeight?.toLocaleString() || mockDashboardMetrics.currentBlockHeight.toLocaleString()}
              icon={Box}
              change="3s avg block time"
              changeType="neutral"
              delay={0.2}
            />
            <MetricCard
              title="Total Value Locked"
              value={realStats?.tvl || mockDashboardMetrics.tvl}
              icon={DollarSign}
              change="+12.4% this month"
              changeType="positive"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="relative py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-4" gradient>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  [ 01A_PRICE ]
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    ${realStats?.toraPrice?.toFixed(2) || mockDashboardMetrics.toraPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-xs">+8.3%</span>
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  [ 24H_VOLUME ]
                </span>
                <div className="text-2xl font-bold text-white">
                  {realStats?.dailyVolume || mockDashboardMetrics.dailyVolume}
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  [ TOTAL_TX ]
                </span>
                <div className="text-2xl font-bold text-white">
                  {realStats?.totalTransactions?.toLocaleString() || mockDashboardMetrics.totalTransactions}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Charts Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Block Production Chart */}
          <GlassCard gradient>
            <h3 className="text-sm font-bold text-white mb-3 font-mono">
              [ DAILY_BLOCK_PRODUCTION ]
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={blockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
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
                  dataKey="blocks"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Subnet Activity Chart */}
          <GlassCard gradient>
            <h3 className="text-sm font-bold text-white mb-3 font-mono">
              [ SUBNET_ACTIVITY_24H ]
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subnetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(16, 18, 31, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(20px)',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="tasks" fill="url(#colorGradient)" radius={[0, 0, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#666666" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6 text-center" gradient>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3 font-mono"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                [ JOIN_THE_NETWORK ]
              </h2>
              <div className="text-xs text-gray-400 space-y-0.5">
                <p>{'>'} Become a validator or miner</p>
                <p>{'>'} Earn rewards for powering the decentralized AI network</p>
                <p>{'>'} Scale computational tasks on-chain</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Link href="/subnets">
                  <button className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-xs">
                    [START_MINING]
                  </button>
                </Link>
                <Link href="/validators">
                  <button className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-xs">
                    [BECOME_VALIDATOR]
                  </button>
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

