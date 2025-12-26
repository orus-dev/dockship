"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import {
  Rocket,
  RotateCcw,
  Eye,
  MoreVertical,
  Plus,
  GitBranch,
} from "lucide-react";

const deployments = [
  {
    id: "dep-001",
    app: "api-gateway",
    version: "v2.4.1",
    previousVersion: "v2.4.0",
    status: "running" as const,
    deployedAt: "2024-01-15 14:32:18",
    deployedBy: "ci/github-actions",
    duration: "45s",
    replicas: "3/3",
    strategy: "rolling",
  },
  {
    id: "dep-002",
    app: "auth-service",
    version: "v1.8.0",
    previousVersion: "v1.7.9",
    status: "running" as const,
    deployedAt: "2024-01-15 14:18:42",
    deployedBy: "admin@dockship.io",
    duration: "32s",
    replicas: "2/2",
    strategy: "rolling",
  },
  {
    id: "dep-003",
    app: "worker-queue",
    version: "v3.1.2",
    previousVersion: "v3.1.1",
    status: "pending" as const,
    deployedAt: "2024-01-15 13:58:05",
    deployedBy: "ci/github-actions",
    duration: "—",
    replicas: "3/4",
    strategy: "rolling",
  },
  {
    id: "dep-004",
    app: "metrics-collector",
    version: "v1.2.0",
    previousVersion: "v1.1.8",
    status: "error" as const,
    deployedAt: "2024-01-15 13:42:11",
    deployedBy: "ci/github-actions",
    duration: "—",
    replicas: "0/2",
    strategy: "rolling",
  },
  {
    id: "dep-005",
    app: "postgres-db",
    version: "15-alpine",
    previousVersion: "14-alpine",
    status: "running" as const,
    deployedAt: "2024-01-10 09:15:33",
    deployedBy: "admin@dockship.io",
    duration: "2m 18s",
    replicas: "1/1",
    strategy: "recreate",
  },
  {
    id: "dep-006",
    app: "redis-cache",
    version: "7-alpine",
    previousVersion: "7-alpine",
    status: "running" as const,
    deployedAt: "2024-01-08 16:45:22",
    deployedBy: "admin@dockship.io",
    duration: "18s",
    replicas: "1/1",
    strategy: "recreate",
  },
];

export default function DeploymentsPage() {
  return (
    <DashboardLayout
      title="Deployments"
      subtitle="Deployment history and management"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge>{deployments.length} deployments</Badge>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Deployment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Application
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Version
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Replicas
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Deployed
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Duration
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Deployed By
                </th>
                <th className="text-right text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep) => (
                <tr key={dep.id} className="data-table-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{dep.app}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono text-sm">{dep.version}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ← {dep.previousVersion}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusIndicator status={dep.status} showLabel />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm">{dep.replicas}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {dep.deployedAt}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">{dep.duration}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-muted-foreground">
                      {dep.deployedBy}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
