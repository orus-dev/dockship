"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Download, Filter, RefreshCw } from "lucide-react";

const logEntries = [
  {
    timestamp: "2024-01-15 14:32:45.123",
    level: "info",
    source: "api-gateway-1",
    message: "Request received: GET /api/v1/users",
  },
  {
    timestamp: "2024-01-15 14:32:45.145",
    level: "info",
    source: "api-gateway-1",
    message: "Response sent: 200 OK (22ms)",
  },
  {
    timestamp: "2024-01-15 14:32:46.012",
    level: "info",
    source: "auth-service-1",
    message: "Token validation successful for user_id=12345",
  },
  {
    timestamp: "2024-01-15 14:32:46.234",
    level: "warn",
    source: "worker-queue-2",
    message: "Job queue depth exceeded threshold: 150 pending jobs",
  },
  {
    timestamp: "2024-01-15 14:32:47.001",
    level: "info",
    source: "postgres-db-1",
    message: "Query executed: SELECT * FROM users WHERE id = $1 (2ms)",
  },
  {
    timestamp: "2024-01-15 14:32:47.456",
    level: "info",
    source: "api-gateway-2",
    message: "Request received: POST /api/v1/orders",
  },
  {
    timestamp: "2024-01-15 14:32:47.789",
    level: "error",
    source: "metrics-collector-1",
    message: "Failed to connect to metrics endpoint: connection refused",
  },
  {
    timestamp: "2024-01-15 14:32:48.012",
    level: "error",
    source: "metrics-collector-1",
    message: "Retry attempt 1/3 failed",
  },
  {
    timestamp: "2024-01-15 14:32:48.234",
    level: "info",
    source: "redis-cache-1",
    message: "Cache hit: session:user:12345",
  },
  {
    timestamp: "2024-01-15 14:32:49.001",
    level: "info",
    source: "worker-queue-1",
    message: "Job completed: send_email_notification (job_id=abc123)",
  },
  {
    timestamp: "2024-01-15 14:32:49.345",
    level: "warn",
    source: "api-gateway-3",
    message: "High latency detected: upstream response took 850ms",
  },
  {
    timestamp: "2024-01-15 14:32:50.012",
    level: "info",
    source: "auth-service-2",
    message: "New session created for user_id=67890",
  },
  {
    timestamp: "2024-01-15 14:32:50.456",
    level: "error",
    source: "metrics-collector-1",
    message: "Retry attempt 2/3 failed",
  },
  {
    timestamp: "2024-01-15 14:32:51.001",
    level: "info",
    source: "api-gateway-1",
    message: "Request received: GET /api/v1/health",
  },
  {
    timestamp: "2024-01-15 14:32:51.023",
    level: "info",
    source: "api-gateway-1",
    message: "Response sent: 200 OK (2ms)",
  },
  {
    timestamp: "2024-01-15 14:32:52.012",
    level: "info",
    source: "worker-queue-3",
    message: "Processing job: generate_report (job_id=def456)",
  },
  {
    timestamp: "2024-01-15 14:32:52.234",
    level: "error",
    source: "metrics-collector-1",
    message: "Retry attempt 3/3 failed. Giving up.",
  },
  {
    timestamp: "2024-01-15 14:32:52.456",
    level: "error",
    source: "metrics-collector-1",
    message: "Container entering unhealthy state",
  },
  {
    timestamp: "2024-01-15 14:32:53.012",
    level: "info",
    source: "postgres-db-1",
    message: "Connection pool: 12/50 active connections",
  },
  {
    timestamp: "2024-01-15 14:32:54.001",
    level: "info",
    source: "api-gateway-2",
    message: "Request received: PUT /api/v1/users/12345",
  },
];

export default function LogsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error">(
    "all"
  );

  const filteredLogs = logEntries.filter((log) => {
    if (filter === "all") return true;
    return log.level === filter;
  });

  const getLevelClass = (level: string) => {
    switch (level) {
      case "info":
        return "log-info";
      case "warn":
        return "log-warn";
      case "error":
        return "log-error";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout title="Logs" subtitle="Real-time log aggregation">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
            <span className="w-2 h-2 rounded-full bg-warning" />
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <div className="w-px h-6 bg-border" />
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

      <Card variant="terminal" className="h-[calc(100vh-240px)]">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b border-border">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
            Log Stream
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="terminal">{filteredLogs.length} entries</Badge>
            {!isPaused && (
              <div className="flex items-center gap-1 text-xs text-success">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Live
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto h-[calc(100%-48px)]">
          <div className="font-mono text-xs">
            {filteredLogs.map((log, index) => (
              <div key={index} className="log-line flex">
                <span className="log-timestamp whitespace-nowrap">
                  {log.timestamp}
                </span>
                <span
                  className={`uppercase w-12 flex-shrink-0 ${getLevelClass(
                    log.level
                  )}`}
                >
                  [{log.level}]
                </span>
                <span className="text-muted-foreground w-40 flex-shrink-0 truncate">
                  {log.source}
                </span>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
