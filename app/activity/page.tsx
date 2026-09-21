export default function ActivityPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Activity
        </h1>
        <p className="text-muted-foreground text-lg">
          Recent actions and WorkMate interactions.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border border-white/10 rounded-2xl bg-white/[0.01] text-muted-foreground italic">
        Activity feed coming soon...
      </div>
    </div>
  );
}
