'use client';

import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const STAGES = [
  { id: 'input', label: 'Reading input...', icon: Sparkles },
  { id: 'understanding', label: 'Understanding context...', icon: BrainCircuit },
  { id: 'organizing', label: 'Organizing tasks...', icon: CheckCircle },
];

export function AIProcessing() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 800); // Progress every 800ms

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STAGES[stageIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 w-full max-w-md mx-auto">
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        {/* Glowing Orbs */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl"
        />
        
        {/* Central Node */}
        <div className="relative z-10 w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <motion.div
            key={stageIndex}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CurrentIcon className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Orbiting particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              transformOrigin: `${40 + i * 15}px ${40 + i * 15}px`,
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>

      {/* Stages Text */}
      <div className="flex flex-col items-center gap-2">
        <motion.div
          key={stageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium text-white tracking-wide"
        >
          {STAGES[stageIndex].label}
        </motion.div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>
    </div>
  );
}
