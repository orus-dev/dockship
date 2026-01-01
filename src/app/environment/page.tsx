"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Eye, EyeOff, Copy, Save, Lock } from "lucide-react";
import { Env } from "@/lib/types";
import { getEnv } from "@/core/application";

export default function EnvironmentPage() {
  const [selectedApp, setSelectedApp] = useState("");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [envGroups, setEnvGroups] = useState<Record<string, Env[]>>({});

  useEffect(() => {
    const fetch = async () => {
      setEnvGroups(await getEnv());
    };
    fetch();
  }, []);

  const currentGroup = envGroups[selectedApp];

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const maskValue = (value: string) => {
    return "•".repeat(Math.min(value.length, 24));
  };

  return (
    <DashboardLayout
      title="Environment"
      subtitle="Manage environment variables"
    >
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar */}
        <div className="md:w-56 md:shrink-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex gap-2 md:block overflow-x-auto">
              {Object.entries(envGroups).map(([key, variables]) => (
                <button
                  key={key}
                  onClick={() => setSelectedApp(key)}
                  className={`
                    whitespace-nowrap md:w-full text-left px-3 py-2 text-sm font-mono transition-colors
                    ${
                      selectedApp === key
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  {key}
                  <Badge className="ml-2 text-[10px]">{variables.length}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="font-mono">{selectedApp}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentGroup?.length} variables •{" "}
                  {currentGroup?.filter((v) => v.secret).length} secrets
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Variable</span>
                </Button>
                <Button size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Changes</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Table header (desktop only) */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs text-muted-foreground uppercase tracking-wider py-2 border-b border-border">
                <div className="col-span-4">Key</div>
                <div className="col-span-6">Value</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border md:divide-none">
                {currentGroup?.map((variable) => (
                  <div
                    key={variable.key}
                    className="
                      py-4 md:py-3
                      flex flex-col gap-3
                      md:grid md:grid-cols-12 md:gap-4 md:items-center
                    "
                  >
                    {/* Key */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      {variable.secret && (
                        <Lock className="w-3 h-3 text-warning" />
                      )}
                      <span className="font-mono text-sm">{variable.key}</span>
                    </div>

                    {/* Value */}
                    <div className="md:col-span-6">
                      <Input
                        type={
                          variable.secret && !showSecrets[variable.key]
                            ? "password"
                            : "text"
                        }
                        value={
                          variable.secret && !showSecrets[variable.key]
                            ? maskValue(variable.value)
                            : variable.value
                        }
                        readOnly
                        className="font-mono text-xs h-8 bg-background border-border"
                      />
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-1">
                      {variable.secret && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleSecret(variable.key)}
                        >
                          {showSecrets[variable.key] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
