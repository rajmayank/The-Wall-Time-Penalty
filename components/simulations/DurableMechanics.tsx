import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, Pause, FastForward, CheckCircle } from 'lucide-react';

export const DurableMechanics: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto gap-8">
      
      {/* Timeline Visualization */}
      <div className="w-full bg-black/40 p-8 rounded-xl border border-white/10 relative overflow-hidden min-h-[300px] flex items-center justify-center">
        
        <AnimatePresence mode='wait'>
          {step === 0 && (
            <motion.div key="exec1" variants={variants} initial="initial" animate="animate" exit="exit" className="text-center">
              <div className="flex justify-center mb-4"><Play size={48} className="text-green-500" /></div>
              <h3 className="text-xl font-bold text-white">1. First Execution</h3>
              <p className="text-gray-400 mt-2">Code runs normally until it hits a <span className="text-accent font-mono">await step()</span>.</p>
              <div className="mt-4 flex gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-800 rounded text-xs text-white">func start()</span>
                <span className="px-3 py-1 bg-green-900 text-xs text-green-200">Processing...</span>
                <span className="px-3 py-1 bg-accent/20 border border-accent rounded text-xs text-accent">CHECKPOINT</span>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="sleep" variants={variants} initial="initial" animate="animate" exit="exit" className="text-center">
              <div className="flex justify-center mb-4"><Pause size={48} className="text-gray-500" /></div>
              <h3 className="text-xl font-bold text-gray-400">2. Hibernate (Zero Cost)</h3>
              <p className="text-gray-500 mt-2">State saved to DB. Compute completely shuts down.</p>
              <div className="mt-4 flex justify-center items-center gap-4">
                 <Database className="text-blue-500 animate-pulse" />
                 <span className="font-mono text-xs text-blue-400">STATE SAVED</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div key="replay" variants={variants} initial="initial" animate="animate" exit="exit" className="text-center">
              <div className="flex justify-center mb-4"><FastForward size={48} className="text-yellow-500" /></div>
              <h3 className="text-xl font-bold text-yellow-500">3. Wake & Replay</h3>
              <p className="text-gray-400 mt-2">Event triggers wake up. Function runs from TOP line.</p>
              <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-700 text-left font-mono text-xs text-gray-400">
                <div>func start()</div>
                <div className="text-yellow-500">{'>>'} SKIPPING (Result in DB)</div>
                <div className="text-white">{'>>'} Resume at Line 45</div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
             <motion.div key="complete" variants={variants} initial="initial" animate="animate" exit="exit" className="text-center">
              <div className="flex justify-center mb-4"><CheckCircle size={48} className="text-primary" /></div>
              <h3 className="text-xl font-bold text-primary">4. Complete</h3>
              <p className="text-gray-400 mt-2">Process finishes or waits for next event.</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 rounded-full ${i === step ? 'bg-primary' : 'bg-gray-800'}`} />
        ))}
      </div>
    </div>
  );
};