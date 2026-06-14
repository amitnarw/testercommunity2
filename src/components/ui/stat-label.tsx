export function StatLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-muted-foreground tracking-[0.15em]">
      {children}
    </span>
  );
}
