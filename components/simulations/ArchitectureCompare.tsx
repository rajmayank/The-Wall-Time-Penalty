import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, CloudLightning } from 'lucide-react';

interface ArchProps {
  mode: 'naive' | 'async' | 'streaming';
}

export const ArchitectureCompare: React.FC<ArchProps> = ({ mode }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[400px] bg-surface rounded-xl border border-white/10 p-8 flex items-center justify-between">
        
        {/* Client */}
        <div className="flex flex-col items-center gap-2 z-10 relative">
          <div className="bg-surface p-3 rounded-full border border-white/20">
             <Smartphone className="text-white w-8 h-8" />
          </div>
          <span className="text-xs font-mono text-gray-400">Client</span>
        </div>

        {/* Middleware / Connection Area */}
        <div className="flex-1 mx-8 relative h-full flex items-center justify-center">
            
            {/* --- NAIVE PATTERN ANIMATION --- */}
            {mode === 'naive' && (
                <>
                    {/* The Blocking Connection Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <motion.line 
                            x1="0" y1="50%" x2="100%" y2="50%"
                            stroke="#ef4444" 
                            strokeWidth="4"
                            initial={{ pathLength: 0, opacity: 0.5 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                        />
                         {/* Pulse effect to show 'holding' */}
                        <motion.circle 
                             cx="50%" cy="50%" r="4" fill="#ef4444"
                             animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                             transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </svg>
                    
                    <div className="z-10 bg-surface border border-danger text-danger px-4 py-2 rounded-lg text-xs font-mono text-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <div>Socket Blocked</div>
                        <div>Billing Active</div>
                    </div>
                </>
            )}

            {/* --- ASYNC PATTERN ANIMATION --- */}
            {mode === 'async' && (
                <div className="w-full flex items-center justify-between relative">
                    {/* Request Packet */}
                    <motion.div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 -mt-1.5"
                        animate={{ x: ['0%', '40%', '40%', '100%'], opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.4, 1] }}
                    />
                     {/* Response/Poll Packet */}
                     <motion.div 
                        className="absolute w-3 h-3 bg-green-500 rounded-full top-1/2 -mt-1.5"
                        animate={{ x: ['100%', '60%', '60%', '0%'], opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5, times: [0, 0.6, 0.7, 1] }}
                    />

                    <div className="flex flex-col gap-4 w-full items-center z-10">
                        <div className="flex w-full justify-around items-center">
                             <div className="p-3 bg-blue-900/30 border border-blue-500/50 rounded text-blue-200 text-xs text-center w-24">
                                API GW
                            </div>
                            <ArrowRight size={16} className="text-gray-600"/>
                            <div className="p-3 bg-purple-900/30 border border-purple-500/50 rounded text-purple-200 text-xs text-center w-24">
                                Queue
                            </div>
                            <ArrowRight size={16} className="text-gray-600"/>
                             <div className="p-3 bg-green-900/30 border border-green-500/50 rounded text-green-200 text-xs text-center w-24">
                                Worker
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STREAMING PATTERN ANIMATION --- */}
            {mode === 'streaming' && (
                <div className="w-full flex items-center justify-center relative">
                     {/* Connection Line */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line x1="0" y1="50%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>

                    {/* Stream Packets */}
                    <motion.div 
                         className="absolute w-2 h-2 bg-emerald-400 rounded-full top-1/2 -mt-1"
                         initial={{ x: '100%' }}
                         animate={{ x: '0%' }}
                         transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />

                     <div className="flex items-center gap-4 z-10">
                         <div className="p-4 bg-indigo-900/80 border border-indigo-400 rounded-lg text-indigo-200 w-32 text-center backdrop-blur-sm shadow-xl">
                            <div className="text-xs font-bold mb-1">Proxy</div>
                            <div className="text-[10px] text-gray-400">Persistent</div>
                         </div>
                         <div className="p-4 bg-emerald-900/80 border border-emerald-400 rounded-lg text-emerald-200 w-32 text-center backdrop-blur-sm shadow-xl">
                            <div className="text-xs font-bold mb-1">Worker</div>
                            <div className="text-[10px] text-gray-400">Ephemeral</div>
                         </div>
                     </div>
                </div>
            )}
        </div>

        {/* LLM */}
        <div className="flex flex-col items-center gap-2 z-10 relative">
          <div className="bg-surface p-3 rounded-full border border-white/20">
            <CloudLightning className="text-accent w-8 h-8" />
          </div>
          <span className="text-xs font-mono text-gray-400">LLM API</span>
        </div>

      </div>

      <div className="mt-8 text-center max-w-2xl">
        {mode === 'naive' && (
            <p className="text-danger font-mono text-sm">
                THE BLOCKING TRAP: The FaaS function is alive for the entire 40s duration. 
                1 request = 1 execution environment. Cost scales linearly with duration.
            </p>
        )}
        {mode === 'async' && (
            <p className="text-purple-300 font-mono text-sm">
                THE POLLING TAX: Decouples connection from compute. Client polls for result.
                High reliability, but terrible UX (no streaming/latency).
            </p>
        )}
        {mode === 'streaming' && (
            <p className="text-blue-300 font-mono text-sm">
                THE SPLIT-STACK: A lightweight proxy holds the socket. 
                Backend workers push chunks via PubSub. Zero idle compute.
            </p>
        )}
      </div>
    </div>
  );
};