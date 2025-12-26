"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { Play, Square, RotateCcw, MoreVertical, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const applications = [
  {
    id: "app-001",
    name: "api-gateway",
    image: "dockship/api-gateway:v2.4.1",
    containers: 3,
    replicas: "3/3",
    cpu: 45,
    memory: 62,
    network: "12.4 MB/s",
    status: "running" as const,
    ports: ["80:8080", "443:8443"],
  },
  {
    id: "app-002",
    name: "auth-service",
    image: "dockship/auth:v1.8.0",
    containers: 2,
    replicas: "2/2",
    cpu: 28,
    memory: 45,
    network: "3.2 MB/s",
    status: "running" as const,
    ports: ["9000:9000"],
  },
  {
    id: "app-003",
    name: "postgres-db",
    image: "postgres:15-alpine",
    containers: 1,
    replicas: "1/1",
    cpu: 65,
    memory: 78,
    network: "8.1 MB/s",
    status: "running" as const,
    ports: ["5432:5432"],
  },
  {
    id: "app-004",
    name: "redis-cache",
    image: "redis:7-alpine",
    containers: 1,
    replicas: "1/1",
    cpu: 12,
    memory: 34,
    network: "1.8 MB/s",
    status: "running" as const,
    ports: ["6379:6379"],
  },
  {
    id: "app-005",
    name: "worker-queue",
    image: "dockship/worker:v3.1.2",
    containers: 4,
    replicas: "3/4",
    cpu: 55,
    memory: 48,
    network: "5.6 MB/s",
    status: "pending" as const,
    ports: [],
  },
  {
    id: "app-006",
    name: "metrics-collector",
    image: "dockship/metrics:v1.2.0",
    containers: 2,
    replicas: "0/2",
    cpu: 0,
    memory: 0,
    network: "0 MB/s",
    status: "error" as const,
    ports: ["9090:9090"],
  },
];

export default function ApplicationsPage() {
  return (
    <DashboardLayout
      title="Applications"
      subtitle="Manage deployed applications"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="terminal">{applications.length} apps</Badge>
          <Badge variant="success">
            {applications.filter((a) => a.status === "running").length} running
          </Badge>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Deploy Application
        </Button>
      </div>

      <div className="space-y-3">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Status & Name */}
                <div className="col-span-3 flex items-center gap-3">
                  <StatusIndicator status={app.status} />
                  <div>
                    <div className="font-mono text-sm font-medium">
                      {app.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate max-w-48">
                      {app.image}
                    </div>
                  </div>
                </div>

                {/* Replicas */}
                <div className="col-span-1">
                  <div className="text-xs text-muted-foreground">Replicas</div>
                  <div className="font-mono text-sm">{app.replicas}</div>
                </div>

                {/* CPU */}
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">CPU</div>
                  <div className="flex items-center gap-2">
                    <Progress value={app.cpu} className="w-full" />
                    <span className="text-xs font-mono w-8">{app.cpu}%</span>
                  </div>
                </div>

                {/* Memory */}
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    Memory
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={app.memory} className="w-full" />
                    <span className="text-xs font-mono w-8">{app.memory}%</span>
                  </div>
                </div>

                {/* Network */}
                <div className="col-span-1">
                  <div className="text-xs text-muted-foreground">Network</div>
                  <div className="font-mono text-xs">{app.network}</div>
                </div>

                {/* Ports */}
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    Ports
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {app.ports.length > 0 ? (
                      app.ports.map((port) => (
                        <Badge
                          key={port}
                          variant="terminal"
                          className="text-[10px]"
                        >
                          {port}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {app.status === "running" ? (
                    <Button variant="ghost" size="icon-sm">
                      <Square className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon-sm">
                      <Play className="w-3 h-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
