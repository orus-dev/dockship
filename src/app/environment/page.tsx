"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Save,
  Lock,
  Loader2,
} from "lucide-react";
import { Env } from "@/lib/types";
import { getEnv, setEnv } from "@/core/application";
import { AddVariableDialog } from "@/components/dialogs/AddVariable";

export default function EnvironmentPage() {
  const [selectedApp, setSelectedApp] = useState("");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [envGroups, setEnvGroups] = useState<Record<string, Env>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const env = await getEnv();
      setEnvGroups(env);
      const vars = Object.keys(env);
      if (vars.length > 0) setSelectedApp(vars[0]);
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setEnv(selectedApp, currentGroup.variables);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
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
              {Object.entries(envGroups).map(([id, variables]) => (
                <button
                  key={id}
                  onClick={() => setSelectedApp(id)}
                  className={`
                    whitespace-nowrap md:w-full text-left px-3 py-2 text-sm font-mono transition-colors
                    ${
                      selectedApp === id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  {variables.name}
                  <Badge className="ml-2 text-[10px]">
                    {variables.variables.length}
                  </Badge>
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
                  {currentGroup?.variables.length} variables •{" "}
                  {currentGroup?.variables.filter((v) => v.secret).length}{" "}
                  secrets
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <AddVariableDialog
                  selectedApp={selectedApp}
                  currentGroup={currentGroup}
                  setEnvGroups={setEnvGroups}
                />
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </span>
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
                {currentGroup?.variables.map((variable, i) => (
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
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-primary"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${variable.key}=${variable.value}`
                          )
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-destructive"
                        onClick={() => {
                          setEnvGroups((env) => ({
                            ...env,
                            [selectedApp]: {
                              ...env[selectedApp],
                              variables: env[selectedApp].variables.filter(
                                (_, iv) => iv !== i
                              ),
                            },
                          }));
                        }}
                      >
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
