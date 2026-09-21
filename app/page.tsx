'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Task } from '@/lib/types';
import { TaskCard } from '@/components/ui/TaskCard';
import { AIProcessing } from '@/components/ui/AIProcessing';
import { DashboardMetrics } from '@/components/ui/DashboardMetrics';
import { IntroSequence } from '@/components/ui/IntroSequence';

const MOCK_GENERATED_TASKS: Task[] = [
  { id: '1', title: 'Follow up with Sara', category: 'Payment', priority: 'HIGH', deadline: 'Today', completed: false },
  { id: '2', title: "Confirm Ahmed's order", category: 'Order', priority: 'HIGH', deadline: 'Tomorrow', completed: false },
  { id: '3', title: 'Post new collection', category: 'Marketing', priority: 'MEDIUM', deadline: 'Tonight', completed: false },
  { id: '4', title: 'Ali — appointment', category: 'Customer', priority: 'NORMAL', deadline: 'Friday', completed: false },
];

export default function Dashboard() {
  const [showIntro, setShowIntro] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleOrganize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to organize work.');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      setHasProcessed(true);
      setInputText('');
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const completed = !t.completed;
        return {
          ...t,
          completed,
          priority: completed ? 'COMPLETED' : 'NORMAL'
        };
      }
      return t;
    }));
  };

  return (
    <>
      {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
      
      <div className="flex flex-col items-center justify-start min-h-[80vh] w-full pt-10 pb-20">
      
      <AnimatePresence mode="wait">
        {!hasProcessed && !isProcessing && (
          <motion.div 
            key="composer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl flex flex-col items-center gap-10 mt-10"
          >
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-2xl mb-4 border border-white/10 shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white drop-shadow-sm">
                Good morning.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
                What do we need to organize today?
              </p>
            </div>

            <div className="w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-white/10 to-blue-500/20 rounded-[32px] blur-xl opacity-50 group-focus-within:opacity-100 transition duration-1000"></div>
              
              <div className="relative bg-background/50 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 focus-within:border-white/30 focus-within:bg-background/80">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Ahmed needs 3 blue shirts tomorrow. Sara hasn't paid yet..."
                  className="w-full bg-transparent p-8 text-xl md:text-2xl font-light resize-none outline-none min-h-[180px] text-foreground placeholder:text-muted-foreground/40 leading-relaxed"
                />

                {error && (
                  <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 px-6 border-t border-white/5 bg-white/[0.01]">
                  <div className="text-sm font-medium text-muted-foreground/60">
                    Press <kbd className="font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">⌘ Enter</kbd> to organize
                  </div>
                  
                  <button
                    onClick={handleOrganize}
                    disabled={!inputText.trim()}
                    className="group/btn relative overflow-hidden flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      ORGANIZE <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex items-center justify-center min-h-[60vh]"
          >
            <AIProcessing />
          </motion.div>
        )}

        {hasProcessed && !isProcessing && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl flex flex-col gap-8"
          >
            <DashboardMetrics tasks={tasks} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {tasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={index} 
                  onToggle={toggleTask} 
                />
              ))}
            </div>
            
            {/* Action to add more */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex justify-center"
            >
              <button 
                onClick={() => setHasProcessed(false)}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Add More Work
              </button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </>
  );
}
