"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, MoreVertical, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DeployApplication from "@/components/dialogs/DeployApplication";
import { useEffect, useState } from "react";
import { ImageApp } from "@/lib/types";
import { getApplications } from "@/core/application";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ImageApp[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setApplications(await getApplications());
    };

    fetch();
  }, []);

  console.log(applications);

  return (
    <DashboardLayout
      title="Applications"
      subtitle="Manage deployed applications"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{applications.length} apps</Badge>
          <Badge>
            {applications.filter((a) => a.status === "running").length} running
          </Badge>
        </div>

        <DeployApplication>
          <Button size="sm" className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Deploy Application
          </Button>
        </DeployApplication>
      </div>

      <div className="space-y-3">
        {applications.map((app, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:items-center">
                {/* Status & Name */}
                <div className="flex items-center gap-3 md:col-span-3">
                  {/* {app.status} */}
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-medium">
                      {app.app?.name || app.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {app.image}
                    </div>
                  </div>
                </div>

                {/* Containers */}
                <div className="flex justify-between md:block md:col-span-1">
                  <span className="text-xs text-muted-foreground md:hidden">
                    Containers
                  </span>
                  <div className="font-mono text-sm">{app.replicas}</div>
                </div>

                {/* CPU */}
                <div className="md:col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">CPU</div>
                  <div className="flex items-center gap-2">
                    <Progress value={app.cpu} className="w-full" />
                    <span className="text-xs font-mono w-8">{app.cpu}%</span>
                  </div>
                </div>

                {/* Memory */}
                <div className="md:col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    Memory
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={app.memory} className="w-full" />
                    <span className="text-xs font-mono w-8">{app.memory}%</span>
                  </div>
                </div>

                {/* Network */}
                <div className="flex justify-between md:block md:col-span-1">
                  <span className="text-xs text-muted-foreground md:hidden">
                    Network
                  </span>
                  <div className="font-mono text-xs">{app.network}</div>
                </div>

                {/* Ports */}
                <div className="md:col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    Ports
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {app.ports?.length > 0 ? (
                      app.ports.map((port) => (
                        <Badge key={port} className="text-[10px]">
                          {port}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 md:col-span-1">
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
