import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const CostCalculator: React.FC = () => {
  const [concurrency, setConcurrency] = useState(10000);
  const [avgDuration, setAvgDuration] = useState(20); // Seconds
  
  // Assumptions
  // Lambda: $0.0000166667 per GB-second (approx)
  // EC2 (Proxy): t3.large approx $0.0832/hour (can handle thousands of conns)
  
  const calculateData = () => {
    // Scenario: 1 hour of sustained traffic
    const totalRequests = concurrency * 60 * 60 / avgDuration; // Throughput needed to sustain concurrency
    
    // 1. Naive Lambda (Wait entire time)
    // 128MB lambda running for duration
    const lambdaCostPerReq = 0.00000208 * avgDuration; 
    const naiveTotal = totalRequests * lambdaCostPerReq;

    // 2. Streaming Proxy Architecture
    // Compute time is only for processing chunks (approx 100ms total CPU time spread out)
    const optimizedComputePerReq = 0.00000208 * 0.2; // 200ms effective compute
    const computeTotal = totalRequests * optimizedComputePerReq;
    
    // Plus Proxy fleet cost (Assume 1 t3.xlarge per 10k connections)
    const proxyInstances = Math.ceil(concurrency / 10000);
    const proxyCost = proxyInstances * 0.1664; // cost per hour for t3.xlarge
    
    const streamingTotal = computeTotal + proxyCost;

    return [
      { name: 'Standard Serverless', cost: naiveTotal, fill: '#ef4444' },
      { name: 'Streaming Proxy Arch', cost: streamingTotal, fill: '#10b981' },
    ];
  };

  const data = calculateData();

  return (
    <div className="flex flex-col md:flex-row h-full gap-8">
      <div className="flex-1 bg-surface p-6 rounded-xl border border-white/10 flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-6 text-white">Live Cost Estimator (Hourly)</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Concurrent Inference Streams: <span className="text-white">{concurrency.toLocaleString()}</span>
            </label>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000" 
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Avg Generation Wall Time: <span className="text-white">{avgDuration}s</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="1" 
              value={avgDuration}
              onChange={(e) => setAvgDuration(Number(e.target.value))}
              className="w-full accent-accent h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="text-xs text-gray-500 font-mono mb-2">ESTIMATED HOURLY SPEND</div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-danger">Naive FaaS:</span>
              <span className="text-xl font-bold text-danger">${data[0].cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-success">Proxy Arch:</span>
              <span className="text-xl font-bold text-success">${data[1].cost.toFixed(2)}</span>
            </div>
            <div className="mt-4 text-xs text-gray-400 italic">
              *Savings: {((1 - data[1].cost/data[0].cost) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
            <XAxis type="number" stroke="#666" tickFormatter={(val) => `$${val}`} />
            <YAxis dataKey="name" type="category" stroke="#fff" width={120} tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};