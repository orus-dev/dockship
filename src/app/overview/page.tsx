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
import { getLiveNodes } from "@/lib/dockship/node";
import { useEffect, useMemo, useState } from "react";
import {
  Application,
  Deployment,
  Docker,
  Node,
  NodeLiveData,
} from "@/lib/types";
import { getDocker } from "@/lib/dockship/docker";
import { getApps } from "@/lib/dockship/application";
import { cn } from "@/lib/utils";
import { getDeployments } from "@/lib/dockship/deploy";
import { useAsync, useAsyncInterval } from "@/hooks/use-async";

export default function OverviewPage() {
  const { value: nodes } = useAsyncInterval([], getLiveNodes, 3000);
  const { value: dockerNodes } = useAsync([], async () => getDocker(nodes), [
    nodes,
  ]);
  const { value: apps } = useAsyncInterval([], getApps, 3000);
  const { value: deployments } = useAsyncInterval(
    [],
    async () => (await getDeployments()).filter((d) => d !== null),
    3000
  );

  const appNameByContainer = useMemo(() => {
    const map = new Map<string, string>();
    for (const app of apps) {
      for (const container of app.deployments) {
        map.set(container, app.name);
      }
    }
    return map;
  }, [apps]);

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
            <div className="min-w-lg">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 border-b">
                <div className="col-span-5">Name</div>
                <div className="col-span-4">Deployments</div>
                <div className="col-span-3">Node</div>
              </div>

              {/* Rows */}
              {apps.slice(-5).length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground text-center">
                  No applications yet
                </div>
              ) : (
                apps.slice(-5).map((app) => (
                  <div
                    key={app.id}
                    className="
            grid grid-cols-12 gap-4 py-3 items-center
            text-sm
            hover:bg-muted/50
            transition-colors
            rounded-md
          "
                  >
                    <div className="col-span-5 font-mono truncate">
                      {app.name}
                    </div>

                    <div className="col-span-7 text-muted-foreground">
                      {app.deployments.length}
                    </div>
                  </div>
                ))
              )}
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
              {deployments.slice(-5).map((dep) => (
                <div
                  key={dep.container}
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
                      <div className="font-mono text-sm">
                        {appNameByContainer.get(dep.container)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dep.image.slice(7, 19)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 sm:mt-0">
                    {/* <Clock className="w-3 h-3" /> {dep.time} */}
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
