'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';

export function DashboardMetrics({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const highPriority = tasks.filter(t => t.priority === 'HIGH' && !t.completed).length;
  const mediumPriority = tasks.filter(t => t.priority === 'MEDIUM' && !t.completed).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {/* Progress */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today&apos;s Progress</p>
          <div className="text-3xl font-semibold text-white">
            {progress}%
          </div>
        </div>
        
        {/* Simple SVG Ring */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
            <motion.circle 
              cx="32" cy="32" r="28" 
              stroke="currentColor" 
              strokeWidth="6" 
              fill="none" 
              className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              strokeDasharray={176}
              initial={{ strokeDashoffset: 176 }}
              animate={{ strokeDashoffset: 176 - (176 * progress) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>

      {/* Remaining */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-center group hover:bg-white/[0.04] transition-colors">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Completion</p>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-semibold text-white">{completed}</div>
          <div className="text-muted-foreground mb-1">/ {total} done</div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Priorities */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-center group hover:bg-white/[0.04] transition-colors">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Focus</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-lg font-medium text-white">{highPriority}</span>
            <span className="text-xs text-muted-foreground uppercase">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span className="text-lg font-medium text-white">{mediumPriority}</span>
            <span className="text-xs text-muted-foreground uppercase">Med</span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
