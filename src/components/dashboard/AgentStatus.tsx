import { agentStats } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cpu, Activity, MessageSquare, Calendar, Star, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

const agentIcons = {
  dataAnalysis: Activity,
  diagnosis: Cpu,
  customerEngagement: MessageSquare,
  scheduling: Calendar,
  feedback: Star,
  manufacturing: Factory
};

const agentLabels = {
  dataAnalysis: 'Data Analysis',
  diagnosis: 'Diagnosis',
  customerEngagement: 'Customer Engagement',
  scheduling: 'Scheduling',
  feedback: 'Feedback',
  manufacturing: 'Manufacturing Insights'
};

export function AgentStatus() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">AI Agent Status</h3>
          <p className="text-sm text-muted-foreground">Master & Worker Agents</p>
        </div>
        <Badge className="bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/30">
          All Systems Operational
        </Badge>
      </div>

      {/* Master Agent */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            <span className="font-semibold">Master Agent</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {agentStats.masterAgent.tasksProcessed.toLocaleString()} tasks
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Success Rate</p>
            <p className="font-semibold text-[hsl(var(--success))]">{agentStats.masterAgent.successRate}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Response</p>
            <p className="font-semibold">{agentStats.masterAgent.avgResponseTime}s</p>
          </div>
        </div>
      </div>

      {/* Worker Agents */}
      <div className="space-y-3">
        {Object.entries(agentStats.workerAgents).map(([key, agent]) => {
          const Icon = agentIcons[key as keyof typeof agentIcons];
          const label = agentLabels[key as keyof typeof agentLabels];

          return (
            <div key={key} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-40">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{label}</span>
              </div>
              <div className="flex-1">
                <Progress value={agent.successRate} className="h-2" />
              </div>
              <span className="text-sm font-medium w-12 text-right">{agent.successRate}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
