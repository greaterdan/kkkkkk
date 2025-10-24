'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink, Clock, Box, Zap, CheckCircle, XCircle, AlertCircle, Hash, User, DollarSign, Gauge, Calendar, Shield, Activity, Flame, Database, Layers } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { formatTimestamp } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface TransactionDetails {
  hash: string;
  status: 'Success' | 'Failed' | 'Pending';
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  gasLimit: string;
  nonce: number;
  transactionFee: string;
  aiService?: string;
  method?: string;
  input?: string;
  logs?: any[];
  internalTransactions?: any[];
  confirmations?: number;
}

interface AddressDetails {
  address: string;
  type: string;
  balance: {
    '01A': string;
    'BNB': string;
  };
  usdValue: {
    '01A': number;
    'BNB': number;
  };
  statistics: {
    totalTransactions: number;
    totalSent: string;
    totalReceived: string;
  };
  activity: {
    firstSeen: number;
    lastActivity: number;
  };
  contractInfo: {
    name: string;
    compiler: string;
    verified: boolean;
  };
}

interface BlockDetails {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
  gasUsed: string;
  gasLimit: string;
  miner: string;
  difficulty: string;
  totalDifficulty: string;
  size: number;
  extraData: string;
  nonce: string;
  parentHash: string;
  stateRoot: string;
  receiptsRoot: string;
  transactionsRoot: string;
  uncles: string[];
  reward: string;
  fees: string;
  baseFeePerGas?: string;
  burntFees?: string;
}

export default function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [copied, setCopied] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionDetails | null>(null);
  const [blockData, setBlockData] = useState<BlockDetails | null>(null);
  const [addressData, setAddressData] = useState<AddressDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'state'>('overview');

  // Determine if this is a block, tx, or address
  const isBlock = !id.startsWith('0x');
  const isTx = id.startsWith('0x') && id.length > 42;
  const isAddress = id.startsWith('0x') && id.length <= 42;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch real transaction data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isTx) {
          // Fetch real transaction data from API
          const response = await fetch(`/api/explorer/transaction/${id}`);
          if (response.ok) {
            const data = await response.json();
            setTransactionData(data);
          } else {
            throw new Error('Failed to fetch transaction data');
          }
        } else if (isBlock) {
          // Fetch real block data from API
          const response = await fetch(`/api/explorer/block/${id}`);
          if (response.ok) {
            const data = await response.json();
            setBlockData(data);
          } else {
            throw new Error('Failed to fetch block data');
          }
        } else if (isAddress) {
          // Fetch real address data from API
          const response = await fetch(`/api/explorer/address/${id}`);
          if (response.ok) {
            const data = await response.json();
            setAddressData(data);
          } else {
            throw new Error('Failed to fetch address data');
          }
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isTx, isBlock, isAddress]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white font-mono text-sm">Loading blockchain data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/explorer">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-all text-xs font-mono">
            <ArrowLeft className="w-3 h-3" />
            [BACK_TO_EXPLORER]
          </button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            {isBlock && <Box className="w-8 h-8 text-white" />}
            {isTx && <Zap className="w-8 h-8 text-white" />}
            {isAddress && <User className="w-8 h-8 text-white" />}
            <div>
              <h1 className="text-3xl font-black text-white font-mono">
                {isBlock ? `Block #${id}` : isTx ? 'Transaction Details' : 'Address Details'}
              </h1>
              <p className="text-sm text-gray-400 font-mono">
                {isBlock ? 'Block Information' : isTx ? 'Transaction Hash' : 'Address Information'}
              </p>
            </div>
          </div>

          {/* Status and Key Info */}
          {isTx && transactionData && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                {transactionData.status === 'Success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-mono text-white">{transactionData.status}</span>
          </div>
          <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-mono text-gray-400">
                  {formatTimestamp(transactionData.timestamp * 1000)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-mono text-gray-400">
                  Block #{transactionData.blockNumber}
                </span>
              </div>
              </div>
            )}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
        <GlassCard gradient>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white font-mono">Overview</h2>
                </div>
                
                {isTx && transactionData && (
                  <div className="space-y-4">
                    {/* Transaction Hash */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Transaction Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm break-all">{transactionData.hash}</span>
                        <button
                          onClick={() => copyToClipboard(transactionData.hash)}
                          className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                        >
                          <Copy className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Status:</span>
                      <StatusBadge status={transactionData.status.toLowerCase() as any} />
                    </div>

                    {/* Block */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Block:</span>
                      <Link href={`/explorer/${transactionData.blockNumber}`} className="text-white hover:underline font-mono">
                        {transactionData.blockNumber}
                    </Link>
                    </div>

                    {/* From/To */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">From:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm break-all">{transactionData.from}</span>
                          <button
                            onClick={() => copyToClipboard(transactionData.from)}
                            className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                          >
                            <Copy className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">To:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm break-all">{transactionData.to}</span>
                          <button
                            onClick={() => copyToClipboard(transactionData.to)}
                            className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                          >
                            <Copy className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Value:</span>
                      <span className="text-white font-mono text-sm">
                        {transactionData.value} 01A (${(parseFloat(transactionData.value) * 3.42).toFixed(2)})
                      </span>
                    </div>

                    {/* AI Service */}
                    {transactionData.aiService && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded border border-purple-500/20">
                        <span className="text-sm text-purple-300 font-mono">AI Service:</span>
                        <span className="text-purple-200 font-mono text-sm">{transactionData.aiService}</span>
                      </div>
                    )}

                    {/* Gas Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">Gas Price:</span>
                        <span className="text-white font-mono text-sm">25 Gwei</span>
                      </div>
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">Gas Used:</span>
                        <span className="text-white font-mono text-sm">21,000 / 21,000 (100%)</span>
                      </div>
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">Transaction Fee:</span>
                        <span className="text-white font-mono text-sm">{transactionData.transactionFee} BNB</span>
                      </div>
                    </div>
                  </div>
                )}

                {isBlock && blockData && (
                  <div className="space-y-4">
                    {/* Block Hash */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Block Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm break-all">{blockData.hash}</span>
                        <button
                          onClick={() => copyToClipboard(blockData.hash)}
                          className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                        >
                          <Copy className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Timestamp:</span>
                      <span className="text-white font-mono text-sm">
                        {formatTimestamp(blockData.timestamp * 1000)}
                      </span>
                    </div>

                    {/* Transactions */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Transactions:</span>
                      <span className="text-white font-mono text-sm">{blockData.transactions.length}</span>
                    </div>

                    {/* Gas Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">Gas Used:</span>
                        <span className="text-white font-mono text-sm">
                          {parseInt(blockData.gasUsed, 16).toLocaleString()} / {parseInt(blockData.gasLimit, 16).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-sm text-gray-400 font-mono block mb-2">Gas Limit:</span>
                        <span className="text-white font-mono text-sm">{parseInt(blockData.gasLimit, 16).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Miner */}
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">Miner:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm break-all">{blockData.miner}</span>
                        <button
                          onClick={() => copyToClipboard(blockData.miner)}
                          className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                        >
                          <Copy className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Details */}
                {isAddress && addressData && (
                  <div className="space-y-4">
                    {/* Address Information */}
                    <div className="p-4 bg-gradient-to-r from-orange-900/20 to-amber-900/20 rounded border border-orange-500/20">
                      <h4 className="text-sm font-bold text-orange-200 font-mono mb-3">Address Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-mono text-sm">Address:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-sm break-all">{addressData.address}</span>
                            <button
                              onClick={() => copyToClipboard(addressData.address)}
                              className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                            >
                              <Copy className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-mono text-sm">Type:</span>
                          <span className="text-white font-mono text-sm">{addressData.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Balance Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded border border-white/10">
                        <h4 className="text-sm font-bold text-white font-mono mb-3">01A Token Balance</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">Balance:</span>
                            <span className="text-white font-mono text-sm">{addressData.balance['01A']} 01A</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">USD Value:</span>
                            <span className="text-white font-mono text-sm">${addressData.usdValue['01A'].toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 rounded border border-white/10">
                        <h4 className="text-sm font-bold text-white font-mono mb-3">BNB Balance</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">Balance:</span>
                            <span className="text-white font-mono text-sm">{addressData.balance['BNB']} BNB</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">USD Value:</span>
                            <span className="text-white font-mono text-sm">${addressData.usdValue['BNB'].toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Statistics */}
                    <div className="p-4 bg-black/20 rounded border border-white/10">
                      <h4 className="text-sm font-bold text-white font-mono mb-3">Transaction Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-400 font-mono text-sm block mb-1">Total Transactions:</span>
                          <span className="text-white font-mono text-sm">{addressData.statistics.totalTransactions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-mono text-sm block mb-1">Total Sent:</span>
                          <span className="text-white font-mono text-sm">{addressData.statistics.totalSent} 01A</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-mono text-sm block mb-1">Total Received:</span>
                          <span className="text-white font-mono text-sm">{addressData.statistics.totalReceived} 01A</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded border border-white/10">
                        <h4 className="text-sm font-bold text-white font-mono mb-3">Activity</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">First Seen:</span>
                            <span className="text-white font-mono text-sm">{formatTimestamp(addressData.activity.firstSeen * 1000)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">Last Activity:</span>
                            <span className="text-white font-mono text-sm">{formatTimestamp(addressData.activity.lastActivity * 1000)}</span>
                          </div>
                        </div>
                      </div>

                      {addressData.contractInfo && (
                        <div className="p-4 bg-black/20 rounded border border-white/10">
                          <h4 className="text-sm font-bold text-white font-mono mb-3">Contract Info</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Contract Name:</span>
                              <span className="text-white font-mono text-sm">{addressData.contractInfo.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Compiler:</span>
                              <span className="text-white font-mono text-sm">{addressData.contractInfo.compiler}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Verified:</span>
                              <span className={`font-mono text-sm ${addressData.contractInfo.verified ? 'text-green-400' : 'text-red-400'}`}>
                                {addressData.contractInfo.verified ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Tabs for Transaction Details */}
            {isTx && transactionData && (
              <GlassCard>
                <div className="space-y-4">
                  {/* Tab Navigation */}
                  <div className="flex gap-2 border-b border-white/10">
                    {['overview', 'logs', 'state'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-sm font-mono transition-all ${
                          activeTab === tab
                            ? 'text-white border-b-2 border-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Transaction Action */}
                      <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded border border-blue-500/20">
                        <h4 className="text-sm font-bold text-blue-200 font-mono mb-3">Transaction Action</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">Action:</span>
                            <span className="text-white font-mono text-sm">{transactionData.method}</span>
                          </div>
                          {transactionData.aiService && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">AI Service:</span>
                              <span className="text-purple-200 font-mono text-sm">{transactionData.aiService}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Value and Fees */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded border border-white/10">
                          <h4 className="text-sm font-bold text-white font-mono mb-3">Value</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Amount:</span>
                              <span className="text-white font-mono text-sm">{transactionData.value} 01A</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">USD Value:</span>
                              <span className="text-white font-mono text-sm">${(parseFloat(transactionData.value) * 3.42).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-black/20 rounded border border-white/10">
                          <h4 className="text-sm font-bold text-white font-mono mb-3">Transaction Fee</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Fee:</span>
                              <span className="text-white font-mono text-sm">{transactionData.transactionFee} BNB</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">USD Fee:</span>
                              <span className="text-white font-mono text-sm">${(parseFloat(transactionData.transactionFee) * 600).toFixed(4)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gas Information */}
                      <div className="p-4 bg-black/20 rounded border border-white/10">
                        <h4 className="text-sm font-bold text-white font-mono mb-3">Gas Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-gray-400 font-mono text-sm block mb-1">Gas Price:</span>
                            <span className="text-white font-mono text-sm">25 Gwei</span>
                          </div>
                          <div>
                            <span className="text-gray-400 font-mono text-sm block mb-1">Gas Used:</span>
                            <span className="text-white font-mono text-sm">21,000</span>
                          </div>
                          <div>
                            <span className="text-gray-400 font-mono text-sm block mb-1">Gas Limit:</span>
                            <span className="text-white font-mono text-sm">21,000</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-xs text-gray-400 font-mono mt-1 block">Gas Usage: 100%</span>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded border border-white/10">
                          <h4 className="text-sm font-bold text-white font-mono mb-3">Transaction Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Nonce:</span>
                              <span className="text-white font-mono text-sm">{transactionData.nonce}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Position:</span>
                              <span className="text-white font-mono text-sm">0</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Type:</span>
                              <span className="text-white font-mono text-sm">Legacy</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-black/20 rounded border border-white/10">
                          <h4 className="text-sm font-bold text-white font-mono mb-3">Block Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Block Height:</span>
                              <Link href={`/explorer/${transactionData.blockNumber}`} className="text-white hover:underline font-mono text-sm">
                                {transactionData.blockNumber}
                              </Link>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Confirmations:</span>
                              <span className="text-white font-mono text-sm">{transactionData.confirmations}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-mono text-sm">Timestamp:</span>
                              <span className="text-white font-mono text-sm">{formatTimestamp(transactionData.timestamp * 1000)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Input Data */}
                      <div className="p-4 bg-black/20 rounded border border-white/10">
                        <h4 className="text-sm font-bold text-white font-mono mb-3">Input Data</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-mono text-sm">Function:</span>
                            <span className="text-white font-mono text-sm">transfer(address,uint256)</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-400 font-mono text-sm block mb-1">Raw Input:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono text-xs break-all bg-black/40 p-2 rounded">{transactionData.input}</span>
                              <button
                                onClick={() => copyToClipboard(transactionData.input || '')}
                                className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                              >
                                <Copy className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'logs' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-mono">Event Logs</h3>
                        <span className="text-sm text-gray-400 font-mono">
                          {transactionData.logs?.length || 0} events
                        </span>
                      </div>
                      
                      {transactionData.logs?.map((log, idx) => (
                        <div key={idx} className="p-4 bg-black/20 rounded border border-white/10">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400 font-mono">Log #{idx + 1}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-green-400 font-mono">✓ Indexed</span>
                                <button
                                  onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
                                  className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                                >
                                  <Copy className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <span className="text-sm text-gray-400 font-mono block mb-1">Address:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-mono text-sm break-all">{log.address}</span>
                                  <button
                                    onClick={() => copyToClipboard(log.address)}
                                    className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                                  >
                                    <Copy className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-sm text-gray-400 font-mono block mb-1">Topics:</span>
                                <div className="space-y-1">
                                  {log.topics.map((topic: string, topicIdx: number) => (
                                    <div key={topicIdx} className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500 font-mono w-8">[{topicIdx}]</span>
                                      <span className="text-white font-mono text-xs break-all">{topic}</span>
                                      <button
                                        onClick={() => copyToClipboard(topic)}
                                        className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                                      >
                                        <Copy className="w-3 h-3 text-white" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-sm text-gray-400 font-mono block mb-1">Data:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-mono text-xs break-all">{log.data}</span>
                    <button
                                    onClick={() => copyToClipboard(log.data)}
                                    className="p-1 border border-white/20 hover:bg-white hover:border-white transition-all"
                                  >
                                    <Copy className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(!transactionData.logs || transactionData.logs.length === 0) && (
                        <div className="text-center py-8 text-gray-400 font-mono">
                          No event logs found for this transaction
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'state' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-mono">Internal Transactions</h3>
                        <span className="text-sm text-gray-400 font-mono">
                          {transactionData.internalTransactions?.length || 0} internal txs
                        </span>
                      </div>
                      
                      {transactionData.internalTransactions && transactionData.internalTransactions.length > 0 ? (
                        transactionData.internalTransactions.map((internalTx, idx) => (
                          <div key={idx} className="p-4 bg-black/20 rounded border border-white/10">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400 font-mono">Internal Transaction #{idx + 1}</span>
                                <span className="text-xs text-blue-400 font-mono">Internal</span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <span className="text-sm text-gray-400 font-mono block mb-1">From:</span>
                                  <span className="text-white font-mono text-sm break-all">{internalTx.from}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-400 font-mono block mb-1">To:</span>
                                  <span className="text-white font-mono text-sm break-all">{internalTx.to}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-400 font-mono block mb-1">Value:</span>
                                  <span className="text-white font-mono text-sm">{internalTx.value} 01A</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-400 font-mono block mb-1">Gas:</span>
                                  <span className="text-white font-mono text-sm">{internalTx.gas}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-black/20 rounded border border-white/10">
                            <p className="text-gray-400 font-mono text-sm">
                              No internal transactions found for this transaction.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded border border-blue-500/20">
                            <h4 className="text-sm font-bold text-blue-200 font-mono mb-2">State Changes</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 font-mono">Storage Changes:</span>
                                <span className="text-white font-mono">0</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 font-mono">Balance Changes:</span>
                                <span className="text-white font-mono">2</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 font-mono">Nonce Changes:</span>
                                <span className="text-white font-mono">1</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Network Info */}
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white font-mono">Network Info</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-mono">Network:</span>
                    <span className="text-white font-mono text-sm">01A L2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-mono">Chain ID:</span>
                    <span className="text-white font-mono text-sm">0x1A</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-mono">Block Time:</span>
                    <span className="text-white font-mono text-sm">~3s</span>
                  </div>
                </div>
          </div>
        </GlassCard>

            {/* External Links */}
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white font-mono">External Links</h3>
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-black/20 rounded border border-white/10 hover:bg-white/10 transition-all">
                    <span className="text-white font-mono text-sm">View on 01A Explorer</span>
                    <ExternalLink className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-black/20 rounded border border-white/10 hover:bg-white/10 transition-all">
                    <span className="text-white font-mono text-sm">View on 01A Bridge</span>
                    <ExternalLink className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-black/20 rounded border border-white/10 hover:bg-white/10 transition-all">
                    <span className="text-white font-mono text-sm">View on 01A Validators</span>
                    <ExternalLink className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Copy All Data */}
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white font-mono">Export Data</h3>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(isTx ? transactionData : blockData, null, 2))}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-black/20 rounded border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <Copy className="w-4 h-4 text-white" />
                    <span className="text-white font-mono text-sm">Copy JSON</span>
              </button>
                </div>
            </div>
          </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}