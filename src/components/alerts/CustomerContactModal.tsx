import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, User, Car, MessageSquare } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

interface CustomerContactModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerContactModal({ vehicle, isOpen, onClose }: CustomerContactModalProps) {
  if (!vehicle) return null;

  const handleCall = () => {
    if (vehicle.owner_phone) {
      window.open(`tel:${vehicle.owner_phone}`, '_self');
    }
  };

  const handleEmail = () => {
    if (vehicle.owner_email) {
      window.open(`mailto:${vehicle.owner_email}?subject=Vehicle Service - ${vehicle.make} ${vehicle.model}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (vehicle.owner_phone) {
      const phone = vehicle.owner_phone.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(
        `Hello ${vehicle.owner_name}, this is regarding your ${vehicle.make} ${vehicle.model} (${vehicle.year}). We have an important maintenance update for you.`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold text-lg mb-2">{vehicle.owner_name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Car className="h-4 w-4" />
              <span>{vehicle.make} {vehicle.model} ({vehicle.year})</span>
            </div>
            <p className="text-xs text-muted-foreground">VIN: {vehicle.vin || 'N/A'}</p>
          </div>

          <Separator />

          {/* Contact Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact Options</h4>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={handleCall}
              disabled={!vehicle.owner_phone}
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-[hsl(var(--success))]" />
              </div>
              <div className="text-left">
                <p className="font-medium">Call</p>
                <p className="text-xs text-muted-foreground">{vehicle.owner_phone || 'Not available'}</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={handleEmail}
              disabled={!vehicle.owner_email}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Email</p>
                <p className="text-xs text-muted-foreground">{vehicle.owner_email || 'Not available'}</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={handleWhatsApp}
              disabled={!vehicle.owner_phone}
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-[hsl(var(--success))]" />
              </div>
              <div className="text-left">
                <p className="font-medium">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Send message via WhatsApp</p>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
