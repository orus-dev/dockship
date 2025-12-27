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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <Badge>{deployments.length} deployments</Badge>

        <Button size="sm" className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Deployment</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Application",
                    "Version",
                    "Status",
                    "Replicas",
                    "Deployed",
                    "Duration",
                    "Deployed By",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4 ${
                        h === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
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

                    <td className="py-3 px-4 font-mono text-sm">
                      {dep.replicas}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                      {dep.deployedAt}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs">
                      {dep.duration}
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {dep.deployedBy}
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
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {deployments.map((dep) => (
              <div key={dep.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{dep.app}</span>
                  </div>
                  <StatusIndicator status={dep.status} />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <GitBranch className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono">{dep.version}</span>
                  <span className="text-muted-foreground">
                    ← {dep.previousVersion}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Replicas</span>
                    <div className="font-mono">{dep.replicas}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <div className="font-mono">{dep.duration}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deployed</span>
                    <div className="font-mono">{dep.deployedAt}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">By</span>
                    <div className="truncate">{dep.deployedBy}</div>
                  </div>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
