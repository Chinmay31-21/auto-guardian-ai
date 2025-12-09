import { StatsCard } from './StatsCard';
import { VehicleHealthChart } from './VehicleHealthChart';
import { DemandForecastChart } from './DemandForecastChart';
import { RecentAlerts } from './RecentAlerts';
import { AgentStatus } from './AgentStatus';
import { vehicles, maintenanceAlerts, serviceAppointments } from '@/data/mockData';
import { Car, AlertTriangle, Calendar, Users, TrendingUp, Wrench } from 'lucide-react';

export function Dashboard() {
  const healthyVehicles = vehicles.filter((v) => v.status === 'healthy').length;
  const criticalAlerts = maintenanceAlerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length;
  const todayAppointments = serviceAppointments.filter((a) => a.status === 'scheduled' || a.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Fleet"
          value={vehicles.length}
          change={`${healthyVehicles} healthy`}
          changeType="positive"
          icon={Car}
          iconColor="primary"
        />
        <StatsCard
          title="Active Alerts"
          value={maintenanceAlerts.length}
          change={`${criticalAlerts} critical`}
          changeType="negative"
          icon={AlertTriangle}
          iconColor="warning"
        />
        <StatsCard
          title="Today's Services"
          value={todayAppointments}
          change="+2 scheduled"
          changeType="neutral"
          icon={Calendar}
          iconColor="success"
        />
        <StatsCard
          title="AI Uptime"
          value="99.8%"
          change="All agents active"
          changeType="positive"
          icon={TrendingUp}
          iconColor="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VehicleHealthChart />
        <DemandForecastChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts />
        <AgentStatus />
      </div>
    </div>
  );
}
