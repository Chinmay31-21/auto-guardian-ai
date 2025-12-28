import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type MaintenanceAlert = Tables<'maintenance_alerts'>;

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial alerts
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_alerts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAlerts(data || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();

    // Set up realtime subscription
    const channel = supabase
      .channel('alerts-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_alerts'
        },
        (payload) => {
          console.log('Alert update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as MaintenanceAlert, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => 
              prev.map(a => a.id === (payload.new as MaintenanceAlert).id ? payload.new as MaintenanceAlert : a)
            );
          } else if (payload.eventType === 'DELETE') {
            setAlerts(prev => prev.filter(a => a.id !== (payload.old as MaintenanceAlert).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateAlert = async (alertId: string, updates: Partial<MaintenanceAlert>) => {
    const { error } = await supabase
      .from('maintenance_alerts')
      .update(updates)
      .eq('id', alertId);
    
    if (error) throw error;
  };

  return { alerts, isLoading, error, updateAlert };
}
