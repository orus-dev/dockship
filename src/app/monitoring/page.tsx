"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Progress } from "@/components/ui/progress";

const cpuData = [
  { time: "00:00", value: 45 },
  { time: "01:00", value: 52 },
  { time: "02:00", value: 38 },
  { time: "03:00", value: 42 },
  { time: "04:00", value: 35 },
  { time: "05:00", value: 48 },
  { time: "06:00", value: 55 },
  { time: "07:00", value: 62 },
  { time: "08:00", value: 78 },
  { time: "09:00", value: 85 },
  { time: "10:00", value: 72 },
  { time: "11:00", value: 68 },
  { time: "12:00", value: 75 },
];

const memoryData = [
  { time: "00:00", value: 62 },
  { time: "01:00", value: 64 },
  { time: "02:00", value: 58 },
  { time: "03:00", value: 61 },
  { time: "04:00", value: 59 },
  { time: "05:00", value: 63 },
  { time: "06:00", value: 67 },
  { time: "07:00", value: 72 },
  { time: "08:00", value: 78 },
  { time: "09:00", value: 82 },
  { time: "10:00", value: 76 },
  { time: "11:00", value: 74 },
  { time: "12:00", value: 71 },
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

export default function MonitoringPage() {
  return (
    <DashboardLayout
      title="Monitoring"
      subtitle="Resource utilization and metrics"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              CPU Usage
              <Badge>Last 12 hours</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <defs>
                    <linearGradient
                      id="cpuGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(180, 100%, 50%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(180, 100%, 50%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 7%)",
                      border: "1px solid hsl(0, 0%, 18%)",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(180, 100%, 50%)"
                    strokeWidth={2}
                    fill="url(#cpuGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              Memory Usage
              <Badge>Last 12 hours</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memoryData}>
                  <defs>
                    <linearGradient
                      id="memoryGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(142, 70%, 45%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(142, 70%, 45%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 7%)",
                      border: "1px solid hsl(0, 0%, 18%)",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(142, 70%, 45%)"
                    strokeWidth={2}
                    fill="url(#memoryGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            Network I/O
            <Badge>Last 12 hours</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 7%)",
                    border: "1px solid hsl(0, 0%, 18%)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="in"
                  stroke="hsl(180, 100%, 50%)"
                  strokeWidth={2}
                  dot={false}
                  name="Inbound"
                />
                <Line
                  type="monotone"
                  dataKey="out"
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={2}
                  dot={false}
                  name="Outbound"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-primary" />
              <span className="text-xs text-muted-foreground">Inbound</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-warning" />
              <span className="text-xs text-muted-foreground">Outbound</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Container Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Container Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
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
