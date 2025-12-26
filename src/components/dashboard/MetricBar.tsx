interface MetricBarProps {
  value: number;
  max: number;
  variant?: "default" | "success" | "warning" | "danger";
}

export function MetricBar({ value, max, variant = "default" }: MetricBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = () => {
    if (variant !== "default") {
      switch (variant) {
        case "success": return "bg-success";
        case "warning": return "bg-warning";
        case "danger": return "bg-destructive";
      }
    }
    
    if (percentage > 80) return "bg-destructive";
    if (percentage > 60) return "bg-warning";
    return "bg-primary";
  };

  return (
    <div className="metric-bar">
      <div
        className={`metric-bar-fill ${getColor()}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
