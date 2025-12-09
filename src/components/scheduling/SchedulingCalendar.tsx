import { useState } from 'react';
import { serviceAppointments, serviceCenters, vehicles } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  Star,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  scheduled: 'bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]',
  'in-progress': 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
  completed: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]',
  cancelled: 'bg-destructive/20 text-destructive'
};

export function SchedulingCalendar() {
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Service Centers */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Service Centers</h3>
          <Badge variant="outline">{serviceCenters.length} Active</Badge>
        </div>

        <div className="space-y-3">
          {serviceCenters.map((center) => (
            <Card
              key={center.id}
              className={cn(
                'p-4 cursor-pointer transition-all',
                selectedCenter === center.id
                  ? 'border-primary ring-1 ring-primary'
                  : 'hover:border-primary/50'
              )}
              onClick={() => setSelectedCenter(center.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-sm">{center.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{center.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[hsl(var(--warning))]">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{center.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{center.currentLoad}/{center.capacity}</span>
                </div>
                <Progress value={(center.currentLoad / center.capacity) * 100} className="h-2" />
                <p className="text-xs text-[hsl(var(--success))]">
                  {center.availableSlots} slots available today
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Appointments */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Upcoming Appointments</h3>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

        <div className="space-y-3">
          {serviceAppointments.map((appointment) => {
            const vehicle = vehicles.find((v) => v.id === appointment.vehicleId);
            const center = serviceCenters.find((c) => c.id === appointment.serviceCenterId);

            return (
              <Card key={appointment.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.serviceType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {vehicle?.make} {vehicle?.model} • {appointment.customerName}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn('capitalize', statusConfig[appointment.status])}>
                    {appointment.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.scheduledDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.scheduledTime} ({appointment.estimatedDuration} min)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{center?.name.split(' ').slice(-1)[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="truncate">{appointment.assignedTechnician}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm" variant="outline">Contact</Button>
                  {appointment.status === 'scheduled' && (
                    <Button size="sm" variant="outline" className="text-[hsl(var(--success))]">
                      Start Service
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
