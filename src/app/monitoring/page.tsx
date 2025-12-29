"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import GradientAreaChart from "@/components/GradientAreaChart";
import { getMetrics } from "@/core/metrics";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import RadialChart from "@/components/RadialChart";
import { getLiveNodes } from "@/core/node";
import { average } from "@/lib/format";

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
  const [data, setData] = useState<
    {
      time: string;
      cpu: number;
      memory: number;
      in: number;
      out: number;
    }[]
  >([]);
  const isMobile = useIsMobile();
  const [liveData, setLiveData] = useState<{
    cpuUsage: number;
    ramUsage: number;
  }>();

  useEffect(() => {
    const fetchNodes = async () => {
      const nodes = await getLiveNodes();
      setLiveData({
        cpuUsage: average(nodes, (n) => n.liveData?.cpu.usage || 0),
        ramUsage: average(nodes, (n) => n.liveData?.memory.usage || 0),
      });
    };
    fetchNodes();
    const interval = setInterval(fetchNodes, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchMetrics() {
      setData(await getMetrics());
    }

    fetchMetrics();

    const i = setInterval(fetchMetrics, 30000);

    return () => clearInterval(i);
  }, []);

  return (
    <DashboardLayout
      title="Monitoring"
      subtitle="Resource utilization and metrics"
    >
      {/* Summary Stats */}
      {isMobile ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="px-4">
              <RadialChart value={liveData?.cpuUsage || 0}>CPU</RadialChart>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-4">
              <RadialChart value={liveData?.ramUsage || 0}>RAM</RadialChart>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                CPU usage
              </div>
              <div className="stat-value">
                {liveData?.cpuUsage?.toFixed(0) || 0}%
              </div>
              <Progress value={liveData?.cpuUsage} className="w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Memory usage
              </div>
              <div className="stat-value">
                {liveData?.ramUsage?.toFixed(0) || 0}%
              </div>
              <Progress value={liveData?.ramUsage} className="w-full" />
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
      )}

      {/* CPU & Memory Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <GradientAreaChart
          title="CPU Usage"
          data={data}
          config={cpuChartConfig}
          max={100}
        />
        <GradientAreaChart
          title="Memory Usage"
          data={data}
          config={memoryChartConfig}
          max={100}
        />
      </div>

      {/* Network Metrics */}
      <div className="mb-6">
        <GradientAreaChart
          title="Network I/O"
          data={data}
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
