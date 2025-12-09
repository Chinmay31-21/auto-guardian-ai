import { useState } from 'react';
import { maintenanceAlerts, vehicles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Phone,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const severityConfig = {
  low: {
    icon: Info,
    color: 'bg-[hsl(var(--chart-1))]/10 text-[hsl(var(--chart-1))]',
    badge: 'bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))] border-[hsl(var(--chart-1))]/30',
    border: 'border-l-[hsl(var(--chart-1))]'
  },
  medium: {
    icon: AlertCircle,
    color: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',
    badge: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30',
    border: 'border-l-[hsl(var(--warning))]'
  },
  high: {
    icon: AlertTriangle,
    color: 'bg-orange-500/10 text-orange-500',
    badge: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    border: 'border-l-orange-500'
  },
  critical: {
    icon: XCircle,
    color: 'bg-destructive/10 text-destructive',
    badge: 'bg-destructive/20 text-destructive border-destructive/30',
    border: 'border-l-destructive'
  }
};

const statusConfig = {
  pending: 'bg-muted text-muted-foreground',
  scheduled: 'bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]',
  completed: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]',
  dismissed: 'bg-muted text-muted-foreground line-through'
};

export function AlertsList() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'scheduled'>('all');

  const filteredAlerts = maintenanceAlerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'scheduled'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const vehicle = vehicles.find((v) => v.id === alert.vehicleId);
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <Card
              key={alert.id}
              className={cn(
                'p-5 border-l-4 hover:shadow-md transition-shadow',
                config.border
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn('rounded-lg p-3', config.color)}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold">{alert.component}</h4>
                      <p className="text-sm text-muted-foreground">
                        {vehicle?.make} {vehicle?.model} ({vehicle?.year}) • VIN: {vehicle?.vin?.slice(-8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('capitalize', config.badge)}>
                        {alert.severity}
                      </Badge>
                      <Badge className={cn('capitalize', statusConfig[alert.status])}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{alert.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Predicted: {new Date(alert.predictedFailureDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Confidence: {alert.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Est. Cost: ₹{alert.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 mb-4">
                    <p className="text-sm font-medium mb-1">Recommended Action:</p>
                    <p className="text-sm text-muted-foreground">{alert.recommendedAction}</p>
                  </div>

                  {alert.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Service
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Customer
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Check className="h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
