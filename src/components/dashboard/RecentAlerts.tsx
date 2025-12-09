import { maintenanceAlerts, vehicles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const severityConfig = {
  low: {
    icon: Info,
    color: 'bg-[hsl(var(--chart-1))]/10 text-[hsl(var(--chart-1))]',
    badge: 'bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))] border-[hsl(var(--chart-1))]/30'
  },
  medium: {
    icon: AlertCircle,
    color: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',
    badge: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30'
  },
  high: {
    icon: AlertTriangle,
    color: 'bg-orange-500/10 text-orange-500',
    badge: 'bg-orange-500/20 text-orange-500 border-orange-500/30'
  },
  critical: {
    icon: XCircle,
    color: 'bg-destructive/10 text-destructive',
    badge: 'bg-destructive/20 text-destructive border-destructive/30'
  }
};

export function RecentAlerts() {
  const recentAlerts = maintenanceAlerts.slice(0, 4);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Alerts</h3>
        <Badge variant="outline" className="text-xs">
          {maintenanceAlerts.length} Active
        </Badge>
      </div>
      <div className="space-y-3">
        {recentAlerts.map((alert) => {
          const vehicle = vehicles.find((v) => v.id === alert.vehicleId);
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className={cn('rounded-lg p-2', config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{alert.component}</p>
                  <Badge className={cn('text-xs capitalize', config.badge)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {vehicle?.make} {vehicle?.model} • {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
