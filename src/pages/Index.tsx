import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { FleetMonitor } from '@/components/fleet/FleetMonitor';
import { AlertsList } from '@/components/alerts/AlertsList';
import { SchedulingCalendar } from '@/components/scheduling/SchedulingCalendar';
import { CustomerChat } from '@/components/engagement/CustomerChat';
import { RCAAnalytics } from '@/components/analytics/RCAAnalytics';
import { UEBAMonitor } from '@/components/security/UEBAMonitor';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Overview of fleet health, maintenance alerts, and AI agent status'
  },
  fleet: {
    title: 'Fleet Monitor',
    description: 'Real-time vehicle health monitoring and telematics data'
  },
  alerts: {
    title: 'Maintenance Alerts',
    description: 'Predictive maintenance alerts and diagnostic insights'
  },
  scheduling: {
    title: 'Service Scheduling',
    description: 'Manage appointments and service center capacity'
  },
  engagement: {
    title: 'Customer AI Agent',
    description: 'AI-powered customer outreach and voice engagement'
  },
  analytics: {
    title: 'RCA/CAPA Analytics',
    description: 'Root cause analysis and manufacturing feedback loop'
  },
  security: {
    title: 'UEBA Security',
    description: 'User and Entity Behavior Analytics for AI agents'
  }
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'fleet':
        return <FleetMonitor />;
      case 'alerts':
        return <AlertsList />;
      case 'scheduling':
        return <SchedulingCalendar />;
      case 'engagement':
        return <CustomerChat />;
      case 'analytics':
        return <RCAAnalytics />;
      case 'security':
        return <UEBAMonitor />;
      default:
        return <Dashboard />;
    }
  };

  const { title, description } = pageTitles[activeTab] || pageTitles.dashboard;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pl-64 transition-all duration-300">
        <Header />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
