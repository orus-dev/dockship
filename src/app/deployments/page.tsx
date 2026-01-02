"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  RotateCcw,
  Eye,
  MoreVertical,
  Plus,
  GitBranch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Application, Deployment } from "@/lib/types";
import { getDeployments } from "@/lib/dockship/deploy";
import { getApplications } from "@/lib/dockship/application";
import { cn } from "@/lib/utils";

export default function DeploymentsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setApplications(await getApplications());
      setDeployments((await getDeployments()).filter((d) => d !== null));
    };
    fetch();
  }, []);

  return (
    <DashboardLayout
      title="Deployments"
      subtitle="Deployment history and management"
    >
      {/* Header */}
      <div className="flex flex-row gap-3 items-center justify-between mb-6">
        <Badge>{deployments.length} deployments</Badge>

        <Button size="sm" className="gap-2 self-auto">
          <Plus className="w-4 h-4" />
          New Deployment
        </Button>
      </div>

      <div className="hidden md:visible space-y-3">
        {deployments.map((dep) => (
          <div
            key={dep.image}
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
                  {
                    applications.find((app) =>
                      app.deployments.includes(dep.image)
                    )?.name
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {/* {dep.version} */}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 sm:mt-0">
              {/* <Clock className="w-3 h-3" /> {dep.time} */}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {deployments.map((dep) => (
          <div key={dep.image} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm">{dep.image}</span>
              </div>
              {dep.status}
            </div>

            {/* <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">By</span>
                    <div className="truncate">{dep.deployedBy}</div>
                  </div>
                </div> */}

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
    </DashboardLayout>
  );
}
