'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Upload, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useAccount, useBalance } from 'wagmi';

type TaskType = 'llm' | 'vision' | 'embedding' | 'audio';

interface Task {
  id: string;
  type: TaskType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  cost: string;
}

export default function TasksPage() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);
  
  const [taskType, setTaskType] = useState<TaskType>('llm');
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const taskTypes = [
    {
      id: 'llm' as TaskType,
      name: 'LLM Inference',
      icon: '',
      description: 'Text generation, completion, chat',
      costPer1k: '0.002 01A',
      avgTime: '~5s',
    },
    {
      id: 'vision' as TaskType,
      name: 'Vision',
      icon: '',
      description: 'Image classification, detection, segmentation',
      costPer1k: '0.005 01A',
      avgTime: '~10s',
    },
    {
      id: 'embedding' as TaskType,
      name: 'Embeddings',
      icon: '',
      description: 'Text/image embeddings for RAG',
      costPer1k: '0.001 01A',
      avgTime: '~2s',
    },
    {
      id: 'audio' as TaskType,
      name: 'Audio',
      icon: '',
      description: 'Transcription, generation, TTS',
      costPer1k: '0.003 01A',
      avgTime: '~7s',
    },
  ];

  const selectedTask = taskTypes.find((t) => t.id === taskType);
  const estimatedCost = selectedTask 
    ? parseFloat(selectedTask.costPer1k.split(' ')[0]).toFixed(4)
    : '0';

  const handleSubmitTask = async () => {
    if (!address || !prompt) return;

    setIsSubmitting(true);

    try {
      // Submit task to backend API
      const response = await fetch('/api/ai/submit-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: taskType.toUpperCase(),
          prompt: prompt,
          subnetId: `subnet-${taskType === 'llm' ? '1' : taskType === 'vision' ? '2' : taskType === 'embedding' ? '3' : '4'}`,
          userAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Create task record with real data
      const newTask: Task = {
        id: result.taskId,
        type: taskType,
        status: 'completed',
        createdAt: Date.now(),
        cost: `${estimatedCost} 01A`,
      };

      setTasks([newTask, ...tasks]);
      setPrompt('');

      // Show success message with result
      alert(`Task completed! Result: ${result.result.substring(0, 100)}...`);

    } catch (error) {
      console.error('Task submission error:', error);
      alert('Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-[#0201ff] animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
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
            <span className="text-white">$</span> ai.submit_task()
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-mono">
            [ AI_TASK_SUBMISSION ]
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {'>'} Submit AI computation tasks to decentralized subnets
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassCard className="p-3" delay={0}>
            <div className="space-y-1 font-mono">
              <Cpu className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">YOUR_TASKS</p>
              <p className="text-lg font-bold text-white">{tasks.length}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.05}>
            <div className="space-y-1 font-mono">
              <Zap className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">PROCESSING</p>
              <p className="text-lg font-bold text-white">
                {tasks.filter((t) => t.status === 'processing').length}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.1}>
            <div className="space-y-1 font-mono">
              <CheckCircle className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">COMPLETED</p>
              <p className="text-lg font-bold text-white">
                {tasks.filter((t) => t.status === 'completed').length}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-3" delay={0.15}>
            <div className="space-y-1 font-mono">
              <Upload className="w-4 h-4 text-white mb-1" />
              <p className="text-[10px] text-gray-500 uppercase">BALANCE</p>
              <p className="text-lg font-bold text-white">
                {mounted && balance ? parseFloat(balance.formatted).toFixed(2) : '0.00'}
              </p>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Submission Form */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6" gradient>
              <div className="space-y-6 font-mono">
                <h2 className="text-lg font-bold text-white">[ NEW_TASK ]</h2>

                {/* Task Type Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase">SELECT_TASK_TYPE</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {taskTypes.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setTaskType(task.id)}
                        className={`p-3 border transition-all ${
                          taskType === task.id
                            ? 'border-[#0201ff] bg-[#0201ff]/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{task.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{task.avgTime}</p>
                      </button>
                    ))}
                  </div>
                  {selectedTask && (
                    <p className="text-[10px] text-gray-400 mt-2">
                      {selectedTask.description} • Cost: {selectedTask.costPer1k} per 1K tokens
                    </p>
                  )}
                </div>

                {/* Prompt/Input */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase">
                    {taskType === 'llm' ? 'PROMPT' : taskType === 'vision' ? 'IMAGE_URL' : 'INPUT'}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      taskType === 'llm'
                        ? 'Enter your prompt here...'
                        : taskType === 'vision'
                        ? 'Enter image URL or upload file...'
                        : 'Enter your input...'
                    }
                    rows={6}
                    className="w-full p-4 glass-panel text-white text-xs placeholder-gray-500 focus:outline-none focus:border-white transition-all resize-none"
                  />
                </div>


                {/* Cost Estimate */}
                {prompt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">ESTIMATED_COST</p>
                        <p className="text-xl font-bold text-[#0201ff] mt-1">
                          {estimatedCost} 01A
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase">EST_TIME</p>
                        <p className="text-sm text-white mt-1">{selectedTask?.avgTime}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmitTask}
                  disabled={!mounted || !address || !prompt || isSubmitting}
                  className={`w-full px-6 py-4 border transition-all text-sm font-bold ${
                    !mounted || !address || !prompt
                      ? 'border-white/20 text-gray-600 cursor-not-allowed'
                      : isSubmitting
                      ? 'border-primary-gold text-[#0201ff] cursor-wait'
                      : 'border-[#0201ff] text-[#0201ff] hover:bg-[#0201ff] hover:text-black'
                  }`}
                >
                  {!mounted
                    ? '[LOADING...]'
                    : !address
                    ? '[CONNECT_WALLET_TO_SUBMIT]'
                    : isSubmitting
                    ? '[SUBMITTING...]'
                    : '[SUBMIT_TASK]'}
                </button>
              </div>
            </GlassCard>

            {/* Task History */}
            {tasks.length > 0 && (
              <GlassCard className="p-6">
                <div className="space-y-4 font-mono">
                  <h3 className="text-sm font-bold text-white">[ RECENT_TASKS ]</h3>
                  <div className="space-y-2">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="p-3 border border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(task.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-white font-bold">
                                  {task.type.toUpperCase()} Task
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(task.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="text-gray-500">ID:</span>
                                <span className="text-white truncate">{task.id}</span>
                              </div>
                              <div className="text-[10px] text-gray-400 mt-1">
                                Cost: {task.cost}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-1 border ${
                              task.status === 'completed'
                                ? 'border-green-400/30 text-green-400'
                                : task.status === 'failed'
                                ? 'border-red-400/30 text-red-400'
                                : task.status === 'processing'
                                ? 'border-[#0201ff]/30 text-[#0201ff]'
                                : 'border-gray-400/30 text-gray-400'
                            }`}
                          >
                            [{task.status.toUpperCase()}]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            {/* Pricing */}
            <GlassCard className="p-4">
              <div className="space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white">[ PRICING ]</h3>
                <div className="space-y-2">
                  {taskTypes.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white">{task.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{task.costPer1k}/1K</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* How it Works */}
            <GlassCard className="p-4">
              <div className="space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white">[ HOW_IT_WORKS ]</h3>
                <div className="space-y-2 text-[10px] text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">1.</span>
                    <p>Submit your AI task with parameters</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">2.</span>
                    <p>Task is routed to specialized subnet</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">3.</span>
                    <p>Miners compete to process your task</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">4.</span>
                    <p>Validators verify the result</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0201ff] mt-0.5">5.</span>
                    <p>You receive the result on-chain</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Benefits */}
            <GlassCard className="p-4">
              <div className="space-y-3 font-mono">
                <h3 className="text-sm font-bold text-white">[ BENEFITS ]</h3>
                <div className="space-y-1.5 text-[10px] text-gray-400">
                  <p>
                    <span className="text-white">•</span> Decentralized: No single point of failure
                  </p>
                  <p>
                    <span className="text-white">•</span> Cost-effective: 70% cheaper than centralized APIs
                  </p>
                  <p>
                    <span className="text-white">•</span> Privacy: Your data stays encrypted
                  </p>
                  <p>
                    <span className="text-white">•</span> Transparent: All computations verified on-chain
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

