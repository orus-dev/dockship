"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Rocket } from "lucide-react";
import InstallApplicationDialog from "@/components/dialogs/InstallApplication";
import { useEffect, useState } from "react";
import { getApplications, removeApp } from "@/lib/dockship/application";
import RemoveDialog from "@/components/dialogs/Remove";
import { Application } from "@/lib/types";
import DeployAppDialog from "@/components/dialogs/DeployApp";

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
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.repo}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {/* Deployments */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Deployments
                </span>
                <span className="font-mono text-sm">
                  {app.deployments?.length ?? 0}
                </span>
              </div>
            </CardContent>

            <CardFooter className="justify-end">
              <DeployAppDialog defaultApp={app.id}>
                <Button variant="ghost" size="icon-sm" aria-label="Deploy">
                  <Rocket className="w-3 h-3" />
                </Button>
              </DeployAppDialog>

              <RemoveDialog remove={() => remove(app.id)} />

              <Button variant="ghost" size="icon-sm" aria-label="More options">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
