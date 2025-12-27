"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import {
  Box,
  Server,
  Container,
  Activity,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getLiveNodes, getNodes } from "@/core/client/node";
import { useEffect, useState } from "react";
import { Node, NodeLiveData } from "@/lib/types";

const recentDeployments = [
  {
    id: "dep-001",
    app: "api-gateway",
    version: "v2.4.1",
    status: "running" as const,
    time: "2m ago",
  },
  {
    id: "dep-002",
    app: "auth-service",
    version: "v1.8.0",
    status: "running" as const,
    time: "15m ago",
  },
  {
    id: "dep-003",
    app: "worker-queue",
    version: "v3.1.2",
    status: "pending" as const,
    time: "32m ago",
  },
  {
    id: "dep-004",
    app: "metrics-collector",
    version: "v1.2.0",
    status: "error" as const,
    time: "1h ago",
  },
];

const applications = [
  {
    name: "api-gateway",
    containers: 3,
    cpu: 45,
    memory: 62,
    status: "running" as const,
  },
  {
    name: "auth-service",
    containers: 2,
    cpu: 28,
    memory: 45,
    status: "running" as const,
  },
  {
    name: "postgres-db",
    containers: 1,
    cpu: 65,
    memory: 78,
    status: "running" as const,
  },
  {
    name: "redis-cache",
    containers: 1,
    cpu: 12,
    memory: 34,
    status: "running" as const,
  },
  {
    name: "worker-queue",
    containers: 4,
    cpu: 55,
    memory: 48,
    status: "pending" as const,
  },
];

export default function OverviewPage() {
  const [nodes, setNodes] = useState<NodeLiveData[]>([]);

  useEffect(() => {
    getLiveNodes().then(setNodes);
  }, []);

  return (
    <DashboardLayout title="Overview" subtitle="System status and metrics">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Applications"
          value="12"
          subtitle="3 pending"
          icon={<Box className="w-4 h-4" />}
        />
        <StatCard
          title="Containers"
          value="47"
          subtitle="all healthy"
          icon={<Container className="w-4 h-4" />}
        />
        <StatCard
          title="Nodes"
          value="3"
          subtitle="online"
          icon={<Server className="w-4 h-4" />}
        />
        <StatCard
          title="Uptime"
          value="99.9%"
          trend={{ value: 0.2, isPositive: true }}
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Applications & Deployments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Applications Table */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <Link href="/applications">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="space-y-0 min-w-125">
              <div className="grid grid-cols-12 gap-4 text-xs text-muted-foreground uppercase tracking-wider py-2 border-b border-border">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Containers</div>
                <div className="col-span-2">CPU</div>
                <div className="col-span-2">Memory</div>
                <div className="col-span-2">Status</div>
              </div>
              {applications.map((app) => (
                <div
                  key={app.name}
                  className="grid grid-cols-12 gap-4 py-3 items-center data-table-row"
                >
                  <div className="col-span-4 font-mono text-sm">{app.name}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {app.containers}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Progress value={app.cpu} className="w-full" />
                    <span className="text-xs text-muted-foreground font-mono w-8">
                      {app.cpu}%
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Progress value={app.memory} className="w-full" />
                    <span className="text-xs text-muted-foreground font-mono w-8">
                      {app.memory}%
                    </span>
                  </div>
                  <div className="col-span-2">
                    <StatusIndicator status={app.status} showLabel />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Deployments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Deployments</CardTitle>
            <Link href="/deployments">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDeployments.map((dep) => (
                <div
                  key={dep.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <StatusIndicator status={dep.status} size="sm" />
                    <div>
                      <div className="font-mono text-sm">{dep.app}</div>
                      <div className="text-xs text-muted-foreground">
                        {dep.version}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 sm:mt-0">
                    <Clock className="w-3 h-3" /> {dep.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nodes */}
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cluster Nodes</CardTitle>
          <Badge>{nodes.length} nodes</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-75">
            {nodes.map((node) => (
              <div
                key={node.name}
                className="border border-border p-4 bg-secondary/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={node.liveData.status} />
                    <span className="font-mono text-sm">{node.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {node.ip}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">CPU</span>
                    <span className="font-mono">{node.liveData.cpu}%</span>
                  </div>
                  <Progress
                    value={node.liveData.cpu}
                    className="[&>div]:bg-chart-1"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-mono">{node.liveData.memory}%</span>
                  </div>
                  <Progress
                    value={node.liveData.memory}
                    className="w-full [&>div]:bg-chart-3"
                  />
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border mt-2">
                    <span className="text-muted-foreground">Containers</span>
                    <span className="font-mono">
                      {node.liveData.containers}
                    </span>
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
