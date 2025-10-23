'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink, Clock, Box, Zap } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { formatTimestamp } from '@/lib/utils';
import { useState } from 'react';

export default function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [copied, setCopied] = useState(false);

  // Determine if this is a block, tx, or address
  const isBlock = !id.startsWith('0x');
  const isTx = id.startsWith('0x') && id.length > 42;
  const isAddress = id.startsWith('0x') && id.length <= 42;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock data based on type
  const mockData = isBlock
    ? {
        type: 'Block',
        title: `Block #${id}`,
        data: [
          { label: 'Block Height', value: id },
          { label: 'Timestamp', value: formatTimestamp(Date.now() - 30000) },
          { label: 'Transactions', value: '156' },
          { label: 'Gas Used', value: '8.42M / 30M (28.07%)' },
          { label: 'Gas Limit', value: '30,000,000' },
          { label: 'Base Fee', value: '0.000000007 BNB' },
          { label: 'Burnt Fees', value: '0.00059 BNB' },
          { label: 'Block Reward', value: '2.5000 01A' },
          {
            label: 'Miner',
            value: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            isCopyable: true,
          },
          {
            label: 'Hash',
            value: `0x${Math.random().toString(16).slice(2)}abcdef1234567890`,
            isCopyable: true,
          },
          {
            label: 'Parent Hash',
            value: `0x${Math.random().toString(16).slice(2)}1234567890abcdef`,
            isCopyable: true,
          },
        ],
      }
    : isTx
    ? {
        type: 'Transaction',
        title: 'Transaction Details',
        data: [
          {
            label: 'Transaction Hash',
            value: id,
            isCopyable: true,
          },
          { label: 'Status', value: 'Success', isStatus: true },
          { label: 'Block', value: '1234567', isLink: true },
          { label: 'Timestamp', value: formatTimestamp(Date.now() - 45000) },
          {
            label: 'From',
            value: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            isCopyable: true,
          },
          {
            label: 'To',
            value: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
            isCopyable: true,
          },
          { label: 'Value', value: '12.5432 01A ($42.89)' },
          { label: 'Transaction Fee', value: '0.000234 BNB ($0.07)' },
          { label: 'Gas Price', value: '5 Gwei' },
          { label: 'Gas Limit & Usage', value: '21,000 | 21,000 (100%)' },
          { label: 'Nonce', value: '42' },
        ],
      }
    : {
        type: 'Address',
        title: 'Address Details',
        data: [
          {
            label: 'Address',
            value: id,
            isCopyable: true,
          },
          { label: 'Balance', value: '142.5678 01A ($487.82)' },
          { label: 'BNB Balance', value: '1.2345 BNB ($377.42)' },
          { label: 'Total Transactions', value: '1,247' },
          { label: 'Total Sent', value: '3,456.78 01A' },
          { label: 'Total Received', value: '3,599.35 01A' },
          { label: 'First Seen', value: formatTimestamp(Date.now() - 86400000 * 30) },
          { label: 'Last Activity', value: formatTimestamp(Date.now() - 3600000) },
        ],
      };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Back Button */}
        <Link href="/explorer">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-all text-xs font-mono">
            <ArrowLeft className="w-3 h-3" />
            [BACK]
          </button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="text-xs text-gray-500 font-mono">
            <span className="text-white">$</span> query.fetch({`"${id}"`})
          </div>
          <div className="flex items-center gap-2">
            {isBlock && (
              <div className="p-1.5 border border-white/20">
                <Box className="w-4 h-4 text-white" />
              </div>
            )}
            {isTx && (
              <div className="p-1.5 border border-white/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
            )}
            <h1 className="text-2xl font-black text-white font-mono">
              [ {mockData.type.toUpperCase()} ]
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-mono">{'>'} {mockData.title}</p>
        </motion.div>

        {/* Details Card */}
        <GlassCard gradient>
          <div className="space-y-3 font-mono">
            {mockData.data.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-white/10 last:border-0 last:pb-0"
              >
                <div className="sm:w-1/3">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    [ {item.label.replace(/ /g, '_').toUpperCase()} ]
                  </span>
                </div>
                <div className="sm:w-2/3 flex items-center gap-2">
                  {item.isStatus ? (
                    <StatusBadge status="success" />
                  ) : item.isLink ? (
                    <Link
                      href={`/explorer/${item.value}`}
                      className="text-white hover:bg-white hover:text-black px-1 transition-all text-xs break-all"
                    >
                      {item.value}
                    </Link>
                  ) : (
                    <span className="text-white text-xs break-all">
                      {item.value}
                    </span>
                  )}
                  {item.isCopyable && (
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className="p-1.5 border border-white/20 hover:bg-white hover:border-white group transition-all flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <span className="text-[10px] text-white">OK</span>
                      ) : (
                        <Copy className="w-3 h-3 text-white" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Additional Actions */}
        {isTx && (
          <GlassCard className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">[ EXTERNAL_VERIFICATION ]</h3>
                <p className="text-[10px] text-gray-400">
                  {'>'} Verify on official BNB chain explorer
                </p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-all text-xs">
                [OPEN_BSCSCAN]
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

