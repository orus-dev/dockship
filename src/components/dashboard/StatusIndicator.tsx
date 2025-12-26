import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "running" | "stopped" | "error" | "pending";
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusConfig = {
  running: { label: "Running", className: "status-running" },
  stopped: { label: "Stopped", className: "status-stopped" },
  error: { label: "Error", className: "status-error" },
  pending: { label: "Pending", className: "status-pending" },
};

export function StatusIndicator({ status, showLabel = false, size = "md" }: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full",
          config.className,
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        )}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}
