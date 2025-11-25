
import { cn } from '@/lib/utils';

export default function ButtonLoadingIcon({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 rounded-full bg-current animate-bounce"></span>
    </div>
  );
};
