import { useState } from 'react';
import { useRealtimeVehicles } from '@/hooks/useRealtimeVehicles';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailModal } from './VehicleDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Grid, List, RefreshCw } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

const getStatusFromHealthScore = (score: number | null) => {
  if (!score) return 'warning';
  if (score >= 80) return 'healthy';
  if (score >= 50) return 'warning';
  return 'critical';
};

export function FleetMonitor() {
  const { vehicles, isLoading, error } = useRealtimeVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const vehicleStatus = getStatusFromHealthScore(vehicle.health_score);
    const matchesStatus = statusFilter === 'all' || vehicleStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: vehicles.length,
    healthy: vehicles.filter((v) => getStatusFromHealthScore(v.health_score) === 'healthy').length,
    warning: vehicles.filter((v) => getStatusFromHealthScore(v.health_score) === 'warning').length,
    critical: vehicles.filter((v) => getStatusFromHealthScore(v.health_score) === 'critical').length
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailOpen(true);
  };

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Error loading vehicles: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real-time indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
          <span className="text-sm text-muted-foreground">Real-time updates active</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Auto-refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, owner, or VIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'healthy', 'warning', 'critical'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {statusCounts[status]}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="flex gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      )}

      {/* Vehicle Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={handleVehicleSelect}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredVehicles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No vehicles found matching your criteria.</p>
        </div>
      )}

      {/* Vehicle Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
