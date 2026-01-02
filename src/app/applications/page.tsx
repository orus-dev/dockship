"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Rocket } from "lucide-react";
import InstallApplicationDialog from "@/components/dialogs/InstallApplication";
import { useEffect, useState } from "react";
import { getApplications, removeApp } from "@/core/application";
import RemoveDialog from "@/components/dialogs/Remove";
import { Application } from "@/lib/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const apps = await getApplications();
      setApplications(apps);
    };

    fetch();

    const iid = setInterval(fetch, 3000);
    return () => clearInterval(iid);
  }, []);

  const remove = async (appId: string) => {
    await removeApp(appId);
    setApplications((prev) => prev.filter((app) => app.id !== appId));
  };

  return (
    <DashboardLayout
      title="Applications"
      subtitle="Manage installed applications"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{applications.length} apps</Badge>
        </div>
        <InstallApplicationDialog>
          <Button size="sm" className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Install Application
          </Button>
        </InstallApplicationDialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Status & Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-medium truncate">
                      {app.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {app.repo}
                    </div>
                  </div>
                </div>

                {/* Deployments */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Deployments
                  </span>
                  <span className="font-mono text-sm">
                    {app.deployments?.length ?? 0}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" aria-label="Deploy">
                    <Rocket className="w-3 h-3" />
                  </Button>

                  {app.id && <RemoveDialog remove={() => remove(app.id)} />}

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="More options"
                  >
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
