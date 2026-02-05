import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, DollarSign, Clock, Cpu, Pause } from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  duration: number;
  cpuActive: boolean;
  description: string;
  color: string;
}

export const LambdaLifecycle: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [billedTime, setBilledTime] = useState(0);
  const [cpuTime, setCpuTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases: Phase[] = [
    { id: 'receive', name: 'Receive Request', duration: 2, cpuActive: true, description: 'Parse HTTP, validate auth', color: '#22c55e' },
    { id: 'preprocess', name: 'Preprocess', duration: 15, cpuActive: true, description: 'Build prompt, query vector DB', color: '#22c55e' },
    { id: 'call', name: 'Call LLM API', duration: 5, cpuActive: true, description: 'HTTP request to OpenAI/Anthropic', color: '#22c55e' },
    { id: 'wait', name: 'Waiting for Tokens', duration: 4800, cpuActive: false, description: 'LLM is "thinking"... CPU idle', color: '#ef4444' },
    { id: 'stream', name: 'Stream Response', duration: 30, cpuActive: true, description: 'Forward tokens to client', color: '#22c55e' },
    { id: 'cleanup', name: 'Cleanup', duration: 3, cpuActive: true, description: 'Close connections, log metrics', color: '#22c55e' },
  ];

  const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
  const actualCpuTime = phases.filter(p => p.cpuActive).reduce((sum, p) => sum + p.duration, 0);

  useEffect(() => {
    if (!isRunning) return;

    let phaseIdx = 0;
    let phaseElapsed = 0;
    let totalElapsed = 0;

    intervalRef.current = setInterval(() => {
      const speedMultiplier = 50; // Speed up simulation
      phaseElapsed += speedMultiplier;
      totalElapsed += speedMultiplier;

      setElapsed(totalElapsed);
      setBilledTime(totalElapsed);
      
      // Calculate CPU time so far
      let cpu = 0;
      let remaining = totalElapsed;
      for (const phase of phases) {
        if (remaining <= 0) break;
        const phaseTime = Math.min(remaining, phase.duration);
        if (phase.cpuActive) cpu += phaseTime;
        remaining -= phase.duration;
      }
      setCpuTime(cpu);

      // Check if we need to advance to next phase
      if (phaseElapsed >= phases[phaseIdx].duration) {
        phaseElapsed = 0;
        phaseIdx++;
        if (phaseIdx >= phases.length) {
          setIsRunning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
      }
      setCurrentPhase(phaseIdx);
    }, 16);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setCurrentPhase(-1);
    setElapsed(0);
    setBilledTime(0);
    setCpuTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const progress = (elapsed / totalDuration) * 100;

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">Lambda Function Lifecycle</div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"/> CPU Active</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"/> CPU Idle (Still Billing)</span>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Phase Boxes */}
        <div className="flex gap-1 mb-4 h-20">
          {phases.map((phase, idx) => {
            const widthPercent = (phase.duration / totalDuration) * 100;
            const isActive = idx === currentPhase;
            const isPast = idx < currentPhase;
            
            return (
              <motion.div
                key={phase.id}
                className={`relative flex flex-col justify-center items-center rounded-lg border-2 overflow-hidden ${
                  isActive ? 'ring-2 ring-white' : ''
                }`}
                style={{ 
                  width: `${widthPercent}%`,
                  backgroundColor: isPast || isActive ? `${phase.color}20` : '#1f2937',
                  borderColor: isPast || isActive ? phase.color : '#374151',
                  minWidth: widthPercent > 5 ? 'auto' : '40px'
                }}
                animate={{ scale: isActive ? 1.02 : 1 }}
              >
                {widthPercent > 8 && (
                  <>
                    <span className={`text-xs font-bold ${isPast || isActive ? 'text-white' : 'text-gray-500'}`}>
                      {phase.name}
                    </span>
                    <span className="text-[10px] text-gray-400">{phase.duration}ms</span>
                  </>
                )}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1"
                    style={{ backgroundColor: phase.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: phase.duration / 50 / 1000, ease: 'linear' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Billing Indicator Bar */}
        <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 z-10">
            <DollarSign size={12} className="mr-1" /> BILLING ACTIVE (from first byte to last byte)
          </div>
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500/30 to-red-500/30"
            animate={{ width: `${progress}%` }}
          />
          {/* Start marker */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
          {/* End marker */}
          {elapsed >= totalDuration && (
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500" />
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-500 mb-1">Elapsed</div>
            <div className="text-2xl font-mono text-white">{(elapsed / 1000).toFixed(2)}s</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-green-500/30 text-center">
            <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
              <Cpu size={10} /> Actual CPU Work
            </div>
            <div className="text-2xl font-mono text-green-400">{cpuTime}ms</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-red-500/30 text-center">
            <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
              <Clock size={10} /> Billed Duration
            </div>
            <div className="text-2xl font-mono text-red-400">{(billedTime / 1000).toFixed(2)}s</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-yellow-500/30 text-center">
            <div className="text-xs text-gray-500 mb-1">Cost Multiplier</div>
            <div className="text-2xl font-mono text-yellow-400">
              {cpuTime > 0 ? `${Math.round(billedTime / cpuTime)}x` : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={elapsed >= totalDuration}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
            isRunning ? 'bg-yellow-500 text-black' : 'bg-primary text-white'
          } disabled:opacity-50`}
        >
          {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> {elapsed > 0 ? 'Resume' : 'Start Request'}</>}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-surface border border-white/20 text-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Key Insight */}
      {elapsed >= totalDuration && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
        >
          <p className="text-red-400 font-bold">
            {actualCpuTime}ms of work. {totalDuration}ms billed. You paid for {Math.round(totalDuration / actualCpuTime)}x more than you used.
          </p>
        </motion.div>
      )}
    </div>
  );
};
