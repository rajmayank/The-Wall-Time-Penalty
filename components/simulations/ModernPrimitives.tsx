import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Activity, Database, Zap, Repeat, Server, DollarSign } from 'lucide-react';

export const ModernPrimitives: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'streaming' | 'durable'>('streaming');

  return (
    <div className="w-full h-full flex flex-col items-center p-8">
      <div className="flex gap-4 mb-8 bg-surface p-1 rounded-lg border border-white/10">
        <button 
            onClick={() => setActiveTab('streaming')}
            className={`px-6 py-2 rounded-md font-mono text-sm transition-all ${activeTab === 'streaming' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
            Lambda Response Streaming
        </button>
        <button 
            onClick={() => setActiveTab('durable')}
            className={`px-6 py-2 rounded-md font-mono text-sm transition-all ${activeTab === 'durable' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
            Durable Functions (Async)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl items-start">
        
        {/* Visualization Panel */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-8 h-[400px] relative overflow-hidden flex items-center justify-center">
             <AnimatePresence mode="wait">
                {activeTab === 'streaming' ? (
                    <motion.div 
                        key="stream-vis"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="w-full space-y-6"
                    >
                        {/* Request */}
                        <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                            <span>Client</span>
                            <span>Lambda (Node.js 18+)</span>
                        </div>
                        
                        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute inset-y-0 bg-primary w-1/3"
                                animate={{ x: ['-100%', '300%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Code Snippet */}
                        <div className="bg-[#1e1e1e] p-4 rounded border border-gray-700 font-mono text-xs text-gray-300">
                            <div className="text-blue-400">export const</div> handler = <span className="text-yellow-300">awslambda.streamifyResponse</span>(
                            <br/>&nbsp;&nbsp;<span className="text-purple-400">async</span> (event, responseStream) ={'>'} {'{'}
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">// TTFB: Immediate</span>
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;responseStream.write(<span className="text-orange-300">"First token..."</span>);
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">await</span> longRunningTask();
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;responseStream.end();
                            <br/>{'}'});
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="durable-vis"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="w-full space-y-6"
                    >
                         <div className="flex justify-around items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-accent/20 rounded-lg border border-accent"><Activity className="text-accent"/></div>
                                <span className="text-xs font-mono">Trigger</span>
                            </div>
                            <Repeat className="text-gray-600 animate-pulse" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500"><Database className="text-blue-500"/></div>
                                <span className="text-xs font-mono">State Store</span>
                            </div>
                         </div>
                         
                         {/* Code Snippet */}
                         <div className="bg-[#1e1e1e] p-4 rounded border border-gray-700 font-mono text-xs text-gray-300">
                            <div className="text-purple-400">yield</div> context.df.callActivity(<span className="text-orange-300">"HeavyGenAI"</span>);
                            <br/><span className="text-gray-500">// Function sleeps here. Free!</span>
                            <br/><span className="text-gray-500">// Rehydrates when result ready.</span>
                            <br/><div className="text-green-400 mt-2">// Ideal for workflows, not chat</div>
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>
        </div>

        {/* Explanation Panel */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
                {activeTab === 'streaming' ? 'AWS Lambda Response Streaming' : 'Durable Execution (Azure/Temporal)'}
            </h3>
            
            {activeTab === 'streaming' ? (
                <>
                    <p className="text-gray-300 leading-relaxed">
                        Historically, Lambda buffered the entire response (6MB limit) before sending it to API Gateway. 
                        Response Streaming breaks this limit and allows sending data <strong>immediately</strong>.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="p-2 bg-green-500/10 rounded h-fit"><Zap size={20} className="text-green-500"/></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Better Time-To-First-Byte (TTFB)</h4>
                                <p className="text-xs text-gray-400">Browsers receive the first token in milliseconds, not seconds. Improves perceived performance.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 bg-yellow-500/10 rounded h-fit"><DollarSign size={20} className="text-yellow-500"/></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Billing Soft Limit</h4>
                                <p className="text-xs text-gray-400">Allows exceeding the 29s API Gateway timeout if invoked via Function URL. Still bills for total duration.</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-gray-300 leading-relaxed">
                        The "Durable" pattern (popularized by Azure Durable Functions & Temporal) creates stateful workflows using stateless functions. 
                        The function "sleeps" (checkpoints state to DB) while waiting for external events.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="p-2 bg-blue-500/10 rounded h-fit"><Server size={20} className="text-blue-500"/></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">True "Serverless" Waiting</h4>
                                <p className="text-xs text-gray-400">You do NOT pay for the time waiting for the LLM. You only pay for the state transitions.</p>
                            </div>
                        </div>
                         <div className="flex gap-4">
                            <div className="p-2 bg-red-500/10 rounded h-fit"><Activity size={20} className="text-red-500"/></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Latency Penalty</h4>
                                <p className="text-xs text-gray-400">Requires multiple "cold starts" to rehydrate state. Terrible for real-time chat, amazing for agents.</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>

      </div>
    </div>
  );
};