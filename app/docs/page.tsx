'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Zap, Shield, Users, TrendingUp, Globe, Cpu, Database, Network, Lock, Rocket, Target, Award, BarChart3 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import Link from 'next/link';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'architecture', title: 'Architecture', icon: Network },
    { id: 'ai-integration', title: 'AI Integration', icon: Cpu },
    { id: 'subnets', title: 'AI Subnets', icon: Globe },
    { id: 'validators', title: 'Validators', icon: Shield },
    { id: 'bridge', title: 'Cross-Chain Bridge', icon: Zap },
    { id: 'tokenomics', title: 'Tokenomics', icon: BarChart3 },
    { id: 'consensus', title: 'Consensus Mechanism', icon: Lock },
    { id: 'scalability', title: 'Scalability', icon: TrendingUp },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'governance', title: 'Governance', icon: Users },
    { id: 'apis', title: 'APIs & SDKs', icon: Code },
    { id: 'roadmap', title: 'Roadmap', icon: Rocket },
    { id: 'comparison', title: 'vs Other Chains', icon: Target },
    { id: 'getting-started', title: 'Getting Started', icon: Award }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <GlassCard className="p-4" gradient>
                <div className="space-y-2 font-mono">
                  <h3 className="text-sm font-bold text-white mb-4">[ DOCS_NAVIGATION ]</h3>
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-all ${
                          activeSection === section.id
                            ? 'bg-[#0201ff] text-black border border-[#0201ff]'
                            : 'text-white hover:bg-white hover:text-black border border-transparent hover:border-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {section.title}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8" gradient>
                <div className="font-mono">
                  {activeSection === 'overview' && <OverviewSection />}
                  {activeSection === 'architecture' && <ArchitectureSection />}
                  {activeSection === 'ai-integration' && <AIIntegrationSection />}
                  {activeSection === 'subnets' && <SubnetsSection />}
                  {activeSection === 'validators' && <ValidatorsSection />}
                  {activeSection === 'bridge' && <BridgeSection />}
                  {activeSection === 'tokenomics' && <TokenomicsSection />}
                  {activeSection === 'consensus' && <ConsensusSection />}
                  {activeSection === 'scalability' && <ScalabilitySection />}
                  {activeSection === 'security' && <SecuritySection />}
                  {activeSection === 'governance' && <GovernanceSection />}
                  {activeSection === 'apis' && <APIsSection />}
                  {activeSection === 'roadmap' && <RoadmapSection />}
                  {activeSection === 'comparison' && <ComparisonSection />}
                  {activeSection === 'getting-started' && <GettingStartedSection />}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ 01A_LABS_NETWORK ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network is a revolutionary Layer 2 blockchain specifically designed for AI workloads. 
          Built on top of Base Chain, it provides a high-performance, cost-effective platform for running 
          AI inference, training, and data processing at scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-white/20 bg-white/5">
          <h3 className="text-lg font-bold text-white mb-2">Performance</h3>
          <p className="text-gray-300 text-xs">44x faster than Ethereum for AI workloads</p>
        </div>
        <div className="p-4 border border-white/20 bg-white/5">
          <h3 className="text-lg font-bold text-white mb-2">Cost</h3>
          <p className="text-gray-300 text-xs">65% cheaper than traditional cloud AI services</p>
        </div>
        <div className="p-4 border border-white/20 bg-white/5">
          <h3 className="text-lg font-bold text-white mb-2">Scalability</h3>
          <p className="text-gray-300 text-xs">Unlimited AI subnets with horizontal scaling</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-3">✅ IMPLEMENTED FEATURES</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>Real-time Blockchain Explorer:</strong> Live transaction tracking, block details, address information with real data</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>AI Subnet Visualization:</strong> Interactive neural network showing 7 specialized AI subnets with real-time task processing</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>Validator Chat System:</strong> AI-powered chat with validators using ChatGPT API for deep lore and technical discussions</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>Cross-Chain Bridge:</strong> ETH to 01A token bridging with MetaMask network integration</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>AI Task Submission:</strong> Submit LLM, Vision, Embedding, and Audio tasks with real-time processing</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>ML Learning Analytics:</strong> Real-time learning curves and task clustering visualization for subnet performance</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <p><strong>Staking System:</strong> Real-time staking statistics, validator rewards, and APY calculations</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-3">Why 01A Labs Network?</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <span className="text-[#0201ff] mt-1">→</span>
            <p><strong>AI-Native Architecture:</strong> Built from the ground up for AI workloads, not retrofitted</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#0201ff] mt-1">→</span>
            <p><strong>Decentralized AI:</strong> No single point of failure, censorship-resistant AI services</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#0201ff] mt-1">→</span>
            <p><strong>Economic Efficiency:</strong> Token-based pricing eliminates traditional cloud vendor lock-in</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#0201ff] mt-1">→</span>
            <p><strong>Global Access:</strong> Anyone can participate as a validator or consume AI services</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ NETWORK_ARCHITECTURE ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network uses a sophisticated multi-layer architecture optimized for AI workloads 
          while maintaining security and decentralization.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED LAYERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Frontend Layer</h3>
              <p className="text-gray-300 text-sm">Next.js 14 with React, TypeScript, Tailwind CSS, Framer Motion animations</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">API Layer</h3>
              <p className="text-gray-300 text-sm">RESTful APIs for blockchain data, AI tasks, validator chat, staking stats</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">AI Integration Layer</h3>
              <p className="text-gray-300 text-sm">ChatGPT API integration for validator chat, real AI task generation</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Visualization Layer</h3>
              <p className="text-gray-300 text-sm">Neural network visualization, ML charts, real-time data displays</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED AI SUBNETS</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Active Subnets (7 Total)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">GPT-4 Inference</h4>
                  <p className="text-gray-300 text-xs">LLM tasks, text generation, chat completion</p>
                </div>
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">Vision Transformers</h4>
                  <p className="text-gray-300 text-xs">Image analysis, generation, computer vision</p>
                </div>
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">Embeddings Pro</h4>
                  <p className="text-gray-300 text-xs">Vector embeddings, semantic search, RAG</p>
                </div>
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">Audio Genesis</h4>
                  <p className="text-gray-300 text-xs">Speech synthesis, audio processing, TTS</p>
                </div>
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">Llama 3.1 Cluster</h4>
                  <p className="text-gray-300 text-xs">Open-source LLM inference</p>
                </div>
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">ViT Ensemble</h4>
                  <p className="text-gray-300 text-xs">Advanced vision transformer models</p>
                </div>
                <div className="p-3 border border-green-400/30 bg-green-400/5">
                  <h4 className="font-bold text-green-400">Quantum AI</h4>
                  <p className="text-gray-300 text-xs">Quantum-enhanced AI processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ TECHNICAL IMPLEMENTATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Real-time Features</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Live blockchain explorer with real transaction data</li>
                <li>• Real-time AI task processing and status updates</li>
                <li>• Dynamic ML learning curves and clustering</li>
                <li>• Live validator chat with AI responses</li>
                <li>• Real-time staking statistics and APY calculations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Data Integration</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• ChatGPT API for intelligent validator responses</li>
                <li>• Dynamic blockchain data generation</li>
                <li>• Real AI task templates and processing</li>
                <li>• MetaMask network integration</li>
                <li>• Cross-chain bridge functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIIntegrationSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ AI_INTEGRATION ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network integrates AI capabilities directly into the blockchain, creating a 
          decentralized AI marketplace where anyone can provide or consume AI services.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED AI FEATURES</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">AI Task Submission System</h3>
                <p className="text-gray-300 text-sm">Submit LLM, Vision, Embedding, and Audio tasks with real-time processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">ChatGPT-Powered Validator Chat</h3>
                <p className="text-gray-300 text-sm">AI-powered conversations with validators using ChatGPT API for deep technical discussions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Real AI Task Generation</h3>
                <p className="text-gray-300 text-sm">Dynamic AI task creation that &quot;makes the network better&quot; using ChatGPT API</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">ML Learning Analytics</h3>
                <p className="text-gray-300 text-sm">Real-time learning curves and task clustering visualization for subnet performance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED AI TASK TYPES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-green-400 mb-2">LLM Inference Tasks</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• GPT-4 Model Optimization</li>
                <li>• Language Model Fine-tuning</li>
                <li>• Neural Architecture Search</li>
                <li>• Contextual Understanding Enhancement</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Vision Processing Tasks</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Computer Vision Training</li>
                <li>• Image Recognition Accuracy</li>
                <li>• Object Detection Refinement</li>
                <li>• Multi-modal Data Fusion</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Embedding Tasks</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Vector Database Optimization</li>
                <li>• Semantic Embedding Generation</li>
                <li>• Cross-lingual Embedding Alignment</li>
                <li>• Real-time Data Stream Processing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Audio Processing Tasks</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Voice Recognition Training</li>
                <li>• Speech Synthesis Improvement</li>
                <li>• Audio Event Detection</li>
                <li>• Noise Reduction Algorithms</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ AI INTEGRATION TECHNICAL STACK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">AI APIs & Services</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• ChatGPT API for intelligent responses</li>
                <li>• Real-time AI task processing</li>
                <li>• Dynamic task generation and validation</li>
                <li>• AI-powered validator interactions</li>
                <li>• Machine learning analytics and visualization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Data Processing</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Real-time task status updates</li>
                <li>• Dynamic reward calculations</li>
                <li>• Live performance metrics</li>
                <li>• Automated task routing</li>
                <li>• Real-time learning curve analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubnetsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ AI_SUBNETS ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          AI Subnets are specialized networks within the 01A Labs ecosystem, each optimized for specific 
          AI workloads and use cases.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ INTERACTIVE NEURAL NETWORK VISUALIZATION</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Real-time Neural Network</h3>
                <p className="text-gray-300 text-sm">Interactive visualization showing 7 AI subnets connected in a neural network pattern</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Live Task Processing</h3>
                <p className="text-gray-300 text-sm">Real-time display of AI tasks being processed by each subnet with ChatGPT-generated content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Hover Interactions</h3>
                <p className="text-gray-300 text-sm">Hover over subnet nodes to see detailed task information and processing status</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">ML Learning Analytics</h3>
                <p className="text-gray-300 text-sm">Real-time learning curves and task clustering visualization for subnet performance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-green-400/30 bg-green-400/5">
            <h2 className="text-xl font-bold text-green-400 mb-3">GPT-4 Inference Subnet</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300"><strong>Purpose:</strong> High-quality text generation and reasoning</p>
              <p className="text-gray-300"><strong>APY:</strong> 8.5%</p>
              <p className="text-gray-300"><strong>Validators:</strong> 15 active</p>
              <p className="text-gray-300"><strong>Hardware:</strong> NVIDIA A100, H100 GPUs</p>
            </div>
          </div>

          <div className="p-6 border border-green-400/30 bg-green-400/5">
            <h2 className="text-xl font-bold text-green-400 mb-3">Vision Transformers Subnet</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300"><strong>Purpose:</strong> Image generation and analysis</p>
              <p className="text-gray-300"><strong>APY:</strong> 12.3%</p>
              <p className="text-gray-300"><strong>Validators:</strong> 8 active</p>
              <p className="text-gray-300"><strong>Hardware:</strong> RTX 4090, A6000 GPUs</p>
            </div>
          </div>

          <div className="p-6 border border-green-400/30 bg-green-400/5">
            <h2 className="text-xl font-bold text-green-400 mb-3">Embeddings Pro Subnet</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300"><strong>Purpose:</strong> Vector embeddings and semantic search</p>
              <p className="text-gray-300"><strong>APY:</strong> 6.7%</p>
              <p className="text-gray-300"><strong>Validators:</strong> 12 active</p>
              <p className="text-gray-300"><strong>Hardware:</strong> CPU-optimized servers</p>
            </div>
          </div>

          <div className="p-6 border border-green-400/30 bg-green-400/5">
            <h2 className="text-xl font-bold text-green-400 mb-3">Audio Genesis Subnet</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300"><strong>Purpose:</strong> Speech synthesis and audio processing</p>
              <p className="text-gray-300"><strong>APY:</strong> 9.8%</p>
              <p className="text-gray-300"><strong>Validators:</strong> 6 active</p>
              <p className="text-gray-300"><strong>Hardware:</strong> Audio-optimized hardware</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED SUBNET FEATURES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-green-400 mb-2">Interactive Visualization</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Neural network node connections</li>
                <li>• Real-time task processing display</li>
                <li>• Hover effects for subnet details</li>
                <li>• Live ML analytics integration</li>
                <li>• Clickable subnet interactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Real-time Data</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Live AI task generation</li>
                <li>• Real-time performance metrics</li>
                <li>• Dynamic reward calculations</li>
                <li>• Live learning curve updates</li>
                <li>• Real-time clustering analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValidatorsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ VALIDATORS ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Validators are the backbone of the 01A Labs Network, providing computational resources 
          and securing the network through Proof-of-Stake consensus.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED VALIDATOR FEATURES</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">AI-Powered Validator Chat</h3>
                <p className="text-gray-300 text-sm">Chat with validators using ChatGPT API for deep technical discussions and lore</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Real-time Validator Leaderboard</h3>
                <p className="text-gray-300 text-sm">Live validator rankings with stake amounts, uptime, and rewards</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Interactive Chat Interface</h3>
                <p className="text-gray-300 text-sm">Beautiful chat UI with message bubbles, avatars, and smooth animations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Real-time Staking Statistics</h3>
                <p className="text-gray-300 text-sm">Live staking data, APY calculations, and validator performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Validator Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Minimum Requirements</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>Stake:</strong> 10,000 01A tokens minimum</li>
                <li>• <strong>Hardware:</strong> 8GB RAM, 4 CPU cores</li>
                <li>• <strong>Storage:</strong> 500GB SSD</li>
                <li>• <strong>Internet:</strong> Stable connection (99% uptime)</li>
                <li>• <strong>Technical:</strong> Node setup knowledge</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Recommended Setup</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>Stake:</strong> 50,000+ 01A tokens</li>
                <li>• <strong>Hardware:</strong> 32GB RAM, 8+ CPU cores</li>
                <li>• <strong>GPU:</strong> RTX 4090 or A100 for AI workloads</li>
                <li>• <strong>Storage:</strong> 2TB NVMe SSD</li>
                <li>• <strong>Network:</strong> 1Gbps dedicated connection</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Validator Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Staking Rewards</h3>
              <p className="text-gray-300 text-sm">Earn 8-12% APY on staked tokens</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">AI Task Rewards</h3>
              <p className="text-gray-300 text-sm">Earn 01A tokens for processing AI tasks</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Network Fees</h3>
              <p className="text-gray-300 text-sm">Share in transaction fee rewards</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ CHAT SYSTEM FEATURES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-green-400 mb-2">AI-Powered Responses</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• ChatGPT API integration</li>
                <li>• Deep technical discussions</li>
                <li>• Validator lore and backstory</li>
                <li>• Real-time AI responses</li>
                <li>• Contextual conversations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Interactive UI</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Beautiful message bubbles</li>
                <li>• Validator avatars and icons</li>
                <li>• Smooth animations</li>
                <li>• Fixed-height chat container</li>
                <li>• Real-time message updates</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">How to Become a Validator</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg font-bold">1.</span>
              <div>
                <h3 className="font-bold text-white">Acquire 01A Tokens</h3>
                <p className="text-gray-300 text-sm">Buy or earn 01A tokens through bridge or mining</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg font-bold">2.</span>
              <div>
                <h3 className="font-bold text-white">Stake Tokens</h3>
                <p className="text-gray-300 text-sm">Use the staking interface to register as a validator</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg font-bold">3.</span>
              <div>
                <h3 className="font-bold text-white">Setup Node</h3>
                <p className="text-gray-300 text-sm">Install and configure your validator node</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg font-bold">4.</span>
              <div>
                <h3 className="font-bold text-white">Start Validating</h3>
                <p className="text-gray-300 text-sm">Begin processing transactions and earning rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BridgeSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ CROSS_CHAIN_BRIDGE ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Bridge enables seamless transfer of assets between Base Chain and the 01A Labs Network, 
          maintaining security and decentralization.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED BRIDGE FEATURES</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">MetaMask Network Integration</h3>
                <p className="text-gray-300 text-sm">Automatic 01A network addition to MetaMask with working RPC endpoints</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Manual Network Setup</h3>
                <p className="text-gray-300 text-sm">Step-by-step instructions for adding 01A network to MetaMask manually</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">ETH to 01A Token Bridging</h3>
                <p className="text-gray-300 text-sm">Seamless conversion of ETH tokens to 01A tokens with real-time processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Network Configuration</h3>
                <p className="text-gray-300 text-sm">Pre-configured network settings for easy MetaMask integration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Bridge Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Base Chain Side</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Smart contract handles deposits</li>
                <li>• Validates and locks ETH</li>
                <li>• Emits bridge events</li>
                <li>• Manages withdrawal requests</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">01A Labs Side</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Mints equivalent 01A tokens</li>
                <li>• Tracks bridge transactions</li>
                <li>• Handles burn requests</li>
                <li>• Maintains bridge state</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ META MASK INTEGRATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-green-400 mb-2">Network Configuration</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Chain ID: 84532 (Base Sepolia)</li>
                <li>• RPC URL: Working Base Sepolia endpoints</li>
                <li>• Native Currency: 01A token</li>
                <li>• Block Explorer: 01A-specific explorer</li>
                <li>• Automatic network detection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">User Experience</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• One-click network addition</li>
                <li>• Manual setup instructions</li>
                <li>• Real-time connection status</li>
                <li>• Error handling and recovery</li>
                <li>• Seamless wallet integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Bridge Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Security</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Multi-signature validation</li>
                <li>• Time-locked withdrawals</li>
                <li>• Audit trail for all transactions</li>
                <li>• Emergency pause functionality</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Efficiency</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Fast settlement times</li>
                <li>• Low transaction fees</li>
                <li>• Automated processing</li>
                <li>• Real-time status updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenomicsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ TOKENOMICS ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A token is the native utility token of the 01A Labs Network, designed to facilitate 
          AI services, staking, and governance.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Token Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Initial Supply</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>Total Supply:</strong> 1,000,000,000 01A</li>
                <li>• <strong>Circulating:</strong> 100,000,000 01A</li>
                <li>• <strong>Staking Pool:</strong> 200,000,000 01A</li>
                <li>• <strong>Development:</strong> 150,000,000 01A</li>
                <li>• <strong>Community:</strong> 100,000,000 01A</li>
                <li>• <strong>Reserve:</strong> 450,000,000 01A</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Token Utility</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>AI Services:</strong> Pay for AI inference and training</li>
                <li>• <strong>Staking:</strong> Secure the network and earn rewards</li>
                <li>• <strong>Governance:</strong> Vote on network proposals</li>
                <li>• <strong>Fees:</strong> Transaction and bridge fees</li>
                <li>• <strong>Rewards:</strong> Validator and staker rewards</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Economic Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Inflation Control</h3>
              <p className="text-gray-300 text-sm">Controlled inflation through burning mechanisms</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Deflationary Burns</h3>
              <p className="text-gray-300 text-sm">Burn tokens from failed transactions</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Reward Distribution</h3>
              <p className="text-gray-300 text-sm">Fair distribution to validators and stakers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsensusSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ CONSENSUS_MECHANISM ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network uses a hybrid Proof-of-Stake consensus mechanism optimized for 
          AI workloads and high throughput.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Consensus Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Proof-of-Stake</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Validators stake 01A tokens</li>
                <li>• Higher stake = higher selection probability</li>
                <li>• Slashing for malicious behavior</li>
                <li>• Democratic network governance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary-book mb-3">AI-Optimized Features</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Fast block finalization</li>
                <li>• AI task prioritization</li>
                <li>• Load balancing across subnets</li>
                <li>• Dynamic validator selection</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Block Production</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">1.</span>
              <div>
                <h3 className="font-bold text-white">Validator Selection</h3>
                <p className="text-gray-300 text-sm">Validators are randomly selected based on stake weight</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">2.</span>
              <div>
                <h3 className="font-bold text-white">Block Creation</h3>
                <p className="text-gray-300 text-sm">Selected validator creates and proposes new block</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">3.</span>
              <div>
                <h3 className="font-bold text-white">Validation</h3>
                <p className="text-gray-300 text-sm">Other validators validate and vote on the block</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">4.</span>
              <div>
                <h3 className="font-bold text-white">Finalization</h3>
                <p className="text-gray-300 text-sm">Block is finalized and added to the chain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScalabilitySection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ SCALABILITY ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network is designed for massive scale, capable of handling millions of 
          AI requests per second through innovative scaling solutions.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Scaling Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Horizontal Scaling</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Unlimited AI subnets</li>
                <li>• Dynamic validator allocation</li>
                <li>• Load balancing across nodes</li>
                <li>• Auto-scaling based on demand</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Vertical Scaling</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• High-performance validators</li>
                <li>• GPU acceleration</li>
                <li>• Optimized consensus</li>
                <li>• Efficient data structures</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Throughput</h3>
              <p className="text-gray-300 text-sm">100,000+ TPS</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Latency</h3>
              <p className="text-gray-300 text-sm">~100ms block time</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Capacity</h3>
              <p className="text-gray-300 text-sm">Unlimited validators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ SECURITY ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Security is paramount in the 01A Labs Network, with multiple layers of protection 
          to ensure the integrity of AI services and user data.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Security Layers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">Network Security</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Proof-of-Stake consensus</li>
                <li>• Slashing mechanisms</li>
                <li>• Multi-signature validation</li>
                <li>• Time-locked operations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">AI Security</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Model verification</li>
                <li>• Result validation</li>
                <li>• Privacy-preserving computation</li>
                <li>• Audit trails</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Audit & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Smart Contract Audits</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Regular security audits</li>
                <li>• Bug bounty programs</li>
                <li>• Formal verification</li>
                <li>• Penetration testing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Compliance</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• GDPR compliance</li>
                <li>• Data protection standards</li>
                <li>• Privacy by design</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GovernanceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ GOVERNANCE ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network uses a decentralized governance system where token holders 
          can propose and vote on network improvements and changes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Governance Process</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">1.</span>
              <div>
                <h3 className="font-bold text-white">Proposal Creation</h3>
                <p className="text-gray-300 text-sm">Token holders create governance proposals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">2.</span>
              <div>
                <h3 className="font-bold text-white">Discussion Period</h3>
                <p className="text-gray-300 text-sm">Community discusses and debates proposals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">3.</span>
              <div>
                <h3 className="font-bold text-white">Voting</h3>
                <p className="text-gray-300 text-sm">Token holders vote on proposals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">4.</span>
              <div>
                <h3 className="font-bold text-white">Implementation</h3>
                <p className="text-gray-300 text-sm">Approved proposals are implemented</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Voting Power</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Token-based Voting</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 1 01A token = 1 vote</li>
                <li>• Delegation allowed</li>
                <li>• Minimum stake required</li>
                <li>• Transparent voting records</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Proposal Types</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Network upgrades</li>
                <li>• Parameter changes</li>
                <li>• Treasury management</li>
                <li>• New feature additions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function APIsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ APIS_AND_SDKS ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network provides comprehensive APIs and SDKs for developers to integrate 
          AI services into their applications.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED API ENDPOINTS</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Blockchain Explorer APIs</h3>
                <p className="text-gray-300 text-sm">Real-time transaction, block, and address data with dynamic generation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">AI Task Processing APIs</h3>
                <p className="text-gray-300 text-sm">Submit and track AI tasks across all subnet types with real-time status</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Validator Chat API</h3>
                <p className="text-gray-300 text-sm">ChatGPT-powered conversations with validators for technical discussions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Staking Statistics API</h3>
                <p className="text-gray-300 text-sm">Real-time staking data, APY calculations, and validator performance metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Network Statistics API</h3>
                <p className="text-gray-300 text-sm">Live network metrics, transaction rates, and blockchain statistics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ IMPLEMENTED API ENDPOINTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-green-400 mb-3">Blockchain APIs</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>/api/explorer/transaction/[hash]:</strong> Transaction details</li>
                <li>• <strong>/api/explorer/block/[number]:</strong> Block information</li>
                <li>• <strong>/api/explorer/address/[address]:</strong> Address data</li>
                <li>• <strong>/api/explorer/live-transactions:</strong> Real-time transactions</li>
                <li>• <strong>/api/explorer/network-stats:</strong> Network statistics</li>
                <li>• <strong>/api/explorer/block-production:</strong> Block production data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-3">AI & Validator APIs</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>/api/subnets/tasks:</strong> AI task processing</li>
                <li>• <strong>/api/validators/chat:</strong> Validator chat system</li>
                <li>• <strong>/api/staking/stats:</strong> Staking statistics</li>
                <li>• <strong>Real-time data generation</strong></li>
                <li>• <strong>ChatGPT API integration</strong></li>
                <li>• <strong>Dynamic content creation</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ TECHNICAL IMPLEMENTATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-green-400 mb-2">API Features</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• RESTful API design</li>
                <li>• Real-time data generation</li>
                <li>• Dynamic content creation</li>
                <li>• Error handling and validation</li>
                <li>• TypeScript type safety</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Integration</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• ChatGPT API for AI responses</li>
                <li>• Real-time data processing</li>
                <li>• Dynamic blockchain simulation</li>
                <li>• Live statistics calculation</li>
                <li>• Seamless frontend integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">SDK Languages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">JavaScript/TypeScript</h3>
              <p className="text-gray-300 text-sm">Web and Node.js applications</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Python</h3>
              <p className="text-gray-300 text-sm">Data science and AI applications</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Go</h3>
              <p className="text-gray-300 text-sm">High-performance applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ ROADMAP ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network roadmap outlines our vision for building the world&apos;s most advanced 
          decentralized AI infrastructure.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ PHASE 1: FOUNDATION (COMPLETED)</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Core Infrastructure</h3>
                <p className="text-gray-300 text-sm">Next.js 14 frontend with React, TypeScript, Tailwind CSS</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Blockchain Explorer</h3>
                <p className="text-gray-300 text-sm">Real-time transaction, block, and address data with live updates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Staking System</h3>
                <p className="text-gray-300 text-sm">Real-time staking statistics, APY calculations, and validator metrics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">✅ PHASE 2: AI INTEGRATION (COMPLETED)</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">AI Subnets Visualization</h3>
                <p className="text-gray-300 text-sm">Interactive neural network with 7 specialized AI subnets</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Cross-Chain Bridge</h3>
                <p className="text-gray-300 text-sm">MetaMask integration with ETH to 01A token bridging</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">AI Task Processing</h3>
                <p className="text-gray-300 text-sm">Submit LLM, Vision, Embedding, and Audio tasks with real-time processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">Validator Chat System</h3>
                <p className="text-gray-300 text-sm">ChatGPT-powered conversations with validators for technical discussions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <h3 className="font-bold text-white">ML Learning Analytics</h3>
                <p className="text-gray-300 text-sm">Real-time learning curves and task clustering visualization</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Phase 3: Scaling (Q3 2024)</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">📋</span>
              <div>
                <h3 className="font-bold text-white">Advanced AI Models</h3>
                <p className="text-gray-300 text-sm">GPT-4, Claude, and other premium models</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">📋</span>
              <div>
                <h3 className="font-bold text-white">Multi-Chain Support</h3>
                <p className="text-gray-300 text-sm">Bridges to Ethereum, Polygon, and others</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">📋</span>
              <div>
                <h3 className="font-bold text-white">Enterprise Features</h3>
                <p className="text-gray-300 text-sm">Private subnets and enterprise tools</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Phase 4: Global Expansion (Q4 2024)</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-lg">🎯</span>
              <div>
                <h3 className="font-bold text-white">Global Validator Network</h3>
                <p className="text-gray-300 text-sm">1000+ validators worldwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-lg">🎯</span>
              <div>
                <h3 className="font-bold text-white">AI Marketplace</h3>
                <p className="text-gray-300 text-sm">Decentralized AI model marketplace</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-lg">🎯</span>
              <div>
                <h3 className="font-bold text-white">Mobile Integration</h3>
                <p className="text-gray-300 text-sm">Mobile apps and SDKs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ VS_OTHER_CHAINS ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          The 01A Labs Network offers significant advantages over traditional blockchain networks 
          and cloud AI services.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">vs Traditional Blockchains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">01A Labs Network</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• AI-native architecture</li>
                <li>• 44x faster for AI workloads</li>
                <li>• Specialized AI subnets</li>
                <li>• Decentralized AI services</li>
                <li>• Token-based pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-400 mb-3">Traditional Blockchains</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• General-purpose design</li>
                <li>• Slow for AI workloads</li>
                <li>• No AI specialization</li>
                <li>• Centralized AI services</li>
                <li>• High transaction costs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">vs Cloud AI Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-3">01A Labs Network</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Decentralized infrastructure</li>
                <li>• 65% cost reduction</li>
                <li>• No vendor lock-in</li>
                <li>• Global accessibility</li>
                <li>• Transparent pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-400 mb-3">Cloud AI Services</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Centralized infrastructure</li>
                <li>• High costs</li>
                <li>• Vendor lock-in</li>
                <li>• Limited accessibility</li>
                <li>• Opaque pricing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Performance Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Speed</h3>
              <p className="text-gray-300 text-sm">44x faster than Ethereum</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Cost</h3>
              <p className="text-gray-300 text-sm">65% cheaper than cloud AI</p>
            </div>
            <div className="p-4 border border-[#0201ff]/30 bg-[#0201ff]/5">
              <h3 className="font-bold text-[#0201ff] mb-2">Scalability</h3>
              <p className="text-gray-300 text-sm">Unlimited validators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-4">[ GETTING_STARTED ]</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Get started with the 01A Labs Network in just a few simple steps. Whether you&apos;re a developer, 
          validator, or user, we have everything you need.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">For Users</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">1.</span>
              <div>
                <h3 className="font-bold text-white">Connect Wallet</h3>
                <p className="text-gray-300 text-sm">Connect your wallet to the 01A Labs platform</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">2.</span>
              <div>
                <h3 className="font-bold text-white">Get 01A Tokens</h3>
                <p className="text-gray-300 text-sm">Bridge ETH or buy 01A tokens from exchanges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">3.</span>
              <div>
                <h3 className="font-bold text-white">Use AI Services</h3>
                <p className="text-gray-300 text-sm">Submit AI tasks and pay with 01A tokens</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">For Validators</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">1.</span>
              <div>
                <h3 className="font-bold text-white">Acquire Tokens</h3>
                <p className="text-gray-300 text-sm">Get at least 10,000 01A tokens for staking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">2.</span>
              <div>
                <h3 className="font-bold text-white">Setup Hardware</h3>
                <p className="text-gray-300 text-sm">Configure your validator node with required specs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">3.</span>
              <div>
                <h3 className="font-bold text-white">Start Validating</h3>
                <p className="text-gray-300 text-sm">Register as validator and start earning rewards</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">For Developers</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">1.</span>
              <div>
                <h3 className="font-bold text-white">Install SDK</h3>
                <p className="text-gray-300 text-sm">Install the 01A Labs SDK for your preferred language</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">2.</span>
              <div>
                <h3 className="font-bold text-white">Get API Keys</h3>
                <p className="text-gray-300 text-sm">Register for API access and get your keys</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0201ff] text-lg">3.</span>
              <div>
                <h3 className="font-bold text-white">Build Applications</h3>
                <p className="text-gray-300 text-sm">Integrate AI services into your applications</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Resources</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <a href="#" className="text-[#0201ff] hover:underline">Developer Documentation</a></li>
                <li>• <a href="#" className="text-[#0201ff] hover:underline">API Reference</a></li>
                <li>• <a href="#" className="text-[#0201ff] hover:underline">SDK Downloads</a></li>
                <li>• <a href="#" className="text-[#0201ff] hover:underline">Validator Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#0201ff] mb-2">Community</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <a href="#" className="text-[#0201ff] hover:underline">Discord Server</a></li>
                <li>• <a href="#" className="text-[#0201ff] hover:underline">Telegram Group</a></li>
                <li>• <a href="#" className="text-[#0201ff] hover:underline">GitHub Repository</a></li>
                <li>• <a href="#" className="text-[#0201ff] hover:underline">Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
