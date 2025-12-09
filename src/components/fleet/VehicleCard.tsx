import { Vehicle } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Car, MapPin, Calendar, Gauge, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

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
  const config = statusConfig[vehicle.status];

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
        <Badge className={cn('capitalize', config.color)}>{vehicle.status}</Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Health Score</span>
          <span className="font-semibold">{vehicle.healthScore}%</span>
        </div>
        <Progress
          value={vehicle.healthScore}
          className="h-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gauge className="h-4 w-4" />
          <span>{vehicle.mileage.toLocaleString()} km</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{vehicle.location.split(',')[0]}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Next: {new Date(vehicle.nextServiceDue).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className={cn(
          'flex items-center gap-2',
          vehicle.telematicsConnected ? 'text-[hsl(var(--success))]' : 'text-muted-foreground'
        )}>
          <div className={cn(
            'h-2 w-2 rounded-full',
            vehicle.telematicsConnected ? 'bg-[hsl(var(--success))] animate-pulse' : 'bg-muted-foreground'
          )} />
          <span>{vehicle.telematicsConnected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-sm font-medium mb-2">{vehicle.ownerName}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>{vehicle.ownerPhone}</span>
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
