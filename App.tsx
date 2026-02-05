import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Terminal, Cpu, Clock, DollarSign, Zap, AlertOctagon, Code, TrendingUp, Layers, Brain, CheckCircle, Pause, Play, MessageSquare } from 'lucide-react';
import { SlideLayout } from './components/SlideLayout';
import { TaxiMeter } from './components/simulations/TaxiMeter';
import { ArchitectureCompare } from './components/simulations/ArchitectureCompare';
import { CostCalculator } from './components/CostCalculator';
import { HistoryTimeline } from './components/simulations/HistoryTimeline';
import { DurableMechanics } from './components/simulations/DurableMechanics';
import { LambdaLifecycle } from './components/simulations/LambdaLifecycle';
import { CodeComparison } from './components/simulations/CodeComparison';
import { ImpactMatrix } from './components/simulations/ImpactMatrix';
import { TOTAL_SLIDES } from './constants';

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 })
  };

  const renderSlide = () => {
    switch (currentSlide) {
      // ============================================
      // PART 1: THE EVOLUTION (Slides 0-3)
      // ============================================
      
      case 0: // Title
        return (
          <SlideLayout>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-6 p-4 bg-white/5 rounded-full border border-white/10">
                <Terminal size={64} className="text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-600 mb-4">
                The Wall Time Penalty
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-400 font-light mb-8 max-w-3xl">
                Why Serverless Economics Break for GenAI - and What Comes Next
              </h2>
            </div>
          </SlideLayout>
        );

      case 1: // Evolution Timeline
        return (
          <SlideLayout title="The Evolution of Scale" subtitle="From Monolith to Serverless">
            <HistoryTimeline />
          </SlideLayout>
        );

      case 2: // Serverless Promise
        return (
          <SlideLayout title="The Serverless Promise" subtitle="Why we adopted it">
            <div className="grid grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-6">
                <div className="p-5 bg-surface border border-green-500/30 rounded-xl">
                  <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle size={20} /> Scale to Zero
                  </h3>
                  <p className="text-gray-400 text-sm">No traffic? No cost. No servers running idle overnight.</p>
                </div>
                <div className="p-5 bg-surface border border-green-500/30 rounded-xl">
                  <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle size={20} /> Pay Per Execution
                  </h3>
                  <p className="text-gray-400 text-sm">Millisecond billing granularity. Pay only for what you use.</p>
                </div>
                <div className="p-5 bg-surface border border-green-500/30 rounded-xl">
                  <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle size={20} /> Auto-Scaling
                  </h3>
                  <p className="text-gray-400 text-sm">From 0 to 10,000 concurrent executions instantly.</p>
                </div>
              </div>
              <div className="p-8 bg-surface border border-white/10 rounded-xl">
                <h3 className="text-2xl font-bold text-white mb-4">The Assumption</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  "Functions are <span className="text-primary font-bold">compute-heavy</span> and <span className="text-primary font-bold">short-lived</span>. 
                  Fast execution equals lower cost."
                </p>
                <div className="mt-6 p-4 bg-black/30 rounded-lg">
                  <div className="font-mono text-sm text-gray-400">Typical Lambda: 50-500ms execution</div>
                  <div className="font-mono text-sm text-gray-400">Memory utilized: 60-90%</div>
                  <div className="font-mono text-sm text-gray-400">CPU utilized: 70-100%</div>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      // ============================================
      // PART 2: WHERE SERVERLESS BREAKS (Slides 3-6)
      // ============================================

      case 3: // The Shift - LLM Workloads
        return (
          <SlideLayout title="Then Came LLMs" subtitle="A fundamentally different workload">
            <div className="grid grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-6">
                <div className="p-5 bg-surface border border-white/10 rounded-xl opacity-50">
                  <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                    <Cpu size={20} /> Traditional Compute
                  </h3>
                  <p className="text-gray-500 text-sm">CPU-bound. Memory-bound. Fast in, fast out.</p>
                  <div className="mt-3 font-mono text-xs text-gray-600">200ms avg • High utilization</div>
                </div>
                <div className="p-5 bg-surface border border-purple-500/40 rounded-xl ring-1 ring-purple-500/20">
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-xs px-2 py-0.5 rounded font-bold">NEW</div>
                  <h3 className="text-lg font-bold text-purple-400 mb-2 flex items-center gap-2">
                    <Clock size={20} /> LLM Inference
                  </h3>
                  <p className="text-gray-300 text-sm">I/O-bound. Waiting for tokens. "Strolling".</p>
                  <div className="mt-3 font-mono text-xs text-purple-400">20-60s avg • {'<'}2% utilization</div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">The Mismatch</h3>
                <ul className="space-y-4 text-lg text-gray-300">
                  <li className="flex items-start gap-3">
                    <AlertOctagon className="text-red-400 shrink-0 mt-1" size={20} />
                    <span>You pay for <span className="text-red-400 font-bold">wall time</span>, not CPU time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertOctagon className="text-red-400 shrink-0 mt-1" size={20} />
                    <span>Function sits idle while LLM "thinks"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertOctagon className="text-red-400 shrink-0 mt-1" size={20} />
                    <span>Memory allocated but barely touched</span>
                  </li>
                </ul>
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-bold text-center">
                    "Pay for Use" becomes "Pay for Waiting"
                  </p>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      case 4: // The Plumber Analogy
        return (
          <SlideLayout title="The Plumber Analogy" subtitle="Understanding the waste">
            <div className="flex items-center justify-center h-full gap-16">
              <div className="text-center opacity-40 w-64">
                <div className="text-7xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-white mb-2">Traditional Job</h3>
                <p className="text-gray-500">Arrives. Fixes sink in 5 mins.<br/>Bills for 5 mins.<br/><span className="text-green-400">$50</span></p>
              </div>
              
              <div className="text-4xl text-gray-600">→</div>
              
              <div className="text-center w-72 p-8 bg-surface border-2 border-red-500/40 rounded-xl scale-110">
                <div className="text-7xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">The LLM Job</h3>
                <p className="text-gray-300">
                  Arrives. Works for 2 mins.<br/>
                  <span className="text-red-400">Waits 38 mins for parts.</span><br/>
                  Bills for 40 mins.<br/>
                  <span className="text-red-400 font-bold text-xl">$400</span>
                </p>
              </div>
            </div>
            <div className="text-center mt-8 text-gray-500 text-sm">
              This is what happens when you call an LLM from a Lambda function.
            </div>
          </SlideLayout>
        );

      case 5: // The Taxi Meter
        return (
          <SlideLayout title="The Taxi Meter Effect" subtitle="Live simulation: Traditional API vs LLM call">
            <TaxiMeter />
          </SlideLayout>
        );

      case 6: // The Math - GB Seconds
        return (
          <SlideLayout title="The GB-Second Reckoning" subtitle="How Lambda actually bills you">
            <div className="grid grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-6">
                <div className="p-6 bg-surface border border-white/10 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-3">Lambda Pricing Formula</h3>
                  <div className="font-mono text-sm bg-black/40 p-4 rounded">
                    <div className="text-gray-400">Cost = Requests × $0.20/million</div>
                    <div className="text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ <span className="text-yellow-400">Memory_GB</span> × <span className="text-red-400">Duration_Sec</span> × $0.0000166667</div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    <strong>Key insight:</strong> CPU is tied to memory. Allocate 1GB+ to get decent compute - but you pay for that 1GB the entire time, even while idle.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">A Typical RAG Request</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-green-900/20 rounded border-l-4 border-green-500">
                    <span className="text-gray-300">Parse request, build prompt</span>
                    <span className="font-mono text-green-400">~15ms</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-900/20 rounded border-l-4 border-green-500">
                    <span className="text-gray-300">Query vector DB</span>
                    <span className="font-mono text-green-400">~35ms</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-900/20 rounded border-l-4 border-green-500">
                    <span className="text-gray-300">Fire HTTP to OpenAI</span>
                    <span className="font-mono text-green-400">~5ms</span>
                  </div>
                  <div className="flex justify-between p-3 bg-red-900/30 rounded border-l-4 border-red-500">
                    <span className="text-gray-300 font-bold">Wait for LLM response</span>
                    <span className="font-mono text-red-400 font-bold">~4,800ms</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-surface rounded-xl text-center">
                  <div className="text-gray-500 text-sm">Total CPU: <span className="text-green-400 font-bold">55ms</span></div>
                  <div className="text-gray-500 text-sm">Total Billed: <span className="text-red-400 font-bold">4,855ms</span></div>
                  <div className="text-2xl font-bold text-white mt-2">88× Cost Multiplier</div>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      // ============================================
      // PART 3: LAMBDA LIFECYCLE DEEP DIVE (Slides 7-8)
      // ============================================

      case 7: // Lambda Lifecycle Visualization
        return (
          <SlideLayout title="Lambda Lifecycle" subtitle="When billing starts and ends">
            <LambdaLifecycle />
          </SlideLayout>
        );

      case 8: // The Pattern: Naive Wrapper
        return (
          <SlideLayout title="Pattern: The Naive Wrapper" subtitle="The anti-pattern at scale">
            <div className="grid grid-cols-3 gap-8 h-full items-center">
              <div className="col-span-2 h-full">
                <ArchitectureCompare mode="naive" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-bold mb-2">Why It Fails</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• 1 request = 1 container for 40s</li>
                    <li>• API Gateway timeout: 29s max</li>
                    <li>• 1000 concurrent limit per region</li>
                    <li>• $667 per million requests (40s avg)</li>
                  </ul>
                </div>
                <div className="p-4 bg-surface border border-white/10 rounded-lg">
                  <h4 className="text-gray-400 font-bold mb-2 text-sm">WHEN IT'S ACCEPTABLE</h4>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• Prototypes / POC</li>
                    <li>• {'<'}100 requests/day</li>
                    <li>• Short inference ({'<'}5s)</li>
                  </ul>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      // ============================================
      // PART 4: STREAMING RESPONSE (Slides 9-10)
      // ============================================

      case 9: // Streaming Response Introduction
        return (
          <SlideLayout title="AWS Response Streaming" subtitle="The UX improvement (2023)">
            <div className="grid grid-cols-2 gap-12 items-center h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">What AWS Launched</h3>
                <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-700 font-mono text-sm mb-6">
                  <span className="text-purple-400">import</span> {'{ streamifyResponse }'} <span className="text-purple-400">from</span> <span className="text-green-400">'aws-lambda'</span>;<br/><br/>
                  <span className="text-purple-400">export const</span> handler = <span className="text-yellow-400">streamifyResponse</span>(<br/>
                  &nbsp;&nbsp;<span className="text-purple-400">async</span> (event, responseStream) ={'>'} {'{'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// Stream tokens as they arrive</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">for await</span> (<span className="text-purple-400">const</span> chunk <span className="text-purple-400">of</span> llmStream) {'{'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;responseStream.<span className="text-yellow-400">write</span>(chunk);<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;responseStream.<span className="text-yellow-400">end</span>();<br/>
                  &nbsp;&nbsp;{'}'}<br/>
                  );
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Bypasses 6MB response limit</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> TTFB drops to ~200ms</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Users see tokens immediately</li>
                </ul>
              </div>
              <div className="p-8 bg-surface border border-yellow-500/30 rounded-xl">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">But Here's The Catch</h3>
                <p className="text-gray-300 mb-6">
                  Streaming improves <span className="text-green-400 font-bold">perceived latency</span>. 
                  It does <span className="text-red-400 font-bold">NOT</span> fix the billing problem.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="font-bold text-green-400 text-sm">User Experience</div>
                    <div className="text-gray-400 text-sm">Excellent. Chat feels responsive.</div>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="font-bold text-red-400 text-sm">Infrastructure Cost</div>
                    <div className="text-gray-400 text-sm">Identical. Lambda runs for full duration.</div>
                  </div>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      case 10: // Streaming Myth
        return (
          <SlideLayout title="The Streaming Myth" subtitle="Great for UX, not for your bill">
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="p-6 bg-surface rounded-xl border border-white/10">
                  <h3 className="font-bold text-white mb-4">Without Streaming</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>User waits...</div>
                    <div>User waits...</div>
                    <div>User waits... (40 seconds)</div>
                    <div className="text-white">Full response appears.</div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">TTFB: ~40,000ms</div>
                  <div className="text-xs text-red-400">Billed: 40,000ms</div>
                </div>
                <div className="p-6 bg-surface rounded-xl border border-green-500/30">
                  <h3 className="font-bold text-white mb-4">With Streaming</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="text-green-400">First token arrives! (200ms)</div>
                    <div className="text-green-400">More tokens stream in...</div>
                    <div className="text-green-400">User reads as it generates...</div>
                    <div className="text-white">Complete. (40 seconds total)</div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">TTFB: ~200ms</div>
                  <div className="text-xs text-red-400">Billed: 40,000ms (same!)</div>
                </div>
              </div>
              
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
                <p className="text-lg text-gray-300">
                  Streaming solves the <span className="text-green-400 font-bold">UX problem</span>. 
                  It doesn't solve the <span className="text-red-400 font-bold">cost problem</span>.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  The Lambda is still alive, connected, and billing - just forwarding bytes.
                </p>
              </div>
            </div>
          </SlideLayout>
        );

      // ============================================
      // PART 5: DURABLE FUNCTIONS (Slides 11-14)
      // ============================================

      case 11: // Enter Durable Functions
        return (
          <SlideLayout title="The Stateless Lie" subtitle="How Lambda finally learned to remember">
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold text-white">
                For 10 years, we built "stateless" because we had to.
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl">
                We split logic across multiple functions. We glued them with SQS queues. 
                We wrote Step Functions YAML. We externalized state to DynamoDB.
                Because nothing says "developer productivity" like maintaining a state machine 
                for what should've been a <code className="text-accent">while</code> loop.
              </p>
              <div className="p-8 bg-surface border border-accent/40 rounded-xl mt-4">
                <h3 className="text-2xl font-bold text-accent mb-4">AWS re:Invent 2025</h3>
                <p className="text-xl text-white">
                  "What if the function could just... <span className="text-accent">pause</span>?"
                </p>
                <p className="text-gray-400 mt-2">
                  No bill for waiting. Resume exactly where you left off. Up to 1 year execution.
                </p>
              </div>
            </div>
          </SlideLayout>
        );

      case 12: // How Durable Works
        return (
          <SlideLayout title="Checkpoint & Replay" subtitle="How durable execution actually works">
            <DurableMechanics />
          </SlideLayout>
        );

      case 13: // Durable Billing Model
        return (
          <SlideLayout title="Durable Billing" subtitle="Pay only for what you compute">
            <div className="grid grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">The Economic Flip</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Traditional Lambda</span>
                      <span className="font-mono text-red-400">$667 / 1M reqs</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Paying for 40s × 1GB each request</div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Durable Functions</span>
                      <span className="font-mono text-green-400">~$8-15 / 1M reqs</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Paying for ~100ms compute + checkpoint ops</div>
                  </div>
                </div>
                <div className="p-4 bg-surface border border-white/10 rounded-lg">
                  <h4 className="font-bold text-white mb-2">The Key Difference</h4>
                  <p className="text-sm text-gray-400">
                    When you hit <code className="text-accent">await context.step()</code>, 
                    Lambda checkpoints state to storage and <span className="text-green-400 font-bold">terminates</span>. 
                    No compute running = no billing.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-400">TIMELINE COMPARISON</h3>
                {/* Traditional */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Traditional Lambda</div>
                  <div className="h-8 bg-red-500/20 rounded-lg flex items-center px-3 relative">
                    <div className="absolute inset-y-0 left-0 w-[2%] bg-green-500 rounded-l-lg" />
                    <span className="text-xs text-red-400 ml-auto">40s billed</span>
                  </div>
                </div>
                {/* Durable */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Durable Function</div>
                  <div className="h-8 bg-gray-800 rounded-lg flex items-center gap-1 px-1">
                    <div className="w-[5%] h-6 bg-green-500 rounded" title="Init" />
                    <div className="flex-1 h-6 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-[10px] text-gray-500">Hibernating (free)</span>
                    </div>
                    <div className="w-[3%] h-6 bg-green-500 rounded" title="Resume" />
                  </div>
                  <div className="text-xs text-green-400">~100-200ms billed</div>
                </div>
                <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg text-center mt-4">
                  <div className="text-3xl font-bold text-accent">~50-80x</div>
                  <div className="text-sm text-gray-400">Cost reduction</div>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      case 14: // The Determinism Tax
        return (
          <SlideLayout title="The Determinism Tax" subtitle="The constraint you accept">
            <div className="grid grid-cols-2 gap-12 h-full items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Code replays from the start</h3>
                <p className="text-gray-300">
                  To restore state, the function re-executes from line 1. 
                  The SDK returns cached results for completed steps.
                  <span className="text-yellow-400"> Everything else must be deterministic.</span>
                </p>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                    <AlertOctagon size={16}/> Will Break on Replay
                  </h4>
                  <ul className="font-mono text-sm space-y-1 text-gray-400">
                    <li>Math.random()</li>
                    <li>Date.now()</li>
                    <li>uuid.v4()</li>
                    <li>fetch() outside of step()</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-700 font-mono text-xs">
                <div className="text-red-400 mb-4">// BAD: Non-deterministic</div>
                <div className="text-gray-300">
                  <span className="text-purple-400">const</span> id = uuid.v4();&nbsp;&nbsp;<span className="text-red-500">// Different each replay!</span><br/>
                  <span className="text-purple-400">const</span> now = Date.now(); <span className="text-red-500">// Time moved!</span>
                </div>
                <div className="border-t border-gray-700 my-4" />
                <div className="text-green-400 mb-4">// GOOD: Wrap in step()</div>
                <div className="text-gray-300">
                  <span className="text-purple-400">const</span> id = <span className="text-accent">await ctx.step</span>(<span className="text-green-400">'gen-id'</span>, () ={'>'} uuid.v4());<br/>
                  <span className="text-gray-500">// Cached! Replay gets same ID.</span><br/><br/>
                  <span className="text-purple-400">const</span> now = <span className="text-accent">await ctx.step</span>(<span className="text-green-400">'get-time'</span>, () ={'>'} Date.now());<br/>
                  <span className="text-gray-500">// Cached! Replay gets same timestamp.</span>
                </div>
              </div>
            </div>
          </SlideLayout>
        );

      // ============================================
      // PART 6: CODE COMPARISON & IMPACT (Slides 15-17)
      // ============================================

      case 15: // Code Comparison
        return (
          <SlideLayout title="Code Patterns Compared" subtitle="Traditional vs Streaming vs Durable">
            <CodeComparison />
          </SlideLayout>
        );

      case 16: // Impact Matrix
        return (
          <SlideLayout title="Impact Analysis" subtitle="Cost, Throughput, DevX, Customer Experience">
            <ImpactMatrix />
          </SlideLayout>
        );

      case 17: // Cost Calculator
        return (
          <SlideLayout title="Economic Impact" subtitle="Interactive cost comparison">
            <CostCalculator />
          </SlideLayout>
        );

      // ============================================
      // PART 7: TAKEAWAYS (Slides 18-19)
      // ============================================

      case 18: // Key Takeaways
        return (
          <SlideLayout title="Key Takeaways" subtitle="The TL;DR">
            <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="p-5 bg-surface rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-500/20 rounded-lg"><DollarSign className="text-red-400" size={20} /></div>
                  <h3 className="font-bold text-white">Serverless Breaks for LLMs</h3>
                </div>
                <p className="text-sm text-gray-400">
                  GB-second billing was designed for compute-heavy workloads. 
                  LLMs are I/O-heavy. You pay 50-100x more than actual CPU usage.
                </p>
              </div>
              <div className="p-5 bg-surface rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg"><MessageSquare className="text-green-400" size={20} /></div>
                  <h3 className="font-bold text-white">Streaming ≠ Cost Fix</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Response streaming solves user experience (TTFB). 
                  It does NOT solve the billing problem. Lambda still runs full duration.
                </p>
              </div>
              <div className="p-5 bg-surface rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/20 rounded-lg"><Pause className="text-accent" size={20} /></div>
                  <h3 className="font-bold text-white">Durable = Paradigm Shift</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Functions that hibernate during I/O wait. 
                  Pay only for compute. Checkpoint/replay enables resumable workflows.
                </p>
              </div>
              <div className="p-5 bg-surface rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg"><Code className="text-yellow-400" size={20} /></div>
                  <h3 className="font-bold text-white">Determinism Tax</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Durable requires deterministic code. Wrap non-deterministic operations in steps. 
                  New mental model, but worth the savings.
                </p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-accent/10 border border-accent/30 rounded-xl max-w-3xl mx-auto text-center">
              <p className="text-lg text-white">
                "The 15-minute limit was never a constraint - it was a philosophy. 
                <span className="text-accent"> And philosophies change.</span>"
              </p>
            </div>
          </SlideLayout>
        );

      case 19: // Q&A
        return (
          <SlideLayout>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-5xl font-bold text-white mb-8">Questions?</h1>
              <div className="grid grid-cols-2 gap-6 max-w-2xl text-left">
                <div className="p-4 bg-surface rounded-xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">Further Reading</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• AWS Lambda Durable Functions Docs</li>
                    <li>• Temporal.io (similar pattern)</li>
                    <li>• Azure Durable Functions</li>
                  </ul>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">Key Numbers</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Traditional: ~$667 per 1M requests</li>
                    <li>• Durable: ~$8-15 per 1M requests</li>
                    <li>• 50-80x cost reduction potential</li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 text-sm text-gray-600">
                MayankRaj.com
              </div>
            </div>
          </SlideLayout>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden selection:bg-primary selection:text-white">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-12 z-50 flex items-center gap-4">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            animate={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%` }}
          />
        </div>
        <button 
          onClick={nextSlide}
          disabled={currentSlide === TOTAL_SLIDES - 1}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={24} />
        </button>
        <span className="text-sm font-mono text-gray-500 ml-2">
          {currentSlide + 1} / {TOTAL_SLIDES}
        </span>
      </div>
    </div>
  );
};

export default App;
