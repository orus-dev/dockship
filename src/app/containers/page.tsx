"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { Terminal, MoreVertical, Play, Square, Trash2 } from "lucide-react";

const containers = [
  {
    id: "c-a1b2c3d4",
    name: "api-gateway-1",
    image: "dockship/api-gateway:v2.4.1",
    node: "node-01",
    status: "running" as const,
    uptime: "3d 12h 45m",
    cpu: "12%",
    memory: "256MB / 512MB",
  },
  {
    id: "c-e5f6g7h8",
    name: "api-gateway-2",
    image: "dockship/api-gateway:v2.4.1",
    node: "node-02",
    status: "running" as const,
    uptime: "3d 12h 45m",
    cpu: "18%",
    memory: "312MB / 512MB",
  },
  {
    id: "c-i9j0k1l2",
    name: "api-gateway-3",
    image: "dockship/api-gateway:v2.4.1",
    node: "node-03",
    status: "running" as const,
    uptime: "3d 12h 45m",
    cpu: "15%",
    memory: "284MB / 512MB",
  },
  {
    id: "c-m3n4o5p6",
    name: "auth-service-1",
    image: "dockship/auth:v1.8.0",
    node: "node-01",
    status: "running" as const,
    uptime: "5d 8h 22m",
    cpu: "8%",
    memory: "128MB / 256MB",
  },
  {
    id: "c-q7r8s9t0",
    name: "auth-service-2",
    image: "dockship/auth:v1.8.0",
    node: "node-02",
    status: "running" as const,
    uptime: "5d 8h 22m",
    cpu: "6%",
    memory: "142MB / 256MB",
  },
  {
    id: "c-u1v2w3x4",
    name: "postgres-db-1",
    image: "postgres:15-alpine",
    node: "node-01",
    status: "running" as const,
    uptime: "12d 4h 15m",
    cpu: "22%",
    memory: "1.2GB / 2GB",
  },
  {
    id: "c-y5z6a7b8",
    name: "redis-cache-1",
    image: "redis:7-alpine",
    node: "node-02",
    status: "running" as const,
    uptime: "8d 16h 33m",
    cpu: "4%",
    memory: "64MB / 128MB",
  },
  {
    id: "c-c9d0e1f2",
    name: "worker-queue-1",
    image: "dockship/worker:v3.1.2",
    node: "node-03",
    status: "running" as const,
    uptime: "1d 2h 18m",
    cpu: "34%",
    memory: "512MB / 1GB",
  },
  {
    id: "c-g3h4i5j6",
    name: "worker-queue-2",
    image: "dockship/worker:v3.1.2",
    node: "node-03",
    status: "pending" as const,
    uptime: "—",
    cpu: "—",
    memory: "—",
  },
  {
    id: "c-k7l8m9n0",
    name: "metrics-collector-1",
    image: "dockship/metrics:v1.2.0",
    node: "node-01",
    status: "error" as const,
    uptime: "—",
    cpu: "—",
    memory: "—",
  },
];

export default function ContainersPage() {
  return (
    <DashboardLayout
      title="Containers"
      subtitle="View and manage container instances"
    >
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="terminal">{containers.length} containers</Badge>
        <Badge variant="success">
          {containers.filter((c) => c.status === "running").length} running
        </Badge>
        <Badge variant="warning">
          {containers.filter((c) => c.status === "pending").length} pending
        </Badge>
        <Badge variant="destructive">
          {containers.filter((c) => c.status === "error").length} error
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Container
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Image
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Node
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Uptime
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  CPU
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Memory
                </th>
                <th className="text-right text-xs text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {containers.map((container) => (
                <tr key={container.id} className="data-table-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-mono text-sm">
                          {container.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {container.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {container.image}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="terminal">{container.node}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <StatusIndicator status={container.status} showLabel />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">
                      {container.uptime}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">{container.cpu}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">
                      {container.memory}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {container.status === "running" ? (
                        <Button variant="ghost" size="icon-sm">
                          <Square className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon-sm">
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="w-3 h-3" />
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
