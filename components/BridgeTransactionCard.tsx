'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface BridgeTransaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  status: string;
  timestamp: number;
  txHashL1?: string;
  txHashL2?: string;
}

interface BridgeTransactionCardProps {
  tx: BridgeTransaction;
  delay: number;
}

export function BridgeTransactionCard({ tx, delay }: BridgeTransactionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <GlassCard hover className="p-3 font-mono">
        <div className="flex items-center justify-between gap-3">
          {/* Bridge Icon */}
          <div className="flex-shrink-0">
            <div className="p-2 border border-white/20 bg-white/5">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-white">
                {tx.from} → {tx.to}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(tx.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-1 text-white">{tx.amount}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-1 text-white">{tx.status}</span>
              </div>
            </div>
            {tx.txHashL1 && (
              <div className="mt-1.5 text-[10px] text-gray-400">
                L1: {tx.txHashL1.slice(0, 10)}...
                {tx.txHashL2 && (
                  <>
                    <span className="mx-1">•</span>
                    L2: {tx.txHashL2.slice(0, 10)}...
                  </>
                )}
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
