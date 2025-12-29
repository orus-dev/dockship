"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Plus, Settings, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Docker, Node, NodeLiveData } from "@/lib/types";
import { useEffect, useState } from "react";
import { getLiveNodes } from "@/core/node";
import { formatBytes } from "@/lib/format";
import { setNodes as updateNodes } from "@/core/node";
import AddNode from "@/components/dialogs/AddNode";
import { getDocker } from "@/core/docker";

function DiskUsage({ liveData }: NodeLiveData) {
  if (!liveData) return null;

  const usage = (liveData.disk.used / liveData.disk.size) * 100;

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">Disk</div>
      <div className="stat-value mb-2">{usage.toFixed(0)}%</div>
      <Progress value={usage} className="w-full" />
      <div className="text-[10px] text-muted-foreground mt-1 font-mono">
        {formatBytes(liveData.disk.used)} / {formatBytes(liveData.disk.size)}
      </div>
    </div>
  );
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<(NodeLiveData & Node)[]>([]);
  const [dockerNodes, setDockerNodes] = useState<Docker[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      const nodes = await getLiveNodes();
      setNodes(nodes);
    };
    fetchNodes();
    const interval = setInterval(fetchNodes, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDocker = async () => {
      setDockerNodes(await getDocker(nodes));
    };
    fetchDocker();
  }, [nodes]);

  return (
    <DashboardLayout title="Nodes" subtitle="Cluster node management">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{nodes.length} nodes</Badge>
          <Badge>{nodes.filter((node) => node.liveData).length} online</Badge>
        </div>
        <AddNode>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Add Node
          </Button>
        </AddNode>
      </div>

      <div className="flex flex-col gap-4">
        {nodes.map((node, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-2 gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center">
                  <Server className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="font-mono">{node.name}</CardTitle>
                    {node.liveData ? (
                      <span className="size-2 rounded-full bg-chart-2" />
                    ) : (
                      <span className="size-2 rounded-full bg-chart-5" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {node.ip} • {node.ip}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                {node.labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-[10px]">
                    {label}
                  </Badge>
                ))}
                <Button variant="ghost" size="icon-sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={async () => {
                    const newNodes = nodes.filter((_, index) => index !== i);
                    setNodes(newNodes);
                    await updateNodes(newNodes);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {/* System Info */}
                <div className="border-b sm:border-b-0 sm:border-r border-border pb-2 sm:pb-0 pr-0 sm:pr-6">
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
                      <span className="font-mono">
                        {dockerNodes[i]?.version}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Containers</span>
                      <span className="font-mono">
                        {dockerNodes[i]?.containers.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CPU */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    CPU ({node.liveData?.cpu.cores} cores)
                  </div>
                  <div className="stat-value mb-2">
                    {node.liveData?.cpu.usage.toFixed(0)}%
                  </div>
                  <Progress
                    value={node.liveData?.cpu.usage}
                    className="w-full"
                  />
                </div>

                {/* Memory */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Memory
                  </div>
                  <div className="stat-value mb-2">
                    {node.liveData?.memory.usage.toFixed(0)}%
                  </div>
                  <Progress
                    value={node.liveData?.memory.usage}
                    className="w-full"
                  />
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                    {node.liveData &&
                      formatBytes(node.liveData?.memory.used) +
                        "/" +
                        formatBytes(node.liveData?.memory.total)}
                  </div>
                </div>

                {/* Disk */}
                <DiskUsage liveData={node.liveData} />

                {/* Quick Actions */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Quick Actions
                  </div>
                  <div className="space-y-1">
                    <Button size="sm" className="w-full justify-start">
                      SSH Connect
                    </Button>
                    <Button size="sm" className="w-full justify-start">
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
