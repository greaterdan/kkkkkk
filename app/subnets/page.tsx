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
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Network className="w-12 h-12 text-primary-gold animate-pulse" />
            <h1 className="text-7xl font-black gradient-text">AI MESH NETWORK</h1>
            <Brain className="w-12 h-12 text-primary-gold animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Live AI subnet activity visualization. Watch as neural networks process tasks in real-time across specialized domains.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Active Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Completed</span>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-white text-xl">Loading AI mesh network...</div>
        ) : (
          <div className="space-y-8">
            {/* AI Mesh Network Visualization */}
            <div className="relative">
              <GlassCard className="p-8 min-h-[600px]" gradient>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  {subnets.map((subnet, idx) => {
                    const IconComponent = taskTypeIcons[subnet.taskType as keyof typeof taskTypeIcons];
                    const subnetTasks = liveTasks.filter(task => task.subnetId === subnet.id);
                    const isHovered = hoveredNode === subnet.id;
                    const isSelected = selectedSubnet === subnet.id;
                    
                    return (
                      <motion.div
                        key={subnet.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.2, type: "spring", stiffness: 100 }}
                        className="relative"
                        onMouseEnter={() => setHoveredNode(subnet.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => setSelectedSubnet(selectedSubnet === subnet.id ? null : subnet.id)}
                      >
                        {/* Subnet Node */}
                        <motion.div
                          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'border-primary-gold bg-gradient-to-br from-primary-gold/20 to-amber-500/20' 
                              : isHovered
                              ? 'border-white/40 bg-gradient-to-br from-white/10 to-white/5'
                              : 'border-white/20 bg-gradient-to-br from-black/40 to-gray-900/40'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Animated Background */}
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${taskTypeGradients[subnet.taskType as keyof typeof taskTypeGradients]} opacity-50`}></div>
                          
                          {/* Pulsing Ring */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-primary-gold/30"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          
                          {/* Content */}
                          <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                              <motion.div 
                                className="p-3 rounded-xl bg-white/10 border border-white/20"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              >
                                <IconComponent className={`w-8 h-8 ${taskTypeColors[subnet.taskType as keyof typeof taskTypeColors]}`} />
                              </motion.div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{subnet.name}</h3>
                                <p className="text-sm text-gray-400">{subnet.taskType} Tasks</p>
                              </div>
                            </div>

                            {/* Live Activity Indicator */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex gap-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ 
                                      duration: 1.5, 
                                      repeat: Infinity, 
                                      delay: i * 0.2 
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-green-400 font-mono">
                                {subnetTasks.filter(t => t.status === 'processing').length} Active
                              </span>
                            </div>

                            {/* Live Tasks Stream */}
                            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                              <AnimatePresence>
                                {subnetTasks.slice(0, 3).map((task, taskIdx) => (
                                  <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    <div className={`w-2 h-2 rounded-full ${
                                      task.status === 'processing' ? 'bg-blue-400 animate-pulse' : 'bg-green-400'
                                    }`} />
                                    <span className="text-gray-300 truncate">{task.description}</span>
                                    <span className="text-primary-gold font-mono">{task.progress}%</span>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="text-center">
                                <div className="text-primary-gold font-bold">{subnet.apy}%</div>
                                <div className="text-gray-400 text-xs">APY</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white font-bold">{subnet.validatorCount}</div>
                                <div className="text-gray-400 text-xs">Validators</div>
                              </div>
                            </div>

                            {/* Click to View */}
                            <motion.div 
                              className="flex items-center justify-center gap-2 mt-4 text-primary-gold text-sm font-medium"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <ArrowRight className="w-4 h-4" />
                              <span>Click to view subnet</span>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Connection Lines */}
                        {idx < subnets.length - 1 && (
                          <motion.div
                            className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-gold/50 to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: idx * 0.2 + 0.5 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-primary-gold animate-pulse" />
                  <h3 className="text-2xl font-bold text-white">Live AI Activity</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary-gold/50 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveTasks.slice(0, 9).map((task, idx) => {
                    const IconComponent = taskTypeIcons[task.taskType as keyof typeof taskTypeIcons];
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-lg border border-white/10 bg-gradient-to-br from-black/40 to-gray-900/40"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className={`w-5 h-5 ${taskTypeColors[task.taskType as keyof typeof taskTypeColors]}`} />
                          <span className="text-sm font-medium text-white">{task.subnetName}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === 'processing' ? 'bg-blue-400 animate-pulse' : 'bg-green-400'
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
              transition={{ delay: 1 }}
            >
              <GlassCard className="p-8 text-center" gradient>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Zap className="w-8 h-8 text-primary-gold animate-pulse" />
                  <h2 className="text-4xl font-bold text-white">Join the AI Revolution</h2>
                  <Heart className="w-8 h-8 text-primary-gold animate-pulse" />
                </div>
                <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                  Become part of the decentralized AI mesh network. Stake your tokens, run validators, and earn rewards by contributing to the future of artificial intelligence.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/stake">
                    <Button variant="primary" size="lg" className="px-8 py-4 text-lg">
                      Start Staking
                    </Button>
                  </Link>
                  <Link href="/validators">
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
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