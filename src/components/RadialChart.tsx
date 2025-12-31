"use client";

export default function RadialChart({
  value,
  children,
}: {
  value: number;
  children?: React.ReactNode;
}) {
  const radius = 42;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;

  const TRIM_ANGLE = 80;
  const ARC_ANGLE = 360 - TRIM_ANGLE;

  const progress = Math.min(Math.max(value, 0), 100);
  const arcLength = circumference * (ARC_ANGLE / 360);
  const offset = arcLength * (1 - progress / 100);

  return (
    <div className="w-full aspect-square">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* background arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={0}
          transform="rotate(130 50 50)"
        />

        {/* progress arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-chart-1)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(130 50 50)"
        />

        {/* center text */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-sm font-bold"
        >
          {value.toFixed(1)}%
        </text>

        {children && (
          <text
            x="50"
            y="67"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            {children}
          </text>
        )}
      </svg>
    </div>
  );
}
