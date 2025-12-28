import { useState } from 'react';
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts';
import { useRealtimeVehicles } from '@/hooks/useRealtimeVehicles';
import { ScheduleServiceModal } from './ScheduleServiceModal';
import { CustomerContactModal } from './CustomerContactModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Phone,
  Check,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type MaintenanceAlert = Tables<'maintenance_alerts'>;
type Vehicle = Tables<'vehicles'>;

const severityConfig: Record<string, { icon: any; color: string; badge: string; border: string }> = {
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

export function AlertsList() {
  const { toast } = useToast();
  const { alerts, isLoading, updateAlert } = useRealtimeAlerts();
  const { vehicles } = useRealtimeVehicles();
  const [filter, setFilter] = useState<'all' | 'pending' | 'scheduled'>('all');
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceAlert | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !alert.is_resolved;
    if (filter === 'scheduled') return alert.is_resolved === false;
    return true;
  });

  const handleScheduleService = (alert: MaintenanceAlert) => {
    const vehicle = vehicles.find(v => v.id === alert.vehicle_id);
    setSelectedAlert(alert);
    setSelectedVehicle(vehicle || null);
    setIsScheduleOpen(true);
  };

  const handleContactCustomer = (alert: MaintenanceAlert) => {
    const vehicle = vehicles.find(v => v.id === alert.vehicle_id);
    setSelectedVehicle(vehicle || null);
    setIsContactOpen(true);
  };

  const handleDismiss = async (alert: MaintenanceAlert) => {
    try {
      await updateAlert(alert.id, { is_resolved: true, resolved_at: new Date().toISOString() });
      toast({
        title: "Alert Dismissed",
        description: "The maintenance alert has been dismissed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss alert.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with real-time indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
          <span className="text-sm text-muted-foreground">Real-time alerts active</span>
        </div>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" />
          AI-Powered Scheduling
        </Badge>
      </div>

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
          const vehicle = vehicles.find((v) => v.id === alert.vehicle_id);
          const config = severityConfig[alert.severity] || severityConfig.low;
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
                        {vehicle?.make} {vehicle?.model} ({vehicle?.year}) • VIN: {vehicle?.vin?.slice(-8) || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('capitalize', config.badge)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant={alert.is_resolved ? 'secondary' : 'outline'}>
                        {alert.is_resolved ? 'Resolved' : 'Pending'}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{alert.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Predicted: {alert.predicted_failure_date 
                          ? new Date(alert.predicted_failure_date).toLocaleDateString('en-IN')
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Confidence: {Math.round((alert.confidence_score || 0) * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Est. Cost: ₹5,000</span>
                    </div>
                    {vehicle && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="truncate">{vehicle.owner_phone || 'N/A'}</span>
                      </div>
                    )}
                  </div>

                  {alert.ai_recommendation && (
                    <div className="p-3 rounded-lg bg-muted/50 mb-4">
                      <p className="text-sm font-medium mb-1 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Recommendation:
                      </p>
                      <p className="text-sm text-muted-foreground">{alert.ai_recommendation}</p>
                    </div>
                  )}

                  {!alert.is_resolved && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleScheduleService(alert)}
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Service
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleContactCustomer(alert)}
                      >
                        <Phone className="h-4 w-4" />
                        Contact Customer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="gap-2"
                        onClick={() => handleDismiss(alert)}
                      >
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

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No alerts found.</p>
        </div>
      )}

      {/* Modals */}
      <ScheduleServiceModal
        alert={selectedAlert}
        vehicle={selectedVehicle}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onScheduled={() => {}}
      />

      <CustomerContactModal
        vehicle={selectedVehicle}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
