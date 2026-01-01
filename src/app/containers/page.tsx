"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Play, Square, Container } from "lucide-react";
import { useEffect, useState } from "react";
import { getDocker, removeContainer } from "@/core/docker";
import { getNodes } from "@/core/node";
import { ContainerInfo } from "dockerode";
import { formatBytes } from "@/lib/format";
import {
  getContainerStats,
  startContainer,
  stopContainer,
} from "@/core/docker";
import RemoveDialog from "@/components/dialogs/Remove";

type ContainerSummary = {
  id: string;
  name: string;
  image: string;
  node: string;
  status: "running" | "stopped";
  uptime: string;
  cpu: number;
  memory: number;
};

async function summarizeContainer(
  container: ContainerInfo,
  nodeName: string
): Promise<ContainerSummary> {
  // 1. Shorten the long container ID
  const shortId = container.Id;

  // 2. Clean the name
  const name = container.Names[0]?.replace(/^\//, "") ?? "unknown";

  // 3. Normalize status
  const status = container.State === "running" ? "running" : "stopped";

  // 4. Compute uptime from Status string (if available)
  const uptime = container.Status?.replace(/^Up\s*/, "") ?? "unknown";

  const stats = await getContainerStats(container.Id);

  return {
    id: shortId,
    name,
    image: container.Image,
    node: nodeName,
    status,
    uptime,
    cpu: stats?.cpu || 0,
    memory: stats?.memory || 0,
  };
}

export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerSummary[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      const nodes = await getNodes();
      const dockerNodes = await getDocker(nodes);

      setContainers(
        await Promise.all(
          nodes.flatMap((node, i) =>
            dockerNodes[i].containers.map((c) =>
              summarizeContainer(c, node.name)
            )
          )
        )
      );
    };

    fetchNodes();

    const iid = setInterval(fetchNodes, 3000);
    return () => clearInterval(iid);
  }, []);

  return (
    <DashboardLayout
      title="Containers"
      subtitle="View and manage container instances"
    >
      {/* Stats */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge>{containers.length} containers</Badge>
        <Badge>
          {containers.filter((c) => c.status === "running").length} running
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden xl:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Container",
                    "Image",
                    "Node",
                    "Status",
                    "Uptime",
                    "CPU",
                    "Memory",
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
                {containers.map((container) => (
                  <tr key={container.id} className="data-table-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Container className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-mono text-sm">
                            {container.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {container.id.slice(0, 12)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                      {container.image}
                    </td>

                    <td className="py-3 px-4">{container.node}</td>

                    <td className="py-3 px-4">{container.status}</td>

                    <td className="py-3 px-4 font-mono text-xs">
                      {container.uptime}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs">
                      {container.cpu.toFixed(1)}%
                    </td>

                    <td className="py-3 px-4 font-mono text-xs">
                      {container.memory.toFixed(1)}%
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        {container.status === "running" ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => stopContainer(container.id)}
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => startContainer(container.id)}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                        <RemoveDialog
                          remove={() => removeContainer(container.id)}
                        />
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

          {/* ================= MOBILE CARDS ================= */}
          <div className="xl:hidden divide-y divide-border">
            {containers.map((container) => (
              <div key={container.id} className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Container className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{container.name}</span>
                  </div>
                  {container.status}
                </div>

                <div className="text-[10px] font-mono text-muted-foreground">
                  {container.id}
                </div>

                <div className="text-xs font-mono text-muted-foreground truncate">
                  {container.image}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Node</span>
                    <div>{container.node}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime</span>
                    <div className="font-mono">{container.uptime}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPU</span>
                    <div className="font-mono">{container.cpu.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Memory</span>
                    <div className="font-mono">
                      {container.memory.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-1 pt-2">
                  {container.status === "running" ? (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => stopContainer(container.id)}
                    >
                      <Square className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => startContainer(container.id)}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  )}
                  <RemoveDialog remove={() => removeContainer(container.id)} />
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
