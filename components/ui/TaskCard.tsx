'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { 
  CheckCircle2, 
  Circle, 
  CreditCard, 
  Package, 
  Megaphone, 
  Users,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
}

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  switch (category.toLowerCase()) {
    case 'payment': return <CreditCard className={className} />;
    case 'order': return <Package className={className} />;
    case 'marketing': return <Megaphone className={className} />;
    case 'customer': return <Users className={className} />;
    default: return <Calendar className={className} />;
  }
};

export function TaskCard({ task, index, onToggle }: TaskCardProps) {
  const isCompleted = task.completed;
  
  const getStyles = () => {
    if (isCompleted) {
      return {
        dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
        border: 'border-l-emerald-500/40',
        text: 'text-emerald-500'
      };
    }
    switch (task.priority) {
      case 'HIGH': return {
        dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
        border: 'border-l-red-500/40',
        text: 'text-red-400'
      };
      case 'MEDIUM': return {
        dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
        border: 'border-l-amber-500/40',
        text: 'text-amber-400'
      };
      default: return {
        dot: 'bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]',
        border: 'border-l-white/20',
        text: 'text-muted-foreground'
      };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30, 
        delay: index * 0.1 
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative p-5 rounded-2xl border border-white/5 border-l-[3px] bg-white/[0.02] backdrop-blur-md transition-all overflow-hidden group flex flex-col gap-3",
        styles.border,
        isCompleted ? "bg-emerald-500/[0.02]" : "hover:bg-white/[0.04]",
        "shadow-lg hover:shadow-2xl"
      )}
    >
      {/* Subtle inner top highlight for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* TOP METADATA ROW */}
      <div className="relative z-10 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5 uppercase tracking-wider">
          <CategoryIcon category={task.category} className="w-3.5 h-3.5" />
          <span>{task.category}</span>
        </div>
        
        {/* Glowing Priority Indicator */}
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] uppercase tracking-wider font-semibold", styles.text)}>
            {isCompleted ? 'Completed' : task.priority}
          </span>
          <div className={cn("w-2 h-2 rounded-full", styles.dot)} />
        </div>
      </div>

      {/* MAIN TASK ROW */}
      <div className="relative z-10 flex items-start gap-3 mt-1 flex-1">
        <button 
          onClick={() => onToggle(task.id)}
          className={cn(
            "mt-0.5 transition-colors shrink-0", 
            isCompleted ? "text-emerald-500" : "text-muted-foreground hover:text-white"
          )}
        >
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
        <h3 className={cn(
          "text-xl font-medium tracking-tight transition-colors leading-snug",
          isCompleted ? "text-muted-foreground line-through" : "text-white/95"
        )}>
          {task.title}
        </h3>
      </div>

      {/* FOOTER ROW */}
      <div className="relative z-10 flex items-center justify-end mt-2 pt-3 border-t border-white/5">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
          {task.deadline}
        </div>
      </div>
    </motion.div>
  );
}
