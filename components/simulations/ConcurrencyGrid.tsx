import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Server, Network, ShieldAlert } from 'lucide-react';

export const ConcurrencyGrid: React.FC = () => {
  const TOTAL_SLOTS = 240; // Visual representation
  const [filledSlots, setFilledSlots] = useState(0);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilledSlots(prev => {
        if (prev >= TOTAL_SLOTS) {
          setIsFailed(true);
          return TOTAL_SLOTS;
        }
        // Exponential growth simulation
        const growth = Math.max(1, Math.floor(prev * 0.1)) + 2; 
        return Math.min(prev + growth, TOTAL_SLOTS);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center justify-center h-full">
      <div className="flex-1 space-y-6 max-w-xl">
        <h3 className="text-3xl font-bold text-white flex items-center gap-3">
          <Network className="text-accent" />
          The "Port Exhaustion" Cliff
        </h3>
        <p className="text-gray-300 leading-relaxed">
           When you hold open connections for 40s+, you saturate the 5-tuple table of your Load Balancers and NAT Gateways.
        </p>
        
        <div className="bg-surface/50 border border-white/10 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">The Physics of TCP</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 text-xs mb-1">UNIX Ephemeral Ports</div>
              <div className="font-mono text-white">~32,768 - 60,999</div>
              <div className="text-xs text-gray-600">Default Linux Range</div>
            </div>
             <div>
              <div className="text-gray-500 text-xs mb-1">AWS NAT Gateway</div>
              <div className="font-mono text-white">64,000</div>
              <div className="text-xs text-gray-600">Conns per Destination</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">MacBook (Reference)</div>
              <div className="font-mono text-white">~16,383</div>
              <div className="text-xs text-gray-600">net.inet.ip.portrange</div>
            </div>
             <div>
              <div className="text-gray-500 text-xs mb-1">TIME_WAIT State</div>
              <div className="font-mono text-white">60s (Default)</div>
              <div className="text-xs text-gray-600">Kernel lock duration</div>
            </div>
          </div>
        </div>

        {isFailed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-danger/10 border border-danger text-danger p-4 rounded-lg flex items-start gap-3 mt-4"
          >
            <ShieldAlert className="shrink-0" />
            <div>
              <div className="font-bold">System Failure: SNAT Port Exhaustion</div>
              <div className="text-xs mt-1">Packets are being dropped because the NAT Gateway cannot allocate a new source port. The system is effectively offline for new users.</div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex-1 w-full max-w-xl">
        <div className="bg-black p-6 rounded-xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-end mb-4">
                <div className="text-xs font-mono text-gray-500">
                    <div>VISUALIZATION</div>
                    <div className="text-white">Connection State Table</div>
                </div>
                <div className="text-right text-xs font-mono">
                    <div className="text-gray-500">SATURATION</div>
                    <div className={isFailed ? "text-danger" : "text-primary"}>
                        {Math.floor((filledSlots/TOTAL_SLOTS)*100)}%
                    </div>
                </div>
            </div>
            
            {/* Fixed Grid CSS: Tailwind doesn't have grid-cols-20 by default */}
            <div 
                className="grid gap-1 w-full aspect-[16/10]" 
                style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
            >
            {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                <motion.div
                key={i}
                initial={{ backgroundColor: '#1f2937' }}
                animate={{ 
                    backgroundColor: i < filledSlots ? (isFailed ? '#ef4444' : '#3b82f6') : '#1f2937',
                    scale: i < filledSlots ? 1 : 0.8
                }}
                className="rounded-[1px]"
                />
            ))}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-gray-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"/> ESTABLISHED</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"/> DROPPED</span>
                </div>
                <span>FaaS POOL</span>
            </div>
        </div>
      </div>
    </div>
  );
};