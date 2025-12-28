import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Wrench, 
  MessageSquare,
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type MaintenanceAlert = Tables<'maintenance_alerts'>;
type Vehicle = Tables<'vehicles'>;

interface AIScheduleRecommendation {
  scheduledDate: string;
  scheduledTime: string;
  serviceCenterName: string;
  serviceCenterLocation?: string;
  estimatedDuration: number;
  priority: string;
  technicianNotes?: string;
  customerMessage: string;
  reasoning: string;
}

interface ScheduleServiceModalProps {
  alert: MaintenanceAlert | null;
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduled: () => void;
}

export function ScheduleServiceModal({ 
  alert, 
  vehicle, 
  isOpen, 
  onClose, 
  onScheduled 
}: ScheduleServiceModalProps) {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIScheduleRecommendation | null>(null);

  const getAIRecommendation = async () => {
    if (!alert || !vehicle) return;

    setIsLoadingAI(true);
    try {
      const response = await supabase.functions.invoke('schedule-service', {
        body: {
          alertId: alert.id,
          vehicleId: alert.vehicle_id,
          component: alert.component,
          severity: alert.severity,
          predictedFailureDate: alert.predicted_failure_date,
          estimatedCost: 5000, // Default estimate
          recommendedAction: alert.ai_recommendation || alert.description,
          customerName: vehicle.owner_name,
          customerPhone: vehicle.owner_phone || '',
          customerEmail: vehicle.owner_email || '',
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          vehicleYear: vehicle.year,
          location: `${vehicle.location_lat}, ${vehicle.location_lng}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.schedule) {
        setAiRecommendation(response.data.schedule);
        toast({
          title: "AI Recommendation Ready",
          description: "Review the suggested schedule below.",
        });
      }
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to get AI scheduling recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSchedule = async () => {
    if (!alert || !aiRecommendation) return;

    setIsScheduling(true);
    try {
      // Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          vehicle_id: alert.vehicle_id,
          alert_id: alert.id,
          service_type: alert.component,
          scheduled_date: `${aiRecommendation.scheduledDate}T${convertTo24Hour(aiRecommendation.scheduledTime)}:00`,
          estimated_duration: aiRecommendation.estimatedDuration,
          priority: aiRecommendation.priority,
          technician_notes: aiRecommendation.technicianNotes,
          customer_notes: aiRecommendation.customerMessage,
          status: 'scheduled'
        });

      if (appointmentError) throw appointmentError;

      // Update alert status
      const { error: alertError } = await supabase
        .from('maintenance_alerts')
        .update({ 
          is_resolved: false
        })
        .eq('id', alert.id);

      if (alertError) throw alertError;

      toast({
        title: "Service Scheduled",
        description: `Appointment scheduled for ${aiRecommendation.scheduledDate} at ${aiRecommendation.scheduledTime}`,
      });

      onScheduled();
      onClose();
    } catch (error) {
      console.error('Error scheduling service:', error);
      toast({
        title: "Error",
        description: "Failed to schedule service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours.padStart(2, '0')}:${minutes || '00'}`;
  };

  if (!alert || !vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Service
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Summary */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{alert.component}</span>
              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                {alert.severity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
            <p className="text-sm">
              <span className="text-muted-foreground">Vehicle:</span>{' '}
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Owner:</span>{' '}
              {vehicle.owner_name}
            </p>
          </div>

          {!aiRecommendation ? (
            <Button 
              onClick={getAIRecommendation} 
              disabled={isLoadingAI}
              className="w-full gap-2"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get AI Scheduling Recommendation
                </>
              )}
            </Button>
          ) : (
            <>
              <Separator />
              
              {/* AI Recommendation */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI Recommendation
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      Date
                    </div>
                    <p className="font-semibold">{aiRecommendation.scheduledDate}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      Time
                    </div>
                    <p className="font-semibold">{aiRecommendation.scheduledTime}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      Service Center
                    </div>
                    <p className="font-semibold text-sm">{aiRecommendation.serviceCenterName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Wrench className="h-3 w-3" />
                      Duration
                    </div>
                    <p className="font-semibold">{aiRecommendation.estimatedDuration} mins</p>
                  </div>
                </div>

                {aiRecommendation.reasoning && (
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <p className="font-medium mb-1">Reasoning:</p>
                    <p className="text-muted-foreground">{aiRecommendation.reasoning}</p>
                  </div>
                )}

                {aiRecommendation.customerMessage && (
                  <div className="p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MessageSquare className="h-3 w-3" />
                      Message to Customer
                    </div>
                    <p className="text-sm">{aiRecommendation.customerMessage}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {aiRecommendation && (
            <Button onClick={handleSchedule} disabled={isScheduling} className="gap-2">
              {isScheduling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Schedule
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
