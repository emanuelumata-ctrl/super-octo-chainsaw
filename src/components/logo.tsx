import { GraduationCap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-lg font-bold tracking-tight">
      <GraduationCap className="h-7 w-7 text-primary" />
      <span className="text-foreground">Skillscribe</span>
    </div>
  );
}
