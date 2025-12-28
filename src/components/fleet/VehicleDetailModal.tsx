import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  Gauge, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail,
  Fuel,
  Thermometer,
  Battery,
  Activity,
  User,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
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
    label: 'Healthy'
  },
  warning: {
    color: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30',
    label: 'Warning'
  },
  critical: {
    color: 'bg-destructive/20 text-destructive border-destructive/30',
    label: 'Critical'
  }
};

export function VehicleDetailModal({ vehicle, isOpen, onClose }: VehicleDetailModalProps) {
  if (!vehicle) return null;

  const status = getStatusFromHealthScore(vehicle.health_score);
  const config = statusConfig[status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span>{vehicle.make} {vehicle.model} ({vehicle.year})</span>
              <p className="text-sm font-normal text-muted-foreground">ID: {vehicle.vehicle_id}</p>
            </div>
            <Badge className={cn('ml-auto capitalize', config.color)}>
              {config.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Health Score */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Health Score</span>
              <span className="text-2xl font-bold">{vehicle.health_score || 0}%</span>
            </div>
            <Progress value={vehicle.health_score || 0} className="h-3" />
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">VIN:</span>
                <span className="font-medium">{vehicle.vin || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">License Plate:</span>
                <span className="font-medium">{vehicle.license_plate || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mileage:</span>
                <span className="font-medium">{(vehicle.mileage || 0).toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Telematics:</span>
                <Badge variant={vehicle.telematics_status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {vehicle.telematics_status || 'Unknown'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Telemetry Data */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Real-time Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Fuel className="h-4 w-4" />
                  <span className="text-xs">Fuel Level</span>
                </div>
                <div className="text-lg font-semibold">{vehicle.fuel_level || 0}%</div>
                <Progress value={vehicle.fuel_level || 0} className="h-1.5 mt-1" />
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-xs">Engine Temp</span>
                </div>
                <div className="text-lg font-semibold">{vehicle.engine_temp || 0}°C</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Battery className="h-4 w-4" />
                  <span className="text-xs">Battery Voltage</span>
                </div>
                <div className="text-lg font-semibold">{vehicle.battery_voltage || 0}V</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs">Oil Pressure</span>
                </div>
                <div className="text-lg font-semibold">{vehicle.oil_pressure || 0} PSI</div>
              </div>
            </div>
          </div>

          {/* Tire Pressure */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Tire Pressure (PSI)</h3>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
              <div className="p-2 rounded bg-muted/30 text-center">
                <span className="text-xs text-muted-foreground">FL</span>
                <div className="font-semibold">{vehicle.tire_pressure_fl || 0}</div>
              </div>
              <div className="p-2 rounded bg-muted/30 text-center">
                <span className="text-xs text-muted-foreground">FR</span>
                <div className="font-semibold">{vehicle.tire_pressure_fr || 0}</div>
              </div>
              <div className="p-2 rounded bg-muted/30 text-center">
                <span className="text-xs text-muted-foreground">RL</span>
                <div className="font-semibold">{vehicle.tire_pressure_rl || 0}</div>
              </div>
              <div className="p-2 rounded bg-muted/30 text-center">
                <span className="text-xs text-muted-foreground">RR</span>
                <div className="font-semibold">{vehicle.tire_pressure_rr || 0}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service History */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Service Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Last Service:</span>
                <p className="font-medium">
                  {vehicle.last_service_date 
                    ? new Date(vehicle.last_service_date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Next Service Due:</span>
                <p className="font-medium">
                  {vehicle.next_service_date 
                    ? new Date(vehicle.next_service_date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Owner Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Owner Information
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{vehicle.owner_name}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{vehicle.owner_phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{vehicle.owner_email || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          {(vehicle.location_lat && vehicle.location_lng) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lat: {vehicle.location_lat}, Lng: {vehicle.location_lng}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
