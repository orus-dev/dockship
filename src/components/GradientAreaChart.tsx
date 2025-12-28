"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, CartesianGrid, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export default function GradientAreaChart({
  title,
  data,
  config,
  max,
}: {
  title: string;
  data: any[];
  config: ChartConfig;
  max?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Last 12 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-60 w-full">
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            {max && <YAxis domain={[0, max]} width={10} />}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              {Object.entries(config).map(([key, config]) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            {Object.entries(config).map(([key, config]) => (
              <Area
                key={key}
                type="natural"
                dataKey={key}
                stroke={config.color}
                fill={`url(#fill-${key})`}
                fillOpacity={0.4}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
