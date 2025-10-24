'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Camera, Database, Headphones, ArrowRight, TrendingUp, Users, Award, Zap, Activity, Brain, Network, Heart } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { getRealSubnets } from '@/lib/real-data';
import { ApiSubnet } from '@/lib/api';
import LinearRegressionChart from '../components/LinearRegressionChart';
import KMeansChart from '../components/KMeansChart';

export default function SubnetsPage() {
  const [subnets, setSubnets] = useState<ApiSubnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveTasks, setLiveTasks] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [subnetTasks, setSubnetTasks] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [allSubnetTasks, setAllSubnetTasks] = useState<any[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubnets = async () => {
      try {
        const realSubnets = await getRealSubnets();
        setSubnets(realSubnets);
        
        // Fetch tasks from ALL subnets for ML charts
        fetchAllSubnetTasks();
      } catch (error) {
        console.error('Error fetching subnets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubnets();
  }, []);

  const fetchAllSubnetTasks = async () => {
    try {
      const allTasks = [];
      const subnetIds = ['subnet-1', 'subnet-2', 'subnet-3', 'subnet-4', 'subnet-5', 'subnet-6', 'subnet-7'];
      
      for (const subnetId of subnetIds) {
        const response = await fetch(`/api/subnets/tasks?subnetId=${subnetId}`);
        if (response.ok) {
          const data = await response.json();
          allTasks.push(...data.tasks);
        }
      }
      
      setAllSubnetTasks(allTasks);
    } catch (error) {
      console.error('Error fetching all subnet tasks:', error);
    }
  };

  // Refresh all subnet tasks every 10 seconds for ML charts
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllSubnetTasks();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Generate live tasks
  useEffect(() => {
    if (subnets.length > 0) {
      const generateLiveTasks = () => {
        const tasks = subnets.flatMap(subnet => {
          const taskCount = Math.floor(Math.random() * 3) + 1;
          return Array.from({ length: taskCount }, (_, i) => ({
            id: `${subnet.id}-task-${i}`,
            subnetId: subnet.id,
            subnetName: subnet.name,
            taskType: subnet.taskType,
            description: `${subnet.taskType} task processing`,
            status: Math.random() > 0.3 ? 'processing' : 'completed',
            progress: Math.floor(Math.random() * 100),
            timestamp: Date.now() - Math.random() * 300000,
            validator: `Validator-${Math.floor(Math.random() * 10) + 1}`,
            reward: (Math.random() * 10 + 1).toFixed(2)
          }));
        });
        setLiveTasks(tasks);
      };

      generateLiveTasks();
      const interval = setInterval(generateLiveTasks, 5000);
      return () => clearInterval(interval);
    }
  }, [subnets]);

  // Fetch real tasks for selected subnet
  const fetchSubnetTasks = async (subnetId: string) => {
    try {
      const response = await fetch(`/api/subnets/tasks?subnetId=${subnetId}`);
      const data = await response.json();
      setSubnetTasks(data);
    } catch (error) {
      console.error('Error fetching subnet tasks:', error);
    }
  };

  const handleNodeHover = (subnetId: string) => {
    setHoveredNode(subnetId);
    fetchSubnetTasks(subnetId);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType);
  };

  const taskTypeIcons = {
    LLM: Cpu,
    Vision: Camera,
    Embedding: Database,
    Audio: Headphones,
  };

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 300;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: (Math.random() - 0.5) * 100
    };
  };

  const getNodeColor = (taskType: string) => {
    switch (taskType) {
      case 'LLM': return '#ffd700';
      case 'Vision': return '#ff8c00';
      case 'Embedding': return '#ffa500';
      case 'Audio': return '#ffb347';
      default: return '#ffd700';
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="w-full h-screen overflow-hidden">

        {loading ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">Loading neural network...</div>
        ) : (
          <>
            {/* ML Learning Curves - Left Side Middle */}
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-30 w-80">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div 
                  className="cursor-pointer hover:scale-105 transition-transform relative group"
                  onClick={() => handleChartClick('regression')}
                >
                  <LinearRegressionChart subnetTasks={allSubnetTasks} />
                  <div className="absolute top-2 right-2 bg-orange-500/20 backdrop-blur-sm rounded px-2 py-1 text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to expand
                  </div>
                </div>
                <div 
                  className="cursor-pointer hover:scale-105 transition-transform relative group"
                  onClick={() => handleChartClick('clustering')}
                >
                  <KMeansChart subnetTasks={allSubnetTasks} />
                  <div className="absolute top-2 right-2 bg-orange-500/20 backdrop-blur-sm rounded px-2 py-1 text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to expand
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Neural Network Visualization - Full Screen */}
            <div className="absolute inset-0 bg-black overflow-hidden">
              {/* Background Particles */}
              {Array.from({ length: 200 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-gold/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.5, 1.2, 0.5],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Neural Core - Removed the big brain */}

              {/* Neural Nodes */}
              {subnets.map((subnet, index) => {
                const position = getNodePosition(index, subnets.length);
                const nodeColor = getNodeColor(subnet.taskType);
                const subnetTasks = liveTasks.filter(task => task.subnetId === subnet.id);
                const activeTasks = subnetTasks.filter(t => t.status === 'processing').length;
                // Fixed node size to prevent glitching
                const nodeSize = 60;
                const glowIntensity = 0.7;

                return (
                  <motion.div
                    key={subnet.id}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `calc(50% + ${position.x}px)`,
                      top: `calc(50% + ${position.y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.3 }}
                    onMouseEnter={() => handleNodeHover(subnet.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Node Glow - Fixed size to prevent glitching */}
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: '180px',
                        height: '180px',
                        backgroundColor: nodeColor,
                        filter: 'blur(60px)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: glowIntensity
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.9, 0.7]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Node Core - Fixed size to prevent glitching */}
                    <motion.div
                      className="relative rounded-full border-2 border-white/50 flex items-center justify-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: nodeColor,
                        boxShadow: `0 0 120px ${nodeColor}, inset 0 0 60px rgba(255,255,255,0.5)`
                      }}
                      animate={{
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="text-white text-sm font-bold">
                        {activeTasks}
                      </div>
                    </motion.div>

                    {/* Dragging Connection Lines */}
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: -1,
                        width: '100vw',
                        height: '100vh'
                      }}
                    >
                      {/* Main connection line */}
                      <motion.line
                        x1="0"
                        y1="0"
                        x2={`${-position.x}`}
                        y2={`${-position.y}`}
                        stroke={nodeColor}
                        strokeWidth="3"
                        opacity="0.8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                      />
                      
                      {/* Dragging particles along the line */}
                      {Array.from({ length: 3 }, (_, particleIndex) => (
                        <motion.circle
                          key={particleIndex}
                          r="4"
                          fill={nodeColor}
                          initial={{ 
                            cx: 0,
                            cy: 0,
                            opacity: 0
                          }}
                          animate={{ 
                            cx: -position.x,
                            cy: -position.y,
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.2 + particleIndex * 0.5,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </svg>

                    {/* Dragging Lines to Other Nodes */}
                    {subnets.slice(index + 1).map((otherSubnet, otherIndex) => {
                      const otherPosition = getNodePosition(index + otherIndex + 1, subnets.length);
                      const connectionStrength = Math.random();
                      
                      if (connectionStrength > 0.6) {
                        return (
                          <svg
                            key={`${subnet.id}-${otherSubnet.id}`}
                            className="absolute pointer-events-none"
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: -1,
                              width: '100vw',
                              height: '100vh'
                            }}
                          >
                            <motion.line
                              x1="0"
                              y1="0"
                              x2={`${otherPosition.x - position.x}`}
                              y2={`${otherPosition.y - position.y}`}
                              stroke={nodeColor}
                              strokeWidth="2"
                              opacity="0.6"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: index * 0.1 + 1, duration: 1 }}
                            />
                            
                            {/* Dragging particles between nodes */}
                            {Array.from({ length: 2 }, (_, particleIndex) => (
                              <motion.circle
                                key={particleIndex}
                                r="3"
                                fill={nodeColor}
                                initial={{ 
                                  cx: 0,
                                  cy: 0,
                                  opacity: 0
                                }}
                                animate={{ 
                                  cx: otherPosition.x - position.x,
                                  cy: otherPosition.y - position.y,
                                  opacity: [0, 1, 0]
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  delay: index * 0.3 + particleIndex * 0.8,
                                  ease: "linear"
                                }}
                              />
                            ))}
                          </svg>
                        );
                      }
                      return null;
                    })}

                    {/* Node Label */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                      <div className="text-xs text-white font-bold bg-black/70 px-2 py-1 rounded border border-primary-gold/50">
                        {subnet.name}
                      </div>
                      <div className="text-xs text-primary-gold mt-1">
                        {activeTasks} Tasks
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Fixed Data Flow Particles - No random movement */}
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary-gold rounded-full"
                  style={{
                    left: `${20 + (i * 4)}%`,
                    top: `${20 + (i * 3)}%`,
                    boxShadow: '0 0 8px #ffd700'
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Hovered Node Details - Positioned near the node */}
            <AnimatePresence>
              {hoveredNode && subnetTasks && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute z-20 max-w-md"
                  style={{
                    left: `calc(50% + ${(() => {
                      const nodePos = getNodePosition(subnets.findIndex(s => s.id === hoveredNode), subnets.length);
                      const offset = nodePos.x > 0 ? 200 : -200; // Right side gets +200, left side gets -200
                      return Math.min(400, Math.max(-400, nodePos.x + offset));
                    })()}px)`,
                    top: `calc(50% + ${(() => {
                      const nodePos = getNodePosition(subnets.findIndex(s => s.id === hoveredNode), subnets.length);
                      const offset = nodePos.y > 0 ? -100 : 100; // Bottom nodes get -100, top nodes get +100
                      return Math.min(300, Math.max(-300, nodePos.y + offset));
                    })()}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredNode(hoveredNode)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {(() => {
                    const subnet = subnets.find(s => s.id === hoveredNode);
                    if (!subnet) return null;
                    
            const IconComponent = taskTypeIcons[subnet.taskType as keyof typeof taskTypeIcons];
                    
            return (
                      <GlassCard className="max-w-sm bg-black/60 backdrop-blur-md border border-orange-500/30" gradient>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-3 border border-white/20 rounded-lg">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{subnet.name}</h3>
                              <p className="text-sm text-gray-400">{subnet.taskType} Subnet • {subnetTasks.activeTasks} Active Tasks</p>
                            </div>
                          </div>

                          {/* Task Manager */}
                          <div className="space-y-3">
                            <h4 className="text-lg font-bold text-white">Task Manager</h4>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                              {subnetTasks.tasks.map((task: any, idx: number) => (
              <motion.div
                                  key={task.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                                  className="p-3 rounded-lg border border-orange-500/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-orange-500/40 transition-all cursor-pointer"
                                  onClick={() => handleTaskClick(task)}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      task.status === 'processing' ? 'bg-orange-500 animate-pulse' : 'bg-green-400'
                                    }`} />
                                    <span className="text-sm font-bold text-white">{task.title}</span>
                                  </div>
                                  <p className="text-xs text-gray-300 mb-2">{task.description}</p>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">{task.validator}</span>
                                    <span className="text-primary-accent font-bold">{task.impact}</span>
                                  </div>
                                  {task.status === 'processing' && (
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Progress</span>
                                        <span className="text-white">{task.progress}%</span>
                                      </div>
                                      <div className="w-full bg-black/60 rounded-full h-1 border border-orange-500/20">
                                        <div 
                                          className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                                          style={{ width: `${task.progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </GlassCard>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Task Details - Real-time Task View */}
            <AnimatePresence>
              {selectedTask && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-black/90 backdrop-blur-md rounded-lg border border-orange-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Real-time Task Details</h3>
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Task Header */}
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedTask.status === 'processing' ? 'bg-orange-500 animate-pulse' : 'bg-green-400'
                        }`} />
                        <div>
                          <h4 className="text-lg font-bold text-white">{selectedTask.title}</h4>
                          <p className="text-sm text-gray-400">{selectedTask.validator}</p>
                        </div>
                      </div>

                      {/* Task Description */}
                      <div className="p-4 bg-black/60 rounded-lg border border-orange-500/20">
                        <h5 className="text-sm font-bold text-white mb-2">Task Description</h5>
                        <p className="text-sm text-gray-300">{selectedTask.description}</p>
                      </div>

                      {/* Real-time Progress */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-bold text-white">Real-time Progress</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{selectedTask.progress}%</span>
                          </div>
                          <div className="w-full bg-black/60 rounded-full h-2 border border-orange-500/20">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${selectedTask.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Network Impact */}
                      <div className="p-4 bg-black/60 rounded-lg border border-orange-500/20">
                        <h5 className="text-sm font-bold text-white mb-2">Network Impact</h5>
                        <p className="text-sm text-orange-400 font-bold">{selectedTask.impact}</p>
                      </div>

                      {/* Task Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-black/60 rounded-lg border border-orange-500/20">
                          <h6 className="text-xs text-gray-400 mb-1">Status</h6>
                          <p className="text-sm text-white capitalize">{selectedTask.status}</p>
                        </div>
                        <div className="p-3 bg-black/60 rounded-lg border border-orange-500/20">
                          <h6 className="text-xs text-gray-400 mb-1">Reward</h6>
                          <p className="text-sm text-orange-400 font-bold">{selectedTask.reward}</p>
                        </div>
                      </div>


                      {/* Close Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedTask(null)}
                          className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 transition-all text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </motion.div>
              </motion.div>
              )}
            </AnimatePresence>

            {/* Full-Screen Chart Modal */}
            <AnimatePresence>
              {selectedChart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedChart(null)} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                    className="relative bg-black/90 backdrop-blur-sm rounded border border-orange-500/30 p-4 max-w-7xl w-full max-h-[95vh] flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">
                        {selectedChart === 'regression' ? 'Learning Progress' : 'Task Clustering'}
                      </h3>
                      <button
                        onClick={() => setSelectedChart(null)}
                        className="text-gray-400 hover:text-white transition-colors text-lg"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2 flex flex-col h-full">
                      {/* Minimal Stats */}
                      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
                        <div className="bg-black/40 rounded p-2 border border-orange-500/10">
                          <h4 className="text-xs text-gray-400 mb-1">Tasks</h4>
                          <p className="text-sm font-medium text-white">{allSubnetTasks.length}</p>
                        </div>
                        <div className="bg-black/40 rounded p-2 border border-orange-500/10">
                          <h4 className="text-xs text-gray-400 mb-1">Active</h4>
                          <p className="text-sm font-medium text-orange-400">
                            {allSubnetTasks.filter(t => t.status === 'processing').length}
                          </p>
                        </div>
                        <div className="bg-black/40 rounded p-2 border border-orange-500/10">
                          <h4 className="text-xs text-gray-400 mb-1">Done</h4>
                          <p className="text-sm font-medium text-green-400">
                            {allSubnetTasks.filter(t => t.status === 'completed').length}
                          </p>
                        </div>
                        <div className="bg-black/40 rounded p-2 border border-orange-500/10">
                          <h4 className="text-xs text-gray-400 mb-1">Progress</h4>
                          <p className="text-sm font-medium text-white">
                            {Math.round(allSubnetTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / allSubnetTasks.length)}%
                          </p>
                        </div>
                      </div>

                      {/* Large Chart */}
                      <div className="bg-black/20 rounded border border-orange-500/10 flex-1 min-h-0">
                        {selectedChart === 'regression' ? (
                          <div className="h-full w-full">
                            <LinearRegressionChart subnetTasks={allSubnetTasks} />
                          </div>
                        ) : (
                          <div className="h-full w-full">
                            <KMeansChart subnetTasks={allSubnetTasks} />
                          </div>
                        )}
                      </div>

                      {/* Minimal Task Feed */}
                      <div className="bg-black/20 rounded p-1 border border-orange-500/10 flex-shrink-0">
                        <h4 className="text-xs font-medium text-white mb-1">Recent Tasks</h4>
                        <div className="grid grid-cols-1 md:grid-cols-8 gap-1">
                          {allSubnetTasks.slice(0, 8).map((task, idx) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-1 rounded border border-orange-500/10 bg-black/30"
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <div className={`w-1 h-1 rounded-full ${
                                  task.status === 'processing' ? 'bg-orange-500 animate-pulse' : 'bg-green-400'
                                }`} />
                                <span className="text-xs font-medium text-white truncate">{task.title}</span>
                              </div>
                              <p className="text-xs text-gray-400 mb-1 truncate">{task.description}</p>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">{task.validator}</span>
                                <span className="text-orange-400">{task.impact}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Close Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedChart(null)}
                          className="px-4 py-2 bg-black/40 border border-orange-500/20 text-orange-400 hover:bg-orange-500/10 transition-all text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </motion.div>
              </motion.div>
              )}
            </AnimatePresence>


            {/* CTA Buttons - Fixed position */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <Link href="/stake">
                <Button variant="primary" size="sm">
                  Start Staking
                </Button>
              </Link>
              <Link href="/validators">
                <Button variant="outline" size="sm">
                  View Validators
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Prevent scrolling and custom styles */}
      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
        html {
          overflow: hidden !important;
        }
        
        /* Custom chart styling */
        .chart-container {
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.9) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .chart-title {
          background: linear-gradient(45deg, #ffd700, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}