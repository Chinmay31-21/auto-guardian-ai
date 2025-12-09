import { rcaInsights } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Factory,
  FileText,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const defectData = [
  { name: 'Brake Wear', count: 47, color: 'hsl(var(--chart-5))' },
  { name: 'Battery', count: 23, color: 'hsl(var(--chart-1))' },
  { name: 'Transmission', count: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Engine', count: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Electrical', count: 8, color: 'hsl(var(--chart-2))' }
];

const trendData = [
  { month: 'Jul', defects: 45 },
  { month: 'Aug', defects: 52 },
  { month: 'Sep', defects: 48 },
  { month: 'Oct', defects: 38 },
  { month: 'Nov', defects: 32 },
  { month: 'Dec', defects: 28 }
];

const statusConfig = {
  open: {
    color: 'bg-destructive/20 text-destructive',
    icon: AlertTriangle
  },
  'in-progress': {
    color: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
    icon: Clock
  },
  closed: {
    color: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]',
    icon: CheckCircle
  }
};

const priorityConfig = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
  high: 'bg-destructive/20 text-destructive'
};

export function RCAAnalytics() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Open Issues</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--warning))]/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold">47</p>
              <p className="text-sm text-muted-foreground">Resolved YTD</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--success))]">-38%</p>
              <p className="text-sm text-muted-foreground">Defect Reduction</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Defects by Component</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Defect Trend (6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="defects" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* RCA Insights */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">RCA/CAPA Insights</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="space-y-4">
          {rcaInsights.map((insight) => {
            const StatusIcon = statusConfig[insight.status].icon;

            return (
              <div
                key={insight.id}
                className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={cn(
                      'h-5 w-5',
                      insight.status === 'open' ? 'text-destructive' :
                        insight.status === 'in-progress' ? 'text-[hsl(var(--warning))]' : 'text-[hsl(var(--success))]'
                    )} />
                    <div>
                      <h4 className="font-medium">{insight.defectType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {insight.affectedComponent} • {insight.occurrenceCount} occurrences
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={cn('capitalize', statusConfig[insight.status].color)}>
                      {insight.status}
                    </Badge>
                    <Badge className={cn('capitalize', priorityConfig[insight.priority])}>
                      {insight.priority}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-muted-foreground mb-1">Root Cause</p>
                    <p>{insight.rootCause}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-muted-foreground mb-1">Corrective Action</p>
                    <p>{insight.correctiveAction}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-muted-foreground mb-1">Preventive Action</p>
                    <p>{insight.preventiveAction}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
                  <Factory className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Manufacturing Feedback</p>
                    <p className="text-sm text-muted-foreground">{insight.manufacturingFeedback}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
