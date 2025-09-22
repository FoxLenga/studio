import { CheckSquare } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CheckSquare className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold">TaskEase</span>
    </div>
  );
}
