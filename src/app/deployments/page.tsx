"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, RotateCcw, Eye, MoreVertical, Plus } from "lucide-react";
import { Application, Deployment } from "@/lib/types";
import { getDeployments } from "@/lib/dockship/deploy";
import { getApps } from "@/lib/dockship/application";
import { cn } from "@/lib/utils";
import DeployAppDialog from "@/components/dialogs/DeployApp";
import { useAsync } from "@/hooks/use-async";

const statusDot = {
  running: "bg-chart-2",
  pending: "bg-chart-1",
  stopped: "bg-slate-400 dark:bg-slate-600",
} as const;

export default function DeploymentsPage() {
  const { value: apps } = useAsync([], getApps);

  const { value: deployments, loading } = useAsync(
    [],
    async () => (await getDeployments()).filter((d) => d !== null),
    [apps]
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
    <DashboardLayout
      title="Deployments"
      subtitle="Deployment history and management"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Badge>
          {loading ? "Loading…" : `${deployments.length} deployments`}
        </Badge>

        <DeployAppDialog>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Deployment
          </Button>
        </DeployAppDialog>
      </div>

      {/* Desktop */}
      <div className="hidden md:block space-y-3">
        {deployments.map((dep) => {
          const appName =
            appNameByContainer.get(dep.container) ?? "Unknown app";

          return (
            <div
              key={`${dep.image}-${dep.container ?? "latest"}`}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    statusDot[dep.status as keyof typeof statusDot] ??
                      statusDot.stopped
                  )}
                />
                <div>
                  <div className="font-mono text-sm">{appName}</div>
                  <div className="text-xs text-muted-foreground">
                    {dep.image}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-border">
        {deployments.map((dep) => {
          const appName =
            appNameByContainer.get(dep.container) ?? "Unknown app";

          return (
            <div key={`${dep.container}-mobile`} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{appName}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {dep.status}
                </span>
              </div>

              <div className="flex justify-end gap-1 pt-2">
                <Button variant="ghost" size="icon-sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
