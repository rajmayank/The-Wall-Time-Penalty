import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Zap, Turtle, Info, AlertCircle } from 'lucide-react';
import { TRADITIONAL_API_MS, COST_PER_MS_LAMBDA } from '../../constants';

export const TaxiMeter: React.FC = () => {
  const [traditionalTime, setTraditionalTime] = useState(0);
  const [llmTime, setLlmTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // Refs for animation loops
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const deltaTime = (time - startTimeRef.current) * simulationSpeed;

    // Traditional stops at 200ms
    if (deltaTime <= TRADITIONAL_API_MS) {
      setTraditionalTime(deltaTime);
    } else {
      setTraditionalTime(TRADITIONAL_API_MS);
    }

    // LLM keeps going
    setLlmTime(deltaTime);
    
    requestRef.current = requestAnimationFrame(animate);
  };

  const startSimulation = () => {
    setIsRunning(true);
    startTimeRef.current = undefined; // Reset start time
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const resetSimulation = () => {
    stopSimulation();
    setTraditionalTime(0);
    setLlmTime(0);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const formatCost = (ms: number) => {
    // 50k concurrent requests multiplier for dramatic effect (and reality)
    const cost = ms * COST_PER_MS_LAMBDA * 50000; 
    return cost.toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto h-full items-center">
      
      {/* Simulation Context - New Column */}
      <div className="lg:col-span-1 space-y-6 text-sm">
        <div className="bg-surface/50 p-6 rounded-xl border border-white/10">
          <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
            <Info size={16} /> Simulation Parameters
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-2">
              <span className="text-gray-500">•</span>
              <span><strong>Scale:</strong> 50,000 Concurrent Streams</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">•</span>
              <span><strong>Compute:</strong> 128MB ARM64 Lambda</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">•</span>
              <span><strong>Billing Mode:</strong> Duration (GB-second)</span>
            </li>
          </ul>
        </div>

        <div className="bg-surface/50 p-6 rounded-xl border border-white/10">
          <h3 className="text-danger font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> The Problem
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-2">
              <span className="text-gray-500">•</span>
              <span><strong>Idle Wait:</strong> CPU usage is &lt;1% while waiting for the LLM token stream.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">•</span>
              <span><strong>The Meter:</strong> Standard FaaS bills for "Wall Time" (Start to Finish), not "CPU Time".</span>
            </li>
             <li className="flex gap-2">
              <span className="text-gray-500">•</span>
              <span><strong>Socket Hold:</strong> Each connection consumes a file descriptor on your NAT/LB.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Visuals */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Traditional Panel */}
        <div className="bg-surface border border-white/10 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={100} /></div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-primary" /> Traditional Microservice
          </h3>
          <div className="space-y-4 font-mono">
            <div className="flex justify-between items-end border-b border-white/10 pb-2">
              <span className="text-gray-400">Duration</span>
              <span className="text-2xl text-success">{traditionalTime.toFixed(0)} ms</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-gray-400">Cost (50k reqs)</span>
              <span className="text-3xl font-bold text-white">${formatCost(traditionalTime)}</span>
            </div>
          </div>
          <div className="mt-6 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-success"
              style={{ width: `${Math.min((traditionalTime / 1000) * 100, 100)}%` }}
            />
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Request finishes, socket closes, compute released immediately. High efficiency.
          </p>
        </div>

        {/* LLM Panel */}
        <div className="bg-surface border border-danger/30 rounded-xl p-6 relative overflow-hidden ring-1 ring-danger/20">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Turtle size={100} /></div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Turtle className="text-danger" /> GenAI Inference
          </h3>
          <div className="space-y-4 font-mono">
            <div className="flex justify-between items-end border-b border-white/10 pb-2">
              <span className="text-gray-400">Wall Time</span>
              <span className="text-2xl text-danger">{(llmTime / 1000).toFixed(2)} s</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-gray-400">Cost (50k reqs)</span>
              <span className="text-3xl font-bold text-danger">${formatCost(llmTime)}</span>
            </div>
          </div>
          <div className="mt-6 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-danger"
              style={{ width: `${Math.min((llmTime / 30000) * 100, 100)}%` }}
            />
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Compute idles waiting for tokens. You pay for the silence between words.
          </p>
        </div>

        {/* Controls */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-4 mt-8">
          <div className="flex gap-4">
            {!isRunning ? (
              <button 
                onClick={startSimulation}
                className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Clock size={18} /> Start Scale Test
              </button>
            ) : (
              <button 
                onClick={stopSimulation}
                className="px-6 py-2 bg-warning hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors"
              >
                Pause
              </button>
            )}
            <button 
              onClick={resetSimulation}
              className="px-6 py-2 bg-surface border border-white/20 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};