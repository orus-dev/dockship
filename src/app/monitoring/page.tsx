"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import GradientAreaChart from "@/components/GradientAreaChart";
import { getMetrics } from "@/lib/dockship/metrics";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import RadialChart from "@/components/RadialChart";
import { getLiveNodes, getNodes } from "@/lib/dockship/node";
import { average } from "@/lib/format";
import { getContainerStats, getDocker } from "@/lib/dockship/docker";
import { SimpleStats } from "@/lib/types";
import { useAsync, useAsyncInterval } from "@/hooks/use-async";

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
  const isMobile = useIsMobile();

  // Metrics polling every 30 seconds
  const { value: metrics } = useAsyncInterval([], getMetrics, 30000, []);

  // Live nodes polling every 3 seconds
  const { value: liveData } = useAsyncInterval(
    { cpuUsage: 0, ramUsage: 0 },
    async () => {
      const nodes = await getLiveNodes();
      return {
        cpuUsage: average(nodes, (n) => n.liveData?.cpu.usage || 0),
        ramUsage: average(nodes, (n) => n.liveData?.memory.usage || 0),
      };
    },
    3000,
    []
  );

  // Container stats
  const { value: containerStats } = useAsync(
    [],
    async () => {
      const nodes = await getNodes();
      const dockerNodes = await getDocker(nodes);

      return (
        await Promise.all(
          dockerNodes.flatMap((node) =>
            node.containers.map(async (c) => {
              const stats = await getContainerStats(c.Id);
              if (!stats) return undefined;
              return { ...stats, name: c.Names[0] };
            })
          )
        )
      ).filter((s): s is SimpleStats & { name: string } => s !== undefined);
    },
    []
  );

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
          data={metrics}
          config={cpuChartConfig}
          max={100}
        />
        <GradientAreaChart
          title="Memory Usage"
          data={metrics}
          config={memoryChartConfig}
          max={100}
        />
      </div>

      {/* Network Metrics */}
      <div className="mb-6">
        <GradientAreaChart
          title="Network I/O"
          data={metrics}
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
            {containerStats.map((container) => (
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
                      <span>{container.cpu?.toFixed(1)}%</span>
                    </div>
                    <Progress value={container.cpu} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Memory</span>
                      <span>{container.memory?.toFixed(1)}%</span>
                    </div>
                    <Progress value={container.memory} className="w-full" />
                  </div>
                  <div className="flex justify-between text-[10px] pt-1 border-t border-border">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-mono"></span>
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
