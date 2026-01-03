"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Download, Filter, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Log } from "@/lib/types";
import { getAllContainerLogs } from "@/lib/dockship/docker";
import { useAsyncInterval } from "@/hooks/use-async";
import { AnsiText } from "@/components/ansi/Ansi";

export default function LogsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error">(
    "all"
  );
  const { value: logs, setValue: setLogs } = useAsyncInterval(
    [],
    async () => (isPaused ? ([] as Log[]) : getAllContainerLogs()),
    100
  );

  const filteredLogs = logs.filter((log) =>
    filter === "all" ? true : log.level === filter
  );

  const handleExport = () => {
    // Convert data to JSON string
    const json = JSON.stringify(filteredLogs, null, 2);

    // Create a blob from the JSON
    const blob = new Blob([json], { type: "application/json" });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it
    const link = document.createElement("a");
    link.href = url;
    link.download = "logs.json"; // File name
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  const getLevelClass = (level: string) => {
    switch (level) {
      case "info":
        return "text-blue-400";
      case "warn":
        return "text-yellow-300";
      case "error":
        return "text-destructive";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout title="Logs" subtitle="Real-time log aggregation">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "info" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("info")}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            Info
          </Button>
          <Button
            variant={filter === "warn" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("warn")}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-300" />
            Warn
          </Button>
          <Button
            variant={filter === "error" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("error")}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-destructive" />
            Error
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced Filter</span>
          </Button> */}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline" onClick={handleExport}>
              Export
            </span>
          </Button>

          <div className="hidden md:block w-px h-6 bg-border" />

          <Button
            variant={isPaused ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="gap-2"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Log Card */}
      <Card className="h-[calc(100vh-240px)]">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b border-border">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
            Log Stream
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{filteredLogs.length} entries</Badge>
            {!isPaused && (
              <div className="flex items-center gap-1 text-xs text-success">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Live
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-auto h-[calc(100%-48px)]">
          <div className="font-mono text-xs px-3 md:px-6 space-y-2 md:space-y-0">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 md:flex-row md:gap-0"
              >
                {/* Timestamp */}
                <span className="text-gray-400 whitespace-nowrap md:mr-3">
                  {log.timestamp.replace("T", " ").slice(0, 19)}
                </span>

                {/* Level */}
                <span
                  className={cn(
                    "uppercase md:w-12 md:shrink-0 md:mx-3",
                    getLevelClass(log.level)
                  )}
                >
                  [{log.level}]
                </span>

                {/* Source */}
                <span className="text-muted-foreground md:w-40 md:shrink-0 md:truncate">
                  {log.source}
                </span>

                {/* Message */}
                {/* <span className="text-foreground wrap-break-words">
                  {log.message}
                </span> */}
                <AnsiText text={log.message} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
