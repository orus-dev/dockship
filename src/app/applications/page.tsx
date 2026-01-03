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
import RegisterAppDialog from "@/components/dialogs/RegisterApp";
import { getApps, removeApp } from "@/lib/dockship/application";
import RemoveDialog from "@/components/dialogs/Remove";
import DeployAppDialog from "@/components/dialogs/DeployApp";
import { useAsyncInterval } from "@/hooks/use-async";

export default function ApplicationsPage() {
  const { value: apps, setValue: setApps } = useAsyncInterval(
    [],
    getApps,
    3000
  );

  const remove = async (appId: string) => {
    await removeApp(appId);
    setApps((prev) => prev.filter((app) => app.id !== appId));
  };

  return (
    <DashboardLayout
      title="Applications"
      subtitle="Manage dockship applications"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{apps.length} apps</Badge>
        </div>
        <RegisterAppDialog>
          <Button size="sm" className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Register Application
          </Button>
        </RegisterAppDialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
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
