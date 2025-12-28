import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Car, MapPin, Calendar, Gauge, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

const getStatusFromHealthScore = (score: number | null) => {
  if (!score) return 'warning';
  if (score >= 80) return 'healthy';
  if (score >= 50) return 'warning';
  return 'critical';
};

const statusConfig = {
  healthy: {
    color: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/30',
    progressColor: 'bg-[hsl(var(--success))]'
  },
  warning: {
    color: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30',
    progressColor: 'bg-[hsl(var(--warning))]'
  },
  critical: {
    color: 'bg-destructive/20 text-destructive border-destructive/30',
    progressColor: 'bg-destructive'
  }
};

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const status = getStatusFromHealthScore(vehicle.health_score);
  const config = statusConfig[status];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">
              {vehicle.make} {vehicle.model}
            </h4>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={cn('capitalize', config.color)}>{status}</Badge>
          {vehicle.telematics_status === 'active' && (
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--success))]">
              <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              Live
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Health Score</span>
          <span className="font-semibold">{vehicle.health_score || 0}%</span>
        </div>
        <Progress
          value={vehicle.health_score || 0}
          className="h-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gauge className="h-4 w-4" />
          <span>{(vehicle.mileage || 0).toLocaleString()} km</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">
            {vehicle.location_lat && vehicle.location_lng 
              ? `${Number(vehicle.location_lat).toFixed(2)}, ${Number(vehicle.location_lng).toFixed(2)}`
              : 'Unknown'
            }
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Next: {vehicle.next_service_date 
              ? new Date(vehicle.next_service_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : 'N/A'
            }
          </span>
        </div>
        <div className={cn(
          'flex items-center gap-2',
          vehicle.telematics_status === 'active' ? 'text-[hsl(var(--success))]' : 'text-muted-foreground'
        )}>
          <div className={cn(
            'h-2 w-2 rounded-full',
            vehicle.telematics_status === 'active' ? 'bg-[hsl(var(--success))] animate-pulse' : 'bg-muted-foreground'
          )} />
          <span>{vehicle.telematics_status === 'active' ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-sm font-medium mb-2">{vehicle.owner_name}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>{vehicle.owner_phone || 'N/A'}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onSelect(vehicle)}
        variant="outline"
        className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        View Details
      </Button>
    </div>
  );
}
