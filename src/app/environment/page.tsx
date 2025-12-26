"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Eye, EyeOff, Copy, Save, Lock } from "lucide-react";

const envGroups = [
  {
    name: "api-gateway",
    variables: [
      { key: "PORT", value: "8080", secret: false },
      { key: "NODE_ENV", value: "production", secret: false },
      { key: "API_KEY", value: "sk-xxxx-xxxx-xxxx", secret: true },
      { key: "DATABASE_URL", value: "postgresql://...", secret: true },
      { key: "REDIS_URL", value: "redis://localhost:6379", secret: false },
      { key: "LOG_LEVEL", value: "info", secret: false },
    ],
  },
  {
    name: "auth-service",
    variables: [
      { key: "PORT", value: "9000", secret: false },
      { key: "JWT_SECRET", value: "xxxxxxxxxxxx", secret: true },
      { key: "JWT_EXPIRY", value: "7d", secret: false },
      { key: "OAUTH_CLIENT_ID", value: "client-id-xxxx", secret: true },
      { key: "OAUTH_CLIENT_SECRET", value: "client-secret-xxxx", secret: true },
    ],
  },
  {
    name: "worker-queue",
    variables: [
      { key: "QUEUE_URL", value: "amqp://localhost:5672", secret: false },
      { key: "CONCURRENCY", value: "10", secret: false },
      { key: "RETRY_LIMIT", value: "3", secret: false },
      { key: "DEAD_LETTER_QUEUE", value: "dlq.worker", secret: false },
    ],
  },
];

export default function EnvironmentPage() {
  const [selectedApp, setSelectedApp] = useState("api-gateway");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const currentGroup = envGroups.find((g) => g.name === selectedApp);

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
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {envGroups.map((group) => (
                <button
                  key={group.name}
                  onClick={() => setSelectedApp(group.name)}
                  className={`w-full text-left px-3 py-2 text-sm font-mono transition-colors ${
                    selectedApp === group.name
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {group.name}
                  <Badge variant="terminal" className="ml-2 text-[10px]">
                    {group.variables.length}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-mono">{selectedApp}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentGroup?.variables.length} variables •{" "}
                  {currentGroup?.variables.filter((v) => v.secret).length}{" "}
                  secrets
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Variable
                </Button>
                <Button size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="grid grid-cols-12 gap-4 text-xs text-muted-foreground uppercase tracking-wider py-2 border-b border-border">
                  <div className="col-span-4">Key</div>
                  <div className="col-span-6">Value</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                {currentGroup?.variables.map((variable) => (
                  <div
                    key={variable.key}
                    className="grid grid-cols-12 gap-4 py-3 data-table-row items-center"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      {variable.secret && (
                        <Lock className="w-3 h-3 text-warning" />
                      )}
                      <span className="font-mono text-sm">{variable.key}</span>
                    </div>
                    <div className="col-span-6">
                      <div className="flex items-center gap-2">
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
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1">
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
