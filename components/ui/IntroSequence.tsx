'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Circle, CreditCard, Package, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'initial' | 'fragments' | 'processing' | 'cards' | 'done'>('initial');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Initial logo glow
    const t1 = setTimeout(() => setStage('fragments'), 1500);
    // 2. Show messy fragments moving slowly
    const t2 = setTimeout(() => setStage('processing'), 4500);
    // 3. Transform fragments into cards
    const t3 = setTimeout(() => setStage('cards'), 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const fragments = [
    { id: 1, text: "Ahmed needs 3 blue shirts", x: -120, y: -80, delay: 0 },
    { id: 2, text: "Sara hasn't paid", x: 150, y: -40, delay: 0.2 },
    { id: 3, text: "Post new collection tonight", x: -100, y: 100, delay: 0.4 },
    { id: 4, text: "Ali — Friday appointment", x: 140, y: 80, delay: 0.6 },
  ];

  const cards = [
    { id: 1, title: 'Follow up with Sara', priority: 'HIGH', category: 'Payment', Icon: CreditCard },
    { id: 2, title: 'Confirm Ahmed\'s order', priority: 'HIGH', category: 'Order', Icon: Package },
    { id: 3, title: 'Create collection post', priority: 'MEDIUM', category: 'Marketing', Icon: Megaphone },
  ];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 z-0 opacity-30">
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl min-h-[500px]">
            
            {/* Center Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: stage === 'processing' ? 1.2 : 1, 
                opacity: 1,
                boxShadow: stage === 'processing' ? '0 0 80px rgba(99,102,241,0.4)' : '0 0 0px rgba(99,102,241,0)'
              }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 bg-white/5 border border-white/20 rounded-3xl backdrop-blur-md z-20"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Stage: Fragments */}
            <AnimatePresence>
              {(stage === 'fragments' || stage === 'processing') && (
                <div className="absolute inset-0 pointer-events-none">
                  {fragments.map((frag) => (
                    <motion.div
                      key={`frag-${frag.id}`}
                      initial={{ opacity: 0, x: frag.x * 1.5, y: frag.y * 1.5 }}
                      animate={
                        stage === 'processing' 
                        ? { opacity: 0, x: 0, y: 0, scale: 0.5, filter: 'blur(10px)' }
                        : { opacity: 1, x: frag.x, y: frag.y }
                      }
                      transition={{ 
                        duration: stage === 'processing' ? 1 : 2, 
                        delay: stage === 'processing' ? 0 : frag.delay,
                        ease: 'easeInOut' 
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm whitespace-nowrap backdrop-blur-sm"
                    >
                      &quot;{frag.text}&quot;
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Stage: Cards */}
            <AnimatePresence>
              {stage === 'cards' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center gap-6 z-30 w-full"
                >
                  {cards.map((card, i) => {
                    const priorityColor = card.priority === 'HIGH' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20';
                    return (
                      <motion.div
                        key={`card-${card.id}`}
                        initial={{ opacity: 0, y: 40, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: (i - 1) * 20 }}
                        transition={{ duration: 0.8, delay: i * 0.1, type: 'spring', damping: 20 }}
                        className={cn(
                          "w-64 p-5 rounded-2xl border bg-background/80 backdrop-blur-xl shadow-2xl flex flex-col gap-4 transition-transform hover:y-[-5px]",
                          "border-white/10"
                        )}
                        style={{ 
                          rotate: (i - 1) * 4,
                          transformOrigin: 'bottom center',
                          zIndex: cards.length - Math.abs(i - 1)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border", priorityColor)}>
                            {card.priority}
                          </div>
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <h4 className="text-white font-medium text-lg leading-tight">{card.title}</h4>
                        <div className="flex items-center gap-2 text-muted-foreground mt-2 border-t border-white/5 pt-3">
                          <card.Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{card.category}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tagline & CTA */}
          <AnimatePresence>
            {stage === 'cards' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-20 flex flex-col items-center gap-8 z-40"
              >
                <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                  Turn messy work into clear action.
                </h2>
                
                <button
                  onClick={handleEnter}
                  className="group flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95"
                >
                  ENTER WORKMATE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
