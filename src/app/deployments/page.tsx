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
import { Deployment } from "@/lib/types";
import { getDeployments } from "@/core/server/deployment";
import { getApplications } from "@/core/application";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setDeployments(
        (await getDeployments(await getApplications())).filter(
          (d) => d !== null
        )
      );
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

      <Card>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Application", "Status", "Actions"].map((h) => (
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
                {deployments.map((dep) => (
                  <tr key={dep.image} className="data-table-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{dep.image}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">{dep.status}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
