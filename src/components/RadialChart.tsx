"use client";

import {
  Label,
  PolarGrid,
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

export default function RadialChart({
  value,
  children,
}: {
  value: number;
  children?: React.ReactNode;
}) {
  const chartData = [{ value, fill: "var(--color-chart-1)" }];

  return (
    <ChartContainer config={chartConfig} className="size-30">
      <RadialBarChart
        data={chartData}
        startAngle={-50}
        endAngle={(value / 100) * 230}
        innerRadius="65%"
        outerRadius="100%"
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className=""
          polarRadius={[86, 74]}
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
                      {chartData[0].value.toLocaleString()}
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
