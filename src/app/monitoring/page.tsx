"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import GradientAreaChart from "@/components/GradientAreaChart";

const cpuData = [
  { time: "00:00", cpu: 45 },
  { time: "01:00", cpu: 52 },
  { time: "02:00", cpu: 38 },
  { time: "03:00", cpu: 42 },
  { time: "04:00", cpu: 35 },
  { time: "05:00", cpu: 48 },
  { time: "06:00", cpu: 55 },
  { time: "07:00", cpu: 62 },
  { time: "08:00", cpu: 78 },
  { time: "09:00", cpu: 85 },
  { time: "10:00", cpu: 72 },
  { time: "11:00", cpu: 68 },
  { time: "12:00", cpu: 75 },
];

const memoryData = [
  { time: "00:00", memory: 62 },
  { time: "01:00", memory: 64 },
  { time: "02:00", memory: 58 },
  { time: "03:00", memory: 61 },
  { time: "04:00", memory: 59 },
  { time: "05:00", memory: 63 },
  { time: "06:00", memory: 67 },
  { time: "07:00", memory: 72 },
  { time: "08:00", memory: 78 },
  { time: "09:00", memory: 82 },
  { time: "10:00", memory: 76 },
  { time: "11:00", memory: 74 },
  { time: "12:00", memory: 71 },
];

const networkData = [
  { time: "00:00", in: 12, out: 8 },
  { time: "01:00", in: 15, out: 10 },
  { time: "02:00", in: 8, out: 5 },
  { time: "03:00", in: 10, out: 7 },
  { time: "04:00", in: 6, out: 4 },
  { time: "05:00", in: 14, out: 9 },
  { time: "06:00", in: 22, out: 15 },
  { time: "07:00", in: 35, out: 28 },
  { time: "08:00", in: 48, out: 38 },
  { time: "09:00", in: 52, out: 42 },
  { time: "10:00", in: 45, out: 35 },
  { time: "11:00", in: 42, out: 32 },
  { time: "12:00", in: 38, out: 28 },
];

const containerMetrics = [
  { name: "api-gateway-1", cpu: 45, memory: 62, network: "12.4 MB/s" },
  { name: "api-gateway-2", cpu: 52, memory: 58, network: "10.2 MB/s" },
  { name: "api-gateway-3", cpu: 38, memory: 55, network: "8.8 MB/s" },
  { name: "auth-service-1", cpu: 28, memory: 45, network: "3.2 MB/s" },
  { name: "auth-service-2", cpu: 32, memory: 48, network: "2.8 MB/s" },
  { name: "postgres-db-1", cpu: 65, memory: 78, network: "8.1 MB/s" },
  { name: "redis-cache-1", cpu: 12, memory: 34, network: "1.8 MB/s" },
  { name: "worker-queue-1", cpu: 55, memory: 48, network: "5.6 MB/s" },
];

const cpuChartConfig = {
  cpu: { label: "CPU Usage", color: "var(--chart-1)" },
} satisfies ChartConfig;

const memoryChartConfig = {
  memory: { label: "RAM Usage", color: "var(--chart-3)" },
} satisfies ChartConfig;

const networkChartConfig = {
  in: { label: "Inbound", color: "var(--chart-2)" },
  out: { label: "Outbound", color: "var(--chart-4)" },
} satisfies ChartConfig;

export default function MonitoringPage() {
  return (
    <DashboardLayout
      title="Monitoring"
      subtitle="Resource utilization and metrics"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Cluster CPU
            </div>
            <div className="stat-value">68%</div>
            <Progress value={68} className="w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Cluster Memory
            </div>
            <div className="stat-value">71%</div>
            <Progress value={71} className="w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Network In
            </div>
            <div className="stat-value">38 MB/s</div>
            <div className="text-xs text-success mt-1">↑ 12% from avg</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Network Out
            </div>
            <div className="stat-value">28 MB/s</div>
            <div className="text-xs text-muted-foreground mt-1">
              ↓ 5% from avg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CPU & Memory Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <GradientAreaChart
          title="CPU Usage"
          data={cpuData}
          config={cpuChartConfig}
        />
        <GradientAreaChart
          title="Memory Usage"
          data={memoryData}
          config={memoryChartConfig}
        />
      </div>

      <div className="mb-6">
        <GradientAreaChart
          title="Network I/O"
          data={networkData}
          config={networkChartConfig}
        />
      </div>

      {/* Container Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Container Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {containerMetrics.map((container) => (
              <div
                key={container.name}
                className="border border-border p-3 bg-secondary/20"
              >
                <div className="font-mono text-xs mb-3 truncate">
                  {container.name}
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>CPU</span>
                      <span>{container.cpu}%</span>
                    </div>
                    <Progress value={container.cpu} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Memory</span>
                      <span>{container.memory}%</span>
                    </div>
                    <Progress value={container.memory} className="w-full" />
                  </div>
                  <div className="flex justify-between text-[10px] pt-1 border-t border-border">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-mono">{container.network}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
