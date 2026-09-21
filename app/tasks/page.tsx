export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          All Tasks
        </h1>
        <p className="text-muted-foreground text-lg">
          Your complete work history and pending items.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border border-white/10 rounded-2xl bg-white/[0.01] text-muted-foreground italic">
        Task management view coming soon...
      </div>
    </div>
  );
}
