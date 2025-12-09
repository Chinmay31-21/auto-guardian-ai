import { useState } from 'react';
import { uebaEvents } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Ban,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const eventTypeConfig = {
  normal: {
    color: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]',
    icon: ShieldCheck,
    bgColor: 'bg-[hsl(var(--success))]/10'
  },
  anomaly: {
    color: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
    icon: ShieldAlert,
    bgColor: 'bg-[hsl(var(--warning))]/10'
  },
  alert: {
    color: 'bg-destructive/20 text-destructive',
    icon: AlertTriangle,
    bgColor: 'bg-destructive/10'
  }
};

export function UEBAMonitor() {
  const [filter, setFilter] = useState<'all' | 'anomaly' | 'alert'>('all');

  const filteredEvents = uebaEvents.filter((event) => {
    if (filter === 'all') return true;
    return event.eventType === filter;
  });

  const normalCount = uebaEvents.filter(e => e.eventType === 'normal').length;
  const anomalyCount = uebaEvents.filter(e => e.eventType === 'anomaly').length;
  const alertCount = uebaEvents.filter(e => e.eventType === 'alert').length;
  const unresolvedCount = uebaEvents.filter(e => !e.resolved).length;

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{normalCount}</p>
              <p className="text-sm text-muted-foreground">Normal Events</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--warning))]/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-[hsl(var(--warning))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{anomalyCount}</p>
              <p className="text-sm text-muted-foreground">Anomalies</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{alertCount}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unresolvedCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Security Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Security Score</h3>
            <p className="text-sm text-muted-foreground">Based on agent behavior analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="hsl(var(--success))"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${87 * 3.52} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">87</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>API Access Compliance</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Behavioral Baseline Adherence</span>
                <span className="font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Workflow Integrity</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Events List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Security Events</h3>
          <div className="flex gap-2">
            {(['all', 'anomaly', 'alert'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const config = eventTypeConfig[event.eventType];
            const Icon = config.icon;

            return (
              <div
                key={event.id}
                className={cn(
                  'p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors',
                  event.eventType === 'alert' && !event.resolved && 'border-destructive/50 bg-destructive/5'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', config.bgColor)}>
                      <Icon className={cn(
                        'h-4 w-4',
                        event.eventType === 'normal' ? 'text-[hsl(var(--success))]' :
                          event.eventType === 'anomaly' ? 'text-[hsl(var(--warning))]' : 'text-destructive'
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.agentType}</span>
                        <Badge className={cn('capitalize text-xs', config.color)}>
                          {event.eventType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'px-2 py-1 rounded-md text-xs font-medium',
                      event.riskScore > 60 ? 'bg-destructive/20 text-destructive' :
                        event.riskScore > 30 ? 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]' :
                          'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]'
                    )}>
                      Risk: {event.riskScore}
                    </div>
                    {event.resolved ? (
                      <Badge className="bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    ) : (
                      <Badge className="bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString('en-IN')}
                  </span>
                  {!event.resolved && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">
                        <Eye className="h-3 w-3" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 h-7 text-xs text-destructive">
                        <Ban className="h-3 w-3" />
                        Block Agent
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
