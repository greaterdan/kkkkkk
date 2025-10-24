'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Camera, Database, Headphones, ArrowRight, TrendingUp, Users, Award, Zap, Activity, Brain, Network, Heart } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { getRealSubnets } from '@/lib/real-data';
import { ApiSubnet } from '@/lib/api';

export default function SubnetsPage() {
  const [subnets, setSubnets] = useState<ApiSubnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubnet, setSelectedSubnet] = useState<string | null>(null);
  const [liveTasks, setLiveTasks] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const meshRef = useRef<HTMLDivElement>(null);

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

  // Generate live tasks for each subnet
  useEffect(() => {
    if (subnets.length > 0) {
      const generateLiveTasks = () => {
        const tasks = subnets.flatMap(subnet => {
          const taskCount = Math.floor(Math.random() * 5) + 1;
          return Array.from({ length: taskCount }, (_, i) => ({
            id: `${subnet.id}-task-${i}`,
            subnetId: subnet.id,
            subnetName: subnet.name,
            taskType: subnet.taskType,
            description: generateTaskDescription(subnet.taskType),
            status: Math.random() > 0.3 ? 'processing' : 'completed',
            progress: Math.floor(Math.random() * 100),
            timestamp: Date.now() - Math.random() * 300000, // Last 5 minutes
            validator: `Validator-${Math.floor(Math.random() * 10) + 1}`,
            reward: (Math.random() * 10 + 1).toFixed(2)
          }));
        });
        setLiveTasks(tasks);
      };

      generateLiveTasks();
      const interval = setInterval(generateLiveTasks, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [subnets]);

  const generateTaskDescription = (taskType: string) => {
    const descriptions = {
      LLM: ['Processing GPT-4 inference request', 'Fine-tuning language model', 'Generating text completion', 'Analyzing sentiment', 'Translating content'],
      Vision: ['Classifying image objects', 'Detecting faces in video', 'Segmenting medical images', 'Processing satellite data', 'Analyzing artwork'],
      Embedding: ['Creating vector embeddings', 'Building semantic search index', 'Processing document chunks', 'Generating similarity scores', 'Updating knowledge base'],
      Audio: ['Transcribing speech to text', 'Generating voice synthesis', 'Processing music analysis', 'Converting audio formats', 'Detecting audio patterns']
    };
    const typeDescriptions = descriptions[taskType as keyof typeof descriptions] || descriptions.LLM;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  };

  const taskTypeIcons = {
    LLM: Cpu,
    Vision: Camera,
    Embedding: Database,
    Audio: Headphones,
  };

  const taskTypeColors = {
    LLM: 'text-blue-400',
    Vision: 'text-green-400', 
    Embedding: 'text-purple-400',
    Audio: 'text-orange-400',
  };

  const taskTypeGradients = {
    LLM: 'from-blue-500/20 to-cyan-500/20',
    Vision: 'from-green-500/20 to-emerald-500/20',
    Embedding: 'from-purple-500/20 to-violet-500/20', 
    Audio: 'from-orange-500/20 to-yellow-500/20',
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
          <h1 className="text-6xl font-black gradient-text">AI Mesh Network</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Live AI subnet activity. Watch real-time task processing across the decentralized network.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-white text-xl">Loading subnets...</div>
        ) : (
          <div className="space-y-8">
            {/* Mesh Network Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subnets.map((subnet, idx) => {
                const IconComponent = taskTypeIcons[subnet.taskType as keyof typeof taskTypeIcons];
                const subnetTasks = liveTasks.filter(task => task.subnetId === subnet.id);
                const activeTasks = subnetTasks.filter(t => t.status === 'processing').length;
                
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

                          {/* Live Activity Indicator */}
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {activeTasks > 0 ? (
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 font-mono">
                              {activeTasks} Active Tasks
                            </span>
                          </div>

                          {/* Live Tasks */}
                          <div className="space-y-2 max-h-24 overflow-y-auto">
                            {subnetTasks.slice(0, 2).map((task) => (
                              <div key={task.id} className="flex items-center gap-2 text-xs">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  task.status === 'processing' ? 'bg-blue-400' : 'bg-green-400'
                                }`} />
                                <span className="text-gray-300 truncate">{task.description}</span>
                                <span className="text-primary-gold font-mono">{task.progress}%</span>
                              </div>
                            ))}
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

            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-primary-gold" />
                  <h3 className="text-2xl font-bold text-white">Live Network Activity</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveTasks.slice(0, 6).map((task, idx) => {
                    const IconComponent = taskTypeIcons[task.taskType as keyof typeof taskTypeIcons];
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-lg border border-white/10 bg-black/20"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className="w-5 h-5 text-white" />
                          <span className="text-sm font-medium text-white">{task.subnetName}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === 'processing' ? 'bg-blue-400' : 'bg-green-400'
                          }`} />
                        </div>
                        <p className="text-xs text-gray-300 mb-2">{task.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">{task.validator}</span>
                          <span className="text-primary-gold font-mono">+{task.reward} 01A</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
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
        )}
      </div>
    </div>
  );
}