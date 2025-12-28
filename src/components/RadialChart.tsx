"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Value",
  },
} satisfies ChartConfig;

const INNER_RADIUS = 80;

export default function RadialChart({
  value,
  children,
}: {
  value: number;
  children?: React.ReactNode;
}) {
  const chartData = [{ value, fill: "var(--color-chart-1)" }];
  const startAngle = 230;
  const totalSweep = 280;

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-square">
      <RadialBarChart
        data={chartData}
        startAngle={startAngle}
        endAngle={startAngle - (value / 100) * totalSweep}
        innerRadius={INNER_RADIUS}
        outerRadius={INNER_RADIUS + 30}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          tickLine={false}
          axisLine={false}
          ticks={[]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {chartData[0].value.toFixed(1)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {children}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
