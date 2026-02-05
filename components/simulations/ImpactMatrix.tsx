import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Zap, Code, Smile, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const ImpactMatrix: React.FC = () => {
  const [highlight, setHighlight] = useState<string | null>(null);

  const dimensions = [
    {
      id: 'cost',
      name: 'Cost to Serve',
      icon: <DollarSign size={20} />,
      color: '#22c55e',
      traditional: { score: 1, label: 'Terrible', detail: '88x multiplier. $667/1M reqs' },
      streaming: { score: 1, label: 'Terrible', detail: 'Same billing model' },
      durable: { score: 5, label: 'Excellent', detail: 'Pay only for compute. ~$15/1M' },
    },
    {
      id: 'throughput',
      name: 'Throughput',
      icon: <TrendingUp size={20} />,
      color: '#3b82f6',
      traditional: { score: 2, label: 'Limited', detail: '1000 concurrent limit per region' },
      streaming: { score: 2, label: 'Limited', detail: 'Same Lambda limits apply' },
      durable: { score: 4, label: 'Good', detail: 'Hibernating fns dont count toward limit' },
    },
    {
      id: 'latency',
      name: 'User-Perceived Latency',
      icon: <Clock size={20} />,
      color: '#f59e0b',
      traditional: { score: 1, label: 'Poor', detail: 'User waits for full response' },
      streaming: { score: 5, label: 'Excellent', detail: 'TTFB ~200ms, tokens stream' },
      durable: { score: 3, label: 'Moderate', detail: 'Checkpoint overhead adds ~100-500ms' },
    },
    {
      id: 'devx',
      name: 'Developer Experience',
      icon: <Code size={20} />,
      color: '#a855f7',
      traditional: { score: 5, label: 'Simple', detail: 'Just async/await. Nothing new.' },
      streaming: { score: 4, label: 'Good', detail: 'New API, but straightforward' },
      durable: { score: 3, label: 'Learning Curve', detail: 'Determinism rules, replay semantics' },
    },
    {
      id: 'reliability',
      name: 'Reliability',
      icon: <Zap size={20} />,
      color: '#ef4444',
      traditional: { score: 2, label: 'Risky', detail: 'Timeout at 15min. No resume.' },
      streaming: { score: 2, label: 'Risky', detail: 'Same timeout limits' },
      durable: { score: 5, label: 'Excellent', detail: 'Auto-retry, checkpoint, resume' },
    },
  ];

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <CheckCircle size={14} className="text-green-400" />;
    if (score >= 3) return <AlertCircle size={14} className="text-yellow-400" />;
    return <XCircle size={14} className="text-red-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-sm text-gray-400">Dimension</div>
        <div className="text-sm text-gray-400 text-center">Traditional Lambda</div>
        <div className="text-sm text-gray-400 text-center">Streaming Response</div>
        <div className="text-sm text-gray-400 text-center">Durable Functions</div>
      </div>

      {/* Matrix Rows */}
      <div className="flex-1 space-y-3">
        {dimensions.map(dim => (
          <motion.div
            key={dim.id}
            className={`grid grid-cols-4 gap-4 p-3 rounded-lg transition-colors ${
              highlight === dim.id ? 'bg-surface' : 'hover:bg-surface/50'
            }`}
            onMouseEnter={() => setHighlight(dim.id)}
            onMouseLeave={() => setHighlight(null)}
          >
            {/* Dimension Name */}
            <div className="flex items-center gap-2">
              <span style={{ color: dim.color }}>{dim.icon}</span>
              <span className="font-medium text-white text-sm">{dim.name}</span>
            </div>

            {/* Traditional */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {getScoreIcon(dim.traditional.score)}
                <span className={`font-bold text-sm ${getScoreColor(dim.traditional.score)}`}>
                  {dim.traditional.label}
                </span>
              </div>
              {highlight === dim.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-gray-500"
                >
                  {dim.traditional.detail}
                </motion.div>
              )}
            </div>

            {/* Streaming */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {getScoreIcon(dim.streaming.score)}
                <span className={`font-bold text-sm ${getScoreColor(dim.streaming.score)}`}>
                  {dim.streaming.label}
                </span>
              </div>
              {highlight === dim.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-gray-500"
                >
                  {dim.streaming.detail}
                </motion.div>
              )}
            </div>

            {/* Durable */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {getScoreIcon(dim.durable.score)}
                <span className={`font-bold text-sm ${getScoreColor(dim.durable.score)}`}>
                  {dim.durable.label}
                </span>
              </div>
              {highlight === dim.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-gray-500"
                >
                  {dim.durable.detail}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="font-bold text-white">Best For</div>
        <div className="text-center">
          <div className="text-sm text-gray-300">Prototypes</div>
          <div className="text-xs text-gray-500">Low volume, simple logic</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-300">Chat UX</div>
          <div className="text-xs text-gray-500">When latency perception matters</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-300">Production Scale</div>
          <div className="text-xs text-gray-500">Cost-sensitive, high-volume</div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
        <div className="flex items-start gap-3">
          <ArrowRight className="text-accent shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-accent font-bold">The insight:</span> Streaming fixes the UX problem. 
              Durable fixes the cost problem. For production GenAI at scale, you likely need <span className="text-white">both</span>: 
              streaming for real-time chat, durable for background agents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
