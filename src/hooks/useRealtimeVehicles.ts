import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

export function useRealtimeVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial vehicles
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVehicles(data || []);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();

    // Set up realtime subscription
    const channel = supabase
      .channel('vehicles-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicles'
        },
        (payload) => {
          console.log('Vehicle update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setVehicles(prev => [payload.new as Vehicle, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setVehicles(prev => 
              prev.map(v => v.id === (payload.new as Vehicle).id ? payload.new as Vehicle : v)
            );
          } else if (payload.eventType === 'DELETE') {
            setVehicles(prev => prev.filter(v => v.id !== (payload.old as Vehicle).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { vehicles, isLoading, error };
}
