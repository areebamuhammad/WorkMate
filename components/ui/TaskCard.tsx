'use client';

import { motion } from 'framer-motion';
import { Task, Priority } from '@/lib/types';
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

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case 'HIGH': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    default: return 'bg-white/5 text-muted-foreground border-white/10';
  }
};

export function TaskCard({ task, index, onToggle }: TaskCardProps) {
  const isCompleted = task.completed;
  const priorityStyles = getPriorityStyles(task.priority);

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
        "relative p-5 rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-all overflow-hidden group flex flex-col gap-4",
        isCompleted ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]",
        "shadow-lg hover:shadow-2xl"
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", priorityStyles)}>
          {task.priority}
        </div>
        
        <button 
          onClick={() => onToggle(task.id)}
          className={cn(
            "transition-colors", 
            isCompleted ? "text-emerald-500" : "text-muted-foreground hover:text-white"
          )}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col gap-1 mt-2">
        <h3 className={cn(
          "text-lg font-medium transition-colors",
          isCompleted ? "text-muted-foreground line-through" : "text-white"
        )}>
          {task.title}
        </h3>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CategoryIcon category={task.category} className="w-4 h-4" />
          <span className="text-xs font-medium">{task.category}</span>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
          {task.deadline}
        </div>
      </div>
    </motion.div>
  );
}
