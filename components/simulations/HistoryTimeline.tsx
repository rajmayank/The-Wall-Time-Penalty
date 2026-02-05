import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, Zap, Brain } from 'lucide-react';

interface Era {
  id: string;
  title: string;
  year: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  characteristics: string[];
  scalingModel: string;
  costModel: string;
  limitation: string;
}

export const HistoryTimeline: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const eras: Era[] = [
    {
      id: 'monolith',
      title: "Monolithic",
      year: "~2000s",
      icon: <Box size={28} />,
      color: "text-gray-400",
      bg: "bg-gray-800",
      characteristics: [
        "Single deployable unit",
        "Shared database",
        "Tightly coupled modules",
        "Vertical scaling (bigger servers)"
      ],
      scalingModel: "Scale the whole app together",
      costModel: "Pay for peak capacity 24/7",
      limitation: "Can't scale components independently"
    },
    {
      id: 'microservices',
      title: "Microservices",
      year: "~2010s",
      icon: <Layers size={28} />,
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      characteristics: [
        "Decoupled services",
        "Independent deployments",
        "Docker + Kubernetes",
        "Horizontal scaling"
      ],
      scalingModel: "Scale each service independently",
      costModel: "Pay for provisioned containers",
      limitation: "Ops complexity, still pay for idle"
    },
    {
      id: 'serverless',
      title: "Serverless",
      year: "~2015+",
      icon: <Zap size={28} />,
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      characteristics: [
        "Event-driven functions",
        "Scale to zero",
        "Pay per invocation",
        "Managed infrastructure"
      ],
      scalingModel: "Auto-scale per request",
      costModel: "Pay for execution time (GB-seconds)",
      limitation: "Stateless, 15min limit, optimized for fast execution"
    },
    {
      id: 'genai',
      title: "GenAI Era",
      year: "2023+",
      icon: <Brain size={28} />,
      color: "text-purple-400",
      bg: "bg-purple-900/20",
      characteristics: [
        "Long-running inference (20-60s)",
        "Streaming responses",
        "Stateful agents",
        "I/O bound, not CPU bound"
      ],
      scalingModel: "???",
      costModel: "Serverless model breaks down",
      limitation: "The Wall Time Penalty"
    }
  ];

  const selected = selectedIndex >= 0 ? eras[selectedIndex] : null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, eras.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [eras.length]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Timeline */}
      <div className="relative mb-8">
        <div className="grid grid-cols-4 gap-4 relative z-10">
          {eras.map((era, i) => (
            <motion.button
              key={era.id}
              onClick={() => setSelectedIndex(selectedIndex === i ? -1 : i)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: selectedIndex === -1 || i <= selectedIndex ? 1 : 0.3, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex flex-col items-center text-center group cursor-pointer ${
                selectedIndex === i ? 'scale-110' : ''
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${era.bg} ${era.color} border-4 border-background mb-3 transition-all group-hover:scale-110 ${
                selectedIndex === i ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
              }`}>
                {era.icon}
              </div>
              <h3 className={`font-bold text-lg mb-1 ${era.color}`}>{era.title}</h3>
              <p className="text-xs text-gray-500">{era.year}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1">
        {selected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${
              selected.id === 'genai' ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-surface/50'
            }`}
          >
            <div className="grid grid-cols-3 gap-8">
              {/* Characteristics */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-3">CHARACTERISTICS</h4>
                <ul className="space-y-2">
                  {selected.characteristics.map((char, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${selected.bg.replace('/20', '')}`} />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Economic Model */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-3">SCALING MODEL</h4>
                <p className="text-sm text-gray-300 mb-4">{selected.scalingModel}</p>
                
                <h4 className="text-sm font-bold text-gray-400 mb-3">COST MODEL</h4>
                <p className={`text-sm ${selected.id === 'genai' ? 'text-red-400' : 'text-gray-300'}`}>
                  {selected.costModel}
                </p>
              </div>

              {/* Key Limitation */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-3">KEY LIMITATION</h4>
                <div className={`p-4 rounded-lg ${
                  selected.id === 'genai' ? 'bg-red-500/10 border border-red-500/30' : 'bg-surface'
                }`}>
                  <p className={`text-sm font-medium ${selected.id === 'genai' ? 'text-red-400' : 'text-gray-300'}`}>
                    {selected.limitation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Press Space or → to step through eras
          </div>
        )}
      </div>

      {/* Bottom Quote */}
      <div className="mt-6 text-center">
        <p className="text-lg text-gray-400">
          Each era optimized for <span className="text-white font-bold">fast execution</span>. 
          LLMs broke that assumption.
        </p>
      </div>
    </div>
  );
};
