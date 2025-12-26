"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { Server, Plus, Settings, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nodes = [
  {
    id: "node-01",
    name: "node-01",
    hostname: "dockship-node-01.local",
    ip: "10.0.1.10",
    os: "Ubuntu 22.04 LTS",
    docker: "24.0.7",
    cpu: { cores: 8, usage: 72 },
    memory: { total: "32 GB", used: "21.8 GB", percentage: 68 },
    disk: { total: "500 GB", used: "245 GB", percentage: 49 },
    containers: 8,
    status: "running" as const,
    labels: ["production", "primary"],
  },
  {
    id: "node-02",
    name: "node-02",
    hostname: "dockship-node-02.local",
    ip: "10.0.1.11",
    os: "Ubuntu 22.04 LTS",
    docker: "24.0.7",
    cpu: { cores: 8, usage: 45 },
    memory: { total: "32 GB", used: "16.6 GB", percentage: 52 },
    disk: { total: "500 GB", used: "178 GB", percentage: 36 },
    containers: 6,
    status: "running" as const,
    labels: ["production"],
  },
  {
    id: "node-03",
    name: "node-03",
    hostname: "dockship-node-03.local",
    ip: "10.0.1.12",
    os: "Ubuntu 22.04 LTS",
    docker: "24.0.7",
    cpu: { cores: 16, usage: 89 },
    memory: { total: "64 GB", used: "54.4 GB", percentage: 85 },
    disk: { total: "1 TB", used: "612 GB", percentage: 61 },
    containers: 12,
    status: "running" as const,
    labels: ["production", "high-memory"],
  },
];

export default function NodesPage() {
  return (
    <DashboardLayout title="Nodes" subtitle="Cluster node management">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="terminal">{nodes.length} nodes</Badge>
          <Badge variant="success">
            {nodes.filter((n) => n.status === "running").length} online
          </Badge>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Node
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node) => (
          <Card key={node.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center">
                  <Server className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={node.status} />
                    <CardTitle className="font-mono">{node.name}</CardTitle>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {node.hostname} • {node.ip}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {node.labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-[10px]">
                    {label}
                  </Badge>
                ))}
                <Button variant="ghost" size="icon-sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-6">
                {/* System Info */}
                <div className="border-r border-border pr-6">
                  <div className="text-xs text-muted-foreground mb-2">
                    System
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">OS</span>
                      <span className="font-mono">{node.os}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Docker</span>
                      <span className="font-mono">{node.docker}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Containers</span>
                      <span className="font-mono">{node.containers}</span>
                    </div>
                  </div>
                </div>

                {/* CPU */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    CPU ({node.cpu.cores} cores)
                  </div>
                  <div className="stat-value mb-2">{node.cpu.usage}%</div>
                  <Progress value={node.cpu.usage} className="w-full" />
                </div>

                {/* Memory */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Memory
                  </div>
                  <div className="stat-value mb-2">
                    {node.memory.percentage}%
                  </div>
                  <Progress value={node.memory.percentage} className="w-full" />
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                    {node.memory.used} / {node.memory.total}
                  </div>
                </div>

                {/* Disk */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Disk</div>
                  <div className="stat-value mb-2">{node.disk.percentage}%</div>
                  <Progress value={node.disk.percentage} className="w-full" />
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                    {node.disk.used} / {node.disk.total}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Quick Actions
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant="terminal"
                      size="sm"
                      className="w-full justify-start"
                    >
                      SSH Connect
                    </Button>
                    <Button
                      variant="terminal"
                      size="sm"
                      className="w-full justify-start"
                    >
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
