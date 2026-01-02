"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Box,
  Server,
  Container,
  Activity,
  ArrowRight,
  Clock,
  Rocket,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getLiveNodes } from "@/core/node";
import { useEffect, useState } from "react";
import { Application, Docker, Node, NodeLiveData } from "@/lib/types";
import { getDocker } from "@/core/docker";
import { getApplications } from "@/core/application";
import { cn } from "@/lib/utils";

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

export default function OverviewPage() {
  const [nodes, setNodes] = useState<(NodeLiveData & Node)[]>([]);
  const [dockerNodes, setDockerNodes] = useState<Docker[]>([]);
  const [apps, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      const nodes = await getLiveNodes();
      setNodes(nodes);
      setDockerNodes(await getDocker(nodes));
      setApplications(await getApplications());
    };
    fetchNodes();
    const interval = setInterval(fetchNodes, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout title="Overview" subtitle="System status and metrics">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Applications"
          value={apps.length}
          subtitle={`${
            apps.filter((app) => app.deployments.length > 0).length
          } Deployed`}
          icon={<Box className="w-4 h-4" />}
        />
        <StatCard
          title="Deployments"
          value="0"
          subtitle="0 running"
          icon={<Rocket className="w-4 h-4" />}
        />
        <StatCard
          title="Nodes"
          value={nodes.filter((n) => n.liveData).length}
          subtitle="online"
          icon={<Server className="w-4 h-4" />}
        />
        <StatCard
          title="Containers"
          value={dockerNodes.reduce(
            (sum, n) =>
              sum + n.containers.filter((c) => c.State === "running").length,
            0
          )}
          subtitle="running"
          icon={<Container className="w-4 h-4" />}
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
                <div className="col-span-2">Deployments</div>
                <div className="col-span-2">Node</div>
              </div>
              {apps.slice(-5).map((app) => (
                <div
                  key={app.name}
                  className="grid grid-cols-12 gap-4 py-3 items-center data-table-row"
                >
                  <div className="col-span-4 font-mono text-sm">{app.name}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {app.deployments.length}
                  </div>
                  <div className="col-span-2">
                    {nodes.find((node) => node.node_id === app.nodeId)?.name}
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
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        (dep.status === "running" && "bg-chart-2") ||
                          (dep.status === "pending" && "bg-chart-1") ||
                          "bg-slate-400 dark:bg-slate-600"
                      )}
                    />
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
            {nodes.map((node, i) => (
              <div key={i} className="border border-border p-4 bg-secondary/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    {node.liveData ? (
                      <span className="size-2 rounded-full bg-chart-2" />
                    ) : (
                      <span className="size-2 rounded-full bg-chart-5" />
                    )}
                    <span className="font-mono text-sm">{node.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {node.ip}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">CPU</span>
                    <span className="font-mono">
                      {node.liveData?.cpu.usage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={node.liveData?.cpu.usage}
                    className="[&>div]:bg-chart-1"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-mono">
                      {node.liveData?.memory.usage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={node.liveData?.memory.usage}
                    className="w-full [&>div]:bg-chart-3"
                  />
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border mt-2">
                    <span className="text-muted-foreground">Containers</span>
                    <span className="font-mono">{6}</span>
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
