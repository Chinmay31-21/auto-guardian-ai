import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: 'primary' | 'success' | 'warning' | 'destructive';
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'primary'
}: StatsCardProps) {
  const iconColorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]',
    warning: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',
    destructive: 'bg-destructive/10 text-destructive'
  };

  const changeColorClasses = {
    positive: 'text-[hsl(var(--success))]',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn('text-sm font-medium', changeColorClasses[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-3', iconColorClasses[iconColor])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
